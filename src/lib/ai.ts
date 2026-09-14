import { aiChat, aiInfo, type AiChatResult } from "@/lib/ai-rpc";
import {
  aiAnswers,
  assignments,
  conceptMapsByCourse,
  courses,
  explanationTopics,
  exams,
  flashcardsByCourse,
  practiceQuestionsByWeakness,
  smartSummaries,
  smartSearchIndex,
  studyPlanByCourse,
  type Flashcard,
  type Explanation,
  type PracticeQuestion,
  type StudyPlanStep,
  type SmartSummary,
  type SmartSearchResult,
} from "@/lib/mock-data";

export type UiChatMessage = { id: number; role: "user" | "bot"; text: string };

let configured: boolean | null = null;

function setConfigured(value: boolean) {
  configured = value;
}

export function isAiConfiguredSync(): boolean | null {
  return configured;
}

export async function fetchAiStatus() {
  try {
    const info = await aiInfo();
    setConfigured(info.configured);
    return info;
  } catch {
    setConfigured(false);
    return { configured: false, model: "—", baseUrl: "—" } as const;
  }
}

async function isRealAi(): Promise<boolean> {
  if (configured === null) await fetchAiStatus();
  return configured === true;
}

function courseContext(): string {
  const brief = courses.map((c) => ({
    title: c.title,
    code: c.code,
    professor: c.professor,
    semester: c.semester,
    slides: c.slides.map((s) => s.title),
    recordings: c.recordings.map((r) => r.title),
  }));
  const activeAssignments = assignments
    .filter((a) => a.status === "در انتظار ارسال")
    .map((a) => `${a.course}: ${a.title} (مهلت ${a.due} — ${a.remaining})`);
  const upcomingExams = exams
    .filter((e) => e.status !== "برگزار شده")
    .map((e) => `${e.course} — ${e.date} ساعت ${e.time} (${e.type}, ${e.questions} سؤال)`);
  return JSON.stringify(
    { courses: brief, assignments: activeAssignments, exams: upcomingExams },
    null,
    2,
  );
}

const STUDY_SYSTEM_PROMPT = `شما دستیار هوشمند سامانه آموزش مجازی دانشگاه هستید.
همیشه به زبان فارسی، دقیق و ساختارمند پاسخ بدهید. اگر اطلاعات لازم در محتوای دروس نبود، صادقانه بگویید و حدس نزنید.
محتوای دروس و برنامه آموزشی:\n${courseContext()}`;

async function call(
  messages: { role: "user" | "system" | "assistant"; content: string }[],
): Promise<AiChatResult> {
  return aiChat({ data: { messages } });
}

export function parseJson<T>(content: string): T | null {
  const clean = content
    .replace(/```(?:json)?/gi, "")
    .replace(/```/g, "")
    .trim();
  try {
    return JSON.parse(clean) as T;
  } catch {
    const start = clean.indexOf("{");
    const end = clean.lastIndexOf("}");
    if (start >= 0 && end > start) {
      try {
        return JSON.parse(clean.slice(start, end + 1)) as T;
      } catch {
        return null;
      }
    }
    return null;
  }
}

export async function chatWithAssistant(
  history: Pick<UiChatMessage, "role" | "text">[],
  question: string,
): Promise<{ answer: string; source: "ai" | "fallback" }> {
  const fallback = aiAnswers[question] ?? aiAnswers["default"]!;
  if (!(await isRealAi())) return { answer: fallback, source: "fallback" };

  const messages = [
    { role: "system" as const, content: STUDY_SYSTEM_PROMPT },
    ...history.slice(-10).map((m) => ({
      role: m.role === "user" ? ("user" as const) : ("assistant" as const),
      content: m.text,
    })),
    { role: "user" as const, content: question },
  ];
  const res = await call(messages);
  if (res.ok) return { answer: res.content, source: "ai" };
  return { answer: fallback, source: "fallback" };
}

