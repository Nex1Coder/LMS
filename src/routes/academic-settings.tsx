import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/layout/AppShell";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { Settings } from "lucide-react";

export const Route = createFileRoute("/academic-settings")({
  component: AcademicSettingsPage,
});

function AcademicSettingsPage() {
  return (
    <AppShell title="مدیریت ساختار آموزشی" subtitle="تنظیمات سامانه">
      <div className="p-6">
        <Card>
          <CardHeader className="flex flex-row items-center gap-2">
            <Settings className="size-5" />
            <CardTitle className="text-base">تنظیمات سامانه</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-3 sm:grid-cols-2">
            <Input placeholder="نام نقش" />
            <Input placeholder="دسترسی‌ها" />
            <Input placeholder="قالب/تم" />
            <Input placeholder="تنظیمات اعلان" />
            <Button onClick={()=> toast.success("تنظیمات ذخیره شد")}>ذخیره تنظیمات</Button>
          </CardContent>
        </Card>
      </div>
    </AppShell>
  );
}
