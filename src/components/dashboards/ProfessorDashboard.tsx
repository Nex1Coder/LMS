import * as React from "react";
import { Link } from "@tanstack/react-router";
import { Video, Users, ClipboardCheck, CalendarCheck, UserCheck, Save } from "lucide-react";
import { toast } from "sonner";
import { todayClasses, courses, assignments, exams, studentsList } from "@/lib/mock-data";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { Switch } from "@/components/ui/switch";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export function ProfessorDashboard() {
  const [attendance, setAttendance] = React.useState<Record<string, boolean>>(
    Object.fromEntries(studentsList.map((s) => [s.id, s.present])),
  );
  const [marks, setMarks] = React.useState<Record<string, string>>({});
  const presentCount = Object.values(attendance).filter(Boolean).length;

  return (
    <div className="grid gap-5 xl:grid-cols-3">
      <div className="space-y-5 xl:col-span-2">
        <div className="grid gap-4 sm:grid-cols-4">
          {[
            { label: "دروس این ترم", value: "۵", icon: CalendarCheck },
            { label: "کل دانشجویان", value: "۳۲۰", icon: Users },
            { label: "تکالیف در انتظار تصحیح", value: "۳", icon: ClipboardCheck },
            { label: "آزمون‌های فعال", value: "۲", icon: UserCheck },
          ].map(({ label, value, icon: Icon }) => (
            <Card key={label}>
              <CardContent className="flex items-center gap-3 p-4">
                <span className="flex size-10 items-center justify-center rounded-xl bg-accent/15 text-navy">
                  <Icon className="size-5" />
                </span>
                <span>
                  <span className="block text-lg font-bold">{value}</span>
                  <span className="block text-xs text-muted-foreground">{label}</span>
                </span>
              </CardContent>
            </Card>
          ))}
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">کلاس‌های امروز</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {todayClasses.map((c) => (
              <div
                key={c.id}
                className="flex flex-wrap items-center gap-3 rounded-xl border border-border p-3"
              >
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-bold">{c.course}</p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    {c.time} — حاضرین: {c.attendees} نفر
                  </p>
                </div>
                <Badge variant="secondary">{c.status}</Badge>
                <Button asChild size="sm">
                  <Link to="/classroom">
                    <Video className="size-4" /> شروع کلاس
                  </Link>
                </Button>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">لیست درس‌ها و آمار دانشجویان</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>درس</TableHead>
                  <TableHead>کد</TableHead>
                  <TableHead>دانشجو</TableHead>
                  <TableHead>پیشرفت سرفصل</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {courses.map((c) => (
                  <TableRow key={c.id}>
                    <TableCell className="font-medium">{c.title}</TableCell>
                    <TableCell className="text-muted-foreground">{c.code}</TableCell>
                    <TableCell>{c.students}</TableCell>
                    <TableCell className="w-40">
                      <Progress value={c.progress} />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">تکالیف نیازمند تصحیح</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {assignments.slice(0, 4).map((a) => (
              <div
                key={a.id}
                className="flex flex-wrap items-center gap-3 rounded-xl border border-border p-3"
              >
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium">{a.title}</p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    {a.course} — {a.submissions} از {a.total} پاسخ دریافت شده
                  </p>
                </div>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => toast.success("صفحه تصحیح تکلیف باز شد (نمایشی)")}
                >
                  تصحیح
                </Button>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      <div className="space-y-5">
        <Card>
          <CardHeader className="flex-row items-center justify-between">
            <CardTitle className="text-base">حضور و غیاب سریع</CardTitle>
            <Badge variant="secondary">{presentCount} حاضر</Badge>
          </CardHeader>
          <CardContent className="space-y-3">
            <p className="text-xs text-muted-foreground">
              درس مبانی هوش مصنوعی — جلسه امروز ساعت ۱۰:۰۰
            </p>
            {studentsList.map((s) => (
              <div key={s.id} className="flex items-center justify-between gap-2">
                <span className="min-w-0">
                  <span className="block truncate text-sm">{s.name}</span>
                  <span className="block text-[11px] text-muted-foreground">{s.id}</span>
                </span>
                <Switch
                  checked={!!attendance[s.id]}
                  onCheckedChange={(v) => setAttendance((p) => ({ ...p, [s.id]: v }))}
                />
              </div>
            ))}
            <Button
              className="w-full"
              onClick={() => toast.success(`حضور و غیاب ثبت شد — ${presentCount} حاضر`)}
            >
              ثبت حضور و غیاب
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">ثبت سریع نمرات</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="outline" className="w-full">
                  <Save className="size-4" /> فرم ثبت نمره
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-lg">
                <DialogHeader>
                  <DialogTitle>ثبت نمره میان‌ترم — مبانی هوش مصنوعی</DialogTitle>
                  <DialogDescription>نمره از ۲۰ را برای هر دانشجو وارد کنید.</DialogDescription>
                </DialogHeader>
                <div className="max-h-72 space-y-2 overflow-y-auto scrollbar-thin">
                  {studentsList.map((s) => (
                    <div key={s.id} className="flex items-center gap-3">
                      <span className="flex-1 truncate text-sm">{s.name}</span>
                      <Input
                        className="w-24"
                        inputMode="decimal"
                        placeholder="۰ تا ۲۰"
                        value={marks[s.id] ?? ""}
                        onChange={(e) => setMarks((p) => ({ ...p, [s.id]: e.target.value }))}
                      />
                    </div>
                  ))}
                </div>
                <DialogFooter>
                  <Button onClick={() => toast.success("نمرات با موفقیت ثبت شد (نمایشی)")}>
                    ثبت نهایی نمرات
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
            <Button asChild variant="ghost" className="w-full">
              <Link to="/grades">مشاهده جدول نمرات</Link>
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">ابزارهای تدریس</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-wrap gap-2">
            <Button asChild size="sm" variant="outline">
              <Link to="/question-bank">بانک سؤال</Link>
            </Button>
            <Button asChild size="sm" variant="outline">
              <Link to="/live-polls">نظرسنجی حین تدریس</Link>
            </Button>
            <Button asChild size="sm" variant="outline">
              <Link to="/at-risk-students">دانشجویان کم‌فعال</Link>
            </Button>
            <Button asChild size="sm" variant="outline">
              <Link to="/send-notification">ارسال اعلان</Link>
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">مدیریت آزمون‌ها</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {exams.map((e) => (
              <div key={e.id} className="rounded-xl border border-border p-3">
                <p className="text-sm font-bold">{e.course}</p>
                <p className="mt-1 text-xs text-muted-foreground">
                  {e.type} — {e.questions} سوال — {e.date}
                </p>
                <Badge className="mt-2" variant="secondary">
                  {e.status}
                </Badge>
              </div>
            ))}
            <Button asChild variant="outline" className="w-full">
              <Link to="/exams">مدیریت کامل آزمون‌ها</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
