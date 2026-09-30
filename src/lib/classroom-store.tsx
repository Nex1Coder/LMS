import * as React from "react";
import { classSessions, type ClassSession } from "./mock-data";

/**
 * وضعیت زندهٔ کلاس‌ها در مرورگر ذخیره می‌شود، چون این پروژه بک‌اند ندارد
 * و همه‌چیز در حافظه و mock data است.
 *
 * چرا localStorage و نه فقط useState:
 *  لینکی که استاد تعریف می‌کند باید بعد از رفرش هم باقی بماند، وگرنه
 *  دانشجو کلاس را بی‌لینک می‌بیند. نقش ارائه‌دهنده و فایل‌های آپلودی هم
 *  به همین دلیل ذخیره می‌شوند.
 *
 * این کلیدها به حساب کاربر گره نخورده‌اند، پس بین دانشجو و استاد مشترک
 * هستند. برای یک نسخهٔ چندکاربرهٔ واقعی باید کلید به شناسهٔ کاربر برسد.
 */

const LINKS_KEY = "lms-session-links-v1";
const PRESENTERS_KEY = "lms-session-presenters-v1";
const FILES_KEY = "lms-session-files-v1";

/** فایل‌های داخل مرورگر با object URL ساخته می‌شوند و بین رفرش‌ها باقی نمی‌مانند. */
export type UploadedFile = {
  id: string;
  name: string;
  /** بر حسب بایت، برای نمایش حجم. */
  size: number;
  /** پسوند بدون نقطه، مثلاً pdf. */
  ext: string;
  uploader: string;
  /** فقط برای تصویر؛ در رفرش بعدی باطل می‌شود. */
  previewUrl?: string | undefined;
};

const readJson = <T,>(key: string, fallback: T): T => {
  if (typeof window === "undefined") return fallback;
  try {
    const raw = window.localStorage.getItem(key);
    if (!raw) return fallback;
    const parsed = JSON.parse(raw) as T;
    return parsed ?? fallback;
  } catch {
    return fallback;
  }
};

const writeJson = (key: string, value: unknown) => {
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch {
    /* حافظه در دسترس نیست؛ وضعیت فقط تا پایان این نشست می‌ماند */
  }
};

export type ClassroomState = {
  /** جلسات با لینک نهایی، یعنی لینک تعریف‌شدهٔ استاد یا مقدار اولیه. */
  sessions: ClassSession[];
  linkOf: (sessionId: string) => string;
  setLink: (sessionId: string, link: string) => void;
  hasCustomLink: (sessionId: string) => boolean;

  /** نقش ارائه‌دهنده: کلید جلسه به شمارهٔ دانشجویان دارای نقش. */
  presenters: Record<string, string[]>;
  isPresenter: (sessionId: string, studentId: string) => boolean;
  togglePresenter: (sessionId: string, studentId: string) => void;

  files: Record<string, UploadedFile[]>;
  addFiles: (sessionId: string, files: UploadedFile[]) => void;
  removeFile: (sessionId: string, fileId: string) => void;
};

const ClassroomContext = React.createContext<ClassroomState | null>(null);

/**
 * فقط لینک‌هایی که استاد واقعاً تغییر داده ذخیره می‌شوند. بقیه از
 * mock data خوانده می‌شوند تا با تغییر دادهٔ اولیه، مقدار ذخیره‌شدهٔ
 * کهنه روی آن سوار نشود.
 */
const seedLinks = (): Record<string, string> => {
  const out: Record<string, string> = {};
  for (const s of classSessions) if (s.link) out[s.id] = s.link;
  return out;
};

export function ClassroomProvider({ children }: { children: React.ReactNode }) {
  const [customLinks, setCustomLinks] = React.useState<Record<string, string>>(() => ({
    ...seedLinks(),
    ...readJson(LINKS_KEY, {} as Record<string, string>),
  }));
  const [presenters, setPresenters] = React.useState<Record<string, string[]>>(() =>
    readJson(PRESENTERS_KEY, {} as Record<string, string[]>),
  );
  const [files, setFiles] = React.useState<Record<string, UploadedFile[]>>(() =>
    readJson(FILES_KEY, {} as Record<string, UploadedFile[]>),
  );

  const setLink = React.useCallback((sessionId: string, link: string) => {
    setCustomLinks((prev) => {
      const next = { ...prev, [sessionId]: link };
      writeJson(LINKS_KEY, next);
      return next;
    });
  }, []);

  const togglePresenter = React.useCallback((sessionId: string, studentId: string) => {
    setPresenters((prev) => {
      const list = prev[sessionId] ?? [];
      const next = {
        ...prev,
        [sessionId]: list.includes(studentId)
          ? list.filter((id) => id !== studentId)
          : [...list, studentId],
      };
      writeJson(PRESENTERS_KEY, next);
      return next;
    });
  }, []);

  const addFiles = React.useCallback((sessionId: string, incoming: UploadedFile[]) => {
    setFiles((prev) => {
      const next = { ...prev, [sessionId]: [...(prev[sessionId] ?? []), ...incoming] };
      writeJson(FILES_KEY, next);
      return next;
    });
  }, []);

  const removeFile = React.useCallback((sessionId: string, fileId: string) => {
    setFiles((prev) => {
      const list = (prev[sessionId] ?? []).filter((f) => f.id !== fileId);
      // object URL ها دستی آزاد می‌شوند، وگرنه مرورگر تا بسته‌شدن
      // تبشان را نگه می‌دارد.
      for (const f of prev[sessionId] ?? []) {
        if (f.id === fileId && f.previewUrl) URL.revokeObjectURL(f.previewUrl);
      }
      const next = { ...prev, [sessionId]: list };
      writeJson(FILES_KEY, next);
      return next;
    });
  }, []);

  const value = React.useMemo<ClassroomState>(() => {
    const known = new Set(classSessions.map((s) => s.id));
    return {
      sessions: classSessions.map((s) => ({ ...s, link: customLinks[s.id] ?? s.link })),
      linkOf: (id) => customLinks[id] ?? classSessions.find((s) => s.id === id)?.link ?? "",
      hasCustomLink: (id) => Object.prototype.hasOwnProperty.call(customLinks, id),
      setLink,
      presenters,
      isPresenter: (sessionId, studentId) => (presenters[sessionId] ?? []).includes(studentId),
      togglePresenter,
      files: Object.fromEntries(Object.entries(files).filter(([k]) => known.has(k))),
      addFiles,
      removeFile,
    };
  }, [customLinks, presenters, files, setLink, togglePresenter, addFiles, removeFile]);

  return <ClassroomContext.Provider value={value}>{children}</ClassroomContext.Provider>;
}

export function useClassroom(): ClassroomState {
  const ctx = React.useContext(ClassroomContext);
  if (!ctx) throw new Error("useClassroom باید داخل ClassroomProvider استفاده شود");
  return ctx;
}
