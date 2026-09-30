import * as React from "react";
import { Crown, ShieldCheck, UserCheck, Users, Hand } from "lucide-react";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { useClassroom } from "@/lib/classroom-store";
import { studentsList } from "@/lib/mock-data";
import { toFaDigits } from "@/lib/utils";

/**
 * حاضرین کلاس و مدیریت نقش ارائه‌دهنده، ادمین و درخواست‌های صحبت.
 */
export function ClassRoster({
  sessionId,
  professorName,
  canManage,
}: {
  sessionId: string;
  professorName: string;
  canManage: boolean;
}) {
  const { isPresenter, togglePresenter, isAdmin, toggleAdmin, hands, resolveHand } = useClassroom();
  const presentCount = studentsList.filter((s) => s.present).length;
  const pendingHands = hands[sessionId] ?? [];
  const waiting = pendingHands.filter((h) => h.status === "pending");

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-base">
          <Users className="size-4 text-navy" />
          حاضرین کلاس
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* بخش درخواست‌های صحبت (فقط برای مدیران) */}
        {canManage && waiting.length > 0 && (
          <div className="space-y-2 rounded-lg border border-accent/30 bg-accent/10 p-3">
            <p className="flex items-center gap-1.5 text-xs font-bold text-accent">
              <Hand className="size-3.5" />
              درخواست‌های صحبت: {toFaDigits(waiting.length)} نفر
            </p>
            <div className="flex flex-wrap gap-2">
              {waiting.map((h) => {
                const student = studentsList.find((s) => s.id === h.studentId);
                return (
                  <div
                    key={h.studentId}
                    className="flex items-center gap-1.5 rounded-md bg-white p-1 pr-2 text-[10px] ring-1 ring-border"
                  >
                    <span className="truncate max-w-[80px]">{student?.name}</span>
                    <Button
                      size="icon"
                      variant="ghost"
                      className="size-5 h-5 w-5 p-0"
                      onClick={() => {
                        resolveHand(sessionId, h.studentId, "approved");
                        toast.success(`به ${student?.name} اجازه صحبت داده شد`);
                      }}
                    >
                      <UserCheck className="size-3 text-green-600" />
                    </Button>
                    <Button
                      size="icon"
                      variant="ghost"
                      className="size-5 h-5 w-5 p-0"
                      onClick={() => {
                        resolveHand(sessionId, h.studentId, "denied");
                        toast.info(`درخواست ${student?.name} رد شد`);
                      }}
                    >
                      <div className="size-3 text-destructive font-bold">×</div>
                    </Button>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        <p className="flex items-center gap-1 text-xs text-muted-foreground">
          <UserCheck className="size-3.5" />
          {toFaDigits(presentCount)} نفر حاضر از {toFaDigits(studentsList.length)} دانشجو
        </p>

        <div className="flex items-center justify-between rounded-lg bg-navy/10 px-3 py-2 text-sm">
          <span className="flex items-center gap-1.5 font-bold">
            <Crown className="size-3.5 text-navy" />
            {professorName}
          </span>
          <Badge className="bg-navy text-[10px] text-primary-foreground">ارائه‌دهنده</Badge>
        </div>

        {studentsList.map((s) => {
          const presenter = isPresenter(sessionId, s.id);
          const admin = isAdmin(sessionId, s.id);
          const allowed = (hands[sessionId] ?? []).some(
            (h) => h.studentId === s.id && h.status === "approved",
          );
          const hand = (hands[sessionId] ?? []).find((h) => h.studentId === s.id);

          return (
            <div
              key={s.id}
              className="flex items-center justify-between gap-2 rounded-lg bg-muted/50 px-3 py-2 text-sm"
            >
              <span className="flex min-w-0 items-center gap-1.5">
                <span className="truncate">{s.name}</span>
                <div className="flex gap-1">
                  {presenter && (
                    <Badge className="shrink-0 bg-navy text-[10px] text-primary-foreground">
                      ارائه
                    </Badge>
                  )}
                  {admin && (
                    <Badge className="shrink-0 bg-accent text-[10px] text-accent-foreground">
                      ادمین
                    </Badge>
                  )}
                  {allowed && (
                    <Badge className="shrink-0 bg-green-600 text-[10px] text-white">
                      مجاز به صحبت
                    </Badge>
                  )}
                  {hand?.status === "pending" && (
                    <Badge className="shrink-0 bg-orange-500 text-[10px] text-white animate-pulse">
                      ✋
                    </Badge>
                  )}
                </div>
              </span>
              {canManage ? (
                <div className="flex items-center gap-3">
                  <label className="flex items-center gap-1.5 text-[10px] text-muted-foreground">
                    ارائه
                    <Switch
                      checked={presenter}
                      onCheckedChange={() => {
                        togglePresenter(sessionId, s.id);
                        toast.success(
                          presenter ? `ارائه ${s.name} لغو شد` : `${s.name} ارائه‌دهنده شد`,
                        );
                      }}
                    />
                  </label>
                  <label className="flex items-center gap-1.5 text-[10px] text-muted-foreground">
                    ادمین
                    <Switch
                      checked={admin}
                      onCheckedChange={() => {
                        toggleAdmin(sessionId, s.id);
                        toast.success(
                          admin ? `دسترسی ادمین ${s.name} لغو شد` : `${s.name} ادمین شد`,
                        );
                      }}
                    />
                  </label>
                </div>
              ) : (
                <Badge variant={s.present ? "secondary" : "outline"} className="text-[10px]">
                  {s.present ? "حاضر" : "غایب"}
                </Badge>
              )}
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}
