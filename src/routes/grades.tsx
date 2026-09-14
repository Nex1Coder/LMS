import * as React from "react";
import { createFileRoute } from "@tanstack/react-router";
import { AlertCircle, Download, TrendingUp } from "lucide-react";
import { toast } from "sonner";
import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { AppShell } from "@/components/layout/AppShell";
import { grades, gpaHistory } from "@/lib/mock-data";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
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

export const Route = createFileRoute("/grades")({
  head: () => ({
    meta: [
      { title: "نمرات و کارنامه | سامانه آموزش مجازی دانشگاه" },
      {
        name: "description",
        content: "جدول نمرات تفکیکی، معدل ترم و معدل کل و امکان ثبت اعتراض به نمره.",
      },
      { property: "og:title", content: "نمرات و کارنامه" },
      { property: "og:description", content: "نمرات میان‌ترم، تکالیف و پایان‌ترم به‌همراه معدل." },
    ],
  }),
  component: GradesPage,
});

function GradesPage() {
  const [text, setText] = React.useState("");

  return (
    <AppShell title="نمرات و کارنامه" subtitle="کارنامه نیم‌سال ۱۴۰۵-۱ — ۱۴ واحد اخذ شده">
      <div className="grid gap-5 lg:grid-cols-3">
        <div className="space-y-5 lg:col-span-2">
          <Card>
            <CardHeader className="flex-row items-center justify-between">
              <CardTitle className="text-base">جدول نمرات تفکیکی</CardTitle>
              <Button
                size="sm"
                variant="outline"
                onClick={() => toast.success("دریافت کارنامه PDF آغاز شد (نمایشی)")}
              >
                <Download className="size-4" /> دریافت کارنامه
              </Button>
            </CardHeader>
            <CardContent className="overflow-x-auto scrollbar-thin">
              <Table className="min-w-[640px]">
                <TableHeader>
                  <TableRow>
                    <TableHead>درس</TableHead>
                    <TableHead>کد</TableHead>
                    <TableHead>واحد</TableHead>
                    <TableHead>میان‌ترم</TableHead>
                    <TableHead>تکالیف</TableHead>
                    <TableHead>پایان‌ترم</TableHead>
                    <TableHead>نمره نهایی</TableHead>
                    <TableHead>وضعیت</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {grades.map((g) => (
                    <TableRow key={g.code}>
                      <TableCell className="font-medium">{g.course}</TableCell>
                      <TableCell className="text-muted-foreground">{g.code}</TableCell>
                      <TableCell>{g.units}</TableCell>
                      <TableCell>{g.midterm}</TableCell>
                      <TableCell>{g.assignments}</TableCell>
                      <TableCell>{g.final}</TableCell>
                      <TableCell className="font-bold text-navy">{g.total}</TableCell>
                      <TableCell>
                        <Badge variant={g.state === "قبول" ? "secondary" : "default"}>
                          {g.state}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">روند معدل نیم‌سال‌ها</CardTitle>
            </CardHeader>
            <CardContent className="h-64" dir="ltr">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={gpaHistory}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                  <XAxis dataKey="term" tick={{ fontSize: 11 }} />
                  <YAxis domain={[12, 20]} tick={{ fontSize: 11 }} />
                  <Tooltip />
                  <Line type="monotone" dataKey="gpa" stroke="var(--chart-2)" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-5">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">خلاصه وضعیت تحصیلی</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              {[
                ["معدل نیم‌سال جاری", "۱۷٫۰۵"],
                ["معدل کل", "۱۷٫۴۲"],
                ["واحد گذرانده", "۸۶"],
                ["واحد باقی‌مانده", "۵۴"],
                ["رتبه در ورودی", "۱۲ از ۱۴۰"],
              ].map(([k, v]) => (
                <div key={k} className="flex items-center justify-between">
                  <span className="text-muted-foreground">{k}</span>
                  <span className="font-bold">{v}</span>
                </div>
              ))}
              <p className="flex items-center gap-1 pt-2 text-xs text-accent-foreground/70">
                <TrendingUp className="size-3.5" /> معدل شما نسبت به ترم قبل ۰٫۵ نمره بهبود یافته
                است.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <AlertCircle className="size-4 text-accent" /> اعتراض به نمره
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="mb-3 text-xs leading-6 text-muted-foreground">
                مهلت ثبت اعتراض تا ۷ روز پس از اعلام نمره است. پاسخ استاد در همین صفحه نمایش داده
                می‌شود.
              </p>
              <Dialog>
                <DialogTrigger asChild>
                  <Button className="w-full">ثبت درخواست تجدیدنظر</Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>درخواست تجدیدنظر نمره</DialogTitle>
                    <DialogDescription>
                      درس و دلیل اعتراض خود را به‌صورت دقیق توضیح دهید.
                    </DialogDescription>
                  </DialogHeader>
                  <Textarea
                    rows={5}
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    placeholder="مثال: در سوال ۳ آزمون میان‌ترم آمار، پاسخ صحیح ثبت نشده است…"
                  />
                  <DialogFooter>
                    <Button
                      onClick={() => {
                        toast.success("درخواست تجدیدنظر برای استاد درس ارسال شد");
                        setText("");
                      }}
                    >
                      ارسال درخواست
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </CardContent>
          </Card>
        </div>
      </div>
    </AppShell>
  );
}
