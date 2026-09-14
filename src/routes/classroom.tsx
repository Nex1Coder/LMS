import * as React from "react";
import { createFileRoute } from "@tanstack/react-router";
import {
  Mic,
  MicOff,
  Video,
  VideoOff,
  MonitorUp,
  Hand,
  PhoneOff,
  Send,
  Users,
  Pencil,
} from "lucide-react";
import { toast } from "sonner";
import { AppShell } from "@/components/layout/AppShell";
import { classChat, studentsList } from "@/lib/mock-data";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/classroom")({
  head: () => ({
    meta: [
      { title: "کلاس آنلاین | سامانه آموزش مجازی دانشگاه" },
      {
        name: "description",
        content: "شبیه‌ساز کلاس زنده مجازی با تخته اشتراکی، چت کلاس و کنترل صدا و تصویر.",
      },
      { property: "og:title", content: "کلاس آنلاین زنده" },
      { property: "og:description", content: "تخته اشتراکی، چت کلاس و اشتراک صدا و تصویر." },
    ],
  }),
  component: ClassroomPage,
});

function ClassroomPage() {
  const [mic, setMic] = React.useState(false);
  const [cam, setCam] = React.useState(false);
  const [messages, setMessages] = React.useState(classChat);
  const [text, setText] = React.useState("");

  const send = () => {
    if (!text.trim()) return;
    setMessages((m) => [...m, { id: Date.now(), user: "سارا محمدی", text: text.trim(), me: true }]);
    setText("");
  };

  return (
    <AppShell
      title="کلاس آنلاین — مبانی هوش مصنوعی"
      subtitle="جلسه ۷: شبکه‌های عصبی — دکتر رضا کریمی | در حال برگزاری"
    >
      <div className="grid gap-5 lg:grid-cols-3">
        <div className="space-y-4 lg:col-span-2">
          <Card className="overflow-hidden">
            <div className="relative aspect-video bg-navy">
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 text-primary-foreground/80">
                <Pencil className="size-8 text-accent" />
                <p className="text-sm">تخته اشتراکی استاد</p>
                <div className="mx-8 w-full max-w-md space-y-2">
                  <div className="h-2 rounded-full bg-white/20" />
                  <div className="h-2 w-4/5 rounded-full bg-white/15" />
                  <div className="h-2 w-3/5 rounded-full bg-white/10" />
                </div>
              </div>
              <Badge className="absolute end-3 top-3 bg-destructive text-destructive-foreground">
                زنده
              </Badge>
              <div className="absolute bottom-3 start-3 flex size-24 items-center justify-center rounded-xl bg-black/40 text-[11px] text-primary-foreground/80 ring-1 ring-white/20">
                {cam ? "تصویر شما" : "دوربین خاموش"}
              </div>
            </div>
            <CardContent className="flex flex-wrap items-center justify-center gap-2 py-4">
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
              <Button variant="outline" onClick={() => toast.success("اشتراک‌گذاری صفحه آغاز شد")}>
                <MonitorUp className="size-4" /> اشتراک صفحه
              </Button>
              <Button variant="outline" onClick={() => toast.success("درخواست صحبت ارسال شد")}>
                <Hand className="size-4" /> درخواست صحبت
              </Button>
              <Button variant="destructive" onClick={() => toast.info("از کلاس خارج شدید")}>
                <PhoneOff className="size-4" /> خروج از کلاس
              </Button>
            </CardContent>
          </Card>
        </div>

        <Card className="flex h-[520px] flex-col">
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
              <TabsContent value="chat" className="mt-4 h-[330px] overflow-y-auto scrollbar-thin">
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
              <TabsContent value="people" className="mt-4 h-[330px] overflow-y-auto scrollbar-thin">
                <p className="mb-3 flex items-center gap-1 text-xs text-muted-foreground">
                  <Users className="size-3.5" /> ۴۱ نفر در کلاس حاضر هستند
                </p>
                <div className="space-y-2">
                  {studentsList.map((s) => (
                    <div
                      key={s.id}
                      className="flex items-center justify-between rounded-lg bg-muted/50 px-3 py-2 text-sm"
                    >
                      <span className="truncate">{s.name}</span>
                      <Badge variant={s.present ? "secondary" : "outline"} className="text-[10px]">
                        {s.present ? "حاضر" : "غایب"}
                      </Badge>
                    </div>
                  ))}
                </div>
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
    </AppShell>
  );
}
