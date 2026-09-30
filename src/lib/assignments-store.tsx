import * as React from "react";
import { assignments, type Assignment } from "./mock-data";

/**
 * پنل تکالیف. این پروژه بک‌اند ندارد، پس همهٔ تغییرات در مرورگر و با
 * localStorage ذخیره می‌شوند.
 *
 * سه نوع state:
 *  - تعریف تکلیف جدید استاد → customAssignments
 *  - پاسخ دانشجو به تکلیف → submissions
 *  - نمرهٔ داده‌شده به دانشجو → grades
 *
 * کلیدها به حساب کاربر گره نخورده‌اند، پس بین دانشجو و استاد مشترک
 * هستند و رفرش هم آن‌ها را پاک نمی‌کند.
 */

const CUSTOM_KEY = "lms-custom-assignments-v1";
const SUBMISSION_KEY = "lms-assignment-submissions-v1";
const GRADE_KEY = "lms-assignment-grades-v1";

/** پاسخی یک دانشجو به یک تکلیف؛ فقط نام فایل که در مرورگر باقی می‌ماند. */
export type Submission = {
  id: string; // id one سابقه: homework-{assignment}-{student}-{ts}
  assignmentId: string;
  studentId: string;
  studentName: string;
  fileName: string;
  submittedAt: number;
};

/** یک تکلیف از داده ثابت یا تعریف‌شدهٔ استاد با فایل توضیحی. */
export type Homework = Assignment & {
  description?: string | undefined;
  /** نام فایل توضیحی استاد؛ اگر undefined باشد تکلیف فایل ندارد. */
  attachmentName?: string | undefined;
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
    /* حافظه در دسترس نیست */
  }
};

export type AssignmentsState = {
  /** تکالیف ثابت دمو + تکالیف جدیدی که استاد تعریف کرده. */
  homeworks: Homework[];
  attachments: Record<string, string>;
  createAssignment: (hw: {
    title: string;
    course: string;
    due: string;
    description?: string;
    attachmentName?: string;
  }) => void;
  /** فایل پیوست ستاد. */
  setAttachment: (id: string, fileName: string) => void;

  /** ارسال پاسخ دانشجو. */
  submissions: Record<string, Submission[]>;
  addSubmission: (sub: Omit<Submission, "id" | "submittedAt">) => void;
  removeSubmission: (assignmentId: string, id: string) => void;

  /** نمرهٔ دانشجو به ازای تکلیف؛ فقط استاد می‌نویسد. */
  grades: Record<string, Record<string, string>>;
  setGrade: (assignmentId: string, studentId: string, grade: string) => void;
  gradeOf: (assignmentId: string, studentId: string) => string | null;
};

const AssignmentsContext = React.createContext<AssignmentsState | null>(null);

export function AssignmentsProvider({ children }: { children: React.ReactNode }) {
  const [customAssignments, setCustomAssignments] = React.useState<Assignment[]>(() =>
    readJson(CUSTOM_KEY, [] as Assignment[]),
  );
  const [submissions, setSubmissions] = React.useState<Record<string, Submission[]>>(() =>
    readJson(SUBMISSION_KEY, {} as Record<string, Submission[]>),
  );
  const [grades, setGrades] = React.useState<Record<string, Record<string, string>>>(() =>
    readJson(GRADE_KEY, {} as Record<string, Record<string, string>>),
  );
  const [attachments, setAttachments] = React.useState<Record<string, string>>(() => ({}));

  const createAssignment = React.useCallback(
    (hw: {
      title: string;
      course: string;
      due: string;
      description?: string;
      attachmentName?: string;
    }) => {
      const row: Homework = {
        id: `hw-${Date.now().toString(36)}`,
        title: hw.title,
        course: hw.course,
        due: hw.due,
        remaining: "در انتظار ارسال",
        status: "در انتظار ارسال",
        grade: null,
        description: hw.description,
        attachmentName: hw.attachmentName,
      };
      setCustomAssignments((prev) => {
        const next = [{ ...row } as Assignment, ...prev];
        writeJson(CUSTOM_KEY, next);
        return next;
      });
      if (hw.attachmentName) {
        setAttachments((prev) => ({ ...prev, [row.id]: hw.attachmentName! }));
      }
    },
    [],
  );

  const setAttachment = React.useCallback((id: string, fileName: string) => {
    setAttachments((prev) => ({ ...prev, [id]: fileName }));
  }, []);

  const addSubmission = React.useCallback((sub: Omit<Submission, "id" | "submittedAt">) => {
    const row: Submission = { ...sub, id: `sub-${Date.now().toString(36)}`, submittedAt: Date.now() };
    setSubmissions((prev) => {
      const next = {
        ...prev,
        [sub.assignmentId]: [...(prev[sub.assignmentId] ?? []), row],
      };
      writeJson(SUBMISSION_KEY, next);
      return next;
    });
  }, []);

  const removeSubmission = React.useCallback((assignmentId: string, id: string) => {
    setSubmissions((prev) => {
      const next = {
        ...prev,
        [assignmentId]: (prev[assignmentId] ?? []).filter((x) => x.id !== id),
      };
      writeJson(SUBMISSION_KEY, next);
      return next;
    });
  }, []);

  const setGrade = React.useCallback((assignmentId: string, studentId: string, grade: string) => {
    setGrades((prev) => {
      const next = {
        ...prev,
        [assignmentId]: { ...(prev[assignmentId] ?? {}), [studentId]: grade },
      };
      writeJson(GRADE_KEY, next);
      return next;
    });
  }, []);

  const value = React.useMemo<AssignmentsState>(() => {
    // تکالیف ثابت + تکالیف جدید؛ تکالیف جدید اول نمایش داده می‌شوند.
    const base = assignments.map((a) => a as Homework);
    const custom = customAssignments.map((a) => a as Homework);
    return {
      homeworks: [...custom, ...base],
      attachments,
      createAssignment,
      setAttachment,
      submissions,
      addSubmission,
      removeSubmission,
      grades,
      setGrade,
      gradeOf: (assignmentId, studentId) => grades[assignmentId]?.[studentId] ?? null,
    };
  }, [customAssignments, submissions, grades, attachments, createAssignment, setAttachment, addSubmission, removeSubmission, setGrade]);

  return <AssignmentsContext.Provider value={value}>{children}</AssignmentsContext.Provider>;
}

export function useAssignments(): AssignmentsState {
  const ctx = React.useContext(AssignmentsContext);
  if (!ctx) throw new Error("useAssignments باید داخل AssignmentsProvider استفاده شود");
  return ctx;
}
