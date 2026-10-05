import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/layout/AppShell";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { Building2 } from "lucide-react";

export const Route = createFileRoute("/academic-org")({
  component: AcademicOrgPage,
});

function AcademicOrgPage() {
  return (
    <AppShell title="مدیریت ساختار آموزشی" subtitle="ساختار سازمانی">
      <div className="p-6">
        <Card>
          <CardHeader className="flex flex-row items-center gap-2">
            <Building2 className="size-5" />
            <CardTitle className="text-base">ساختار سازمانی</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
            <Input placeholder="مجتمع/دانشکده" />
            <Input placeholder="پژوهشکده" />
            <Input placeholder="گروه علمی" />
            <Input placeholder="رشته" />
            <Input placeholder="مقطع" />
            <Button className="sm:col-span-2" onClick={()=> toast.success("ساختار سازمانی ثبت شد")}>ثبت ساختار</Button>
          </CardContent>
        </Card>
      </div>
    </AppShell>
  );
}
