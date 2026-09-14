import * as React from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Timer, ShieldCheck, PlayCircle } from "lucide-react";
import { toast } from "sonner";
import { AppShell } from "@/components/layout/AppShell";
import { exams, examQuestions } from "@/lib/mock-data";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

export const Route = createFileRoute("/exams")({
  head: () => ({
    meta: [
      { title: "آزمون‌ها | سامانه آموزش مجازی دانشگاه" },
      {
        name: "description",
        content: "آزمون‌های آنلاین تستی و تشریحی با شبیه‌ساز ورود به آزمون و زمان‌بندی دقیق.",
      },
      { property: "og:title", content: "آزمون‌های آنلاین" },
      { property: "og:description", content: "شبیه‌ساز ورود به آزمون و مشاهده زمان‌بندی آزمون‌ها." },
    ],
  }),
  component: ExamsPage,
});

function ExamSimulator({ course }: { course: string }) {
  const [step, setStep] = React.useState(0);
  const [answers, setAnswers] = React.useState<Record<number, string>>({});
  const total = examQuestions.length;
  const q = examQuestions[step]!;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between text-xs text-muted-foreground">
        <span className="flex items-center gap-1">
          <Timer className="size-3.5" /> زمان باقی‌مانده: ۷۲:۱۵
        </span>
        <span>
          سوال {step + 1} از {total}
        </span>
      </div>
      <Progress value={((step + 1) / total) * 100} />
      <div className="rounded-xl border border-border p-4">
        <p className="text-sm font-medium leading-7">{q.q}</p>
        <RadioGroup
          className="mt-4 space-y-2"
          value={answers[step] ?? ""}
          onValueChange={(v) => setAnswers((p) => ({ ...p, [step]: v }))}
        >
          {q.options.map((o, i) => (
            <div key={o} className="flex items-center gap-2 rounded-lg bg-muted/50 p-2.5">
              <RadioGroupItem value={String(i)} id={`q${step}-o${i}`} />
              <Label htmlFor={`q${step}-o${i}`} className="text-sm font-normal leading-6">
                {o}
              </Label>
            </div>
          ))}
        </RadioGroup>
      </div>
      <div className="flex items-center justify-between gap-2">
        <Button variant="outline" disabled={step === 0} onClick={() => setStep((s) => s - 1)}>
          سوال قبلی
        </Button>
        {step < total - 1 ? (
          <Button onClick={() => setStep((s) => s + 1)}>سوال بعدی</Button>
        ) : (
          <Button onClick={() => toast.success(`پاسخ‌های آزمون ${course} ثبت شد (نمایشی)`)}>
            پایان و ثبت آزمون
          </Button>
        )}
      </div>
      <p className="flex items-center gap-1 text-[11px] text-muted-foreground">
        <ShieldCheck className="size-3.5" /> این آزمون در محیط امن سامانه برگزار می‌شود.
      </p>
    </div>
  );
}

function ExamsPage() {
  return (
    <AppShell title="آزمون‌ها" subtitle="آزمون‌های آنلاین تستی و تشریحی نیم‌سال ۱۴۰۵-۱">
      <div className="grid gap-4 lg:grid-cols-2">
        {exams.map((e) => (
          <Card key={e.id}>
            <CardHeader className="pb-3">
              <div className="flex flex-wrap items-start justify-between gap-2">
                <CardTitle className="text-base">{e.course}</CardTitle>
                <Badge
                  variant={
                    e.status === "فعال"
                      ? "default"
                      : e.status === "برگزار شده"
                        ? "outline"
                        : "secondary"
                  }
                >
                  {e.status}
                </Badge>
              </div>
              <p className="text-xs text-muted-foreground">{e.type}</p>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-3 text-xs text-muted-foreground sm:grid-cols-4">
                <span>تاریخ: {e.date}</span>
                <span>ساعت: {e.time}</span>
                <span>مدت: {e.duration}</span>
                <span>تعداد سوال: {e.questions}</span>
              </div>
              {e.status === "فعال" ? (
                <Dialog>
                  <DialogTrigger asChild>
                    <Button size="sm">
                      <PlayCircle className="size-4" /> ورود به آزمون
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-xl">
                    <DialogHeader>
                      <DialogTitle>آزمون {e.course}</DialogTitle>
                      <DialogDescription>
                        شبیه‌ساز آزمون آنلاین — پاسخ‌ها به‌صورت خودکار ذخیره می‌شود.
                      </DialogDescription>
                    </DialogHeader>
                    <ExamSimulator course={e.course} />
                  </DialogContent>
                </Dialog>
              ) : (
                <Dialog>
                  <DialogTrigger asChild>
                    <Button size="sm" variant="outline">
                      جزئیات آزمون
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>{e.course}</DialogTitle>
                      <DialogDescription>
                        {e.type} — {e.date} ساعت {e.time}
                      </DialogDescription>
                    </DialogHeader>
                    <p className="text-sm leading-7 text-muted-foreground">
                      محدوده آزمون: جلسات ۱ تا ۸. استفاده از ماشین‌حساب مجاز است. ورود به آزمون
                      حداکثر تا ۱۵ دقیقه پس از شروع امکان‌پذیر است.
                    </p>
                    <DialogFooter>
                      <Button onClick={() => toast.info("یادآور آزمون فعال شد")}>
                        فعال‌سازی یادآور
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </AppShell>
  );
}
