import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/layout/AppShell";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export const Route = createFileRoute("/academic-reports")({
  component: AcademicReportsPage,
});

function AcademicReportsPage() {
  return (
    <AppShell title="گزارش‌گیری پایه" subtitle="آمار ثبت‌نام، تراکم کلاس و عملکرد اساتید">
      <div className="grid gap-6 lg:grid-cols-3">
        <Card><CardHeader><CardTitle className="text-base">آمار ثبت‌نام</CardTitle></CardHeader><CardContent><p className="text-sm text-muted-foreground">نمودار ثبت‌نام دانشجویان در کلاس‌ها.</p></CardContent></Card>
        <Card><CardHeader><CardTitle className="text-base">تراکم کلاس</CardTitle></CardHeader><CardContent><p className="text-sm text-muted-foreground">نمایش پر بودن کلاس‌ها و ظرفیت.</p></CardContent></Card>
        <Card><CardHeader><CardTitle className="text-base">عملکرد اساتید</CardTitle></CardHeader><CardContent><p className="text-sm text-muted-foreground">گزارش حضور، تکالیف و نمره‌دهی اساتید.</p></CardContent></Card>
      </div>
    </AppShell>
  );
}
