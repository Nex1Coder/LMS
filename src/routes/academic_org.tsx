import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/layout/AppShell";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

// rebuild trigger
export const Route = createFileRoute("/academic-org")({
  component: AcademicOrgPage,
});

function AcademicOrgPage() {
  return (
    <AppShell title="ساختار سازمانی" subtitle="مدیریت مجتمع، پژوهشکده، گروه علمی، رشته و مقطع">
      <Card>
        <CardHeader><CardTitle className="text-base">مدیریت ساختار سازمانی</CardTitle></CardHeader>
        <CardContent className="space-y-3">
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            <Input placeholder="نام مجتمع/دانشکده" />
            <Input placeholder="نام پژوهشکده" />
            <Input placeholder="نام گروه علمی" />
            <Input placeholder="نام رشته" />
            <Input placeholder="مقطع" />
            <Button onClick={()=> toast.success("ساختار سازمانی ثبت شد")}>ثبت ساختار</Button>
          </div>
        </CardContent>
      </Card>
    </AppShell>
  );
}
