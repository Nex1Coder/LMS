import * as React from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Send, Pencil, Eye } from "lucide-react";
import { toast } from "sonner";
import { AppShell } from "@/components/layout/AppShell";
import { WhiteBoard } from "@/components/whiteboard/WhiteBoard";
import { ClassStage } from "@/components/classroom/ClassStage";
import { ClassFiles } from "@/components/classroom/ClassFiles";
import { ClassRoster } from "@/components/classroom/ClassRoster";
import { ClassControls } from "@/components/classroom/ClassControls";
import { classChat, demoUsers, studentsList } from "@/lib/mock-data";
import { useClassroom } from "@/lib/classroom-store";
import { useRole } from "@/lib/role";
import { useLocalMedia } from "@/lib/local-media";
import { useScreenShare } from "@/lib/screen-share";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/classroom")({
  validateSearch: (search: Record<string, unknown>): { session?: string } => {
    const id = search["session"];
    return typeof id === "string" && id ? { session: id } : {};
  },
  head: () => ({
    meta: [
      { title: "کلاس آنلاین | سامانه آموزش مجازی دانشگاه" },
      {
        name: "description",
        content: "شبیه‌ساز کلاس زنده مجازی با تخته اشتراکی، چت کلاس، اشتراک صفحه و بارگذاری فایل.",
      },
    ],
  }),
  component: ClassroomPage,
});

function ClassroomPage() {
  const navigate = useNavigate();
  const { role } = useRole();
  const { sessions, isPresenter, isAdmin } = useClassroom();
  const { session: sessionId } = Route.useSearch();
  const session = sessions.find((s) => s.id === sessionId) ?? sessions[0]!;

  const media = useLocalMedia();
  const screen = useScreenShare();
  const { sharedFile } = useClassroom();

  const [studentView, setStudentView] = React.useState(false);
  const [messages, setMessages] = React.useState(classChat);
  const [text, setText] = React.useState("");

  const meName = role ? demoUsers[role].name : "";
  const meStudentId = studentsList.find((s) => s.name === meName)?.id;

  const isProfessor = role === "professor";
  const grantedAdmin = Boolean(meStudentId) && isAdmin(session.id, meStudentId!);
  const isManager = isProfessor || grantedAdmin;
  const grantedPresenter = Boolean(meStudentId) && isPresenter(session.id, meStudentId!);
  const canPresent = studentView
    ? false
    : isProfessor
      ? true
      : role === "student" && (grantedPresenter || grantedAdmin);
  const readOnly = !canPresent;

  const send = () => {
    const value = text.trim();
    if (!value) return;
    setMessages((m) => [...m, { id: Date.now(), user: meName, text: value, me: true }]);
    setText("");
  };

  const handleLeave = () => {
    media.stopAll();
    screen.stop();
    toast.info("از کلاس خارج شدید");
    navigate({ to: "/" });
  };

  return (
    <AppShell
      title={`کلاس آنلاین — ${session.course}`}
      subtitle={`${session.topic} — ${session.professor} | ${session.day} ${session.time}`}
    >
      <div className="grid gap-5 lg:grid-cols-3">
        <div className="space-y-4 lg:col-span-2">
          <ClassStage
            session={session}
            sharedFile={sharedFile[session.id] ?? null}
            cameraStream={media.camStream}
            screenStream={screen.stream}
            screenState={screen.state}
            canPresent={canPresent}
            grantedPresenter={grantedPresenter}
          />
          <div className="flex justify-center">
            <ClassControls
              media={media}
              screen={screen}
              canSpeak={isProfessor || grantedAdmin || grantedPresenter}
              canShare={canPresent}
              onLeave={handleLeave}
              isProfessor={isProfessor}
              sessionId={session.id}
              studentId={meStudentId ?? ""}
            />
          </div>
          <ClassFiles sessionId={session.id} uploader={meName} canUpload={isManager} />
        </div>

        <div className="space-y-4">
          <Card className="flex h-[420px] flex-col">
            <CardHeader className="border-b pb-3">
              <Tabs defaultValue="chat">
                <TabsList className="w-full">
                  <TabsTrigger value="chat" className="flex-1">
                    چت کلاس
                  </TabsTrigger>
                  <TabsTrigger value="people" className="flex-1">
                    حاضرین
                  </TabsTrigger>
                </TabsList>
                <TabsContent value="chat" className="mt-4 h-[240px] overflow-y-auto scrollbar-thin">
                  <div className="space-y-3 pe-1">
                    {messages.map((m) => (
                      <div key={m.id} className={cn(m.me && "text-end")}>
                        <p className="text-[11px] text-muted-foreground">{m.user}</p>
                        <p
                          className={cn(
                            "mt-1 inline-block max-w-[85%] rounded-2xl px-3 py-2 text-sm leading-6",
                            m.me ? "bg-navy text-primary-foreground" : "bg-muted",
                          )}
                        >
                          {m.text}
                        </p>
                      </div>
                    ))}
                  </div>
                </TabsContent>
                <TabsContent
                  value="people"
                  className="mt-4 h-[240px] overflow-y-auto scrollbar-thin"
                >
                  <ClassRoster
                    sessionId={session.id}
                    professorName={session.professor}
                    canManage={isManager}
                  />
                </TabsContent>
              </Tabs>
            </CardHeader>
            <div className="mt-auto flex gap-2 border-t p-3">
              <Input
                value={text}
                onChange={(e) => setText(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") send();
                }}
                placeholder="پیام خود را بنویسید…"
              />
              <Button size="icon" onClick={send} aria-label="ارسال پیام">
                <Send className="size-4" />
              </Button>
            </div>
          </Card>
        </div>
      </div>

      <div className="mt-5 space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-border bg-muted/40 px-4 py-3">
          <div className="flex items-center gap-2">
            <Pencil className="size-4 text-navy" />
            <p className="text-sm font-bold">وایت‌برد استاد — {session.course}</p>
            <Badge variant="secondary" className="text-[10px]">
              {session.day}
            </Badge>
            {grantedPresenter && (
              <Badge className="bg-navy text-[10px] text-primary-foreground">ارائه‌دهنده</Badge>
            )}
          </div>
          {isProfessor && (
            <label className="flex items-center gap-2 text-xs text-muted-foreground">
              <Eye className="size-4" />
              نمای دانشجو (فقط‌خواندنی)
              <Switch checked={studentView} onCheckedChange={setStudentView} />
            </label>
          )}
        </div>
        <WhiteBoard readOnly={readOnly} />
        <p className="text-center text-xs text-muted-foreground">
          {readOnly
            ? "تختهٔ استاد به‌صورت زنده با همان محتوا نمایش داده می‌شود (نمایش فقط‌خواندنی)."
            : "با قلم، هایلایت، شکل، متن و لیزر تدریس کنید؛ دروس روی برگه‌ها ذخیره می‌شوند و دانشجویان همان لحظه می‌بینند."}
        </p>
      </div>
    </AppShell>
  );
}
