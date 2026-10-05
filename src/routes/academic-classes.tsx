import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/layout/AppShell";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { GraduationCap } from "lucide-react";

export const Route = createFileRoute("/academic-classes")({
  component: AcademicClassesPage,
});

function AcademicClassesPage() {
  return (
    <AppShell title="مدیریت ساختار آموزشی" subtitle="تشکیل کلاس‌ها">
      <div className="p-6">
        <Card>
          <CardHeader className="flex flex-row items-center gap-2">
            <GraduationCap className="size-5" />
            <CardTitle className="text-base">تشکیل کلاس‌ها</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-3 sm:grid-cols-4">
            <Input placeholder="نام استاد" />
            <Input placeholder="کد درس" />
            <Input placeholder="ظرفیت کلاس" />
            <Input placeholder="زمان‌بندی" />
            <Button className="sm:col-span-4" onClick={()=> toast.success("کلاس تشکیل و درس به استاد تخصیص یافت")}>تخصیص درس و ثبت کلاس</Button>
          </CardContent>
        </Card>
      </div>
    </AppShell>
  );
}
