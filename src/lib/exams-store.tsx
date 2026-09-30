import * as React from "react";
import { exams as baseExams, type Exam } from "./mock-data";

const KEY = "lms-exams-v1";

const readJson = <T,>(fallback: T): T => {
  if (typeof window === "undefined") return fallback;
  try {
    const raw = window.localStorage.getItem(KEY);
    if (!raw) return fallback;
    return JSON.parse(raw) as T;
  } catch { return fallback; }
};
const writeJson = (v: unknown) => {
  try { window.localStorage.setItem(KEY, JSON.stringify(v)); } catch {}
};

export type ExamWithMeta = Exam & { description?: string };

export type ExamsState = {
  exams: ExamWithMeta[];
  createExam: (e: { course: string; type: "تستی آنلاین" | "تشریحی آنلاین" | "پروژه‌محور"; date: string; time: string; duration: string; questions: number; description?: string }) => void;
};

const ExamsContext = React.createContext<ExamsState | null>(null);

export function ExamsProvider({ children }: { children: React.ReactNode }) {
  const [custom, setCustom] = React.useState<Exam[]>(() => readJson<Exam[]>([]));
  const createExam = React.useCallback((e: { course: string; type: "تستی آنلاین" | "تشریحی آنلاین" | "پروژه‌محور"; date: string; time: string; duration: string; questions: number; description?: string }) => {
    const row: ExamWithMeta = {
      id: `ex-${Date.now().toString(36)}`,
      course: e.course,
      type: e.type,
      date: e.date,
      time: e.time,
      duration: e.duration,
      questions: e.questions,
      status: "برنامه‌ریزی شده",
    };
    if (e.description) row.description = e.description;
    setCustom(prev => {
      const next = [row, ...prev];
      writeJson(next);
      return next;
    });
  }, []);
  const value = React.useMemo(() => ({
    exams: [...custom, ...baseExams],
    createExam,
  }), [custom, createExam]);
  return <ExamsContext.Provider value={value}>{children}</ExamsContext.Provider>;
}

export function useExams() {
  const ctx = React.useContext(ExamsContext);
  if (!ctx) throw new Error("useExams must be used within ExamsProvider");
  return ctx;
}
