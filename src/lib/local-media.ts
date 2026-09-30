import * as React from "react";
import { toast } from "sonner";

export type LocalMedia = {
  micOn: boolean;
  camOn: boolean;
  micDenied: boolean;
  camStream: MediaStream | null;
  toggleMic: () => void;
  toggleCam: () => void;
  stopAll: () => void;
};

function describeMediaError(err: unknown, kind: "audio" | "video"): string {
  const name = (err as DOMException | null)?.name;
  const what = kind === "audio" ? "میکروفون" : "دوربین";
  if (name === "NotAllowedError" || name === "SecurityError")
    return `اجازهٔ دسترسی به ${what} داده نشد`;
  if (name === "NotFoundError" || name === "OverconstrainedError") return `${what} پیدا نشد`;
  return `روشن کردن ${what} ممکن نشد`;
}

export function useLocalMedia(): LocalMedia {
  const [micOn, setMicOn] = React.useState(false);
  const [camOn, setCamOn] = React.useState(false);
  const [micDenied, setMicDenied] = React.useState(false);

  const camStreamRef = React.useRef<MediaStream | null>(null);
  const micStreamRef = React.useRef<MediaStream | null>(null);

  const closeAll = React.useCallback(() => {
    camStreamRef.current?.getTracks().forEach((t) => t.stop());
    micStreamRef.current?.getTracks().forEach((t) => t.stop());
    camStreamRef.current = null;
    micStreamRef.current = null;
  }, []);

  React.useEffect(() => () => closeAll(), [closeAll]);

  const start = React.useCallback(async (kind: "audio" | "video") => {
    if (!navigator.mediaDevices?.getUserMedia) {
      toast.error("مرورگر شما دسترسی به رسانه‌ها را پشتیبانی نمی‌کند");
      return null;
    }
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
      return stream;
    } catch (err) {
      if (kind === "audio") setMicDenied(true);
      toast.error(describeMediaError(err, kind));
      return null;
    }
  }, []);

  const stop = React.useCallback((kind: "audio" | "video") => {
    if (kind === "audio") {
      micStreamRef.current?.getTracks().forEach((t) => t.stop());
      micStreamRef.current = null;
      setMicOn(false);
    } else {
      camStreamRef.current?.getTracks().forEach((t) => t.stop());
      camStreamRef.current = null;
      setCamOn(false);
    }
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
