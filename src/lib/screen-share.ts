import * as React from "react";
import { toast } from "sonner";

export type ScreenShareState = "idle" | "starting" | "live" | "error";

export type ScreenShare = {
  state: ScreenShareState;
  stream: MediaStream | null;
  start: () => Promise<void>;
  stop: () => void;
};

export function useScreenShare(): ScreenShare {
  const [state, setState] = React.useState<ScreenShareState>("idle");
  const [stream, setStream] = React.useState<MediaStream | null>(null);

  const stop = React.useCallback(() => {
    if (stream) {
      stream.getTracks().forEach((t) => t.stop());
      setStream(null);
    }
    setState("idle");
  }, [stream]);

  const start = React.useCallback(async () => {
    if (!navigator.mediaDevices?.getDisplayMedia) {
      setState("error");
      toast.error("مرورگر شما اشتراک صفحه را پشتیبانی نمی‌کند");
      return;
    }
    setState("starting");
    try {
      const s = await navigator.mediaDevices.getDisplayMedia({ video: true, audio: false });
      setStream(s);
      setState("live");
      for (const track of s.getVideoTracks()) {
        track.onended = () => stop();
      }
      toast.success("اشتراک صفحه آغاز شد");
    } catch (err) {
      if ((err as DOMException)?.name === "NotAllowedError") {
        setState("idle");
        return;
      }
      setState("error");
      toast.error("شروع اشتراک صفحه ممکن نشد");
    }
  }, [stop]);

  React.useEffect(() => () => stop(), [stop]);

  return { state, stream, start, stop };
}
