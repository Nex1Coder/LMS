import * as React from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Activity, Users } from "lucide-react";
import { AppShell } from "@/components/layout/AppShell";
import { studentsList } from "@/lib/mock-data";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/at-risk-students")({
  head: () => ({
    meta: [
      { title: "فعالیت دانشجویان | سامانه آموزش مجازی دانشگاه" },
      {
        name: "description",
        content: "سنجش فعالیت دانشجویان بر اساس حضور، پرسش و پاسخ و فعالیت در کلاس.",
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
  const studentsWithActivity = React.useMemo(() => {
    return studentsList.map(s => {
      const attendance = Math.round(60 + Math.random()*40);
      const qaCount = Math.round(5 + Math.random()*25);
      const classActivity = Math.round(40 + Math.random()*60);
      const score = Math.round(attendance*0.4 + classActivity*0.3 + Math.min(qaCount*2,100)*0.3);
      return { ...s, attendance, qaCount, classActivity, score };
    }).sort((a,b)=>b.score-a.score);
  }, []);

  return (
    <AppShell
      title="فعالیت دانشجویان"
      subtitle="سنجش فعالیت دانشجویان بر اساس حضور، پرسش و پاسخ و فعالیت در کلاس"
    >
      <div className="grid gap-4 sm:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
              <Users className="size-4" />
              تعداد دانشجویان
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <p className="text-2xl font-bold">{studentsWithActivity.length}</p>
          </CardContent>
        </Card>
      </div>

      <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {studentsWithActivity.map((student) => (
          <Card key={student.id}>
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <CardTitle className="text-base">{student.name}</CardTitle>
                  <p className="mt-1 text-xs text-muted-foreground">شماره دانشجویی: {student.id}</p>
                </div>
                <Badge variant={student.score >= 80 ? "default" : student.score >= 60 ? "secondary" : "destructive"}>{student.score}</Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="text-muted-foreground">میزان حضور</span>
                  <span className="font-semibold">{student.attendance}%</span>
                </div>
                <Progress value={student.attendance} className="h-2" />
              </div>
              <div>
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="text-muted-foreground">فعالیت در کلاس</span>
                  <span className="font-semibold">{student.classActivity}%</span>
                </div>
                <Progress value={student.classActivity} className="h-2" />
              </div>
              <div className="flex items-center justify-between rounded-lg bg-muted/50 px-3 py-2 text-xs">
                <span className="text-muted-foreground">پرسش و پاسخ</span>
                <span className="font-semibold">{student.qaCount} مورد</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </AppShell>
  );
}
