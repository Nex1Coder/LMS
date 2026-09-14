import * as React from "react";
import { createFileRoute } from "@tanstack/react-router";
import {
  Bot,
  BookOpenText,
  ClipboardList,
  FileQuestion,
  GitBranch,
  Lightbulb,
  ListChecks,
  Loader2,
  MessageCircle,
  RefreshCw,
  Search,
  Send,
  Sparkles,
  Upload,
  User,
  Zap,
} from "lucide-react";
import { toast } from "sonner";
import { AppShell } from "@/components/layout/AppShell";
import { useRole } from "@/lib/role";
import { courses, weakPoints, aiSuggestions, explanationTopics } from "@/lib/mock-data";
import {
  answerConceptQuery,
  chatWithAssistant,
  explainTopic,
  fetchAiStatus,
  generateConceptMap,
  generateExamQuestions,
  generateFlashcards,
  generatePracticeQuestions,
  generateStudyPlan,
  localConceptSearch,
  summarizeCourse,
  type UiChatMessage,
} from "@/lib/ai";
import type {
  ExamQuestion,
  Flashcard,
  PracticeQuestion,
  SmartSearchResult,
  StudyPlanStep,
} from "@/lib/mock-data";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/smart-panel")({
  head: () => ({
    meta: [
      { title: "پنل هوشمند مطالعه | سامانه آموزش مجازی دانشگاه" },
      {
        name: "description",
        content:
          "ابزارهای هوش مصنوعی برای یادگیری: خلاصه‌سازی، فلش کارت، تمرین هوشمند، نقشه مفهومی و جستجوی مفهومی.",
      },
    ],
  }),
  component: SmartPanelPage,
});

type ToolId =
  | "chat"
  | "summarize"
  | "flashcards"
  | "conceptmap"
  | "practice"
  | "studyplan"
  | "explain"
  | "search"
  | "examdesigner";

const tools: { id: ToolId; label: string; icon: typeof Bot; desc: string }[] = [
  {
    id: "chat",
    label: "گفتگو با دستیار",
    icon: MessageCircle,
    desc: "پاسخ به سوالات درسی و آیین‌نامه‌ای",
  },
  { id: "summarize", label: "خلاصه‌سازی", icon: BookOpenText, desc: "خلاصه جزوه و ویدئوی کلاس" },
  { id: "flashcards", label: "فلش کارت", icon: Zap, desc: "تولید کارت‌های مروری" },
  { id: "conceptmap", label: "نقشه مفهومی", icon: GitBranch, desc: "نمایش ارتباط مفاهیم" },
  { id: "practice", label: "تمرین هوشمند", icon: FileQuestion, desc: "تمرین متناسب با نقاط ضعف" },
  { id: "studyplan", label: "برنامه مطالعه", icon: ListChecks, desc: "برنامه تا تاریخ امتحان" },
  { id: "explain", label: "توضیح مبحث", icon: Lightbulb, desc: "توضیح ساده یا پیشرفته" },
  { id: "search", label: "جستجوی مفهومی", icon: Search, desc: "جستجو در جلسات و جزوات" },
  {
    id: "examdesigner",
    label: "طراح سوال آزمون",
    icon: ClipboardList,
    desc: "تولید سوال از محتوای درس (ویژه استاد)",
  },
];

