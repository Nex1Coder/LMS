import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/layout/AppShell";
import { StudentDashboard } from "@/components/dashboards/StudentDashboard";
import { ProfessorDashboard } from "@/components/dashboards/ProfessorDashboard";
import { AdminDashboard } from "@/components/dashboards/AdminDashboard";
import { useRole } from "@/lib/role";
import { demoUsers, roleLabels } from "@/lib/mock-data";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "داشبورد | سامانه جامع آموزش مجازی دانشگاه" },
      {
        name: "description",
        content:
          "داشبورد نمایشی سامانه آموزش مجازی دانشگاه با نقش‌های دانشجو، استاد و واحد آموزش.",
      },
      { property: "og:title", content: "داشبورد سامانه آموزش مجازی دانشگاه" },
      {
        property: "og:description",
        content: "کلاس‌های امروز، تکالیف، آزمون‌ها و گزارش‌های آموزشی در یک نگاه.",
      },
    ],
  }),
  component: Index,
});

function Index() {
  const { role } = useRole();
  const titles = {
    student: "داشبورد دانشجو",
    professor: "داشبورد استاد",
    admin: "داشبورد واحد آموزش",
  } as const;

  return (
    <AppShell
      title={role ? titles[role] : "داشبورد"}
      subtitle={
        role ? `${demoUsers[role].name} — نقش فعال: ${roleLabels[role]} | نیم‌سال ۱۴۰۵-۱` : undefined
      }
    >
      {role === "student" && <StudentDashboard />}
      {role === "professor" && <ProfessorDashboard />}
      {role === "admin" && <AdminDashboard />}
    </AppShell>
  );
}
