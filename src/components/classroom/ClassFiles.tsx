import * as React from "react";
import { FileUp, Paperclip, Trash2, Presentation } from "lucide-react";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useClassroom, type UploadedFile } from "@/lib/classroom-store";
import {
  ACCEPT_ATTR,
  ALLOWED_UPLOAD_EXTS,
  MAX_UPLOAD_BYTES,
  checkUpload,
  formatBytes,
  isImageExt,
} from "@/lib/upload-rules";
import { toFaDigits } from "@/lib/utils";

/**
 * بارگذاری فایل در کلاس با محدودیت نوع و حجم.
 */
export function ClassFiles({
  sessionId,
  uploader,
  canUpload,
}: {
  sessionId: string;
  uploader: string;
  canUpload: boolean;
}) {
  const { files, addFiles, removeFile, sharedFile, setSharedFile } = useClassroom();
  const list = files[sessionId] ?? [];
  const currentShared = sharedFile[sessionId] ?? null;
  const inputRef = React.useRef<HTMLInputElement | null>(null);

  const onPick = (e: React.ChangeEvent<HTMLInputElement>) => {
    const picked = Array.from(e.target.files ?? []);
    e.target.value = "";
    if (!picked.length) return;

    const accepted: UploadedFile[] = [];
    let rejected = 0;
    for (const file of picked) {
      const check = checkUpload(file);
      if (!check.ok) {
        rejected++;
        toast.error(`${file.name}: ${check.reason}`);
        continue;
      }
      accepted.push({
        id: `${file.name}-${file.size}-${file.lastModified}-${Math.random().toString(36).slice(2, 8)}`,
        name: file.name,
        size: file.size,
        ext: check.ext,
        uploader,
        previewUrl: isImageExt(check.ext) ? URL.createObjectURL(file) : undefined,
      });
    }
    if (accepted.length) {
      addFiles(sessionId, accepted);
      toast.success(`${toFaDigits(accepted.length)} فایل بارگذاری شد`);
    }
    if (rejected) toast.error(`${toFaDigits(rejected)} فایل به دلیل محدودیت رد شد`);
  };

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-base">
            <Paperclip className="size-4 text-navy" />
            فایل‌های کلاس
          </CardTitle>
          {currentShared && (
            <Badge variant="default" className="bg-accent text-accent-foreground text-[10px]">
              در حال نمایش: {currentShared.name}
            </Badge>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <p className="text-[11px] text-muted-foreground">
          مجاز: {ALLOWED_UPLOAD_EXTS.join("، ")} — حداکثر{" "}
          {toFaDigits(MAX_UPLOAD_BYTES / 1024 / 1024)} مگابایت
        </p>

        {canUpload ? (
          <>
            <input
              ref={inputRef}
              type="file"
              multiple
              accept={ACCEPT_ATTR}
              onChange={onPick}
              className="sr-only"
              id={`class-upload-${sessionId}`}
            />
            <Button
              variant="outline"
              size="sm"
              className="w-full gap-1"
              onClick={() => inputRef.current?.click()}
            >
              <FileUp className="size-4" /> بارگذاری فایل
            </Button>
          </>
        ) : (
          <p className="rounded-lg bg-muted/50 px-3 py-2 text-[11px] text-muted-foreground">
            در این نسخه فقط استاد و ادمین می‌توانند فایل بارگذاری کنند.
          </p>
        )}

        {list.length === 0 ? (
          <p className="text-xs text-muted-foreground">هنوز فایلی بارگذاری نشده است.</p>
        ) : (
          <ul className="space-y-2">
            {list.map((f) => (
              <li
                key={f.id}
                className="flex items-center justify-between gap-3 rounded-lg border border-border bg-muted/30 p-2"
              >
                <div className="flex items-center gap-3 overflow-hidden">
                  {f.previewUrl ? (
                    <img
                      src={f.previewUrl}
                      alt=""
                      className="size-9 shrink-0 rounded object-cover"
                    />
                  ) : (
                    <span className="flex size-9 shrink-0 items-center justify-center rounded bg-navy/10 text-[10px] font-bold uppercase text-navy">
                      {f.ext}
                    </span>
                  )}
                  <div className="min-w-0">
                    <p className="truncate text-xs font-medium" dir="auto">
                      {f.name}
                    </p>
                    <p className="text-[10px] text-muted-foreground">
                      {toFaDigits(formatBytes(f.size))} — {f.uploader}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  {canUpload && (
                    <Button
                      size="icon"
                      variant="ghost"
                      className="size-7 shrink-0 text-muted-foreground hover:text-primary"
                      onClick={() => {
                        setSharedFile(sessionId, {
                          id: f.id,
                          name: f.name,
                          ext: f.ext,
                          uploader: f.uploader,
                          previewUrl: f.previewUrl,
                        });
                        toast.success(`فایل ${f.name} به اشتراک گذاشته شد`);
                      }}
                      title="نمایش به کلاس"
                    >
                      <Presentation className="size-3.5" />
                    </Button>
                  )}
                  {canUpload && (
                    <Button
                      size="icon"
                      variant="ghost"
                      className="size-7 shrink-0 text-muted-foreground hover:text-destructive"
                      onClick={() => removeFile(sessionId, f.id)}
                      aria-label={`حذف ${f.name}`}
                    >
                      <Trash2 className="size-3.5" />
                    </Button>
                  )}
                </div>
              </li>
            ))}
          </ul>
        )}

        {list.length > 0 && (
          <Badge variant="secondary" className="text-[10px]">
            {toFaDigits(list.length)} فایل
          </Badge>
        )}
      </CardContent>
    </Card>
  );
}
