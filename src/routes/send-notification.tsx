import * as React from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Send, History, Bell } from "lucide-react";
import { toast } from "sonner";
import { AppShell } from "@/components/layout/AppShell";
import {
  courses,
  studentsList,
  sentNotifications,
  type NotificationTarget,
  type SentNotification,
} from "@/lib/mock-data";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export const Route = createFileRoute("/send-notification")({
  head: () => ({
    meta: [
      { title: "ارسال اعلان | سامانه آموزش مجازی دانشگاه" },
      {
        name: "description",
        content: "ارسال اعلان به دانشجویان، درس خاص یا دانشجوی خاص.",
      },
    ],
  }),
  component: SendNotificationPage,
});

const targetOptions: NotificationTarget[] = ["همه دانشجویان", "درس خاص", "دانشجوی خاص"];

function SendNotificationPage() {
  const [notifications, setNotifications] = React.useState<SentNotification[]>(sentNotifications);
  const [target, setTarget] = React.useState<NotificationTarget>("همه دانشجویان");
  const [selectedCourse, setSelectedCourse] = React.useState<string>("");
  const [selectedStudent, setSelectedStudent] = React.useState<string>("");
  const [subject, setSubject] = React.useState("");
  const [body, setBody] = React.useState("");

  function handleSend() {
    if (!subject.trim()) {
      toast.error("موضوع اعلان را وارد کنید");
      return;
    }
    if (!body.trim()) {
      toast.error("متن اعلان را وارد کنید");
      return;
    }

    let totalRecipients = 1;
    if (target === "همه دانشجویان") {
      totalRecipients = courses.reduce((sum, c) => sum + c.students, 0);
    } else if (target === "درس خاص" && selectedCourse) {
      const course = courses.find((c) => c.title === selectedCourse);
      totalRecipients = course?.students ?? 0;
    }

    const newNotification: SentNotification = {
      id: `sn-${Date.now()}`,
      target,
      ...(target === "درس خاص" ? { course: selectedCourse } : {}),
      ...(target === "دانشجوی خاص" ? { student: selectedStudent } : {}),
      subject: subject.trim(),
      body: body.trim(),
      sentAt:
        new Date().toLocaleDateString("fa-IR") +
        " " +
        new Date().toLocaleTimeString("fa-IR", { hour: "2-digit", minute: "2-digit" }),
      readBy: 0,
      totalRecipients,
    };

    setNotifications((prev) => [newNotification, ...prev]);
    setSubject("");
    setBody("");
    setTarget("همه دانشجویان");
    setSelectedCourse("");
    setSelectedStudent("");
    toast.success("اعلان با موفقیت ارسال شد");
  }

  return (
    <AppShell title="ارسال اعلان" subtitle="ارسال اعلان به دانشجویان و دروس">
      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-2 text-base">
              <Bell className="size-4" />
              فرم ارسال
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>نوع مخاطب</Label>
              <Select
                value={target}
                onValueChange={(v) => {
                  setTarget(v as NotificationTarget);
                  setSelectedCourse("");
                  setSelectedStudent("");
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="مخاطب را انتخاب کنید" />
                </SelectTrigger>
                <SelectContent>
                  {targetOptions.map((opt) => (
                    <SelectItem key={opt} value={opt}>
                      {opt}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {target === "درس خاص" && (
              <div className="space-y-2">
                <Label>انتخاب درس</Label>
                <Select value={selectedCourse} onValueChange={setSelectedCourse}>
                  <SelectTrigger>
                    <SelectValue placeholder="درس را انتخاب کنید" />
                  </SelectTrigger>
                  <SelectContent>
                    {courses.map((c) => (
                      <SelectItem key={c.id} value={c.title}>
                        {c.title}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            {target === "دانشجوی خاص" && (
              <div className="space-y-2">
                <Label>انتخاب دانشجو</Label>
                <Select value={selectedStudent} onValueChange={setSelectedStudent}>
                  <SelectTrigger>
                    <SelectValue placeholder="دانشجو را انتخاب کنید" />
                  </SelectTrigger>
                  <SelectContent>
                    {studentsList.map((s) => (
                      <SelectItem key={s.id} value={s.name}>
                        {s.name} — {s.major}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="subject">موضوع</Label>
              <Input
                id="subject"
                placeholder="موضوع اعلان..."
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="body">متن اعلان</Label>
              <Textarea
                id="body"
                placeholder="متن اعلان را بنویسید..."
                rows={5}
                value={body}
                onChange={(e) => setBody(e.target.value)}
              />
            </div>

            <Button onClick={handleSend} className="w-full">
              <Send className="size-4" />
              ارسال اعلان
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-2 text-base">
              <History className="size-4" />
              تاریخچه اعلان‌ها
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {notifications.length === 0 && (
              <p className="text-center text-sm text-muted-foreground py-8">
                اعلانی ارسال نشده است.
              </p>
            )}
            {notifications.map((n) => {
              const pct =
                n.totalRecipients > 0 ? Math.round((n.readBy / n.totalRecipients) * 100) : 0;
              return (
                <div key={n.id} className="rounded-lg border border-border p-4 space-y-2">
                  <div className="flex items-start justify-between gap-2">
                    <p className="text-sm font-medium leading-6">{n.subject}</p>
                    <Badge variant="secondary" className="shrink-0 text-[10px]">
                      {n.target}
                    </Badge>
                  </div>
                  {n.course && <p className="text-xs text-muted-foreground">درس: {n.course}</p>}
                  {n.student && (
                    <p className="text-xs text-muted-foreground">دانشجو: {n.student}</p>
                  )}
                  <p className="text-xs leading-5 text-muted-foreground line-clamp-2">{n.body}</p>
                  <div className="flex items-center justify-between text-[11px] text-muted-foreground">
                    <span>{n.sentAt}</span>
                    <span>
                      {n.readBy}/{n.totalRecipients} خوانده‌اند ({pct}%)
                    </span>
                  </div>
                </div>
              );
            })}
          </CardContent>
        </Card>
      </div>
    </AppShell>
  );
}
