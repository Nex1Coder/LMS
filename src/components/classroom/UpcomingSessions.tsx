import * as React from "react";
import { Link } from "@tanstack/react-router";
import { CalendarClock, Link2, Pencil, Video } from "lucide-react";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useClassroom } from "@/lib/classroom-store";
import { toFaDigits } from "@/lib/utils";

/**
 * جلسات پیش‌رو به‌همراه لینک ورود به کلاس.
 *
 * دانشجو فقط لینک را می‌بیند و با «ورود به کلاس» وارد می‌شود. استاد علاوه
 * بر دیدن، می‌تواند لینک هر جلسه را تعریف یا اصلاح کند؛ لینک‌هایی که
 * استاد تغییر داده در مرورگر ذخیره می‌شوند و بین رفرش باقی می‌مانند.
 */
export function UpcomingSessions({ canEditLink }: { canEditLink: boolean }) {
  const { sessions, linkOf, setLink, hasCustomLink } = useClassroom();
  const [editing, setEditing] = React.useState<string | null>(null);
  const [draft, setDraft] = React.useState("");

  const startEdit = (id: string, current: string) => {
    setEditing(id);
    setDraft(current);
  };

  const save = (id: string) => {
    const value = draft.trim();
    // لینک خالی مجاز است، یعنی استاد هنوز جلسه را برگزار نکرده. ولی اگر
    // چیزی نوشته، باید واقعاً لینک باشد وگرنه دانشجو با کلیک به صفحهٔ
    // بی‌ربط می‌رود.
    if (value && !/^https?:\/\/.+/i.test(value)) {
      toast.error("لینک باید با http:// یا https:// شروع شود");
      return;
    }
    setLink(id, value);
    setEditing(null);
    toast.success(value ? "لینک کلاس ذخیره شد" : "لینک کلاس پاک شد");
  };

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-base">
          <CalendarClock className="size-4 text-navy" />
          درس‌های پیش‌رو
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-2.5">
        {sessions.map((s) => {
          const link = linkOf(s.id);
          const isEditing = editing === s.id;
          return (
            <div
              key={s.id}
              className="flex flex-col gap-2 rounded-lg border border-border bg-muted/30 p-3 sm:flex-row sm:items-center sm:justify-between"
            >
              <div className="min-w-0 space-y-1">
                <div className="flex flex-wrap items-center gap-2">
                  <p className="truncate text-sm font-bold">{s.course}</p>
                  {s.live && (
                    <Badge className="bg-destructive text-[10px] text-destructive-foreground">
                      همین حالا
                    </Badge>
                  )}
                  <Badge variant="secondary" className="text-[10px]">
                    {s.day}
                  </Badge>
                </div>
                <p className="text-xs text-muted-foreground">
                  {s.time} — {s.topic}
                </p>
                <p className="text-[11px] text-muted-foreground">
                  استاد: {s.professor} • تاریخ: {toFaDigits(s.date)}
                </p>

                {link && !isEditing && (
                  <a
                    href={link}
                    target="_blank"
                    rel="noreferrer noopener"
                    className="inline-flex max-w-full items-center gap-1 truncate text-[11px] text-primary underline-offset-2 hover:underline"
                  >
                    <Link2 className="size-3 shrink-0" />
                    <span className="truncate" dir="ltr">
                      {link}
                    </span>
                  </a>
                )}
                {!link && !isEditing && (
                  <p className="text-[11px] text-amber-600 dark:text-amber-400">
                    {canEditLink
                      ? "هنوز لینکی تعریف نشده است."
                      : "استاد هنوز لینک این جلسه را اعلام نکرده است."}
                  </p>
                )}
              </div>

              <div className="flex shrink-0 items-center gap-2">
                {isEditing ? (
                  <>
                    <Input
                      value={draft}
                      onChange={(e) => setDraft(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") save(s.id);
                        if (e.key === "Escape") setEditing(null);
                      }}
                      placeholder="https://meet.example.com/…"
                      dir="ltr"
                      className="h-8 min-w-0 flex-1 text-xs sm:w-72 sm:flex-none"
                      autoFocus
                    />
                    <Button size="sm" className="h-8" onClick={() => save(s.id)}>
                      ذخیره
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      className="h-8"
                      onClick={() => setEditing(null)}
                    >
                      انصراف
                    </Button>
                  </>
                ) : (
                  <>
                    {canEditLink && (
                      <Button
                        size="sm"
                        variant="outline"
                        className="h-8 gap-1 text-xs"
                        onClick={() => startEdit(s.id, link)}
                      >
                        <Pencil className="size-3" />
                        {hasCustomLink(s.id) ? "ویرایش لینک" : "تعریف لینک"}
                      </Button>
                    )}
                    {link ? (
                      <Button size="sm" className="h-8 gap-1 text-xs" asChild>
                        <Link to="/classroom" params={{ session: s.id }}>
                          <Video className="size-3" />
                          ورود به کلاس
                        </Link>
                      </Button>
                    ) : (
                      <Button size="sm" className="h-8 gap-1 text-xs" disabled>
                        <Video className="size-3" />
                        ورود به کلاس
                      </Button>
                    )}
                  </>
                )}
              </div>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}
