import * as React from "react";
import { MonitorUp, MonitorX, Square } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

/**
 * اشتراک‌گذاری واقعی صفحه با getDisplayMedia.
 *
 * این پروژه بک‌اند ندارد، پس تصویر واقعاً برای کسی ارسال نمی‌شود؛ فقط
 * در همان مرورگر نمایش داده می‌شود. با این حال از API واقعی مرورگر
 * استفاده می‌کنم چون رفتارش (پنجرهٔ انتخاب صفحه، دکمهٔ توقف اشتراک در
 * نوار مرورگر) همان چیزی است که کاربر از یک کلاس آنلاین انتظار دارد.
 */

type ScreenShareState = "idle" | "starting" | "live" | "error";

export function ScreenShare({ canShare }: { canShare: boolean }) {
  const videoRef = React.useRef<HTMLVideoElement | null>(null);
  const streamRef = React.useRef<MediaStream | null>(null);
  const [state, setState] = React.useState<ScreenShareState>("idle");

  // پاک‌سازی قطعی: اگر کامپوننت unmount شود یا کاربر صفحه را ترک کند،
  // دوربین/اشتراک نباید روشن بماند و LED مرورگر خاموش نشود.
  React.useEffect(() => {
    return () => {
      streamRef.current?.getTracks().forEach((t) => t.stop());
      streamRef.current = null;
    };
  }, []);

  const stop = React.useCallback(() => {
    streamRef.current?.getTracks().forEach((t) => t.stop());
    streamRef.current = null;
    if (videoRef.current) videoRef.current.srcObject = null;
    setState("idle");
  }, []);

  const start = async () => {
    if (!navigator.mediaDevices?.getDisplayMedia) {
      setState("error");
      toast.error("مرورگر شما اشتراک صفحه را پشتیبانی نمی‌کند");
      return;
    }
    setState("starting");
    try {
      const stream = await navigator.mediaDevices.getDisplayMedia({
        video: true,
        audio: false,
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        // صدا را فقط از خود مرورگر پخش می‌کنیم، نه از بلندگو، وگرنه
        // صدای خود کاربر دوباره پخش می‌شود.
        videoRef.current.muted = true;
        await videoRef.current.play().catch(() => undefined);
      }
      setState("live");
      // کاربر می‌تواند از نوار مرورگر هم اشتراک را قطع کند. اگر به آن
      // گوش ندهیم، UI ما زنده می‌ماند ولی تصویر قطع شده است.
      for (const track of stream.getVideoTracks()) {
        track.addEventListener("ended", () => {
          stop();
          toast.info("اشتراک صفحه متوقف شد");
        });
      }
      toast.success("اشتراک صفحه آغاز شد");
    } catch (err) {
      // کاربر معمولاً پنجره را می‌بندد؛ این خطا نیست.
      if ((err as DOMException)?.name === "NotAllowedError") {
        setState("idle");
        return;
      }
      setState("error");
      toast.error("شروع اشتراک صفحه ممکن نشد");
    }
  };

  if (state === "live") {
    return (
      <div className="space-y-2">
        <div className="relative overflow-hidden rounded-lg border border-border bg-black">
          <video
            ref={videoRef}
            muted
            playsInline
            className="aspect-video w-full object-contain"
            aria-label="تصویر صفحهٔ به‌اشتراک‌گذاشته‌شده"
          />
          <Badge className="absolute end-2 top-2 bg-destructive text-[10px] text-destructive-foreground">
            در حال اشتراک
          </Badge>
        </div>
        <Button variant="destructive" size="sm" className="w-full gap-1" onClick={stop}>
          <Square className="size-3" /> توقف اشتراک صفحه
        </Button>
      </div>
    );
  }

  return (
    <Button
      variant={canShare ? "outline" : "ghost"}
      size="sm"
      className="w-full gap-1"
      disabled={!canShare || state === "starting"}
      onClick={start}
      title={
        canShare
          ? "یک پنجره یا صفحهٔ دلخواه را انتخاب کنید"
          : "فقط استاد یا ارائه‌دهنده می‌تواند صفحه به‌اشتراک بگذارد"
      }
    >
      {state === "error" ? <MonitorX className="size-4" /> : <MonitorUp className="size-4" />}
      {state === "starting"
        ? "در انتظار انتخاب صفحه…"
        : state === "error"
          ? "اشتراک صفحه پشتیبانی نمی‌شود"
          : "اشتراک صفحه"}
    </Button>
  );
}
