import * as React from "react";
import { Crown, ShieldCheck, UserCheck, Users } from "lucide-react";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { useClassroom } from "@/lib/classroom-store";
import { studentsList } from "@/lib/mock-data";
import { toFaDigits } from "@/lib/utils";

/**
 * حاضرین کلاس و مدیریت نقش ارائه‌دهنده.
 *
 * نقش ارائه‌دهنده یعنی دانشجو می‌تواند صفحهٔ خودش را به‌اشتراک بگذارد و
 * وایت‌برد را بنویسد، یعنی همان کاری که استاد می‌کند. استاد این نقش را
 * می‌دهد و می‌گیرد. خود استاد همیشه ارائه‌دهنده است و قابل حذف نیست.
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
  const { isPresenter, togglePresenter } = useClassroom();
  const presentCount = studentsList.filter((s) => s.present).length;

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-base">
          <Users className="size-4 text-navy" />
          حاضرین کلاس
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        <p className="flex items-center gap-1 text-xs text-muted-foreground">
          <UserCheck className="size-3.5" />
          {toFaDigits(presentCount)} نفر حاضر از {toFaDigits(studentsList.length)} دانشجو
        </p>

        {/* استاد همیشه بالای فهرست و همیشه ارائه‌دهنده است. */}
        <div className="flex items-center justify-between rounded-lg bg-navy/10 px-3 py-2 text-sm">
          <span className="flex items-center gap-1.5 font-bold">
            <Crown className="size-3.5 text-navy" />
            {professorName}
          </span>
          <Badge className="bg-navy text-[10px] text-primary-foreground">ارائه‌دهنده</Badge>
        </div>

        {studentsList.map((s) => {
          const presenter = isPresenter(sessionId, s.id);
          return (
            <div
              key={s.id}
              className="flex items-center justify-between gap-2 rounded-lg bg-muted/50 px-3 py-2 text-sm"
            >
              <span className="flex min-w-0 items-center gap-1.5">
                <span className="truncate">{s.name}</span>
                {presenter && (
                  <Badge className="shrink-0 bg-navy text-[10px] text-primary-foreground">
                    ارائه‌دهنده
                  </Badge>
                )}
              </span>
              {canManage ? (
                <label className="flex shrink-0 items-center gap-1.5 text-[10px] text-muted-foreground">
                  ارائه
                  <Switch
                    checked={presenter}
                    onCheckedChange={() => {
                      togglePresenter(sessionId, s.id);
                      toast.success(
                        presenter
                          ? `نقش ارائه‌دهنده از ${s.name} گرفته شد`
                          : `${s.name} ارائه‌دهنده شد`,
                      );
                    }}
                    aria-label={`نقش ارائه‌دهنده برای ${s.name}`}
                  />
                </label>
              ) : (
                <Badge variant={s.present ? "secondary" : "outline"} className="text-[10px]">
                  {s.present ? "حاضر" : "غایب"}
                </Badge>
              )}
            </div>
          );
        })}

        {canManage && (
          <p className="flex items-start gap-1.5 pt-1 text-[10px] text-muted-foreground">
            <ShieldCheck className="mt-px size-3 shrink-0" />
            با روشن‌کردن کلید، آن دانشجو می‌تواند صفحهٔ خود را به‌اشتراک بگذارد و وایت‌برد را
            بنویسد.
          </p>
        )}
      </CardContent>
    </Card>
  );
}
