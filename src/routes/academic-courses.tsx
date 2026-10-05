import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/layout/AppShell";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

export const Route = createFileRoute("/academic-courses")({
  component: AcademicCoursesPage,
});

function AcademicCoursesPage() {
  return (
    <AppShell title="تعریف دروس و پیش‌نیازها" subtitle="مدیریت کد درس، نام، واحد، ظرفیت و سطح">
      <Card>
        <CardHeader><CardTitle className="text-base">تعریف دروس و پیش‌نیازها</CardTitle></CardHeader>
        <CardContent className="space-y-3">
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            <Input placeholder="کد درس" />
            <Input placeholder="نام درس" />
            <Input placeholder="واحد" />
            <Input placeholder="ظرفیت" />
            <Input placeholder="سطح/مقطع" />
            <Input placeholder="پیش‌نیاز" />
          </div>
          <Button onClick={()=> toast.success("درس ثبت شد")}>ثبت درس</Button>
        </CardContent>
      </Card>
    </AppShell>
  );
}
