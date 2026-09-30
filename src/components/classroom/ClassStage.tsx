import * as React from "react";
import {
  MonitorUp,
  MonitorX,
  Square,
  Eye,
  Pencil,
  FileText,
  Image as ImageIcon,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { type SharedFile } from "@/lib/classroom-store";

/**
 * بخش اصلی نمایش کلاس.
 *
 * محتوا را بر اساس اولویت نمایش می‌دهد:
 * ۱. اشتراک صفحه (اگر فعال باشد)
 * ۲. فایل به‌اشتراک‌گذاشته‌شده (تصویر یا PDF)
 * ۳. دوربین استاد/ارائه‌دهنده (اگر روشن باشد)
 * ۴. پیش‌فرض (تخته یا وضعیت تماشا)
 */
export function ClassStage({
  session,
  sharedFile,
  cameraStream,
  screenStream,
  screenState,
  canPresent,
  grantedPresenter,
}: {
  session: { course: string; professor: string };
  sharedFile: SharedFile | null;
  cameraStream: MediaStream | null;
  screenStream: MediaStream | null;
  screenState: string;
  canPresent: boolean;
  grantedPresenter: boolean;
}) {
  const videoRef = React.useRef<HTMLVideoElement | null>(null);

  React.useEffect(() => {
    if (videoRef.current && screenStream) {
      videoRef.current.srcObject = screenStream;
    }
  }, [screenStream]);

  return (
    <div className="relative aspect-video overflow-hidden rounded-xl bg-navy ring-1 ring-white/10">
      {/* لایه زنده */}
      <Badge className="absolute z-20 end-3 top-3 bg-destructive text-destructive-foreground">
        زنده
      </Badge>

      {/* محتوای اصلی */}
      <div className="absolute inset-0 flex items-center justify-center">
        {screenState === "live" && screenStream ? (
          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted
            className="h-full w-full object-contain"
          />
        ) : sharedFile ? (
          <div className="flex h-full w-full flex-col items-center justify-center p-6 text-center">
            {sharedFile.ext === "pdf" ? (
              <iframe
                src={sharedFile.previewUrl}
                className="h-full w-full rounded-lg border-0 shadow-2xl"
                title={sharedFile.name}
              />
            ) : sharedFile.previewUrl ? (
              <img
                src={sharedFile.previewUrl}
                alt={sharedFile.name}
                className="max-h-full max-w-full rounded-lg object-contain shadow-2xl"
              />
            ) : (
              <div className="flex flex-col items-center gap-4 rounded-2xl bg-white/10 p-12 text-primary-foreground backdrop-blur-sm">
                <FileText className="size-16 text-accent" />
                <div className="space-y-2">
                  <p className="text-lg font-bold">{sharedFile.name}</p>
                  <p className="text-sm opacity-70">
                    {sharedFile.ext.toUpperCase()} — {sharedFile.uploader}
                  </p>
                </div>
              </div>
            )}
          </div>
        ) : cameraStream ? (
          <video
            autoPlay
            playsInline
            muted
            className="h-full w-full object-cover"
            ref={(el) => {
              if (el) el.srcObject = cameraStream;
            }}
          />
        ) : (
          <div className="flex flex-col items-center justify-center gap-3 text-primary-foreground/80">
            {canPresent ? (
              <>
                <Pencil className="size-8 text-accent" />
                <p className="text-sm">
                  {grantedPresenter ? "شما ارائه‌دهندهٔ این جلسه هستید" : "تخته اشتراکی استاد"}
                </p>
              </>
            ) : (
              <>
                <Eye className="size-7" />
                <p className="text-sm">در حال تماشا — {session.professor} ارائه می‌دهد</p>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
