import * as React from "react";
import { createFileRoute } from "@tanstack/react-router";
import { AlertTriangle, GraduationCap, Users } from "lucide-react";
import { toast } from "sonner";
import { AppShell } from "@/components/layout/AppShell";
import { atRiskStudents } from "@/lib/mock-data";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/at-risk-students")({
  head: () => ({
    meta: [
      { title: "دانشجویان کم‌فعال | سامانه آموزش مجازی دانشگاه" },
      {
        name: "description",
        content: "نمای جامع دانشجویان در معرض افت بر اساس حضور، نمره و وضعیت تکالیف برای اساتید.",
      },
    ],
  }),
  component: AtRiskStudentsPage,
});

const riskStyles: Record<string, string> = {
  بحرانی: "bg-red-100 text-red-700",
  هشدار: "bg-amber-100 text-amber-700",
  مرزی: "bg-yellow-100 text-yellow-700",
};

function gradeColor(grade: number): string {
  if (grade >= 15) return "text-green-600";
  if (grade >= 12) return "text-yellow-600";
  return "text-red-600";
}

function AtRiskStudentsPage() {
  const [courseFilter, setCourseFilter] = React.useState("all");

  const courseOptions = React.useMemo(
    () => Array.from(new Set(atRiskStudents.map((s) => s.course))),
    [],
  );

  const filtered = React.useMemo(
    () =>
      courseFilter === "all"
        ? atRiskStudents
        : atRiskStudents.filter((s) => s.course === courseFilter),
    [courseFilter],
  );

  const total = filtered.length;
  const criticalCount = filtered.filter((s) => s.risk === "بحرانی").length;
  const warningCount = filtered.filter((s) => s.risk === "هشدار").length;

  return (
    <AppShell
      title="دانشجویان کم‌فعال"
      subtitle="دانشجویانی که بر اساس حضور، نمره و تکالیف در معرض افت هستند — نسخه نمایشی"
    >
      <div className="grid gap-4 sm:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
              <Users className="size-4" />
              تعداد کل در خطر
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <p className="text-2xl font-bold">{total}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-sm font-medium text-red-600">
              <AlertTriangle className="size-4" />
              وضعیت بحرانی
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <p className="text-2xl font-bold text-red-600">{criticalCount}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-sm font-medium text-amber-600">
              <GraduationCap className="size-4" />
              وضعیت هشدار
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <p className="text-2xl font-bold text-amber-600">{warningCount}</p>
          </CardContent>
        </Card>
      </div>

      <div className="mt-5 flex items-center gap-3">
        <GraduationCap className="size-5 text-accent" />
        <Select value={courseFilter} onValueChange={setCourseFilter}>
          <SelectTrigger className="w-64">
            <SelectValue placeholder="انتخاب درس" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">همه درس‌ها</SelectItem>
            {courseOptions.map((course) => (
              <SelectItem key={course} value={course}>
                {course}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {filtered.length === 0 ? (
        <div className="mt-5 rounded-2xl border border-dashed border-border bg-muted/30 px-6 py-16 text-center">
          <AlertTriangle className="mx-auto size-10 text-muted-foreground/50" />
          <p className="mt-4 text-sm text-muted-foreground">هیچ دانشجویی در وضعیت خطر نیست</p>
        </div>
      ) : (
        <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((student) => (
            <Card key={student.id} className="flex flex-col">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <CardTitle className="text-base">{student.name}</CardTitle>
                    <p className="mt-1 text-xs text-muted-foreground">
                      شماره دانشجویی: {student.id}
                    </p>
                  </div>
                  <Badge className={cn("shrink-0", riskStyles[student.risk])}>{student.risk}</Badge>
                </div>
                <p className="mt-2 flex items-center gap-1.5 text-xs text-muted-foreground">
                  <GraduationCap className="size-3.5 text-accent" />
                  {student.course}
                </p>
              </CardHeader>
              <CardContent className="flex flex-1 flex-col gap-3">
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-muted-foreground">حضور در کلاس</span>
                    <span className="font-semibold">{student.attendanceRate}٪</span>
                  </div>
                  <Progress value={student.attendanceRate} className="h-2" />
                </div>
                <div className="flex items-center justify-between rounded-lg bg-muted/50 px-3 py-2 text-xs">
                  <span className="text-muted-foreground">میانگین نمره</span>
                  <span className={cn("font-bold", gradeColor(student.avgGrade))}>
                    {student.avgGrade.toFixed(1)} از ۲۰
                  </span>
                </div>
                <div className="flex items-center justify-between rounded-lg bg-muted/50 px-3 py-2 text-xs">
                  <span className="text-muted-foreground">تکالیف انجام‌شده</span>
                  <span className="font-semibold">
                    {student.assignmentsDone} از {student.assignmentsTotal} تکلیف
                  </span>
                </div>
                <p className="text-[11px] text-muted-foreground">
                  آخرین فعالیت: {student.lastActivity}
                </p>
                <Button
                  variant="outline"
                  className="mt-auto w-full"
                  onClick={() => toast.success(`پیام برای ${student.name} ارسال شد`)}
                >
                  ارسال پیام
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </AppShell>
  );
}
