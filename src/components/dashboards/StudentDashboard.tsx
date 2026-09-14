import * as React from "react";
import { Link } from "@tanstack/react-router";
import {
  Video,
  ClipboardList,
  GraduationCap,
  Bot,
  Send,
  Clock,
  TrendingUp,
  CheckCircle2,
} from "lucide-react";
import { toast } from "sonner";
import {
  todayClasses,
  assignments,
  grades,
  courses,
  weekDays,
  timeSlots,
  weeklyTimetable,
  aiSuggestions,
  studyPlanByCourse,
} from "@/lib/mock-data";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

const statusColor: Record<string, string> = {
  "درحال برگزاری": "bg-accent text-accent-foreground",
  "به‌زودی": "bg-secondary text-secondary-foreground",
  "پایان‌یافته": "bg-muted text-muted-foreground",
};

export function StudentDashboard() {
  const [q, setQ] = React.useState("");

  return (
    <div className="grid gap-5 xl:grid-cols-3">
      <div className="space-y-5 xl:col-span-2">
        <div className="grid gap-4 sm:grid-cols-4">
          {[
            { label: "معدل کل", value: "۱۷٫۴۲", icon: TrendingUp },
            { label: "واحد این ترم", value: "۱۴", icon: GraduationCap },
            { label: "تکالیف باز", value: "۲", icon: ClipboardList },
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
            <CardTitle className="text-base">کلاس‌های امروز</CardTitle>
            <Badge variant="secondary">۴ جلسه</Badge>
          </CardHeader>
          <CardContent className="space-y-3">
            {todayClasses.map((c) => (
              <div
                key={c.id}
                className="flex flex-wrap items-center gap-3 rounded-xl border border-border p-3"
              >
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-bold">{c.course}</p>
                  <p className="mt-1 flex items-center gap-2 text-xs text-muted-foreground">
                    <Clock className="size-3.5" /> {c.time} — {c.professor}
                  </p>
                </div>
                <Badge className={cn("shrink-0", statusColor[c.status])}>{c.status}</Badge>
                <Button asChild size="sm" disabled={c.status === "پایان‌یافته"}>
                  <Link to="/classroom">
                    <Video className="size-4" /> ورود به کلاس
                  </Link>
                </Button>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">برنامه هفتگی</CardTitle>
          </CardHeader>
          <CardContent className="overflow-x-auto scrollbar-thin">
            <table className="w-full min-w-[640px] border-separate border-spacing-1 text-xs">
              <thead>
                <tr>
                  <th className="w-16 text-muted-foreground">ساعت</th>
                  {weekDays.map((d) => (
                    <th key={d} className="rounded-lg bg-secondary p-2 font-bold">
                      {d}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {timeSlots.map((slot) => (
                  <tr key={slot}>
                    <td className="text-center text-muted-foreground">{slot}</td>
                    {weekDays.map((d) => {
                      const item = weeklyTimetable[d]?.[slot] ?? null;
                      return (
                        <td key={d} className="p-0">
                          <div
                            className={cn(
                              "h-14 rounded-lg p-2 leading-5",
                              item
                                ? "bg-accent/15 font-medium text-navy ring-1 ring-accent/30"
                                : "bg-muted/50",
                            )}
                          >
                            {item ?? ""}
                          </div>
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </CardContent>
        </Card>

        <Card>
            <CardHeader className="flex-row items-center justify-between">
              <CardTitle className="text-base">تکالیف تحویلی</CardTitle>
              <Button asChild variant="ghost" size="sm">
                <Link to="/assignments">همه</Link>
              </Button>
            </CardHeader>
            <CardContent className="space-y-3">
              {assignments.slice(0, 3).map((a) => (
                <div key={a.id} className="rounded-xl border border-border p-3">
                  <p className="text-sm font-medium leading-6">{a.title}</p>
                  <p className="mt-1 text-xs text-muted-foreground">{a.course}</p>
                  <div className="mt-2 flex items-center justify-between text-xs">
                    <span className="text-muted-foreground">مهلت: {a.due}</span>
                    <Badge variant={a.status === "در انتظار ارسال" ? "default" : "secondary"}>
                      {a.status}
                    </Badge>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
      </div>

      <div className="space-y-5">
        <Card>
          <CardHeader className="flex-row items-center justify-between">
            <CardTitle className="text-base">کارنامه و نمرات اخیر</CardTitle>
            <Badge variant="secondary">معدل ترم ۱۷٫۰۵</Badge>
          </CardHeader>
          <CardContent className="space-y-3">
            {grades.slice(0, 4).map((g) => (
              <div key={g.code} className="flex items-center justify-between text-sm">
                <span className="min-w-0 truncate">{g.course}</span>
                <span className="ms-3 shrink-0 font-bold text-navy">{g.total}</span>
              </div>
            ))}
            <Button asChild variant="outline" className="w-full">
              <Link to="/grades">مشاهده کارنامه کامل</Link>
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex-row items-center justify-between">
            <CardTitle className="text-base">برنامه مطالعه این هفته</CardTitle>
            <Badge variant="secondary">هوش مصنوعی</Badge>
          </CardHeader>
          <CardContent className="space-y-3">
            <p className="text-xs leading-6 text-muted-foreground">
              بر اساس نقاط ضعف شما و فاصله تا امتحان آماده شده است.
            </p>
            {studyPlanByCourse["مبانی هوش مصنوعی"]?.map((step) => (
              <div
                key={step.step}
                className="flex items-start gap-2 rounded-xl border border-border p-3"
              >
                <CheckCircle2
                  className={cn(
                    "mt-0.5 size-4 shrink-0",
                    step.done ? "text-emerald-600" : "text-muted-foreground/40",
                  )}
                />
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium">{step.title}</p>
                  <p className="mt-0.5 text-[11px] leading-5 text-muted-foreground">
                    {step.action}
                  </p>
                </div>
                <span className="shrink-0 text-xs font-bold text-navy">گام {step.step}</span>
              </div>
            ))}
            <Button asChild variant="outline" className="w-full">
              <Link to="/smart-panel">مشاهده برنامه کامل مطالعه</Link>
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">درس‌های من</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {courses.map((c) => (
              <Link key={c.id} to="/courses" className="block">
                <p className="flex items-center justify-between text-sm font-medium">
                  <span className="truncate">{c.title}</span>
                  <span className="text-xs text-muted-foreground">{c.progress}٪</span>
                </p>
                <Progress value={c.progress} className="mt-2" />
              </Link>
            ))}
          </CardContent>
        </Card>

        <Card className="border-accent/40 bg-accent/5">
          <CardHeader className="flex-row items-center gap-2">
            <Bot className="size-5 text-navy" />
            <CardTitle className="text-base">دستیار هوشمند درس</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <p className="text-xs leading-6 text-muted-foreground">
              سوال درسی یا آیین‌نامه‌ای خود را بپرسید؛ دستیار بر اساس محتوای دروس شما پاسخ می‌دهد.
            </p>
            <div className="flex flex-wrap gap-2">
              {aiSuggestions.slice(0, 2).map((s) => (
                <button
                  key={s}
                  onClick={() => setQ(s)}
                  className="rounded-full bg-secondary px-3 py-1 text-[11px] text-secondary-foreground hover:bg-accent/20"
                >
                  {s}
                </button>
              ))}
            </div>
            <div className="flex gap-2">
              <Input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="سوال خود را بنویسید…"
              />
              <Button
                size="icon"
                onClick={() => {
                  toast.success("سوال به دستیار هوشمند ارسال شد");
                  setQ("");
                }}
                aria-label="ارسال"
              >
                <Send className="size-4" />
              </Button>
            </div>
            <Button asChild variant="ghost" className="w-full">
              <Link to="/smart-panel">گفت‌وگوی کامل با دستیار</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