function SmartPanelPage() {
  const { role } = useRole();
  const visibleTools = React.useMemo(
    () =>
      role === "professor"
        ? tools.filter((t) => t.id !== "studyplan" && t.id !== "explain" && t.id !== "flashcards")
        : tools.filter((t) => t.id !== "examdesigner"),
    [role],
  );
  const [active, setActive] = React.useState<ToolId>("chat");

  return (
    <AppShell title="پنل هوشمند مطالعه" subtitle="ابزارهای هوش مصنوعی برای یادگیری بهتر">
      <AiStatusBar />
      <div className="grid gap-5 lg:grid-cols-4">
        <Card className="lg:col-span-1 h-fit">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Sparkles className="size-4 text-accent" /> ابزارها
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-1.5">
            {visibleTools.map((t) => (
              <button
                key={t.id}
                onClick={() => setActive(t.id)}
                className={cn(
                  "flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-right transition",
                  active === t.id
                    ? "bg-accent/15 text-navy font-medium"
                    : "hover:bg-muted/60 text-muted-foreground",
                )}
              >
                <t.icon className="size-4 shrink-0" />
                <span className="min-w-0">
                  <span className="block truncate text-sm">{t.label}</span>
                  <span className="block text-[10px] opacity-70">{t.desc}</span>
                </span>
              </button>
            ))}
          </CardContent>
        </Card>

        <Card className="lg:col-span-3 min-h-[460px]">
          <CardContent className="pt-6">
            {active === "chat" && <ChatTool />}
            {active === "summarize" && <SummarizeTool />}
            {active === "flashcards" && <FlashcardsTool />}
            {active === "conceptmap" && <ConceptMapTool />}
            {active === "practice" && <PracticeTool />}
            {active === "studyplan" && <StudyPlanTool />}
            {active === "explain" && <ExplainTool />}
            {active === "search" && <SearchTool />}
            {active === "examdesigner" && <ExamDesignerTool />}
          </CardContent>
        </Card>
      </div>
    </AppShell>
  );
}

function AiStatusBar() {
  const [info, setInfo] = React.useState<{ configured: boolean; model: string } | null>(null);

  const load = React.useCallback(async () => {
    setInfo(await fetchAiStatus());
  }, []);

  React.useEffect(() => {
    void load();
  }, [load]);

  if (!info) return null;

  return (
    <div className="mb-5 flex flex-wrap items-center gap-2 rounded-xl border border-border bg-card/60 p-3 text-xs">
      {info.configured ? (
        <Badge className="gap-1 bg-green-100 text-green-700 hover:bg-green-100">
          <Zap className="size-3" /> متصل به مدل واقعی ({info.model})
        </Badge>
      ) : (
        <Badge variant="secondary" className="gap-1">
          <Bot className="size-3" /> حالت نمونه — بدون کلید API
        </Badge>
      )}
      <span className="text-muted-foreground">
        {info.configured
          ? "پاسخ‌ها توسط مدل هوش مصنوعی تولید می‌شوند. برای تغییر مدل، متغیرهای AI_MODEL و AI_BASE_URL را در فایل .env تنظیم کنید."
          : "برای اتصال به مدل واقعی، فایل .env را با متغیر AI_API_KEY بسازید (نمونه در .env.example)."}
      </span>
      <Button
        variant="ghost"
        size="sm"
        className="mr-auto h-7 gap-1 px-2 text-xs"
        onClick={() => void load()}
      >
        <RefreshCw className="size-3" /> بررسی دوباره
      </Button>
    </div>
  );
}

function SourceBadge({ source }: { source: "ai" | "fallback" }) {
  return source === "ai" ? (
    <Badge variant="outline" className="gap-1 text-[10px] text-accent">
      <Zap className="size-3" /> پاسخ هوش مصنوعی
    </Badge>
  ) : (
    <Badge variant="outline" className="gap-1 text-[10px] text-muted-foreground">
      <Bot className="size-3" /> پاسخ نمونه
    </Badge>
  );
}

type ChatLine = UiChatMessage & { source?: "ai" | "fallback" };

