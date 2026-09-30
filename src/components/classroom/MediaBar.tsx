import * as React from "react";
import { Mic, MicOff, Video, VideoOff, Loader2, TriangleAlert } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";

/**
 * میکروفون و دوربین واقعی با getUserMedia.
 *
 * قبلاً این دو کلید فقط یک state ساده بودند و هیچ دستگاهی روشن نمی‌شد.
 * حالا از API واقعی مرورگر استفاده می‌شود تا رفتارش همان چیزی باشد که
 * کاربر از یک کلاس آنلاین انتظار دارد: اجازه گرفتن، LED روشن، و قطع
 * دستگاه با دکمهٔ خود مرورگر.
 *
 * نکتهٔ مهم: چون این پروژه بک‌اند ندارد، صدا و تصویر واقعاً برای
 * کسی ارسال نمی‌شود و فقط در همان مرورگر قابل مشاهده است.
 */

type MediaStatus = "idle" | "requesting" | "on" | "denied" | "unavailable";

export type MediaControls = {
  micOn: boolean;
  camOn: boolean;
  micDenied: boolean;
  /** استریم دوربین، برای نمایش در کادر تصویر. */
  camStream: MediaStream | null;
  toggleMic: () => void;
  toggleCam: () => void;
  /** همهٔ دستگاه‌ها را می‌بندد؛ برای خروج از کلاس. */
  stopAll: () => void;
};

export function useMedia(): MediaControls {
  const [micOn, setMicOn] = React.useState(false);
  const [camOn, setCamOn] = React.useState(false);
  const [micDenied, setMicDenied] = React.useState(false);
  const [status, setStatus] = React.useState<MediaStatus>("idle");

  // استریم‌ها در ref نگهداری می‌شوند، نه state، تا هر بار که state عوض
  // شود مجبور نباشیم دوباره آن‌ها را در اثر پاک‌سازی ببندیم.
  const camStreamRef = React.useRef<MediaStream | null>(null);
  const micStreamRef = React.useRef<MediaStream | null>(null);

  const closeAll = React.useCallback(() => {
    camStreamRef.current?.getTracks().forEach((t) => t.stop());
    micStreamRef.current?.getTracks().forEach((t) => t.stop());
    camStreamRef.current = null;
    micStreamRef.current = null;
  }, []);

  // اگر کاربر صفحه را ترک کند یا کامپوننت بسته شود، دستگاه‌ها باید
  // بسته شوند؛ وگرنه LED مرورگر روشن می‌ماند.
  React.useEffect(() => closeAll, [closeAll]);

  const start = React.useCallback(async (kind: "audio" | "video") => {
    if (typeof navigator === "undefined" || !navigator.mediaDevices?.getUserMedia) {
      setStatus("unavailable");
      toast.error("مرورگر شما دسترسی به میکروفون و دوربین را پشتیبانی نمی‌کند");
      return;
    }
    setStatus("requesting");
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ [kind]: true });
      if (kind === "audio") {
        micStreamRef.current = stream;
        setMicOn(true);
        setMicDenied(false);
      } else {
        camStreamRef.current = stream;
        setCamOn(true);
      }
      setStatus("on");
      // کاربر می‌تواند از نوار مرورگر هم دستگاه را قطع کند؛ اگر به آن
      // گوش ندهیم، UI ما روشن می‌ماند ولی دستگاه خاموش است.
      for (const track of stream.getTracks()) {
        track.addEventListener("ended", () => {
          if (kind === "audio") {
            setMicOn(false);
            micStreamRef.current = null;
          } else {
            setCamOn(false);
            camStreamRef.current = null;
          }
          setStatus("idle");
          toast.info(kind === "audio" ? "میکروفون خاموش شد" : "دوربین خاموش شد");
        });
      }
    } catch (err) {
      const name = (err as DOMException | null)?.name;
      if (name === "NotAllowedError" || name === "SecurityError") {
        setStatus("denied");
        if (kind === "audio") setMicDenied(true);
        toast.error(
          kind === "audio"
            ? "اجازهٔ دسترسی به میکروفون داده نشد"
            : "اجازهٔ دسترسی به دوربین داده نشد",
        );
        return;
      }
      if (name === "NotFoundError" || name === "OverconstrainedError") {
        setStatus("idle");
        toast.error(kind === "audio" ? "میکروفونی پیدا نشد" : "دوربینی به این دستگاه وصل نیست");
        return;
      }
      setStatus("idle");
      toast.error(kind === "audio" ? "روشن کردن میکروفون ممکن نشد" : "روشن کردن دوربین ممکن نشد");
    }
  }, []);

  const stop = React.useCallback((kind: "audio" | "video") => {
    if (kind === "audio") {
      micStreamRef.current?.getTracks().forEach((t) => t.stop());
      micStreamRef.current = null;
      setMicOn(false);
      return;
    }
    camStreamRef.current?.getTracks().forEach((t) => t.stop());
    camStreamRef.current = null;
    setCamOn(false);
  }, []);

  const toggleMic = React.useCallback(() => {
    if (micOn) {
      stop("audio");
      return;
    }
    void start("audio");
  }, [micOn, start, stop]);

  const toggleCam = React.useCallback(() => {
    if (camOn) {
      stop("video");
      return;
    }
    void start("video");
  }, [camOn, start, stop]);

  return {
    micOn,
    camOn,
    micDenied,
    camStream: camStreamRef.current,
    toggleMic,
    toggleCam,
    stopAll: () => {
      closeAll();
      setMicOn(false);
      setCamOn(false);
    },
  };
}

export function MediaBar({
  media,
  /** وقتی استاد ساکت کرده، دانشجو نمی‌تواند میکروفونش را روشن کند. */
  mutedByHost,
  compact,
}: {
  media: MediaControls;
  mutedByHost: boolean;
  compact?: boolean | undefined;
}) {
  return (
    <div className="flex flex-wrap items-center justify-center gap-2">
      <Button
        variant={media.micOn ? "default" : "outline"}
        size={compact ? "sm" : "default"}
        onClick={media.toggleMic}
        disabled={mutedByHost}
        title={
          mutedByHost
            ? "استاد شما را ساکت کرده است"
            : media.micOn
              ? "میکروفون را خاموش کن"
              : "میکروفون را روشن کن"
        }
      >
        {media.micOn ? <Mic className="size-4" /> : <MicOff className="size-4" />}
        {media.micOn ? "میکروفون روشن" : "میکروفون خاموش"}
      </Button>

      <Button
        variant={media.camOn ? "default" : "outline"}
        size={compact ? "sm" : "default"}
        onClick={media.toggleCam}
        title={media.camOn ? "دوربین را خاموش کن" : "دوربین را روشن کن"}
      >
        {media.camOn ? <Video className="size-4" /> : <VideoOff className="size-4" />}
        {media.camOn ? "دوربین روشن" : "دوربین خاموش"}
      </Button>

      {mutedByHost && (
        <span className="flex items-center gap-1 text-[11px] text-destructive">
          <TriangleAlert className="size-3.5" />
          استاد شما را ساکت کرده است
        </span>
      )}
    </div>
  );
}
