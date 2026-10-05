import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/layout/AppShell";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart3 } from "lucide-react";

export const Route = createFileRoute("/academic-reports")({
  component: AcademicReportsPage,
});

function AcademicReportsPage() {
  return (
    <AppShell title="مدیریت ساختار آموزشی" subtitle="گزارش‌گیری پایه">
      <div className="p-6">
        <Card>
          <CardHeader className="flex flex-row items-center gap-2">
            <BarChart3 className="size-5" />
            <CardTitle className="text-base">گزارش‌گیری پایه</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-6 lg:grid-cols-3">
            <div className="p-4 border rounded-xl">
              <h4 className="font-medium mb-1">آمار ثبت‌نام</h4>
              <p className="text-sm text-muted-foreground">نمودار ثبت‌نام دانشجویان در کلاس‌ها.</p>
            </div>
            <div className="p-4 border rounded-xl">
              <h4 className="font-medium mb-1">تراکم کلاس</h4>
              <p className="text-sm text-muted-foreground">نمایش پر بودن کلاس‌ها و ظرفیت.</p>
            </div>
            <div className="p-4 border rounded-xl">
              <h4 className="font-medium mb-1">عملکرد اساتید</h4>
              <p className="text-sm text-muted-foreground">گزارش حضور، تکالیف و نمره‌دهی.</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </AppShell>
  );
}