function ChatTool() {
  const [messages, setMessages] = React.useState<ChatLine[]>([
    {
      id: 1,
      role: "bot",
      text: "سلام! من دستیار هوشمند پنل مطالعه هستم. درباره محتوای دروس، تکالیف یا آیین‌نامه آموزشی از من بپرسید.",
    },
  ]);
  const [input, setInput] = React.useState("");
  const [busy, setBusy] = React.useState(false);
  const endRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, busy]);

  const send = async (text: string) => {
    const q = text.trim();
    if (!q || busy) return;
    setMessages((m) => [...m, { id: Date.now(), role: "user", text: q }]);
    setInput("");
    setBusy(true);
    const history = messages.map((m) => ({ role: m.role, text: m.text }));
    const res = await chatWithAssistant(history, q);
    setBusy(false);
    setMessages((m) => [
      ...m,
      { id: Date.now() + 1, role: "bot", text: res.answer, source: res.source },
    ]);
  };

  return (
    <div className="flex h-[500px] flex-col">
      <div className="flex-1 space-y-4 overflow-y-auto scrollbar-thin">
        {messages.map((m) => (
          <div key={m.id} className={cn("flex flex-col gap-2", m.role === "user" && "items-end")}>
            <div className={cn("flex max-w-[85%] gap-3", m.role === "user" && "flex-row-reverse")}>
              <span
                className={cn(
                  "flex size-8 shrink-0 items-center justify-center rounded-full",
                  m.role === "bot" ? "bg-accent/20 text-navy" : "bg-navy text-primary-foreground",
                )}
              >
                {m.role === "bot" ? <Bot className="size-4" /> : <User className="size-4" />}
              </span>
              <div
                className={cn(
                  "whitespace-pre-line rounded-2xl px-4 py-3 text-sm leading-7",
                  m.role === "bot" ? "bg-muted" : "bg-navy text-primary-foreground",
                )}
              >
                {m.text}
              </div>
            </div>
            {m.role === "bot" && m.source && <SourceBadge source={m.source} />}
          </div>
        ))}
        {busy && (
          <p className="flex items-center gap-2 text-xs text-muted-foreground">
            <Loader2 className="size-3 animate-spin" /> دستیار در حال نوشتن پاسخ است…
          </p>
        )}
        <div ref={endRef} />
      </div>
      <div className="mt-4 flex gap-2">
        <Input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && void send(input)}
          placeholder="پرسش خود را بنویسید…"
        />
        <Button onClick={() => void send(input)} aria-label="ارسال" disabled={busy}>
          <Send className="size-4" />
        </Button>
      </div>
      <div className="mt-3 flex flex-wrap gap-2">
        {aiSuggestions.slice(0, 3).map((s) => (
          <button
            key={s}
            onClick={() => void send(s)}
            className="rounded-full bg-secondary px-3 py-1 text-[11px] text-secondary-foreground hover:bg-accent/20"
          >
            {s}
          </button>
        ))}
      </div>
    </div>
  );
}

