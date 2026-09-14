import { Link } from "@tanstack/react-router";
import {
  Users,
  Presentation,
  MonitorPlay,
  Smile,
  Building2,
  CalendarClock,
  AlertTriangle,
} from "lucide-react";
import { toast } from "sonner";
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
import {
  adminStats,
  departments,
  courseCatalog,
  facultyNames,
  scheduleItems,
  enrollmentChart,
  attendanceChart,
  requestPie,
  requests,
} from "@/lib/mock-data";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const icons = { users: Users, professor: Presentation, classes: MonitorPlay, smile: Smile };
const pieColors = ["var(--chart-1)", "var(--chart-2)", "var(--chart-3)", "var(--chart-4)"];

const statusVariant: Record<string, "default" | "secondary" | "destructive"> = {
  "در حال بررسی": "default",
  "تایید شده": "secondary",
  "رد شده": "destructive",
  "ثبت شده": "secondary",
};

export function AdminDashboard() {
  return (
    <div className="space-y-5">
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {adminStats.map((s) => {
          const Icon = icons[s.icon as keyof typeof icons];
          return (
            <Card key={s.label}>
              <CardContent className="flex items-start gap-3 p-5">
                <span className="flex size-11 items-center justify-center rounded-xl bg-accent/15 text-navy">
                  <Icon className="size-5" />
                </span>
                <span className="min-w-0">
                  <span className="block text-2xl font-bold">{s.value}</span>
                  <span className="block text-xs text-muted-foreground">{s.label}</span>
                  <span className="mt-1 block text-[11px] text-accent-foreground/70">
                    {s.change} نسبت به ترم گذشته
                  </span>
                </span>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="grid gap-5 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-base">روند ثبت‌نام و دانشجویان فعال</CardTitle>
          </CardHeader>
          <CardContent className="h-72" dir="ltr">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={enrollmentChart}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                <XAxis dataKey="term" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="ثبت‌نام" stroke="var(--chart-1)" strokeWidth={2} />
                <Line type="monotone" dataKey="فعال" stroke="var(--chart-2)" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">سهم انواع درخواست‌ها</CardTitle>
          </CardHeader>
          <CardContent className="h-72" dir="ltr">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={requestPie}
                  dataKey="value"
                  nameKey="name"
                  innerRadius={50}
                  outerRadius={85}
                >
                  {requestPie.map((_, i) => (
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
            <CardTitle className="flex items-center gap-2 text-base">
              <Building2 className="size-4 text-accent" /> نمای کلی ساختار آموزشی
            </CardTitle>
            <Button asChild size="sm" variant="outline">
              <Link to="/academic-structure">مدیریت کامل</Link>
            </Button>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-3">
              {[
                { label: "دانشکده‌ها", value: facultyNames.length },
                { label: "گروه‌های آموزشی", value: departments.length },
                {
                  label: "رشته‌ها و مقاطع",
                  value: departments.reduce((s, d) => s + d.fields.length, 0),
                },
                { label: "دروس تعریف‌شده", value: courseCatalog.length },
              ].map((s) => (
                <div key={s.label} className="rounded-xl bg-accent/10 p-3 text-center">
                  <span className="block text-xl font-bold text-navy">
                    {s.value.toLocaleString("fa-IR")}
                  </span>
                  <span className="block text-[11px] text-muted-foreground">{s.label}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">میانگین حضور در کلاس‌های هفته</CardTitle>
          </CardHeader>
          <CardContent className="h-64" dir="ltr">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={attendanceChart}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                <XAxis dataKey="day" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip />
                <Bar dataKey="حضور" fill="var(--chart-2)" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-5 lg:grid-cols-2">
        <Card>
          <CardHeader className="flex-row items-center justify-between">
            <CardTitle className="text-base">کارتابل درخواست‌های آموزشی</CardTitle>
            <Button asChild variant="ghost" size="sm">
              <Link to="/requests">همه درخواست‌ها</Link>
            </Button>
          </CardHeader>
          <CardContent className="space-y-3">
            {requests.map((r) => (
              <div
                key={r.id}
                className="flex flex-wrap items-center gap-3 rounded-xl border border-border p-3"
              >
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium">{r.type}</p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    {r.student} — {r.id} — {r.date}
                  </p>
                </div>
                <Badge variant={statusVariant[r.status]}>{r.status}</Badge>
                <div className="flex gap-2">
                  <Button size="sm" onClick={() => toast.success(`درخواست ${r.id} تایید شد`)}>
                    تایید
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => toast.error(`درخواست ${r.id} رد شد`)}
                  >
                    رد
                  </Button>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex-row items-center justify-between">
            <CardTitle className="flex items-center gap-2 text-base">
              <CalendarClock className="size-4 text-accent" /> وضعیت زمان‌بندی
            </CardTitle>
            <Button asChild size="sm" variant="outline">
              <Link to="/scheduling">برنامه‌ریزی و تداخل</Link>
            </Button>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="grid grid-cols-3 gap-3">
              {[
                { label: "جلسه و امتحان", value: scheduleItems.length },
                { label: "کلاس", value: scheduleItems.filter((i) => i.kind === "کلاس").length },
                { label: "امتحان", value: scheduleItems.filter((i) => i.kind === "امتحان").length },
              ].map((s) => (
                <div key={s.label} className="rounded-xl bg-accent/10 p-3 text-center">
                  <span className="block text-xl font-bold text-navy">
                    {s.value.toLocaleString("fa-IR")}
                  </span>
                  <span className="block text-[11px] text-muted-foreground">{s.label}</span>
                </div>
              ))}
            </div>
            {scheduleItems.filter((i) => i.conflict).length > 0 && (
              <div className="flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 p-3 text-xs text-red-700">
                <AlertTriangle className="size-4 shrink-0" />
                {scheduleItems.filter((i) => i.conflict).length.toLocaleString("fa-IR")} مورد تداخل
                در زمان‌بندی شناسایی شد — برای بررسی به صفحه برنامه‌ریزی مراجعه کنید.
              </div>
            )}
          </CardContent>
        </Card>
      </div>
      <Card className="border-accent/40 bg-accent/5">
        <CardHeader className="flex-row items-center gap-2">
          <Presentation className="size-5 text-navy" />
          <CardTitle className="text-base">ابزارهای واحد آموزش</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {[
              { to: "/academic-structure", label: "ساختار آموزشی" },
              { to: "/scheduling", label: "زمان‌بندی و تداخل" },
              { to: "/add-drop", label: "حذف و اضافه واحد" },
              { to: "/grade-workflow", label: "گردش کار نمرات" },
              { to: "/academic-calendar", label: "تقویم آموزشی" },
              { to: "/admin-reports", label: "گزارش‌های مدیریتی" },
            ].map((l) => (
              <Button key={l.to} asChild size="sm" variant="outline">
                <Link to={l.to}>{l.label}</Link>
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
