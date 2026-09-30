/**
 * قواعد آپلود فایل کلاس.
 *
 * این پروژه بک‌اند ندارد، پس فایل واقعاً جایی آپلود نمی‌شود. اعتبارسنجی
 * جدا از رابط کاربری نگه داشته شده تا بتوان آن را مستقیم تست کرد و تا
 * وقتی بعداً آپلود واقعی اضافه شد، همین قواعد آنجا هم استفاده شود.
 */

/** ۱۰ مگابایت. بزرگ‌تر از این برای ارسال در کلاس آنلاین کند است. */
export const MAX_UPLOAD_BYTES = 10 * 1024 * 1024;

/**
 * پسوندهای مجاز: اسناد درسی و اسلاید، به‌علاوهٔ تصویر برای تخته.
 *
 * پسوند به‌جای MIME بررسی می‌شود چون مرورگر برای همهٔ انواع فایل
 * content type قابل اعتمادی نمی‌دهد و کاربر می‌تواند آن را جعل کند.
 */
export const ALLOWED_UPLOAD_EXTS = [
  "pdf",
  "ppt",
  "pptx",
  "doc",
  "docx",
  "xls",
  "xlsx",
  "jpg",
  "jpeg",
  "png",
  "webp",
] as const;

export const ACCEPT_ATTR = ALLOWED_UPLOAD_EXTS.map((e) => `.${e}`).join(",");

const IMAGE_EXTS = new Set(["jpg", "jpeg", "png", "webp"]);

export const isImageExt = (ext: string) => IMAGE_EXTS.has(ext);

export const fileExt = (name: string): string => {
  const dot = name.lastIndexOf(".");
  if (dot < 0 || dot === name.length - 1) return "";
  return name.slice(dot + 1).toLowerCase();
};

/** حجم را با یک رقم اعشار و واحد فارسی نشان می‌دهد. */
export const formatBytes = (bytes: number): string => {
  if (bytes < 1024) return `${bytes} بایت`;
  const kb = bytes / 1024;
  if (kb < 1024) return `${kb.toFixed(0)} کیلوبایت`;
  return `${(kb / 1024).toFixed(1)} مگابایت`;
};

export type UploadCheck = { ok: true; ext: string } | { ok: false; reason: string };

/**
 * یک فایل را می‌سنجد. دلیل رد شدن را برمی‌گرداند تا بتوان همان را به
 * کاربر نشان داد، نه یک پیام کلی.
 */
export const checkUpload = (file: { name: string; size: number }): UploadCheck => {
  const ext = fileExt(file.name);
  if (!ext) return { ok: false, reason: "فایل باید پسوند داشته باشد." };
  if (!(ALLOWED_UPLOAD_EXTS as readonly string[]).includes(ext))
    return {
      ok: false,
      reason: `پسوند «.${ext}» مجاز نیست. مجاز: ${ALLOWED_UPLOAD_EXTS.join("، ")}`,
    };
  if (file.size > MAX_UPLOAD_BYTES)
    return { ok: false, reason: `حجم فایل ${formatBytes(file.size)} است و بیش از ۱۰ مگابایت است.` };
  if (file.size === 0) return { ok: false, reason: "فایل خالی است." };
  return { ok: true, ext };
};
