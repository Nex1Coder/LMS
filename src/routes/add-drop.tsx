import * as React from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Plus, Minus, AlertCircle, UserPlus } from "lucide-react";
import { toast } from "sonner";
import { AppShell } from "@/components/layout/AppShell";
import { addDropRequests, type AddDropRequest } from "@/lib/mock-data";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Progress } from "@/components/ui/progress";

export const Route = createFileRoute("/add-drop")({
  head: () => ({
    meta: [
      {
        title: "حذف و اضافه / انتخاب واحد اضطراری | سامانه آموزش مجازی دانشگاه",
      },
      {
        name: "description",
        content:
          "بررسی درخواست‌های تغییر واحد دروس شامل حذف، اضافه و اضافه اضطراری.",
      },
    ],
  }),
  component: AddDropPage,
});

const kindBadge: Record<AddDropRequest["kind"], string> = {
  اضافه: "bg-emerald-100 text-emerald-700",
  حذف: "bg-red-100 text-red-700",
  "اضافه اضطراری": "bg-amber-100 text-amber-700",
};

const statusVariant: Record<AddDropRequest["status"], "default" | "secondary" | "destructive" | "outline"> = {
  "در انتظار بررسی": "default",
  "تایید شده": "secondary",
  "رد شده": "destructive",
  "لیست انتظار": "outline",
};

const statusBadgeExtra: Record<AddDropRequest["status"], string> = {
  "در انتظار بررسی": "",
  "تایید شده": "",
  "رد شده": "",
  "لیست انتظار": "border-amber-300 text-amber-700",
};

const icons = { اضافه: Plus, حذف: Minus, "اضافه اضطراری": AlertCircle } as const;

function AddDropPage() {
  const [requests, setRequests] = React.useState<AddDropRequest[]>(() =>
    addDropRequests.map((r) => ({ ...r })),
  );

  const total = requests.length;
  const pendingCount = requests.filter((r) => r.status === "در انتظار بررسی").length;
  const approvedCount = requests.filter((r) => r.status === "تایید شده").length;
  const waitlistCount = requests.filter((r) => r.status === "لیست انتظار").length;

  function updateStatus(id: string, newStatus: "تایید شده" | "رد شده") {
    setRequests((prev) =>
      prev.map((r) => (r.id === id ? { ...r, status: newStatus } : r)),
    );
    const req = requests.find((r) => r.id === id);
    if (newStatus === "تایید شده") {
      toast.success(`درخواست ${id} تایید شد`, {
        description: `${req?.student} — ${req?.course}`,
      });
    } else {
      toast.error(`درخواست ${id} رد شد`, {
        description: `${req?.student} — ${req?.course}`,
      });
    }
  }

  const pendingRows = requests.filter(
    (r) => r.status === "در انتظار بررسی" || r.status === "لیست انتظار",
  );

  return (
    <AppShell
      title="حذف و اضافه و انتخاب واحد اضطراری"
      subtitle="بررسی درخواست‌های تغییر واحد دروس"
    >
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
              <UserPlus className="size-4" />
              کل درخواست‌ها
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <p className="text-2xl font-bold">{total}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
              <AlertCircle className="size-4 text-blue-500" />
              در انتظار بررسی
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <p className="text-2xl font-bold">{pendingCount}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
              <Plus className="size-4 text-emerald-500" />
              تأیید شده
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <p className="text-2xl font-bold text-emerald-600">{approvedCount}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
              <Minus className="size-4 text-amber-500" />
              لیست انتظار
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <p className="text-2xl font-bold text-amber-600">{waitlistCount}</p>
          </CardContent>
        </Card>
      </div>

      <Card className="mt-5">
        <CardHeader>
          <CardTitle className="text-base">لیست درخواست‌ها</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>کد درخواست</TableHead>
                <TableHead>دانشجو</TableHead>
                <TableHead>درس</TableHead>
                <TableHead>نوع</TableHead>
                <TableHead>ظرفیت</TableHead>
                <TableHead>وضعیت</TableHead>
                <TableHead className="text-left">عملیات</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {requests.map((r) => {
                const Icon = icons[r.kind];
                const pct = Math.round((r.registered / r.capacity) * 100);
                const canAct = r.status === "در انتظار بررسی" || r.status === "لیست انتظار";
                return (
                  <TableRow key={r.id}>
                    <TableCell className="font-mono text-xs">{r.id}</TableCell>
                    <TableCell>{r.student}</TableCell>
                    <TableCell>{r.course}</TableCell>
                    <TableCell>
                      <Badge className={kindBadge[r.kind]}>
                        <Icon className="ms-1 size-3" />
                        {r.kind}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Progress value={pct} className="h-2 w-20" />
                        <span className="text-xs text-muted-foreground">
                          {r.registered}/{r.capacity} ({pct}%)
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={statusVariant[r.status]}
                        className={statusBadgeExtra[r.status]}
                      >
                        {r.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-left">
                      {canAct ? (
                        <div className="flex gap-1">
                          <Button
                            size="sm"
                            variant="outline"
                            className="h-7 text-xs"
                            onClick={() => updateStatus(r.id, "تایید شده")}
                          >
                            تایید
                          </Button>
                          <Button
                            size="sm"
                            variant="destructive"
                            className="h-7 text-xs"
                            onClick={() => updateStatus(r.id, "رد شده")}
                          >
                            رد
                          </Button>
                        </div>
                      ) : (
                        <span className="text-xs text-muted-foreground">—</span>
                      )}
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>

          {pendingRows.length === 0 && (
            <div className="mt-6 rounded-2xl border border-dashed border-border bg-muted/30 px-6 py-12 text-center">
              <AlertCircle className="mx-auto size-10 text-muted-foreground/50" />
              <p className="mt-3 text-sm text-muted-foreground">
                در حال حاضر درخواست در انتظار بررسی وجود ندارد.
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </AppShell>
  );
}
