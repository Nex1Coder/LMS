import * as React from "react";
import { createFileRoute } from "@tanstack/react-router";
import { CalendarDays, ChevronRight, ChevronLeft } from "lucide-react";
import { toast } from "sonner";
import { AppShell } from "@/components/layout/AppShell";
import { academicEvents, type AcademicEvent } from "@/lib/mock-data";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/academic-calendar")({
  head: () => ({
    meta: [
      { title: "تقویم آموزشی دانشگاه | سامانه آموزش مجازی دانشگاه" },
      {
        name: "description",
        content: "تقویم آموزشی نیم‌سال جاری شامل رویدادهای آموزشی، امتحانات، انتخاب واحد و رویدادهای اداری.",
      },
      { property: "og:title", content: "تقویم آموزشی دانشگاه" },
      { property: "og:description", content: "مشاهده رویدادهای آموزشی نیم‌سال جاری در قالب تقویم." },
    ],
  }),
  component: AcademicCalendarPage,
});

const months = [
  "مهر ۱۴۰۵",
  "آبان ۱۴۰۵",
  "آذر ۱۴۰۵",
  "دی ۱۴۰۵",
  "بهمن ۱۴۰۵",
  "اسفند ۱۴۰۵",
];

const kindColor: Record<AcademicEvent["kind"], string> = {
  آموزشی: "bg-navy text-white",
  امتحان: "bg-red-500/90 text-white",
  "انتخاب واحد": "bg-emerald-600 text-white",
  "رویداد اداری": "bg-muted text-muted-foreground",
};

function AcademicCalendarPage() {
  const [monthIndex, setMonthIndex] = React.useState(1);

  const currentMonth = months[monthIndex]!;

  const totalEvents = academicEvents.length;
  const examCount = academicEvents.filter((e) => e.kind === "امتحان").length;
  const addDropCount = academicEvents.filter((e) => e.kind === "انتخاب واحد").length;
  const academicCount = academicEvents.filter((e) => e.kind === "آموزشی").length;

  const eventsByDate = React.useMemo(() => {
    const map = new Map<number, AcademicEvent[]>();
    for (const ev of academicEvents) {
      const list = map.get(ev.date);
      if (list) {
        list.push(ev);
      } else {
        map.set(ev.date, [ev]);
      }
    }
    return map;
  }, []);

  return (
    <AppShell title="تقویم آموزشی دانشگاه" subtitle="رویدادهای آموزشی نیم‌سال جاری">
      <div className="space-y-6">
        <Card>
          <CardContent className="flex flex-col gap-3 py-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-3">
              <CalendarDays className="size-5 text-primary" />
              <div>
                <p className="text-sm font-bold">نیم‌سال ۱۴۰۵-۲</p>
                <p className="text-xs text-muted-foreground">تقویم رسمی آموزشی دانشگاه</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setMonthIndex((i) => (i > 0 ? i - 1 : months.length - 1));
                }}
              >
                <ChevronRight className="size-4" />
                ماه قبل
              </Button>
              <span className="min-w-[110px] text-center text-sm font-bold">{currentMonth}</span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setMonthIndex((i) => (i < months.length - 1 ? i + 1 : 0));
                }}
              >
                ماه بعد
                <ChevronLeft className="size-4" />
              </Button>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
          {[
            { label: "تعداد رویدادها", value: totalEvents },
            { label: "امتحانات", value: examCount },
            { label: "انتخاب واحد", value: addDropCount },
            { label: "رویدادهای آموزشی", value: academicCount },
          ].map((s) => (
            <Card key={s.label}>
              <CardContent className="py-4 text-center">
                <p className="text-2xl font-bold">{s.value.toLocaleString("fa-IR")}</p>
                <p className="mt-1 text-xs text-muted-foreground">{s.label}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">تقویم ماهانه</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-7 gap-2">
              {Array.from({ length: 30 }, (_, i) => {
                const day = i + 1;
                const dayEvents = eventsByDate.get(day) ?? [];
                return (
                  <div
                    key={day}
                    className="flex min-h-24 flex-col rounded-lg border border-border p-2"
                  >
                    <span className="mb-1 text-xs font-bold text-muted-foreground">
                      {day.toLocaleString("fa-IR")}
                    </span>
                    <div className="flex flex-1 flex-col gap-1 overflow-hidden">
                      {dayEvents.slice(0, 3).map((ev) => (
                        <span
                          key={ev.id}
                          className={cn(
                            "truncate rounded px-1.5 py-0.5 text-[10px] font-medium leading-tight",
                            kindColor[ev.kind],
                          )}
                        >
                          {ev.title}
                        </span>
                      ))}
                      {dayEvents.length > 3 && (
                        <span className="text-[10px] text-muted-foreground">
                          +{dayEvents.length - 3} مورد دیگر
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">لیست رویدادها</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {academicEvents.map((ev) => (
                <div
                  key={ev.id}
                  className="flex flex-col gap-1 rounded-lg border border-border p-3 sm:flex-row sm:items-center sm:justify-between"
                >
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-sm font-medium">{ev.title}</span>
                      <Badge variant="secondary" className="text-[10px]">
                        {ev.kind}
                      </Badge>
                    </div>
                    <p className="mt-0.5 text-xs text-muted-foreground">{ev.desc}</p>
                  </div>
                  <span className="mt-1 text-xs text-muted-foreground sm:ms-4 sm:mt-0 sm:shrink-0">
                    روز {ev.date.toLocaleString("fa-IR")} {currentMonth}
                  </span>
                </div>
              ))}
            </div>
            <div className="mt-4 flex justify-end">
              <Button
                variant="outline"
                size="sm"
                onClick={() => toast.success("لیست رویدادها با موفقیت دریافت شد (نمایشی)")}
              >
                دریافت خروجی
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </AppShell>
  );
}
