import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/layout/AppShell";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

export const Route = createFileRoute("/academic-settings")({
  component: AcademicSettingsPage,
});

function AcademicSettingsPage() {
  return (
    <AppShell title="تنظیمات سامانه" subtitle="نقش‌ها، دسترسی‌ها، قالب‌ها و اعلان‌ها">
      <Card>
        <CardHeader><CardTitle className="text-base">تنظیمات سامانه</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-3 sm:grid-cols-2">
            <Input placeholder="نام نقش" />
            <Input placeholder="دسترسی‌ها" />
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            <Input placeholder="قالب/تم" />
            <Input placeholder="تنظیمات اعلان" />
          </div>
          <Button onClick={()=> toast.success("تنظیمات ذخیره شد")}>ذخیره تنظیمات</Button>
        </CardContent>
      </Card>
    </AppShell>
  );
}
