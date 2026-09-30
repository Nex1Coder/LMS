import * as React from "react";
import { Link } from "@tanstack/react-router";
import { ClipboardList, GraduationCap, Bell, TrendingUp, CalendarClock, FileText } from "lucide-react";
import {
  assignments,
  notifications,
  classSessions,
} from "@/lib/mock-data";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

function formatSessionTime(s: typeof classSessions[number]) {
  const dateStr = `${s.date}`;
  const timeStr = s.time;
  return `${s.day} — ${dateStr} • ${timeStr}`;
}

export function StudentDashboard() {
  const openAssignments = assignments.filter(a => a.status === "در انتظار ارسال");
  const upcomingClasses = classSessions.slice(0, 5);
  const upcomingAssignments = assignments.slice(0, 5);
  const newNotificationsCount = notifications.filter(n => n.unread).length;
  const importantNotifications = notifications.slice(0, 5);

  return (
    <div className="grid gap-5 xl:grid-cols-3">
      <div className="space-y-5 xl:col-span-2">
        <div className="grid gap-4 sm:grid-cols-4">
          {[
            { label: "معدل کل", value: "۱۷٫۴۲", icon: TrendingUp },
            { label: "واحدهای این ترم", value: "۱۴", icon: GraduationCap },
            { label: "تکالیف باز", value: String(openAssignments.length), icon: ClipboardList },
            { label: "اعلان‌های جدید", value: String(newNotificationsCount), icon: Bell },
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
                  <p className="mt-1 text-xs text-muted-foreground">{formatSessionTime(s)} • استاد {s.professor}</p>
                </div>
                <a href={`/classroom?session=${s.id}`} className="inline-flex items-center justify-center rounded-md bg-primary px-3 py-1.5 text-xs font-medium text-primary-foreground">🔗 ورود به کلاس</a>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex-row items-center justify-between">
            <CardTitle className="text-base">تکالیف نزدیک</CardTitle>
            <Button asChild variant="ghost" size="sm">
              <Link to="/assignments">همه تکالیف</Link>
            </Button>
          </CardHeader>
          <CardContent className="space-y-3">
            {upcomingAssignments.map(a => (
              <div key={a.id} className="rounded-xl border border-border p-3">
                <p className="text-sm font-medium leading-6">{a.title}</p>
                <p className="mt-1 text-xs text-muted-foreground">{a.course}</p>
                <div className="mt-2 flex items-center justify-between text-xs">
                  <span className="text-muted-foreground flex items-center gap-1"><CalendarClock className="size-3.5"/>مهلت: {a.due}</span>
                  <Badge variant={a.status === "در انتظار ارسال" ? "default" : "secondary"}>{a.status}</Badge>
                </div>
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
            {importantNotifications.map(n => (
              <div key={n.id} className="rounded-xl border border-border p-3">
                <div className="flex items-start gap-2">
                  <FileText className="size-4 mt-0.5 text-muted-foreground" />
                  <div className="min-w-0 flex-1">
                    <p className="text-sm leading-6">{n.title}</p>
                    <p className="text-[11px] text-muted-foreground">{n.time}{n.unread ? " • خوانده نشده" : ""}</p>
                  </div>
                  {n.unread && <Badge variant="default" className="text-[10px]">جدید</Badge>}
                </div>
              </div>
            ))}
            <Button asChild variant="outline" className="w-full">
              <Link to="/requests">مشاهده همه اعلان‌ها</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
