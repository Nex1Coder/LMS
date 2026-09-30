import * as React from "react";
import { Link } from "@tanstack/react-router";
import { BookOpen, Users, ClipboardCheck, CalendarClock, FileText, Activity, Link2 } from "lucide-react";
import { courses, assignments, exams, notifications, classSessions, studentsList } from "@/lib/mock-data";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

function formatSessionTime(s: typeof classSessions[number]) {
  return `${s.date} — ${s.time}`;
}

export function ProfessorDashboard() {
  const activeCourses = courses.length;
  const totalStudents = courses.reduce((acc, c) => acc + c.students, 0);
  const pendingAssignments = assignments.filter(a => a.status === "ارسال شده" || a.status === "در انتظار ارسال").length;
  const upcomingExams = exams.filter(e => e.status === "برنامه‌ریزی شده").length;

  const upcomingClasses = classSessions.slice(0, 5);
  const pendingReview = assignments.slice(0, 5);

  const studentsWithActivity = studentsList.map(s => {
    const attendance = Math.round(60 + Math.random()*40);
    const participation = Math.round(40 + Math.random()*60);
    const qa = Math.round(20 + Math.random()*80);
    const score = Math.round(attendance*0.4 + participation*0.3 + qa*0.3);
    return { ...s, attendance, participation, qa, score };
  }).sort((a,b)=>b.score-a.score);

  return (
    <div className="grid gap-5 xl:grid-cols-3">
      <div className="space-y-5 xl:col-span-2">
        <div className="grid gap-4 sm:grid-cols-4">
          {[
            { label: "تعداد درس‌های فعال", value: String(activeCourses), icon: BookOpen },
            { label: "تعداد دانشجویان", value: String(totalStudents), icon: Users },
            { label: "تکالیف در انتظار بررسی", value: String(pendingAssignments), icon: ClipboardCheck },
            { label: "آزمون‌های پیش‌رو", value: String(upcomingExams), icon: CalendarClock },
          ].map(({ label, value, icon: Icon }) => (
            <Card key={label}>
              <CardContent className="flex items-center gap-3 p-4">
                <span className="flex size-10 items-center justify-center rounded-xl bg-accent/15 text-navy">
                  <Icon className="size-5" />
                </span>
                <span>
                  <span className="block text-lg font-bold">{value}</span>
                  <span className="block text-xs text-muted-foreground">{label}</span>
                </span>
              </CardContent>
            </Card>
          ))}
        </div>

        <Card>
          <CardHeader className="flex-row items-center justify-between">
            <CardTitle className="text-base">کلاس‌های پیش‌رو</CardTitle>
            <Button asChild variant="ghost" size="sm">
              <Link to="/classroom">همه کلاس‌ها</Link>
            </Button>
          </CardHeader>
          <CardContent className="space-y-3">
            {upcomingClasses.map(s => (
              <div key={s.id} className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-border p-3">
                <div>
                  <p className="text-sm font-medium">{s.course}</p>
                  <p className="mt-1 text-xs text-muted-foreground">{formatSessionTime(s)} • {s.course} • {s.professor}</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-muted-foreground">دانشجو: {courses.find(c=>c.title===s.course)?.students ?? 0}</span>
                  <a href={`/classroom?session=${s.id}`} className="inline-flex items-center justify-center rounded-md bg-primary px-3 py-1.5 text-xs font-medium text-primary-foreground">🔗 ورود به کلاس</a>
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button size="sm" variant="outline">مدیریت لینک</Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader><DialogTitle>تعریف لینک کلاس</DialogTitle></DialogHeader>
                      <div className="space-y-3">
                        <Input placeholder="https://..." />
                        <Button className="w-full" onClick={()=> toast.success("لینک کلاس جدید تعریف شد")}>ذخیره لینک</Button>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex-row items-center justify-between">
            <CardTitle className="text-base">تکالیف در انتظار بررسی</CardTitle>
            <Button asChild variant="ghost" size="sm">
              <Link to="/assignments">همه تکالیف</Link>
            </Button>
          </CardHeader>
          <CardContent className="space-y-3">
            {pendingReview.map(a => (
              <div key={a.id} className="rounded-xl border border-border p-3">
                <p className="text-sm font-medium">{a.title}</p>
                <p className="mt-1 text-xs text-muted-foreground">{a.course}</p>
                <div className="mt-2 flex items-center justify-between text-xs">
                  <span>تعداد تحویل‌ها: {a.submissions ?? 12}</span>
                  <Badge variant={a.status === "در انتظار ارسال" ? "default" : "secondary"}>{a.status}</Badge>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex-row items-center justify-between">
            <CardTitle className="text-base flex items-center gap-2"><Activity className="size-4"/> فعالیت دانشجویان</CardTitle>
            <Button asChild variant="ghost" size="sm">
              <Link to="/at-risk-students">مشاهده کامل</Link>
            </Button>
          </CardHeader>
          <CardContent className="space-y-2">
            {studentsWithActivity.slice(0, 8).map(s => (
              <div key={s.id} className="flex items-center justify-between rounded-xl border border-border p-3 text-xs">
                <div className="min-w-0">
                  <p className="text-sm font-medium">{s.name}</p>
                  <p className="text-muted-foreground">حضور {s.attendance}% • مشارکت {s.participation}% • سؤال {s.qa}%</p>
                </div>
                <Badge variant={s.score >= 80 ? "default" : s.score >= 60 ? "secondary" : "destructive"}>{s.score}</Badge>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      <div className="space-y-5">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">اعلان‌های مهم</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {notifications.slice(0, 6).map(n => (
              <div key={n.id} className="rounded-xl border border-border p-3">
                <div className="flex items-start gap-2">
                  <FileText className="size-4 mt-0.5 text-muted-foreground" />
                  <div className="min-w-0 flex-1">
                    <p className="text-sm leading-6">{n.title}</p>
                    <p className="text-[11px] text-muted-foreground">{n.time}</p>
                  </div>
                  {n.unread && <Badge variant="default" className="text-[10px]">جدید</Badge>}
                </div>
              </div>
            ))}
            <Button asChild variant="outline" className="w-full">
              <Link to="/send-notification">مشاهده همه اعلان‌ها</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