export async function summarizeCourse(
  courseTitle: string,
  type: SmartSummary["type"],
): Promise<{ text: string; source: "ai" | "fallback" }> {
  const fallback = smartSummaries.find((s) => s.course === courseTitle && s.type === type);
  const course = courses.find((c) => c.title === courseTitle);
  if (!(await isRealAi())) {
    return fallback
      ? { text: fallback.text, source: "fallback" }
      : { text: "", source: "fallback" };
  }

  const content = course
    ? `درس «${course.title}» (${course.code}) — استاد ${course.professor}, نیم‌سال ${course.semester}.\nفراگرفته‌ها: ${course.slides.map((s) => s.title).join("، ")}؛\nجلسات ضبط‌شده: ${course.recordings.map((r) => r.title).join("، ")}.`
    : `درس «${courseTitle}».`;
  const prompt =
    `خلاصه‌ای دقیق و کامل از «${type}» درس ${courseTitle} بنویس.\n${content}\n` +
    `خلاصه باید شامل مفاهیم کلیدی، نکات مهم و ارتباط مطالب باشد و در پایان پیشنهادهایی برای تمرین بیشتر بدهد.`;

  const res = await call([
    { role: "system", content: STUDY_SYSTEM_PROMPT },
    { role: "user", content: prompt },
  ]);
  if (res.ok) return { text: res.content, source: "ai" };
  return fallback ? { text: fallback.text, source: "fallback" } : { text: "", source: "fallback" };
}

export async function generateFlashcards(
  courseTitle: string,
): Promise<{ cards: Flashcard[]; source: "ai" | "fallback" }> {
  const fallback = flashcardsByCourse[courseTitle] ?? [];
  if (!(await isRealAi())) return { cards: fallback, source: "fallback" };

  const course = courses.find((c) => c.title === courseTitle);
  const content = course
    ? `درس «${course.title}» (${course.code}). محتوا: ${[...course.slides.map((s) => s.title), ...course.recordings.map((r) => r.title)].join("؛ ")}`
    : courseTitle;
  const prompt =
    `بر اساس محتوای زیر پرکاربردترین مفاهیم درس را به ۸ فلش کارت مروری تبدیل کن.\n${content}\n` +
    `فقط JSON خالص برنگردان (بدون متن اضافی و بدون backtick) با فرمت آرایه:\n` +
    `[{"front":"اصطلاح یا سؤال","back":"پاسخ کوتاه"}]\n`;
  const res = await call([
    { role: "system", content: STUDY_SYSTEM_PROMPT },
    { role: "user", content: prompt },
  ]);
  if (res.ok) {
    const cards = parseJson<Flashcard[]>(res.content);
    if (Array.isArray(cards) && cards.length > 0) {
      return {
        cards: cards.filter((c) => c && typeof c.front === "string" && typeof c.back === "string"),
        source: "ai",
      };
    }
  }
  return { cards: fallback, source: "fallback" };
}

export async function generateConceptMap(
  courseTitle: string,
): Promise<{ map: { root: string; children: string[] } | null; source: "ai" | "fallback" }> {
  const fallback = conceptMapsByCourse[courseTitle] ?? null;
  if (!(await isRealAi())) return { map: fallback, source: "fallback" };

  const course = courses.find((c) => c.title === courseTitle);
  const content = course
    ? `درس «${course.title}». سرفصل‌ها: ${course.slides.map((s) => s.title).join("، ")}`
    : courseTitle;
  const prompt =
    `مفهوم‌های درس زیر را به یک نقشه مفهومی تبدیل کن.\n${content}\n` +
    `فقط JSON خالص برگردان (بدون متن اضافی):\n{"root":"مفهوم مرکزی","children":["مفهوم ۱","مفهوم ۲","مفهوم ۳","مفهوم ۴","مفهوم ۵"]}\n`;
  const res = await call([
    { role: "system", content: STUDY_SYSTEM_PROMPT },
    { role: "user", content: prompt },
  ]);
  if (res.ok) {
    const parsed = parseJson<{ root?: string; children?: string[] }>(res.content);
    if (parsed && typeof parsed.root === "string" && Array.isArray(parsed.children)) {
      return {
        map: {
          root: parsed.root,
          children: parsed.children.filter((c) => typeof c === "string" && c.length > 0),
        },
        source: "ai",
      };
    }
  }
  return { map: fallback, source: "fallback" };
}

export async function generatePracticeQuestions(
  skill: string,
): Promise<{ questions: PracticeQuestion[]; source: "ai" | "fallback" }> {
  const fallback = practiceQuestionsByWeakness[skill] ?? [];
  if (!(await isRealAi())) return { questions: fallback, source: "fallback" };

  const prompt =
    `برای مهارت «${skill}» چهار سؤال چهارگزینه‌ای آموزشی بساز که نقاط ضعف رایج را هدف بگیرند.\n` +
    `فقط JSON خالص برگردان (بدون متن اضافی) با فرمت آرایه:\n` +
    `[{"q":"سؤال","options":["گزینه ۱","گزینه ۲","گزینه ۳","گزینه ۴"],"answer":0,"skill":"${skill}"}]\n` +
    `مقدار answer شاخص صفر-پایه گزینه صحیح است.\n`;
  const res = await call([
    { role: "system", content: STUDY_SYSTEM_PROMPT },
    { role: "user", content: prompt },
  ]);
  if (res.ok) {
    const parsed = parseJson<PracticeQuestion[]>(res.content);
    if (Array.isArray(parsed) && parsed.length > 0) {
      return {
        questions: parsed.filter(
          (q) =>
            q &&
            typeof q.q === "string" &&
            Array.isArray(q.options) &&
            q.options.length >= 2 &&
            typeof q.answer === "number",
        ),
        source: "ai",
      };
    }
  }
  return { questions: fallback, source: "fallback" };
}

