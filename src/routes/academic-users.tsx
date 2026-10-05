import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/layout/AppShell";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { Users } from "lucide-react";

export const Route = createFileRoute("/academic-users")({
  component: AcademicUsersPage,
});

function AcademicUsersPage() {
  return (
    <AppShell title="مدیریت ساختار آموزشی" subtitle="مدیریت اساتید و دانشجویان">
      <div className="p-6">
        <Card>
          <CardHeader className="flex flex-row items-center gap-2">
            <Users className="size-5" />
            <CardTitle className="text-base">مدیریت اساتید و دانشجویان</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-3 sm:grid-cols-2">
            <Input placeholder="نام کامل" />
            <Input placeholder="ایمیل دانشگاهی" />
            <Input placeholder="شماره پرسنلی / دانشجویی" />
            <Input placeholder="گروه" />
            <Button onClick={()=> toast.success("حساب ایجاد و اطلاعات ورود ارسال شد")}>ایجاد حساب</Button>
            <Button variant="outline" onClick={()=> toast.success("احراز هویت انجام شد")}>احراز هویت</Button>
          </CardContent>
        </Card>
      </div>
    </AppShell>
  );
}
