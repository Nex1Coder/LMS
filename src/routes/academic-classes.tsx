import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/layout/AppShell";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

export const Route = createFileRoute("/academic-classes")({
  component: AcademicClassesPage,
});

function AcademicClassesPage() {
  return (
    <AppShell title="تشکیل کلاس‌ها" subtitle="تخصیص درس به استاد، ثبت ظرفیت و زمان‌بندی">
      <Card>
        <CardHeader><CardTitle className="text-base">تشکیل کلاس‌ها</CardTitle></CardHeader>
        <CardContent className="grid gap-3 sm:grid-cols-4">
          <Input placeholder="نام استاد" />
          <Input placeholder="کد درس" />
          <Input placeholder="ظرفیت کلاس" />
          <Input placeholder="زمان‌بندی کلاس" />
          <Button onClick={()=> toast.success("کلاس تشکیل و درس به استاد تخصیص یافت")} className="sm:col-span-4">تخصیص درس و ثبت کلاس</Button>
        </CardContent>
      </Card>
    </AppShell>
  );
}
