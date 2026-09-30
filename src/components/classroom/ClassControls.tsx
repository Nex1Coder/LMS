import * as React from "react";
import { Hand, PhoneOff, MonitorUp, Square } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { MediaBar } from "@/components/classroom/MediaBar";
import { useClassroom, type HandStatus } from "@/lib/classroom-store";
import { useLocalMedia } from "@/lib/local-media";
import { useScreenShare } from "@/lib/screen-share";

export function useClassroomMedia() {
  const media = useLocalMedia();
  const screen = useScreenShare();
  return { media, screen };
}

export function ClassControls({
  media,
  screen,
  canSpeak,
  canShare,
  onLeave,
  isProfessor,
  sessionId,
  studentId,
}: {
  media: ReturnType<typeof useLocalMedia>;
  screen: ReturnType<typeof useScreenShare>;
  canSpeak: boolean;
  canShare: boolean;
  onLeave: () => void;
  /** استاد خودش نیازی به درخواست صحبت یا دکمهٔ خروج ندارد؛ او میزبان است. */
  isProfessor: boolean;
  sessionId: string;
  studentId: string;
}) {
  const { myHand, raiseHand, lowerHand } = useClassroom();
  const raised = studentId ? myHand(sessionId, studentId) : null;

  const onHand = () => {
    if (!studentId) return;
    if (raised) {
      lowerHand(sessionId, studentId);
      toast.info("درخواست شما لغو شد");
      return;
    }
    raiseHand(sessionId, studentId);
    toast.success("درخواست صحبت ارسال شد");
  };

  return (
    <div className="flex flex-wrap items-center justify-center gap-3">
      <MediaBar media={media} mutedByHost={!canSpeak} compact />

      <div className="h-8 w-px bg-border" />

      {!isProfessor && (
        <>
          <Button
            variant={raised ? "default" : "outline"}
            size="sm"
            className="gap-1"
            onClick={onHand}
            disabled={raised?.status === "approved"}
            title={
              raised?.status === "approved"
                ? "اجازهٔ صحبت گرفته‌اید"
                : raised?.status === "denied"
                  ? "درخواست شما رد شد"
                  : undefined
            }
          >
            <Hand className="size-4" />
            {raised?.status === "approved"
              ? "اجازهٔ صحبت دارید"
              : raised?.status === "denied"
                ? "درخواست رد شد"
                : raised
                  ? "لغو درخواست"
                  : "درخواست صحبت"}
          </Button>

          <Button
            variant="ghost"
            size="sm"
            className="gap-1 text-destructive hover:bg-destructive/10 hover:text-destructive"
            onClick={onLeave}
          >
            <PhoneOff className="size-4" /> خروج از کلاس
          </Button>

          <div className="h-8 w-px bg-border" />
        </>
      )}

      <Button
        variant={screen.state === "live" ? "destructive" : "outline"}
        size="sm"
        className="gap-1"
        disabled={!canShare || screen.state === "starting"}
        onClick={() => (screen.state === "live" ? screen.stop() : void screen.start())}
      >
        {screen.state === "live" ? <Square className="size-4" /> : <MonitorUp className="size-4" />}
        {screen.state === "live" ? "توقف اشتراک صفحه" : "اشتراک صفحه"}
      </Button>
    </div>
  );
}

export type { HandStatus };
