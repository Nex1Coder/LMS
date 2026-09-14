import * as React from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Pencil, Search, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { AppShell } from "@/components/layout/AppShell";
import { courses, questionBank, type Difficulty, type QuestionType } from "@/lib/mock-data";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const questionTypes: QuestionType[] = ["تستی", "تشریحی", "پروژه‌ای"];
const difficulties: Difficulty[] = ["آسان", "متوسط", "سخت"];

const difficultyClasses: Record<Difficulty, string> = {
  آسان: "border-transparent bg-green-500/15 text-green-700 dark:text-green-400",
  متوسط: "border-transparent bg-yellow-500/15 text-yellow-700 dark:text-yellow-400",
  سخت: "border-transparent bg-red-500/15 text-red-700 dark:text-red-400",
};

export const Route = createFileRoute("/question-bank")({
  head: () => ({
    meta: [
      { title: "بانک سؤال | سامانه آموزش مجازی دانشگاه" },
      {
        name: "description",
        content: "بانک سؤال استاد با امکان فیلتر و مدیریت سؤالات تستی، تشریحی و پروژه‌ای.",
      },
      { property: "og:title", content: "بانک سؤال" },
      { property: "og:description", content: "مدیریت سؤالات دروس در بانک سؤال." },
    ],
  }),
  component: QuestionBank,
});

function QuestionBank() {
  const [course, setCourse] = React.useState<string>("all");
  const [type, setType] = React.useState<"all" | QuestionType>("all");
  const [difficulty, setDifficulty] = React.useState<"all" | Difficulty>("all");

  const filtered = questionBank.filter(
    (q) =>
      (course === "all" || q.course === course) &&
      (type === "all" || q.type === type) &&
      (difficulty === "all" || q.difficulty === difficulty),
  );

  const total = filtered.length;
  const testiCount = filtered.filter((q) => q.type === "تستی").length;
  const tashrihiCount = filtered.filter((q) => q.type === "تشریحی").length;

  return (
    <AppShell title="بانک سؤال" subtitle="مدیریت سؤالات تستی، تشریحی و پروژه‌ای درس‌های شما">
      <div className="space-y-5">
        <Card>
          <CardContent className="grid gap-3 p-4 sm:grid-cols-3">
            <div className="space-y-2">
              <Label htmlFor="filter-course">درس</Label>
              <Select value={course} onValueChange={setCourse}>
                <SelectTrigger id="filter-course">
                  <SelectValue placeholder="انتخاب درس" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">همه درس‌ها</SelectItem>
                  {courses.map((c) => (
                    <SelectItem key={c.id} value={c.title}>
                      {c.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="filter-type">نوع سؤال</Label>
              <Select value={type} onValueChange={(v) => setType(v as "all" | QuestionType)}>
                <SelectTrigger id="filter-type">
                  <SelectValue placeholder="انتخاب نوع" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">همه انواع</SelectItem>
                  {questionTypes.map((t) => (
                    <SelectItem key={t} value={t}>
                      {t}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="filter-difficulty">درجه سختی</Label>
              <Select
                value={difficulty}
                onValueChange={(v) => setDifficulty(v as "all" | Difficulty)}
              >
                <SelectTrigger id="filter-difficulty">
                  <SelectValue placeholder="انتخاب درجه" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">همه درجات</SelectItem>
                  {difficulties.map((d) => (
                    <SelectItem key={d} value={d}>
                      {d}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        <div className="grid gap-4 sm:grid-cols-3">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                تعداد کل سؤالات
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <p className="text-2xl font-bold">{total}</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                تعداد تستی
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <p className="text-2xl font-bold">{testiCount}</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                تعداد تشریحی
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <p className="text-2xl font-bold">{tashrihiCount}</p>
            </CardContent>
          </Card>
        </div>

        {filtered.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center gap-2 py-12 text-center">
              <span className="flex size-12 items-center justify-center rounded-full bg-muted">
                <Search className="size-5 text-muted-foreground" />
              </span>
              <p className="text-sm font-medium">هیچ سؤالی یافت نشد</p>
              <p className="text-xs text-muted-foreground">
                فیلترها را تغییر دهید تا سؤالات منطبق نمایش داده شوند.
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((q) => (
              <Card key={q.id} className="flex flex-col">
                <CardHeader className="pb-3">
                  <div className="flex flex-wrap items-center gap-2">
                    <Badge className={cn("border-transparent", difficultyClasses[q.difficulty])}>
                      {q.difficulty}
                    </Badge>
                    <Badge variant="outline">{q.type}</Badge>
                  </div>
                  <CardTitle className="pt-2 text-base">
                    {q.course}
                    <span className="mt-1 block text-xs font-normal text-muted-foreground">
                      {q.topic}
                    </span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="flex flex-1 flex-col gap-3">
                  <p className="line-clamp-2 text-sm leading-6 text-muted-foreground">{q.text}</p>
                  {q.options && q.options.length > 0 && (
                    <ol className="space-y-1.5">
                      {q.options.map((opt, i) => (
                        <li
                          key={opt}
                          className="flex items-start gap-2 text-xs text-muted-foreground"
                        >
                          <span className="flex size-4 shrink-0 items-center justify-center rounded-full bg-muted text-[10px] font-medium">
                            {i + 1}
                          </span>
                          <span className="min-w-0">{opt}</span>
                        </li>
                      ))}
                    </ol>
                  )}
                </CardContent>
                <CardFooter className="mt-auto flex-col gap-3 border-t border-border px-6 pb-6 pt-4">
                  <div className="flex w-full items-center justify-between gap-2 text-[11px] text-muted-foreground">
                    <span>استفاده‌شده: {q.usedCount} بار</span>
                    <span>آخرین استفاده: {q.lastUsed}</span>
                  </div>
                  <div className="flex w-full items-center justify-end gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => toast.info("باز شدن فرم ویرایش سؤال (نمایشی)")}
                    >
                      <Pencil className="size-3.5" /> ویرایش
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      className="text-destructive hover:text-destructive"
                      onClick={() => toast.error("سؤال از بانک حذف شد (نمایشی)")}
                    >
                      <Trash2 className="size-3.5" /> حذف
                    </Button>
                  </div>
                </CardFooter>
              </Card>
            ))}
          </div>
        )}
      </div>
    </AppShell>
  );
}
