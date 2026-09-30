import * as React from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Mic, MicOff, Video, VideoOff, Hand, PhoneOff, Send, Pencil, Eye } from "lucide-react";
import { toast } from "sonner";
import { AppShell } from "@/components/layout/AppShell";
import { WhiteBoard } from "@/components/whiteboard/WhiteBoard";
import { ScreenShare } from "@/components/classroom/ScreenShare";
import { ClassFiles } from "@/components/classroom/ClassFiles";
import { ClassRoster } from "@/components/classroom/ClassRoster";
import { classChat, demoUsers, studentsList } from "@/lib/mock-data";
import { useClassroom } from "@/lib/classroom-store";
import { useRole } from "@/lib/role";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/classroom")({
  validateSearch: (search: Record<string, unknown>): { session?: string } => {
    // اگر کاربر دستی آدرس را عوض کند و جلسه نامعتبر باشد، صفحه نباید
    // سفید شود؛ فقط پارامتر نادیده گرفته می‌شود.
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
      { property: "og:title", content: "کلاس آنلاین زنده" },
      {
        property: "og:description",
        content: "تخته اشتراکی، چت کلاس، اشتراک صفحه و فایل.",
      },
    ],
  }),
  component: ClassroomPage,
});

function ClassroomPage() {
  const { role } = useRole();
  const { sessions, isPresenter } = useClassroom();
  const { session: sessionId } = Route.useSearch();
  // همیشه یک جلسه باید باشد تا صفحه نشکند. اگر پارامتر نبود یا نامعتبر
  // بود، اولین جلسهٔ فهرست نمایش داده می‌شود، مثل رفتار قبلی صفحه.
  const session = sessions.find((s) => s.id === sessionId) ?? sessions[0]!;

  const [studentView, setStudentView] = React.useState(false);
  const [mic, setMic] = React.useState(false);
  const [cam, setCam] = React.useState(false);
  const [messages, setMessages] = React.useState(classChat);
  const [text, setText] = React.useState("");

  const meName = role ? demoUsers[role].name : "";
  const meStudentId = studentsList.find((s) => s.name === meName)?.id;

  // ارائه‌دهنده کسی است که یا استاد است یا استاد نقشش را داده. «نمای
  // دانشجو» روی حالت استاد، همه را فقط‌خواندنی می‌کند.
  const isProfessor = role === "professor";
  const grantedPresenter = Boolean(meStudentId) && isPresenter(session.id, meStudentId!);
  const canPresent = isProfessor ? !studentView : role === "student" && grantedPresenter;
  const readOnly = !canPresent;

  const send = () => {
    const value = text.trim();
    if (!value) return;
    setMessages((m) => [...m, { id: Date.now(), user: meName, text: value, me: true }]);
    setText("");
  };

  return (
    <AppShell
      title={`کلاس آنلاین — ${session.course}`}
      subtitle={`${session.topic} — ${session.professor} | ${session.day} ${session.time}`}
    >
      <div className="grid gap-5 lg:grid-cols-3">
        <div className="space-y-4 lg:col-span-2">
          <Card className="overflow-hidden">
            <div className="relative aspect-video bg-navy">
              {canPresent ? (
                <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 text-primary-foreground/80">
                  <Pencil className="size-8 text-accent" />
                  <p className="text-sm">
                    {grantedPresenter ? "شما ارائه‌دهندهٔ این جلسه هستید" : "تخته اشتراکی استاد"}
                  </p>
                  <div className="mx-8 w-full max-w-md space-y-2">
                    <div className="h-2 rounded-full bg-white/20" />
                    <div className="h-2 w-4/5 rounded-full bg-white/15" />
                    <div className="h-2 w-3/5 rounded-full bg-white/10" />
                  </div>
                </div>
              ) : (
                <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 text-primary-foreground/70">
                  <Eye className="size-7" />
                  <p className="text-sm">در حال تماشا — {session.professor} ارائه می‌دهد</p>
                </div>
              )}
              <Badge className="absolute end-3 top-3 bg-destructive text-destructive-foreground">
                زنده
              </Badge>
              <div className="absolute bottom-3 start-3 flex size-24 items-center justify-center rounded-xl bg-black/40 text-[11px] text-primary-foreground/80 ring-1 ring-white/20">
                {cam ? "تصویر شما" : "دوربین خاموش"}
              </div>
            </div>
            <CardContent className="space-y-3 py-4">
              <div className="flex flex-wrap items-center justify-center gap-2">
                <Button
                  variant={mic ? "default" : "outline"}
                  onClick={() => {
                    setMic(!mic);
                    toast.info(mic ? "میکروفون خاموش شد" : "میکروفون روشن شد");
                  }}
                >
                  {mic ? <Mic className="size-4" /> : <MicOff className="size-4" />}
                  {mic ? "میکروفون روشن" : "میکروفون خاموش"}
                </Button>
                <Button
                  variant={cam ? "default" : "outline"}
                  onClick={() => {
                    setCam(!cam);
                    toast.info(cam ? "دوربین خاموش شد" : "دوربین روشن شد");
                  }}
                >
                  {cam ? <Video className="size-4" /> : <VideoOff className="size-4" />}
                  {cam ? "دوربین روشن" : "دوربین خاموش"}
                </Button>
                <Button variant="outline" onClick={() => toast.success("درخواست صحبت ارسال شد")}>
                  <Hand className="size-4" /> درخواست صحبت
                </Button>
                <Button variant="destructive" onClick={() => toast.info("از کلاس خارج شدید")}>
                  <PhoneOff className="size-4" /> خروج از کلاس
                </Button>
              </div>
              <div className="max-w-sm">
                <ScreenShare canShare={canPresent} />
              </div>
            </CardContent>
          </Card>

          <ClassFiles
            sessionId={session.id}
            uploader={meName}
            canUpload={isProfessor && !studentView}
          />
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
                    canManage={isProfessor && !studentView}
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
