import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/layout/AppShell";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { BookOpen } from "lucide-react";

export const Route = createFileRoute("/academic-courses")({
  component: AcademicCoursesPage,
});

function AcademicCoursesPage() {
  return (
    <AppShell title="مدیریت ساختار آموزشی" subtitle="تعریف دروس و پیش‌نیازها">
      <div className="p-6">
        <Card>
          <CardHeader className="flex flex-row items-center gap-2">
            <BookOpen className="size-5" />
            <CardTitle className="text-base">تعریف دروس و پیش‌نیازها</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-3 sm:grid-cols-2 lg:grid-cols-6">
            <Input placeholder="کد درس" />
            <Input placeholder="نام درس" />
            <Input placeholder="واحد" />
            <Input placeholder="ظرفیت" />
            <Input placeholder="سطح" />
            <Input placeholder="پیش‌نیاز" />
            <Button onClick={()=> toast.success("درس ثبت شد")}>ثبت درس</Button>
          </CardContent>
        </Card>
      </div>
    </AppShell>
  );
}
