import * as React from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Upload, CalendarClock } from "lucide-react";
import { toast } from "sonner";
import { AppShell } from "@/components/layout/AppShell";
import { assignments } from "@/lib/mock-data";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

export const Route = createFileRoute("/assignments")({
  head: () => ({
    meta: [
      { title: "تکالیف | سامانه آموزش مجازی دانشگاه" },
      {
        name: "description",
        content: "ارسال پاسخ تکالیف، مشاهده مهلت تحویل، وضعیت بررسی و نمره هر تکلیف.",
      },
      { property: "og:title", content: "تکالیف درسی" },
      { property: "og:description", content: "مهلت تحویل، ارسال پاسخ و نمره تکالیف." },
    ],
  }),
  component: AssignmentsPage,
});

const badgeVariant: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
  "در انتظار ارسال": "default",
  "ارسال شده": "outline",
  "تصحیح شده": "secondary",
  "دیرکرد": "destructive",
};

function AssignmentCard({ a }: { a: (typeof assignments)[number] }) {
  const [answer, setAnswer] = React.useState("");

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex flex-wrap items-start justify-between gap-2">
          <CardTitle className="text-base leading-6">{a.title}</CardTitle>
          <Badge variant={badgeVariant[a.status]}>{a.status}</Badge>
        </div>
        <p className="text-xs text-muted-foreground">{a.course}</p>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex flex-wrap gap-4 text-xs text-muted-foreground">
          <span className="flex items-center gap-1">
            <CalendarClock className="size-3.5" /> مهلت تحویل: {a.due}
          </span>
          <span>باقی‌مانده: {a.remaining}</span>
          <span>نمره: {a.grade ?? "ثبت نشده"}</span>
        </div>
        <Dialog>
          <DialogTrigger asChild>
            <Button size="sm" variant={a.status === "در انتظار ارسال" ? "default" : "outline"}>
              <Upload className="size-4" /> ارسال / مشاهده پاسخ
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{a.title}</DialogTitle>
              <DialogDescription>
                پاسخ خود را بنویسید یا فایل پیوست کنید. مهلت تحویل: {a.due}
              </DialogDescription>
            </DialogHeader>
            <Textarea
              rows={6}
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
              placeholder="متن پاسخ یا توضیح فایل پیوست…"
            />
            <Button
              variant="outline"
              onClick={() => toast.info("انتخاب فایل در نسخه نمایشی غیرفعال است")}
            >
              پیوست فایل (PDF / ZIP)
            </Button>
            <DialogFooter>
              <Button onClick={() => toast.success("پاسخ تکلیف با موفقیت ارسال شد")}>
                ارسال نهایی
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
}

function AssignmentsPage() {
  const open = assignments.filter((a) => a.status === "در انتظار ارسال");
  const done = assignments.filter((a) => a.status !== "در انتظار ارسال");

  return (
    <AppShell title="تکالیف" subtitle="فهرست تکالیف دروس ترم جاری با وضعیت بررسی و نمره">
      <Tabs defaultValue="open">
        <TabsList>
          <TabsTrigger value="open">در انتظار ارسال ({open.length})</TabsTrigger>
          <TabsTrigger value="done">بررسی‌شده و ارسال‌شده ({done.length})</TabsTrigger>
        </TabsList>
        <TabsContent value="open" className="mt-5 grid gap-4 lg:grid-cols-2">
          {open.map((a) => (
            <AssignmentCard key={a.id} a={a} />
          ))}
        </TabsContent>
        <TabsContent value="done" className="mt-5 grid gap-4 lg:grid-cols-2">
          {done.map((a) => (
            <AssignmentCard key={a.id} a={a} />
          ))}
        </TabsContent>
      </Tabs>
    </AppShell>
  );
}
