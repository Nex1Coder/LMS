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
const HANDS_KEY = "lms-session-hands-v1";
const MUTED_KEY = "lms-session-muted-v1";
const ADMINS_KEY = "lms-session-admins-v1";
const SHARED_FILE_KEY = "lms-session-shared-file-v1";

/** وضعیت یک درخواست صحبت. */
export type HandStatus = "pending" | "approved" | "denied";

/** درخواست صحبت یک دانشجو در یک جلسه. */
export type HandRequest = {
  studentId: string;
  status: HandStatus;
  /** زمان درخواست به میلی‌ثانیه؛ برای مرتب‌سازی و نمایش. */
  at: number;
};

/**
 * فایلی که همین الان به کلاس نشان داده می‌شود.
 *
 * «اشتراک فایل» با «بارگذاری فایل» فرق دارد: بارگذاری یعنی فایل در فهرست
 * کلاس می‌ماند، ولی اشتراک یعنی فایل روی صفحهٔ اصلی کلاس باز می‌شود تا
 * همه ببینند. فقط یک فایل در هر لحظه به اشتراک گذاشته می‌شود.
 */
export type SharedFile = {
  id: string;
  name: string;
  ext: string;
  uploader: string;
  /** فقط برای تصویر؛ بقیهٔ فرمت‌ها به‌صورت کارت نمایش داده می‌شوند. */
  previewUrl?: string | undefined;
};

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

  /**
   * دسترسی ادمین کلاس. ادمین مثل استاد می‌تواند نقش ارائه‌دهنده بدهد،
   * درخواست صحبت را تأیید کند و فایل به اشتراک بگذارد، ولی خودش لینک
   * جلسه را تغییر نمی‌دهد و نمی‌تواند نقش ادمین را به کسی بدهد.
   */
  admins: Record<string, string[]>;
  isAdmin: (sessionId: string, studentId: string) => boolean;
  toggleAdmin: (sessionId: string, studentId: string) => void;

  /**
   * درخواست صحبت: دانشجو دستش را بالا می‌برد و در فهرست استاد دیده
   * می‌شود. استاد یا ادمین تأیید یا رد می‌کند و نتیجه در state می‌ماند.
   */
  hands: Record<string, HandRequest[]>;
  myHand: (sessionId: string, studentId: string) => HandRequest | null;
  raiseHand: (sessionId: string, studentId: string) => void;
  lowerHand: (sessionId: string, studentId: string) => void;
  resolveHand: (sessionId: string, studentId: string, status: HandStatus) => void;

  /** سکوت تک‌تک دانشجویان توسط استاد یا ادمین. */
  muted: Record<string, string[]>;
  isMuted: (sessionId: string, studentId: string) => boolean;
  toggleMute: (sessionId: string, studentId: string) => void;

  /** فایلی که الان روی صفحهٔ کلاس باز است. */
  sharedFile: Record<string, SharedFile | null>;
  setSharedFile: (sessionId: string, file: SharedFile | null) => void;

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
  const [admins, setAdmins] = React.useState<Record<string, string[]>>(() =>
    readJson(ADMINS_KEY, {} as Record<string, string[]>),
  );
  const [hands, setHands] = React.useState<Record<string, HandRequest[]>>(() =>
    readJson(HANDS_KEY, {} as Record<string, HandRequest[]>),
  );
  const [muted, setMuted] = React.useState<Record<string, string[]>>(() =>
    readJson(MUTED_KEY, {} as Record<string, string[]>),
  );
  const [sharedFile, setSharedFileState] = React.useState<Record<string, SharedFile | null>>(() =>
    readJson(SHARED_FILE_KEY, {} as Record<string, SharedFile | null>),
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

  const toggleAdmin = React.useCallback((sessionId: string, studentId: string) => {
    setAdmins((prev) => {
      const list = prev[sessionId] ?? [];
      const next = {
        ...prev,
        [sessionId]: list.includes(studentId)
          ? list.filter((id) => id !== studentId)
          : [...list, studentId],
      };
      writeJson(ADMINS_KEY, next);
      return next;
    });
  }, []);

  const raiseHand = React.useCallback((sessionId: string, studentId: string) => {
    setHands((prev) => {
      const list = prev[sessionId] ?? [];
      // دانشجو نمی‌تواند هم‌زمان چند درخواست باز داشته باشد؛ درخواست قبلی
      // همان به‌روز می‌شود.
      const next = {
        ...prev,
        [sessionId]: [
          ...list.filter((h) => h.studentId !== studentId),
          { studentId, status: "pending" as const, at: Date.now() },
        ],
      };
      writeJson(HANDS_KEY, next);
      return next;
    });
  }, []);

  const lowerHand = React.useCallback((sessionId: string, studentId: string) => {
    setHands((prev) => {
      const next = {
        ...prev,
        [sessionId]: (prev[sessionId] ?? []).filter((h) => h.studentId !== studentId),
      };
      writeJson(HANDS_KEY, next);
      return next;
    });
  }, []);

  const resolveHand = React.useCallback(
    (sessionId: string, studentId: string, status: HandStatus) => {
      setHands((prev) => {
        const next = {
          ...prev,
          [sessionId]: (prev[sessionId] ?? []).map((h) =>
            h.studentId === studentId ? { ...h, status } : h,
          ),
        };
        writeJson(HANDS_KEY, next);
        return next;
      });
    },
    [],
  );

  const toggleMute = React.useCallback((sessionId: string, studentId: string) => {
    setMuted((prev) => {
      const list = prev[sessionId] ?? [];
      const next = {
        ...prev,
        [sessionId]: list.includes(studentId)
          ? list.filter((id) => id !== studentId)
          : [...list, studentId],
      };
      writeJson(MUTED_KEY, next);
      return next;
    });
  }, []);

  const setSharedFile = React.useCallback((sessionId: string, file: SharedFile | null) => {
    setSharedFileState((prev) => {
      const next = { ...prev, [sessionId]: file };
      writeJson(SHARED_FILE_KEY, next);
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
    // اگر فایلی که روی صفحهٔ کلاس باز بود حذف شود، نمایش آن هم باید قطع
    // شود؛ وگرنه دانشجو یک کارت خالی می‌بیند.
    setSharedFileState((prev) => {
      if (prev[sessionId]?.id !== fileId) return prev;
      const next = { ...prev, [sessionId]: null };
      writeJson(SHARED_FILE_KEY, next);
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
      admins,
      isAdmin: (sessionId, studentId) => (admins[sessionId] ?? []).includes(studentId),
      toggleAdmin,
      hands,
      myHand: (sessionId, studentId) =>
        (hands[sessionId] ?? []).find((h) => h.studentId === studentId) ?? null,
      raiseHand,
      lowerHand,
      resolveHand,
      muted,
      isMuted: (sessionId, studentId) => (muted[sessionId] ?? []).includes(studentId),
      toggleMute,
      sharedFile: Object.fromEntries(Object.entries(sharedFile).filter(([k]) => known.has(k))),
      setSharedFile,
      files: Object.fromEntries(Object.entries(files).filter(([k]) => known.has(k))),
      addFiles,
      removeFile,
    };
  }, [
    customLinks,
    presenters,
    admins,
    hands,
    muted,
    sharedFile,
    files,
    setLink,
    togglePresenter,
    toggleAdmin,
    raiseHand,
    lowerHand,
    resolveHand,
    toggleMute,
    setSharedFile,
    addFiles,
    removeFile,
  ]);

  return <ClassroomContext.Provider value={value}>{children}</ClassroomContext.Provider>;
}

export function useClassroom(): ClassroomState {
  const ctx = React.useContext(ClassroomContext);
  if (!ctx) throw new Error("useClassroom باید داخل ClassroomProvider استفاده شود");
  return ctx;
}