function SummarizeTool() {
  const [courseTitle, setCourseTitle] = React.useState("");
  const [summaryType, setSummaryType] = React.useState<"جزوه" | "ویدیوی کلاس">("جزوه");
  const [result, setResult] = React.useState<{ text: string; source: "ai" | "fallback" } | null>(
    null,
  );
  const [loading, setLoading] = React.useState(false);

  const generate = async () => {
    if (!courseTitle || loading) return;
    setLoading(true);
    setResult(null);
    const res = await summarizeCourse(courseTitle, summaryType);
    setLoading(false);
    if (!res.text) {
      toast.warning("داده‌ای برای این درس وجود ندارد");
      return;
    }
    setResult(res);
  };

  return (
    <div className="space-y-4">
      <h3 className="text-base font-bold">خلاصه‌سازی جزوه و ویدئوی کلاس</h3>
      <div className="flex flex-wrap gap-3">
        <Select value={courseTitle} onValueChange={setCourseTitle}>
          <SelectTrigger className="w-56">
            <SelectValue placeholder="انتخاب درس" />
          </SelectTrigger>
          <SelectContent>
            {courses.map((c) => (
              <SelectItem key={c.id} value={c.title}>
                {c.title}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Tabs
          value={summaryType}
          onValueChange={(v) => setSummaryType(v as "جزوه" | "ویدیوی کلاس")}
        >
          <TabsList>
            <TabsTrigger value="جزوه">جزوه</TabsTrigger>
            <TabsTrigger value="ویدیوی کلاس">ویدیو</TabsTrigger>
          </TabsList>
        </Tabs>
        <Button onClick={() => void generate()} disabled={!courseTitle || loading}>
          {loading ? <Loader2 className="size-4 animate-spin" /> : <Sparkles className="size-4" />}{" "}
          تولید خلاصه
        </Button>
      </div>
      {loading && <div className="h-24 animate-pulse rounded-xl bg-muted" />}
      {result && (
        <div className="space-y-2">
          {result.source === "ai" ? <SourceBadge source="ai" /> : <SourceBadge source="fallback" />}
          <div className="rounded-xl border border-border bg-muted/50 p-4 text-sm leading-8 whitespace-pre-line">
            {result.text}
          </div>
        </div>
      )}
    </div>
  );
}

function FlashcardsTool() {
  const [courseTitle, setCourseTitle] = React.useState("");
  const [cards, setCards] = React.useState<Flashcard[]>([]);
  const [source, setSource] = React.useState<"ai" | "fallback">("fallback");
  const [loading, setLoading] = React.useState(false);
  const [flipped, setFlipped] = React.useState<Record<number, boolean>>({});

  React.useEffect(() => {
    let cancelled = false;
    if (!courseTitle) {
      setCards([]);
      setFlipped({});
      return;
    }
    setLoading(true);
    generateFlashcards(courseTitle).then((res) => {
      if (cancelled) return;
      setCards(res.cards);
      setSource(res.source);
      setFlipped({});
      setLoading(false);
    });
    return () => {
      cancelled = true;
    };
  }, [courseTitle]);

  return (
    <div className="space-y-4">
      <h3 className="text-base font-bold">فلش کارت‌های مروری</h3>
      <div className="flex items-center gap-2">
        <Select value={courseTitle} onValueChange={setCourseTitle}>
          <SelectTrigger className="w-56">
            <SelectValue placeholder="انتخاب درس" />
          </SelectTrigger>
          <SelectContent>
            {courses.map((c) => (
              <SelectItem key={c.id} value={c.title}>
                {c.title}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {loading && <Loader2 className="size-4 animate-spin text-muted-foreground" />}
        {!loading && cards.length > 0 && <SourceBadge source={source} />}
      </div>
      {cards.length > 0 && (
        <div className="grid gap-3 sm:grid-cols-2">
          {cards.map((card, i) => (
            <button
              key={i}
              onClick={() => setFlipped((f) => ({ ...f, [i]: !f[i] }))}
              className={cn(
                "group flex min-h-[120px] flex-col items-center justify-center rounded-xl border border-border p-5 text-center text-sm leading-7 transition-all",
                flipped[i] ? "bg-accent/15 border-accent" : "hover:shadow-md bg-background",
              )}
            >
              {flipped[i] ? (
                <span className="text-sm">{card.back}</span>
              ) : (
                <>
                  <Zap className="mb-2 size-5 text-accent opacity-60" />
                  <span className="font-medium">{card.front}</span>
                  <span className="mt-2 text-[10px] text-muted-foreground">
                    برای مشاهده پاسخ کلیک کنید
                  </span>
                </>
              )}
            </button>
          ))}
        </div>
      )}
      {courseTitle && !loading && cards.length === 0 && (
        <p className="text-sm text-muted-foreground">فلش کارتی برای این درس تولید نشد.</p>
      )}
    </div>
  );
}

function ConceptMapTool() {
  const [courseTitle, setCourseTitle] = React.useState("");
  const [map, setMap] = React.useState<{ root: string; children: string[] } | null>(null);
  const [source, setSource] = React.useState<"ai" | "fallback">("fallback");
  const [loading, setLoading] = React.useState(false);

  React.useEffect(() => {
    let cancelled = false;
    if (!courseTitle) {
      setMap(null);
      return;
    }
    setLoading(true);
    generateConceptMap(courseTitle).then((res) => {
      if (cancelled) return;
      setMap(res.map);
      setSource(res.source);
      setLoading(false);
    });
    return () => {
      cancelled = true;
    };
  }, [courseTitle]);

  return (
    <div className="space-y-4">
      <h3 className="text-base font-bold">نقشه مفهومی</h3>
      <div className="flex items-center gap-2">
        <Select value={courseTitle} onValueChange={setCourseTitle}>
          <SelectTrigger className="w-56">
            <SelectValue placeholder="انتخاب درس" />
          </SelectTrigger>
          <SelectContent>
            {courses.map((c) => (
              <SelectItem key={c.id} value={c.title}>
                {c.title}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {loading && <Loader2 className="size-4 animate-spin text-muted-foreground" />}
        {!loading && map && <SourceBadge source={source} />}
      </div>
      {map && (
        <div className="rounded-xl border border-border p-6">
          <div className="flex flex-col items-center gap-4">
            <div className="rounded-xl border-2 border-accent bg-accent/10 px-6 py-3 text-center">
              <p className="text-base font-bold text-navy">{map.root}</p>
            </div>
            <div className="h-px w-px bg-border" />
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
              {map.children.map((child) => (
                <div
                  key={child}
                  className="rounded-lg border border-border bg-muted/60 p-3 text-center text-xs leading-6"
                >
                  {child}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function PracticeTool() {
  const [weak, setWeak] = React.useState<string>("");
  const [questions, setQuestions] = React.useState<PracticeQuestion[]>([]);
  const [source, setSource] = React.useState<"ai" | "fallback">("fallback");
  const [loading, setLoading] = React.useState(false);
  const [answered, setAnswered] = React.useState<Record<number, number>>({});

  React.useEffect(() => {
    let cancelled = false;
    if (!weak) {
      setQuestions([]);
      return;
    }
    setLoading(true);
    generatePracticeQuestions(weak).then((res) => {
      if (cancelled) return;
      setQuestions(res.questions);
      setSource(res.source);
      setAnswered({});
      setLoading(false);
    });
    return () => {
      cancelled = true;
    };
  }, [weak]);

  return (
    <div className="space-y-4">
      <h3 className="text-base font-bold">تمرین هوشمند بر اساس نقاط ضعف</h3>
      <div className="space-y-3">
        {weakPoints.map((w) => (
          <button
            key={w.skill}
            onClick={() => setWeak(w.skill)}
            className={cn(
              "flex items-center gap-4 rounded-xl border border-border p-3 transition hover:shadow-sm w-full text-right",
              weak === w.skill && "ring-2 ring-accent",
            )}
          >
            <span className="min-w-0 flex-1">
              <span className="block text-sm font-medium">{w.skill}</span>
              <span className="block text-xs text-muted-foreground">
                {w.course} — {w.level}
              </span>
            </span>
            <Progress value={w.progress} className="w-24" />
            <Badge variant="secondary">{w.progress}٪</Badge>
          </button>
        ))}
      </div>
      {loading && (
        <p className="flex items-center gap-2 text-xs text-muted-foreground">
          <Loader2 className="size-3 animate-spin" /> در حال تولید سوالات…
        </p>
      )}
      {questions.length > 0 && !loading && (
        <div className="space-y-3 pt-2">
          <SourceBadge source={source} />
          {questions.map((q, qi) => (
            <div key={qi} className="rounded-xl border border-border p-4">
              <p className="mb-3 text-sm font-medium">{q.q}</p>
              <div className="grid gap-2 sm:grid-cols-2">
                {q.options.map((opt, oi) => (
                  <button
                    key={oi}
                    onClick={() => setAnswered((a) => ({ ...a, [qi]: oi }))}
                    className={cn(
                      "rounded-lg border border-border p-2 text-right text-xs transition",
                      answered[qi] !== undefined &&
                        (oi === q.answer
                          ? "border-green-500 bg-green-50 text-green-700"
                          : oi === answered[qi]
                            ? "border-red-400 bg-red-50 text-red-600"
                            : "opacity-60"),
                    )}
                  >
                    {opt}
                  </button>
                ))}
              </div>
              {answered[qi] !== undefined && (
                <p className="mt-2 text-xs text-muted-foreground">
                  {answered[qi] === q.answer
                    ? "پاسخ صحیح!"
                    : "پاسخ نادرست — پاسخ صحیح گزینه زیر است."}
                </p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function ExamDesignerTool() {
  const [courseTitle, setCourseTitle] = React.useState("");
  const [extraContent, setExtraContent] = React.useState("");
  const [count, setCount] = React.useState(5);
  const [difficulty, setDifficulty] = React.useState<"آسان" | "متوسط" | "سخت">("متوسط");
  const [kind, setKind] = React.useState<"mc" | "essay" | "mixed">("mc");
  const [questions, setQuestions] = React.useState<ExamQuestion[]>([]);
  const [source, setSource] = React.useState<"ai" | "fallback">("fallback");
  const [loading, setLoading] = React.useState(false);
  const fileRef = React.useRef<HTMLInputElement>(null);

  const course = courses.find((c) => c.title === courseTitle);

  const generate = async () => {
    if (!courseTitle || loading) return;
    setLoading(true);
    setQuestions([]);
    const res = await generateExamQuestions({
      courseTitle,
      count,
      difficulty,
      kind,
      ...(extraContent.trim() ? { extraContent: extraContent.trim() } : {}),
    });
    setLoading(false);
    if (res.questions.length === 0) {
      toast.warning("سوالی تولید نشد؛ درس را انتخاب کنید یا محتوای بیشتری بارگذاری نمایید");
      return;
    }
    setQuestions(res.questions);
    setSource(res.source);
  };

  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-base font-bold">طراح سوال آزمون از محتوای درس</h3>
        <p className="mt-1 text-xs text-muted-foreground">
          بر اساس سرفصل‌ها، ضبط کلاس و متن بارگذاری‌شده درس، سوالات امتحانی به‌همراه پاسخ می‌سازد.
        </p>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <Select value={courseTitle} onValueChange={setCourseTitle}>
          <SelectTrigger className="w-56">
            <SelectValue placeholder="انتخاب درس" />
          </SelectTrigger>
          <SelectContent>
            {courses.map((c) => (
              <SelectItem key={c.id} value={c.title}>
                {c.title} ({c.code})
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Tabs value={kind} onValueChange={(v) => setKind(v as "mc" | "essay" | "mixed")}>
          <TabsList>
            <TabsTrigger value="mc">چهارگزینه‌ای</TabsTrigger>
            <TabsTrigger value="essay">تشریحی</TabsTrigger>
            <TabsTrigger value="mixed">ترکیبی</TabsTrigger>
          </TabsList>
        </Tabs>
        <Select
          value={difficulty}
          onValueChange={(v) => setDifficulty(v as "آسان" | "متوسط" | "سخت")}
        >
          <SelectTrigger className="w-28">
            <SelectValue placeholder="سختی" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="آسان">آسان</SelectItem>
            <SelectItem value="متوسط">متوسط</SelectItem>
            <SelectItem value="سخت">سخت</SelectItem>
          </SelectContent>
        </Select>
        <Select value={String(count)} onValueChange={(v) => setCount(Number(v))}>
          <SelectTrigger className="w-28">
            <SelectValue placeholder="تعداد" />
          </SelectTrigger>
          <SelectContent>
            {[5, 10, 15, 20].map((n) => (
              <SelectItem key={n} value={String(n)}>
                {n} سوال
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="rounded-xl border border-dashed border-border p-4">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <p className="text-xs font-medium">محتوا و جزوه درس</p>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => fileRef.current?.click()}
          >
            <Upload className="size-3" /> بارگذاری فایل متن
          </Button>
          <input
            ref={fileRef}
            type="file"
            accept=".txt,.md,text/plain"
            className="hidden"
            onChange={(e) => {
              const f = e.target.files?.[0];
              if (f) {
                const reader = new FileReader();
                reader.onload = () => setExtraContent(String(reader.result ?? ""));
                reader.readAsText(f);
              }
              e.currentTarget.value = "";
            }}
          />
        </div>
        {course && !extraContent.trim() && (
          <p className="mt-2 text-[11px] text-muted-foreground">
            سوالات بر اساس {course.slides.length} جلسه و {course.recordings.length} ضبط «
            {course.title}» ({course.units} واحد) طراحی می‌شوند.
          </p>
        )}
        <Textarea
          value={extraContent}
          onChange={(e) => setExtraContent(e.target.value)}
          placeholder="می‌توانید متن جزوه یا محتوای کلاس را اینجا جایگذاری کنید (اختیاری)…"
          className="mt-3 min-h-24"
        />
      </div>

      <Button onClick={() => void generate()} disabled={!courseTitle || loading}>
        {loading ? <Loader2 className="size-4 animate-spin" /> : <Sparkles className="size-4" />}
        طراحی سوالات
      </Button>

      {loading && <div className="h-24 animate-pulse rounded-xl bg-muted" />}
      {questions.length > 0 && !loading && (
        <div className="space-y-3">
          <div className="flex flex-wrap items-center gap-2">
            <SourceBadge source={source} />
            <Badge variant="outline" className="text-[10px]">
              {questions.length} سوال تولید شد
            </Badge>
          </div>
          {questions.map((q, i) => (
            <div key={i} className="rounded-xl border border-border p-4">
              <div className="flex flex-wrap items-center gap-2">
                <span className="flex size-6 items-center justify-center rounded-full bg-accent/15 text-xs font-bold text-navy">
                  {i + 1}
                </span>
                <Badge variant="secondary">{q.type === "mc" ? "چهارگزینه‌ای" : "تشریحی"}</Badge>
                <Badge variant="outline">{difficulty}</Badge>
              </div>
              <p className="mt-3 text-sm font-medium leading-7">{q.q}</p>
              {q.type === "mc" && q.options.length > 0 && (
                <div className="mt-3 grid gap-2 sm:grid-cols-2">
                  {q.options.map((opt, oi) => (
                    <div
                      key={oi}
                      className={cn(
                        "rounded-lg border border-border p-2 text-xs",
                        oi === q.answer && "border-green-500 bg-green-50 text-green-700",
                      )}
                    >
                      {opt}
                    </div>
                  ))}
                </div>
              )}
              <div className="mt-3 rounded-lg bg-accent/10 p-3 text-xs leading-6">
                <span className="font-bold text-navy">پاسخ: </span>
                {q.type === "mc" ? (q.options[q.answer] ?? "—") : q.modelAnswer}
              </div>
            </div>
          ))}
        </div>
      )}
      {courseTitle && !loading && questions.length === 0 && !extraContent && (
        <p className="text-xs text-muted-foreground">
          درس انتخاب شد؛ دکمه «طراحی سوالات» را بزنید.
        </p>
      )}
    </div>
  );
}

function StudyPlanTool() {
  const [courseTitle, setCourseTitle] = React.useState("");
  const [plan, setPlan] = React.useState<StudyPlanStep[]>([]);
  const [source, setSource] = React.useState<"ai" | "fallback">("fallback");
  const [loading, setLoading] = React.useState(false);

  React.useEffect(() => {
    let cancelled = false;
    if (!courseTitle) {
      setPlan([]);
      return;
    }
    setLoading(true);
    generateStudyPlan(courseTitle).then((res) => {
      if (cancelled) return;
      setPlan(res.plan);
      setSource(res.source);
      setLoading(false);
    });
    return () => {
      cancelled = true;
    };
  }, [courseTitle]);

  return (
    <div className="space-y-4">
      <h3 className="text-base font-bold">برنامه مطالعه تا تاریخ امتحان</h3>
      <div className="flex items-center gap-2">
        <Select value={courseTitle} onValueChange={setCourseTitle}>
          <SelectTrigger className="w-56">
            <SelectValue placeholder="انتخاب درس" />
          </SelectTrigger>
          <SelectContent>
            {courses.map((c) => (
              <SelectItem key={c.id} value={c.title}>
                {c.title}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {loading && <Loader2 className="size-4 animate-spin text-muted-foreground" />}
        {!loading && plan.length > 0 && <SourceBadge source={source} />}
      </div>
      {plan.length > 0 && (
        <div className="space-y-3">
          {plan.map((step) => (
            <div
              key={step.step}
              className={cn(
                "flex items-start gap-4 rounded-xl border border-border p-4",
                step.done && "bg-muted/40",
              )}
            >
              <span
                className={cn(
                  "flex size-8 shrink-0 items-center justify-center rounded-full text-xs font-bold",
                  step.done ? "bg-green-100 text-green-700" : "bg-accent/15 text-navy",
                )}
              >
                {step.step}
              </span>
              <div className="min-w-0 flex-1">
                <p className={cn("text-sm font-medium", step.done && "line-through opacity-70")}>
                  {step.title}
                </p>
                <p className="mt-1 text-xs text-muted-foreground">{step.action}</p>
              </div>
              {step.done && (
                <Badge variant="secondary" className="shrink-0">
                  انجام شده
                </Badge>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function ExplainTool() {
  const [topic, setTopic] = React.useState("");
  const [level, setLevel] = React.useState<"simple" | "advanced">("simple");
  const [result, setResult] = React.useState<{ text: string; source: "ai" | "fallback" } | null>(
    null,
  );

  React.useEffect(() => {
    let cancelled = false;
    if (!topic) {
      setResult(null);
      return;
    }
    setResult(null);
    explainTopic(topic, level).then((res) => {
      if (cancelled) return;
      setResult(res);
    });
    return () => {
      cancelled = true;
    };
  }, [topic, level]);

  const topics = Object.keys(explanationTopics);

  return (
    <div className="space-y-4">
      <h3 className="text-base font-bold">توضیح ساده یا پیشرفته یک مبحث</h3>
      <div className="flex flex-wrap items-center gap-3">
        <Select value={topic} onValueChange={setTopic}>
          <SelectTrigger className="w-56">
            <SelectValue placeholder="انتخاب موضوع" />
          </SelectTrigger>
          <SelectContent>
            {topics.map((t) => (
              <SelectItem key={t} value={t}>
                {t}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Tabs value={level} onValueChange={(v) => setLevel(v as "simple" | "advanced")}>
          <TabsList>
            <TabsTrigger value="simple">ساده</TabsTrigger>
            <TabsTrigger value="advanced">پیشرفته</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>
      {!topic && <p className="text-sm text-muted-foreground">یک موضوع را انتخاب کنید.</p>}
      {result && (
        <div className="space-y-2">
          <SourceBadge source={result.source} />
          <div className="rounded-xl border border-border bg-muted/50 p-4 text-sm leading-8">
            {result.text}
          </div>
        </div>
      )}
    </div>
  );
}

function SearchTool() {
  const [query, setQuery] = React.useState("");
  const [results, setResults] = React.useState<SmartSearchResult[]>([]);
  const [aiAnswer, setAiAnswer] = React.useState<string | null>(null);
  const [thinking, setThinking] = React.useState(false);

  const doSearch = async () => {
    const q = query.trim();
    if (!q) return;
    const local = localConceptSearch(q);
    setResults(local);
    setAiAnswer(null);
    if (local.length > 0) return;
    setThinking(true);
    const answer = await answerConceptQuery(q);
    setThinking(false);
    setAiAnswer(answer?.text ?? null);
  };

  return (
    <div className="space-y-4">
      <h3 className="text-base font-bold">جستجوی مفهومی در تمام جلسات و جزوات</h3>
      <div className="flex gap-2">
        <Input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && void doSearch()}
          placeholder="مثال: وابستگی تابعی، پس‌انتشار خطا، …"
        />
        <Button onClick={() => void doSearch()}>
          <Search className="size-4" /> جستجو
        </Button>
      </div>
      {results.length > 0 ? (
        <div className="space-y-3">
          {results.map((r, i) => (
            <div key={i} className="rounded-xl border border-border p-4">
              <div className="flex items-center gap-2">
                <Badge variant="secondary">{r.topic}</Badge>
                <Badge variant="outline" className="text-[10px]">
                  {r.source} — جلسه {r.session} — صفحه {r.page}
                </Badge>
              </div>
              <p className="mt-2 text-sm leading-7">{r.snippet}</p>
            </div>
          ))}
        </div>
      ) : (
        query && (
          <div className="space-y-3">
            {thinking ? (
              <p className="flex items-center gap-2 text-sm text-muted-foreground">
                <Loader2 className="size-3 animate-spin" /> در حال جستجوی مفهومی…
              </p>
            ) : aiAnswer ? (
              <div className="space-y-2">
                <SourceBadge source="ai" />
                <div className="rounded-xl border border-border bg-muted/50 p-4 text-sm leading-8">
                  {aiAnswer}
                </div>
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">نتیجه‌ای یافت نشد.</p>
            )}
          </div>
        )
      )}
    </div>
  );
}
