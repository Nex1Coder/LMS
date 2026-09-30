import * as React from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Timer, ShieldCheck, PlayCircle, Plus } from "lucide-react";
import { toast } from "sonner";
import { AppShell } from "@/components/layout/AppShell";
import { examQuestions } from "@/lib/mock-data";
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
import { useExams } from "@/lib/exams-store";
import { useRole } from "@/lib/role";
import { courses } from "@/lib/mock-data";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

export const Route = createFileRoute("/exams")({
  head: () => ({
    meta: [{ title: "آزمون‌ها | سامانه آموزش مجازی دانشگاه" }],
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
        <span className="flex items-center gap-1"><Timer className="size-3.5"/> زمان باقی‌مانده: ۷۲:۱۵</span>
        <span>سوال {step + 1} از {total}</span>
      </div>
      <Progress value={((step + 1) / total) * 100} />
      <div className="rounded-xl border border-border p-4">
        <p className="text-sm font-medium leading-7">{q.q}</p>
        <RadioGroup className="mt-4 space-y-2" value={answers[step] ?? ""} onValueChange={(v) => setAnswers(p => ({ ...p, [step]: v }))}>
          {q.options.map((o, i) => (
            <div key={o} className="flex items-center gap-2 rounded-lg bg-muted/50 p-2.5">
              <RadioGroupItem value={String(i)} id={`q${step}-o${i}`} />
              <Label htmlFor={`q${step}-o${i}`} className="text-sm font-normal leading-6">{o}</Label>
            </div>
          ))}
        </RadioGroup>
      </div>
      <div className="flex items-center justify-between gap-2">
        <Button variant="outline" disabled={step === 0} onClick={() => setStep(s => s - 1)}>سوال قبلی</Button>
        {step < total - 1 ? (
          <Button onClick={() => setStep(s => s + 1)}>سوال بعدی</Button>
        ) : (
          <Button onClick={() => toast.success(`پاسخ‌های آزمون ${course} ثبت شد (نمایشی)`)}>
            پایان و ثبت آزمون
          </Button>
        )}
      </div>
      <p className="flex items-center gap-1 text-[11px] text-muted-foreground"><ShieldCheck className="size-3.5"/> این آزمون در محیط امن سامانه برگزار می‌شود.</p>
    </div>
  );
}

function CreateExamForm() {
  const { createExam } = useExams();
  const [course, setCourse] = React.useState("");
  const [type, setType] = React.useState<"تستی آنلاین" | "تشریحی آنلاین" | "پروژه‌محور">("تستی آنلاین");
  const [date, setDate] = React.useState("");
  const [time, setTime] = React.useState("");
  const [duration, setDuration] = React.useState("");
  const [questions, setQuestions] = React.useState("");
  const [description, setDescription] = React.useState("");

  const submit = () => {
    if (!course || !date || !time || !duration || !questions) {
      toast.error("فیلدهای اجباری را تکمیل کنید");
      return;
    }
    createExam({ course, type, date, time, duration, questions: Number(questions), description });
    setCourse(""); setDate(""); setTime(""); setDuration(""); setQuestions(""); setDescription("");
    toast.success("آزمون جدید ثبت شد");
  };

  return (
    <Card className="mb-5">
      <CardHeader><CardTitle className="text-base">تعریف آزمون جدید</CardTitle></CardHeader>
      <CardContent className="grid gap-3 sm:grid-cols-2">
        <div className="space-y-1">
          <Label>درس</Label>
          <Select value={course} onValueChange={setCourse}>
            <SelectTrigger><SelectValue placeholder="انتخاب درس" /></SelectTrigger>
            <SelectContent>{courses.map(c => <SelectItem key={c.id} value={c.title}>{c.title}</SelectItem>)}</SelectContent>
          </Select>
        </div>
        <div className="space-y-1">
          <Label>نوع</Label>
          <Select value={type} onValueChange={(v) => setType(v as any)}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="تستی آنلاین">تستی آنلاین</SelectItem>
              <SelectItem value="تشریحی آنلاین">تشریحی آنلاین</SelectItem>
              <SelectItem value="پروژه‌محور">پروژه‌محور</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-1"><Label>تاریخ</Label><Input type="date" value={date} onChange={e=>setDate(e.target.value)} /></div>
        <div className="space-y-1"><Label>ساعت</Label><Input type="time" value={time} onChange={e=>setTime(e.target.value)} /></div>
        <div className="space-y-1"><Label>مدت</Label><Input placeholder="مثلاً ۹۰ دقیقه" value={duration} onChange={e=>setDuration(e.target.value)} /></div>
        <div className="space-y-1"><Label>تعداد سؤال</Label><Input type="number" value={questions} onChange={e=>setQuestions(e.target.value)} /></div>
        <div className="sm:col-span-2 space-y-1"><Label>توضیحات</Label><Textarea value={description} onChange={e=>setDescription(e.target.value)} /></div>
        <div className="sm:col-span-2"><Button onClick={submit}><Plus className="size-4"/> ایجاد آزمون</Button></div>
      </CardContent>
    </Card>
  );
}

function ExamsPage() {
  const { exams } = useExams();
  const { role } = useRole();
  const isProfessor = role === "professor";

  return (
    <AppShell title="آزمون‌ها" subtitle="آزمون‌های آنلاین تستی و تشریحی نیم‌سال ۱۴۰۵-۱">
      {isProfessor && <CreateExamForm />}
      <div className="grid gap-4 lg:grid-cols-2">
        {exams.map((e) => (
          <Card key={e.id}>
            <CardHeader className="pb-3">
              <div className="flex flex-wrap items-start justify-between gap-2">
                <CardTitle className="text-base">{e.course}</CardTitle>
                <Badge variant={e.status === "فعال" ? "default" : e.status === "برگزار شده" ? "outline" : "secondary"}>{e.status}</Badge>
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
              {e.description && <p className="text-sm text-muted-foreground">{e.description}</p>}
              {e.status === "فعال" ? (
                <Dialog>
                  <DialogTrigger asChild><Button size="sm"><PlayCircle className="size-4"/> ورود به آزمون</Button></DialogTrigger>
                  <DialogContent className="max-w-xl"><DialogHeader><DialogTitle>آزمون {e.course}</DialogTitle></DialogHeader><ExamSimulator course={e.course} /></DialogContent>
                </Dialog>
              ) : (
                <Dialog>
                  <DialogTrigger asChild><Button size="sm" variant="outline">جزئیات آزمون</Button></DialogTrigger>
                  <DialogContent><DialogHeader><DialogTitle>{e.course}</DialogTitle></DialogHeader><p className="text-sm text-muted-foreground">{e.description ?? "بدون توضیح"}</p></DialogContent>
                </Dialog>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </AppShell>
  );
}
