import { createFileRoute } from "@tanstack/react-router";
import { BarChart3, Clock, Users, GraduationCap } from "lucide-react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { AppShell } from "@/components/layout/AppShell";
import {
  capacityReport,
  teachingLoad,
  facultyDistribution,
  gradeDistribution,
} from "@/lib/mock-data";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

export const Route = createFileRoute("/admin-reports")({
  head: () => ({
    meta: [
      {
        title: "گزارش‌های مدیریتی | سامانه آموزش مجازی دانشگاه",
      },
      {
        name: "description",
        content: "گزارش ظرفیت کلاس‌ها، ساعات تدریس و آمار دانشکده‌ها",
      },
    ],
  }),
  component: AdminReportsPage,
});

const pieColors = ["var(--chart-1)", "var(--chart-2)", "var(--chart-3)", "var(--chart-4)"];

const summaryCards = [
  { label: "مجموع ساعات تدریس هفته", icon: Clock },
  { label: "میانگین پر بودن کلاس‌ها", icon: BarChart3 },
  { label: "تعداد دانشجویان کل", icon: Users },
  { label: "اعضای هیئت علمی", icon: GraduationCap },
];

function AdminReportsPage() {
  const totalWeeklyHours = teachingLoad.reduce((sum, t) => sum + t.hours, 0);
  const avgUtilization = Math.round(
    (capacityReport.reduce((sum, c) => sum + c.ثبت‌نام / c.ظرفیت, 0) / capacityReport.length) * 100,
  );
  const totalStudents = facultyDistribution.reduce((sum, f) => sum + f.students, 0);
  const totalProfessors = facultyDistribution.reduce((sum, f) => sum + f.professors, 0);

  const summaryValues = [
    { value: `${totalWeeklyHours}`, suffix: "ساعت" },
    { value: `${avgUtilization}`, suffix: "٪" },
    { value: totalStudents.toLocaleString("fa-IR"), suffix: "نفر" },
    { value: totalProfessors.toLocaleString("fa-IR"), suffix: "نفر" },
  ];

  return (
    <AppShell
      title="گزارش‌های مدیریتی"
      subtitle="گزارش ظرفیت کلاس‌ها، ساعات تدریس و آمار دانشکده‌ها"
    >
      <div className="space-y-5">
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {summaryCards.map((s, i) => {
            const Icon = s.icon;
            const value = summaryValues[i];
            return (
              <Card key={s.label}>
                <CardContent className="flex items-start gap-3 p-5">
                  <span className="flex size-11 items-center justify-center rounded-xl bg-accent/15 text-navy">
                    <Icon className="size-5" />
                  </span>
                  <span className="min-w-0">
                    <span className="flex items-baseline gap-1.5">
                      <span className="block text-2xl font-bold">{value?.value}</span>
                      <span className="text-xs text-muted-foreground">{value?.suffix}</span>
                    </span>
                    <span className="block text-xs text-muted-foreground">{s.label}</span>
                  </span>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <div className="grid gap-5 lg:grid-cols-3">
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle className="text-base">ظرفیت کلاس‌ها</CardTitle>
            </CardHeader>
            <CardContent className="h-72" dir="ltr">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={capacityReport}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                  <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                  <YAxis tick={{ fontSize: 11 }} />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="ظرفیت" fill="var(--chart-1)" radius={[6, 6, 0, 0]} />
                  <Bar dataKey="ثبت‌نام" fill="var(--chart-2)" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">توزیع نمرات</CardTitle>
            </CardHeader>
            <CardContent className="h-72" dir="ltr">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={gradeDistribution}
                    dataKey="count"
                    nameKey="name"
                    innerRadius={50}
                    outerRadius={85}
                  >
                    {gradeDistribution.map((_, i) => (
                      <Cell key={i} fill={pieColors[i % pieColors.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-5 lg:grid-cols-2">
          <Card>
            <CardHeader className="flex-row items-center justify-between">
              <CardTitle className="text-base">ساعات تدریس اساتید</CardTitle>
              <Badge variant="secondary">{teachingLoad.length} استاد</Badge>
            </CardHeader>
            <CardContent className="space-y-4 pt-4">
              {teachingLoad.map((t) => {
                const hoursPercent = Math.round((t.hours / t.limit) * 100);
                return (
                  <div key={t.name} className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">{t.name}</span>
                      <span className="text-xs text-muted-foreground">
                        {t.hours} از {t.limit} ساعت
                      </span>
                    </div>
                    <Progress value={hoursPercent} className="h-2" />
                  </div>
                );
              })}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">توزیع دانشجویان دانشکده‌ها</CardTitle>
            </CardHeader>
            <CardContent className="h-72" dir="ltr">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={facultyDistribution}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                  <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                  <YAxis tick={{ fontSize: 11 }} />
                  <Tooltip />
                  <Legend />
                  <Bar
                    dataKey="students"
                    name="دانشجو"
                    fill="var(--chart-1)"
                    radius={[6, 6, 0, 0]}
                  />
                  <Bar
                    dataKey="professors"
                    name="استاد"
                    fill="var(--chart-3)"
                    radius={[6, 6, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>
      </div>
    </AppShell>
  );
}
