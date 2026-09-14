import * as React from "react";
import { createFileRoute } from "@tanstack/react-router";
import { CheckCircle2, Circle, FilePlus2 } from "lucide-react";
import { toast } from "sonner";
import { AppShell } from "@/components/layout/AppShell";
import { requests, requestTypes } from "@/lib/mock-data";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/requests")({
  head: () => ({
    meta: [
      { title: "درخواست‌های آموزشی | سامانه آموزش مجازی دانشگاه" },
      {
        name: "description",
        content:
          "ثبت درخواست حذف و اضافه، مرخصی تحصیلی، معرفی به استاد و گواهی اشتغال به تحصیل با پیگیری وضعیت.",
      },
      { property: "og:title", content: "درخواست‌های آموزشی" },
      { property: "og:description", content: "ثبت درخواست جدید و پیگیری وضعیت با تایم‌لاین." },
    ],
  }),
  component: RequestsPage,
});

const statusVariant: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
  "در حال بررسی": "default",
  "تایید شده": "secondary",
  "رد شده": "destructive",
  "ثبت شده": "outline",
};

function RequestsPage() {
  const [type, setType] = React.useState(requestTypes[0]!);
  const [desc, setDesc] = React.useState("");
  const [term, setTerm] = React.useState("۱۴۰۵-۱");

  return (
    <AppShell
      title="درخواست‌های آموزشی"
      subtitle="ثبت درخواست جدید و پیگیری مرحله‌به‌مرحله وضعیت درخواست‌ها"
    >
      <div className="grid gap-5 lg:grid-cols-3">
        <Card className="h-fit">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <FilePlus2 className="size-4 text-accent" /> ثبت درخواست جدید
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>نوع درخواست</Label>
              <Select value={type} onValueChange={setType}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {requestTypes.map((t) => (
                    <SelectItem key={t} value={t}>
                      {t}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>نیم‌سال</Label>
              <Input value={term} onChange={(e) => setTerm(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label>توضیحات</Label>
              <Textarea
                rows={5}
                value={desc}
                onChange={(e) => setDesc(e.target.value)}
                placeholder="دلیل درخواست و توضیحات تکمیلی…"
              />
            </div>
            <Button
              className="w-full"
              onClick={() => {
                toast.success("درخواست شما ثبت شد", {
                  description: `${type} — کد پیگیری R-140599`,
                });
                setDesc("");
              }}
            >
              ثبت و ارسال به واحد آموزش
            </Button>
            <p className="text-[11px] leading-6 text-muted-foreground">
              پس از ثبت، درخواست به‌ترتیب توسط استاد راهنما و واحد آموزش بررسی می‌شود و نتیجه در
              همین صفحه اعلام می‌گردد.
            </p>
          </CardContent>
        </Card>

        <div className="space-y-4 lg:col-span-2">
          {requests.map((r) => (
            <Card key={r.id}>
              <CardHeader className="pb-3">
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <CardTitle className="text-base">{r.type}</CardTitle>
                  <Badge variant={statusVariant[r.status]}>{r.status}</Badge>
                </div>
                <p className="text-xs text-muted-foreground">
                  کد پیگیری {r.id} — {r.student} — تاریخ ثبت {r.date}
                </p>
              </CardHeader>
              <CardContent>
                <ol className="space-y-3">
                  {r.timeline.map((t, i) => (
                    <li key={i} className="flex gap-3">
                      <span className="flex flex-col items-center">
                        {t.done ? (
                          <CheckCircle2 className="size-5 text-accent" />
                        ) : (
                          <Circle className="size-5 text-muted-foreground" />
                        )}
                        {i < r.timeline.length - 1 && (
                          <span
                            className={cn(
                              "mt-1 w-px flex-1",
                              t.done ? "bg-accent/50" : "bg-border",
                            )}
                          />
                        )}
                      </span>
                      <span className="pb-1">
                        <span
                          className={cn(
                            "block text-sm",
                            t.done ? "font-medium" : "text-muted-foreground",
                          )}
                        >
                          {t.title}
                        </span>
                        <span className="block text-[11px] text-muted-foreground">{t.date}</span>
                      </span>
                    </li>
                  ))}
                </ol>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </AppShell>
  );
}
