import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/layout/AppShell";

export const Route = createFileRoute("/academic-structure")({
  component: AcademicStructurePage,
});

function AcademicStructurePage() {
  return (
    <AppShell title="مدیریت ساختار آموزشی" subtitle="پنل واحد آموزش">
      <div className="p-6">
        <h2 className="text-xl font-bold">پنل واحد آموزش</h2>
        <p className="mt-2 text-muted-foreground">اینجا محتوا قرار می‌گیرد.</p>
        {/* trigger rebuild */}
      </div>
    </AppShell>
  );
}