export async function generateStudyPlan(
  courseTitle: string,
): Promise<{ plan: StudyPlanStep[]; source: "ai" | "fallback" }> {
  const fallback = studyPlanByCourse[courseTitle] ?? [];
  if (!(await isRealAi())) return { plan: fallback, source: "fallback" };

  const course = courses.find((c) => c.title === courseTitle);
  const targetExam = exams.find((e) => e.course === courseTitle && e.status !== "برگزار شده");
  const remaining = course
    ? `پیشرفت درس ${course.progress}٪; جلسه بعدی: ${course.nextSession}.`
    : "";
  const prompt =
    `یک برنامه مطالعه مرحله‌به‌مرحله برای درس «${courseTitle}» تا تاریخ امتحان (${targetExam ? targetExam.date : "پایان ترم"}) تنظیم کن.\n${remaining}\n` +
    `فقط JSON خالص برگردان (بدون متن اضافی) با فرمت آرایه:\n` +
    `[{"step":1,"title":"عنوان مرحله","action":"اقدام مشخص و قابل انجام","done":false}]\n` +
    `حداکثر ۵ مرحله. مرحله اول done: true باشد تا پیشرفت شروع شود.\n`;
  const res = await call([
    { role: "system", content: STUDY_SYSTEM_PROMPT },
    { role: "user", content: prompt },
  ]);
  if (res.ok) {
    const parsed = parseJson<StudyPlanStep[]>(res.content);
    if (Array.isArray(parsed) && parsed.length > 0) {
      return {
        plan: parsed
          .map((s, i) => ({ ...s, step: typeof s.step === "number" ? s.step : i + 1 }))
          .filter((s) => s && typeof s.title === "string" && typeof s.action === "string"),
        source: "ai",
      };
    }
  }
  return { plan: fallback, source: "fallback" };
}

export async function explainTopic(
  topic: string,
  level: keyof Explanation,
): Promise<{ text: string; source: "ai" | "fallback" }> {
  const fallback = explanationTopics[topic]?.[level] ?? "";
  if (!(await isRealAi())) return { text: fallback, source: "fallback" };

  const label =
    level === "simple" ? "ساده و قابل‌فهم برای یک مبتدی" : "پیشرفته و فنی با مثال‌های دقیق";
  const prompt = `مبحث «${topic}» را به زبان ${label} برای یک دانشجوی دانشگاه توضیح بده. پاسخ را با مثال و کاربرد عملی کامل کن.`;
  const res = await call([
    { role: "system", content: STUDY_SYSTEM_PROMPT },
    { role: "user", content: prompt },
  ]);
  if (res.ok) return { text: res.content, source: "ai" };
  return { text: fallback, source: "fallback" };
}

export async function answerConceptQuery(query: string): Promise<{ text: string } | null> {
  if (!(await isRealAi())) return null;
  const prompt =
    `کاربر پرسشی دارد که در محتوای دروس یافت نشد: «${query}».\n` +
    `بر اساس محتوای دروس، موضوع‌های مرتبط را شناسایی کن و یک پاسخ مفهومی کوتاه با ارجاع به جلسه/جزوه بده. اگر واقعاً مرتبط نبود، بگو.`;
  const res = await call([
    { role: "system", content: STUDY_SYSTEM_PROMPT },
    { role: "user", content: prompt },
  ]);
  return res.ok ? { text: res.content } : null;
}

export function localConceptSearch(query: string): SmartSearchResult[] {
  const q = query.trim().toLowerCase();
  if (!q) return [];
  return smartSearchIndex.find(
    (r) => r.topic.toLowerCase().includes(q) || r.snippet.toLowerCase().includes(q),
  )
    ? smartSearchIndex.filter(
        (r) => r.topic.toLowerCase().includes(q) || r.snippet.toLowerCase().includes(q),
      )
    : [];
}
