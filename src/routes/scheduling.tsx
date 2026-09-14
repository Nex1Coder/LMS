import * as React from "react";
import { createFileRoute } from "@tanstack/react-router";
import { CalendarClock, AlertTriangle, FileText, ClipboardList } from "lucide-react";
import { toast } from "sonner";
import { AppShell } from "@/components/layout/AppShell";
import { scheduleItems, type ScheduleItem } from "@/lib/mock-data";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

export const Route = createFileRoute("/scheduling")({
  head: () => ({
    meta: [
      { title: "برنامه‌ریزی کلاس و امتحان | سامانه آموزش مجازی دانشگاه" },
      {
        name: "description",
        content: "زمان‌بندی جلسات و امتحانات با تشخیص تداخل استاد، دانشجو و فضا.",
      },
      { property: "og:title", content: "برنامه‌ریزی کلاس و امتحان" },
      { property: "og:description", content: "زمان‌بندی جلسات و امتحانات با تشخیص تداخل." },
    ],
  }),
  component: SchedulingPage,
});

const DAY_ORDER: Record<string, number> = {
  شنبه: 0,
  یکشنبه: 1,
  دوشنبه: 2,
  "سه‌شنبه": 3,
  چهارشنبه: 4,
};

function sortByDayAndTime(items: ScheduleItem[]): ScheduleItem[] {
  return [...items].sort((a, b) => {
    const dayDiff = (DAY_ORDER[a.day] ?? 99) - (DAY_ORDER[b.day] ?? 99);
    if (dayDiff !== 0) return dayDiff;
    return a.time.localeCompare(b.time, "fa");
  });
}

function SchedulingPage() {
  const [filter, setFilter] = React.useState<"همه" | "کلاس" | "امتحان">("همه");
  const [conflictCheck, setConflictCheck] = React.useState(false);

  const filtered = React.useMemo(() => {
    const base =
      filter === "همه"
        ? scheduleItems
        : scheduleItems.filter((i) => i.kind === filter);
    return sortByDayAndTime(base);
  }, [filter]);

  const totalClasses = filtered.filter((i) => i.kind === "کلاس").length;
  const totalExams = filtered.filter((i) => i.kind === "امتحان").length;
  const conflictCount = conflictCheck
    ? filtered.filter((i) => i.conflict).length
    : 0;

  return (
    <AppShell
      title="برنامه‌ریزی کلاس و امتحان"
      subtitle="زمان‌بندی جلسات و امتحانات با تشخیص تداخل استاد، دانشجو و فضا"
    >
      <div className="space-y-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <Tabs
            value={filter}
            onValueChange={(v) => setFilter(v as "همه" | "کلاس" | "امتحان")}
          >
            <TabsList>
              <TabsTrigger value="همه">همه</TabsTrigger>
              <TabsTrigger value="کلاس">کلاس</TabsTrigger>
              <TabsTrigger value="امتحان">امتحان</TabsTrigger>
            </TabsList>
          </Tabs>

          <div className="flex items-center gap-2">
            <Button
              variant={conflictCheck ? "destructive" : "outline"}
              size="sm"
              onClick={() => setConflictCheck((c) => !c)}
            >
              <AlertTriangle className="size-4" />
              بررسی تداخل
            </Button>

            <Dialog>
              <DialogTrigger asChild>
                <Button variant="outline" size="sm">
                  <ClipboardList className="size-4" />
                  صدور صورت‌جلسه امتحان
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-md">
                <DialogHeader>
                  <DialogTitle className="flex items-center gap-2">
                    <FileText className="size-5" />
                    صورت‌جلسه امتحان — مبانی هوش مصنوعی
                  </DialogTitle>
                  <DialogDescription>
                    خلاصه رسمی برگزاری امتحان پایانی درس مبانی هوش مصنوعی
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-3 rounded-lg border p-4 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">تاریخ:</span>
                    <span className="font-medium">۱۴۰۵/۰۶/۳۰</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">ساعت:</span>
                    <span className="font-medium">۱۰:۰۰ — ۱۱:۳۰</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">محل برگزاری:</span>
                    <span className="font-medium">سالن آمفی‌تئاتر</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">تعداد دانشجویان:</span>
                    <span className="font-medium">۴۸ نفر</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">مسئول نظارت:</span>
                    <span className="font-medium">دکتر رضا کریمی</span>
                  </div>
                </div>
                <DialogFooter>
                  <Button
                    onClick={() =>
                      toast.success("فایل صورت‌جلسه آماده دانلود است (نمایشی)")
                    }
                  >
                    <FileText className="size-4" />
                    دانلود (نمایشی)
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {conflictCheck && conflictCount > 0 && (
          <div className="flex items-center gap-2 rounded-lg border border-red-200 bg-red-50 px-4 py-2.5 text-sm text-red-700 dark:border-red-800 dark:bg-red-950 dark:text-red-400">
            <AlertTriangle className="size-4" />
            {conflictCount} تداخل شناسایی شد
          </div>
        )}

        <div className="grid gap-4 sm:grid-cols-3">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm text-muted-foreground">
                تعداد کل جلسات
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                <CalendarClock className="size-5 text-primary" />
                <span className="text-2xl font-bold">{filtered.length}</span>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm text-muted-foreground">
                تعداد کلاس‌ها
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                <CalendarClock className="size-5 text-primary" />
                <span className="text-2xl font-bold">{totalClasses}</span>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm text-muted-foreground">
                تعداد امتحانات
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                <CalendarClock className="size-5 text-accent" />
                <span className="text-2xl font-bold">{totalExams}</span>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>نوع</TableHead>
                  <TableHead>درس</TableHead>
                  <TableHead>استاد</TableHead>
                  <TableHead>روز</TableHead>
                  <TableHead>ساعت</TableHead>
                  <TableHead>فضای آموزشی</TableHead>
                  <TableHead>ظرفیت</TableHead>
                  {conflictCheck && <TableHead>تداخل</TableHead>}
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map((item) => (
                  <TableRow
                    key={item.id}
                    className={
                      conflictCheck && item.conflict
                        ? "bg-red-50 hover:bg-red-100 dark:bg-red-950 dark:hover:bg-red-900"
                        : undefined
                    }
                  >
                    <TableCell>
                      <Badge
                        variant={item.kind === "کلاس" ? "default" : "secondary"}
                        className={
                          item.kind === "کلاس"
                            ? "bg-navy text-white"
                            : "bg-accent text-accent-foreground"
                        }
                      >
                        {item.kind}
                      </Badge>
                    </TableCell>
                    <TableCell className="font-medium">{item.course}</TableCell>
                    <TableCell>{item.professor}</TableCell>
                    <TableCell>{item.day}</TableCell>
                    <TableCell className="font-mono text-xs">{item.time}</TableCell>
                    <TableCell>{item.room}</TableCell>
                    <TableCell>
                      {item.students}/{item.capacity}
                    </TableCell>
                    {conflictCheck && (
                      <TableCell>
                        {item.conflict && (
                          <Badge variant="destructive">{item.conflict}</Badge>
                        )}
                      </TableCell>
                    )}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </AppShell>
  );
}
