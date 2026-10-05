import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/layout/AppShell";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

export const Route = createFileRoute("/academic-users")({
  component: AcademicUsersPage,
});

function AcademicUsersPage() {
  return (
    <AppShell title="مدیریت اساتید و دانشجویان" subtitle="ایجاد حساب، احراز هویت، گروه‌بندی و وضعیت">
      <Card>
        <CardHeader><CardTitle className="text-base">مدیریت اساتید و دانشجویان</CardTitle></CardHeader>
        <CardContent className="space-y-3">
          <Input placeholder="نام کامل" />
          <Input placeholder="ایمیل دانشگاهی" />
          <Input placeholder="شماره پرسنلی / دانشجویی" />
          <div className="grid gap-3 sm:grid-cols-2">
            <Button onClick={()=> toast.success("حساب ایجاد و اطلاعات ورود ارسال شد")}>ایجاد حساب</Button>
            <Button variant="outline" onClick={()=> toast.success("احراز هویت انجام شد")}>احراز هویت</Button>
          </div>
        </CardContent>
      </Card>
    </AppShell>
  );
}
