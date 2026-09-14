import * as React from "react";
import { createFileRoute } from "@tanstack/react-router";
import { CheckCircle2, CircleDashed, ClipboardCheck, UserCheck } from "lucide-react";
import { toast } from "sonner";
import { AppShell } from "@/components/layout/AppShell";
import { gradeWorkflow, type GradeWorkflowItem } from "@/lib/mock-data";
import { cn } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";

export const Route = createFileRoute("/grade-workflow")({
  head: () => ({
    meta: [
      { title: "گردش کار ثبت نمرات | سامانه آموزش مجازی دانشگاه" },
      {
        name: "description",
        content: "کنترل فرآیند ثبت نمرات از استاد تا تأیید نهایی واحد آموزش.",
      },
    ],
  }),
  component: GradeWorkflowPage,
});

type WorkflowStatus = GradeWorkflowItem["status"];
type StepState = "done" | "active" | "pending";

const stepLabels = ["ثبت توسط استاد", "تأیید واحد آموزش", "تأیید نهایی"];

const faNumber = (n: number) => n.toLocaleString("fa-IR");

function stepStates(status: WorkflowStatus): StepState[] {
  switch (status) {
    case "تأیید نهایی شده":
      return ["done", "done", "done"];
    case "منتظر تأیید واحد آموزش":
      return ["done", "active", "pending"];
    default:
      return ["active", "pending", "pending"];
  }
}

function statusBadgeClass(status: WorkflowStatus): string {
  switch (status) {
    case "تأیید نهایی شده":
      return "border-transparent bg-green-600 text-primary-foreground";
    case "منتظر تأیید واحد آموزش":
      return "border-transparent bg-navy text-primary-foreground";
    default:
      return "border-transparent bg-amber-100 text-amber-800";
  }
}

function WorkflowStepper({ status }: { status: WorkflowStatus }) {
  const states = stepStates(status);
  return (
    <div className="flex items-center gap-1">
      {stepLabels.map((label, index) => {
        const state = states[index] ?? "pending";
        const finalDone = status === "تأیید نهایی شده" && index === 2;
        const circleClass = finalDone
          ? "border-green-600 bg-green-600 text-primary-foreground"
          : state === "done"
            ? "border-navy bg-navy text-primary-foreground"
            : state === "active"
              ? "border-amber-400 bg-card text-amber-600 ring-2 ring-amber-400"
              : "border-border bg-muted text-muted-foreground";
        return (
          <React.Fragment key={label}>
            {index > 0 && (
              <div
                className={cn(
                  "h-px min-w-3 flex-1",
                  states[index - 1] === "done" ? "bg-navy" : "bg-muted",
                )}
              />
            )}
            <div className="flex flex-col items-center gap-1.5">
              <div
                className={cn(
                  "flex size-7 items-center justify-center rounded-full border text-[11px] font-bold",
                  circleClass,
                )}
              >
                {finalDone ? <CheckCircle2 className="size-4" /> : faNumber(index + 1)}
              </div>
              <span
                className={cn(
                  "whitespace-nowrap text-[10px]",
                  state === "pending" ? "text-muted-foreground" : "text-foreground",
                )}
              >
                {label}
              </span>
            </div>
          </React.Fragment>
        );
      })}
    </div>
  );
}

const statCards = [
  {
    key: "waiting" as const,
    label: "در انتظار ثبت استاد",
    icon: CircleDashed,
    iconClass: "bg-amber-100 text-amber-700",
  },
  {
    key: "reviewing" as const,
    label: "منتظر تأیید واحد آموزش",
    icon: ClipboardCheck,
    iconClass: "bg-navy/10 text-navy",
  },
  {
    key: "approved" as const,
    label: "تأیید نهایی شده",
    icon: CheckCircle2,
    iconClass: "bg-green-100 text-green-700",
  },
];

function GradeWorkflowPage() {
  const [items, setItems] = React.useState<GradeWorkflowItem[]>(gradeWorkflow);

  const counts = {
    waiting: items.filter((item) => item.status === "در انتظار ثبت استاد").length,
    reviewing: items.filter((item) => item.status === "منتظر تأیید واحد آموزش").length,
    approved: items.filter((item) => item.status === "تأیید نهایی شده").length,
  };

  function handleApprove(id: string) {
    setItems((prev) =>
      prev.map((item) =>
        item.id === id
          ? {
              ...item,
              status: "تأیید نهایی شده",
              lastAction: new Date().toLocaleDateString("fa-IR"),
            }
          : item,
      ),
    );
    toast.success("نمرات درس به‌صورت نهایی تأیید شد");
  }

  return (
    <AppShell
      title="کنترل ثبت نمرات و تأیید نهایی"
      subtitle="گردش کار تأیید نمرات از ثبت استاد تا تأیید واحد آموزش"
    >
      <div className="grid gap-4 sm:grid-cols-3">
        {statCards.map(({ key, label, icon: Icon, iconClass }) => (
          <Card key={key}>
            <CardContent className="flex items-center gap-3 p-5">
              <span
                className={cn(
                  "flex size-11 shrink-0 items-center justify-center rounded-xl",
                  iconClass,
                )}
              >
                <Icon className="size-5" />
              </span>
              <div className="min-w-0">
                <p className="truncate text-xs text-muted-foreground">{label}</p>
                <p className="text-2xl font-bold">{faNumber(counts[key])}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="mt-6 grid gap-5 lg:grid-cols-2">
        {items.map((item) => {
          const pct = item.total > 0 ? Math.round((item.graded / item.total) * 100) : 0;
          return (
            <Card key={item.id} className="flex flex-col">
              <CardHeader className="flex-row items-start justify-between gap-3 space-y-0">
                <div className="min-w-0">
                  <CardTitle className="text-base">{item.course}</CardTitle>
                  <p className="mt-1 flex items-center gap-1.5 text-xs text-muted-foreground">
                    <UserCheck className="size-3.5 shrink-0" />
                    <span className="truncate">{item.professor}</span>
                  </p>
                </div>
                <Badge className={cn("shrink-0 text-[10px]", statusBadgeClass(item.status))}>
                  {item.status}
                </Badge>
              </CardHeader>
              <CardContent className="flex flex-1 flex-col gap-5">
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-muted-foreground">پیشرفت ثبت نمرات</span>
                    <span className="font-semibold">
                      {faNumber(item.graded)} از {faNumber(item.total)} نمره ثبت‌شده
                    </span>
                  </div>
                  <Progress value={pct} />
                </div>

                <WorkflowStepper status={item.status} />

                <div className="mt-auto flex items-center justify-between gap-3 border-t border-border pt-4">
                  <span className="text-xs text-muted-foreground">
                    آخرین اقدام: <b className="text-foreground">{item.lastAction}</b>
                  </span>
                  {item.status === "منتظر تأیید واحد آموزش" ? (
                    <Button size="sm" onClick={() => handleApprove(item.id)}>
                      <ClipboardCheck className="size-4" />
                      تأیید نهایی
                    </Button>
                  ) : item.status === "در انتظار ثبت استاد" ? (
                    <Button size="sm" variant="outline" disabled>
                      <CircleDashed className="size-4" />
                      در انتظار ثبت نمرات توسط استاد
                    </Button>
                  ) : (
                    <Button size="sm" variant="outline" disabled>
                      <CheckCircle2 className="size-4 text-green-600" />
                      نمرات تأیید و بسته شده
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </AppShell>
  );
}
