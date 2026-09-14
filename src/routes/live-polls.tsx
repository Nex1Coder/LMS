import * as React from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Vote, BarChart3, Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { AppShell } from "@/components/layout/AppShell";
import { livePolls, courses, type Poll as PollType } from "@/lib/mock-data";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export const Route = createFileRoute("/live-polls")({
  head: () => ({
    meta: [
      { title: "نظرسنجی حین تدریس | سامانه آموزش مجازی دانشگاه" },
      {
        name: "description",
        content: "ایجاد و مدیریت نظرسنجی‌های حین تدریس برای دروس دانشگاه.",
      },
    ],
  }),
  component: LivePollsPage,
});

type Filter = "همه" | "فعال" | "بسته‌شده";

function LivePollsPage() {
  const [polls, setPolls] = React.useState<PollType[]>(livePolls);
  const [filter, setFilter] = React.useState<Filter>("همه");

  const [courseId, setCourseId] = React.useState<string>("");
  const [question, setQuestion] = React.useState("");
  const [options, setOptions] = React.useState<string[]>(["", ""]);

  const filtered = polls.filter((p) => {
    if (filter === "همه") return true;
    return p.status === filter;
  });

  function addOption() {
    if (options.length >= 5) return;
    setOptions((prev) => [...prev, ""]);
  }

  function removeOption(index: number) {
    if (options.length <= 2) return;
    if (options[index] !== "") return;
    setOptions((prev) => prev.filter((_, i) => i !== index));
  }

  function updateOption(index: number, value: string) {
    setOptions((prev) => prev.map((o, i) => (i === index ? value : o)));
  }

  function createPoll() {
    const trimmed = question.trim();
    const filledOptions = options.map((o) => o.trim()).filter((o) => o.length > 0);

    if (!trimmed) {
      toast.error("متن سوال را وارد کنید");
      return;
    }
    if (!courseId) {
      toast.error("درس را انتخاب کنید");
      return;
    }
    if (filledOptions.length < 2) {
      toast.error("حداقل دو گزینه پر لازم است");
      return;
    }

    const course = courses.find((c) => c.id === courseId);
    const newPoll: PollType = {
      id: `p${Date.now()}`,
      course: course?.title ?? "",
      question: trimmed,
      options: filledOptions.map((label) => ({ label, votes: 0 })),
      totalVoters: 0,
      status: "فعال",
      createdAt: new Date().toLocaleDateString("fa-IR"),
    };

    setPolls((prev) => [newPoll, ...prev]);
    setQuestion("");
    setCourseId("");
    setOptions(["", ""]);
    toast.success("نظرسنجی جدید ایجاد شد");
  }

  function closePoll(id: string) {
    setPolls((prev) => prev.map((p) => (p.id === id ? { ...p, status: "بسته‌شده" } : p)));
    toast.success("نظرسنجی بسته شد");
  }

  return (
    <AppShell title="نظرسنجی حین تدریس" subtitle="ایجاد و مدیریت نظرسنجی‌های لحظه‌ای دروس">
      <Card className="mb-6">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-base">
            <Vote className="size-4" />
            ایجاد نظرسنجی جدید
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <label className="text-sm font-medium">درس</label>
              <Select value={courseId} onValueChange={setCourseId}>
                <SelectTrigger>
                  <SelectValue placeholder="انتخاب درس" />
                </SelectTrigger>
                <SelectContent>
                  {courses.map((c) => (
                    <SelectItem key={c.id} value={c.id}>
                      {c.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-medium">سوال</label>
              <Input
                placeholder="متن سوال را وارد کنید"
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">گزینه‌ها</label>
            <div className="space-y-2">
              {options.map((opt, i) => (
                <div key={i} className="flex items-center gap-2">
                  <Input
                    placeholder={`گزینه ${i + 1}`}
                    value={opt}
                    onChange={(e) => updateOption(i, e.target.value)}
                  />
                  {options.length > 2 && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="shrink-0 text-muted-foreground hover:text-destructive"
                      onClick={() => removeOption(i)}
                      disabled={opt !== ""}
                    >
                      <Trash2 className="size-4" />
                    </Button>
                  )}
                </div>
              ))}
            </div>
            {options.length < 5 && (
              <Button type="button" variant="outline" size="sm" onClick={addOption}>
                <Plus className="size-4" />
                افزودن گزینه
              </Button>
            )}
          </div>

          <Button onClick={createPoll}>
            <BarChart3 className="size-4" />
            ایجاد نظرسنجی
          </Button>
        </CardContent>
      </Card>

      <div className="mb-4 flex gap-2">
        {(["همه", "فعال", "بسته‌شده"] as Filter[]).map((f) => (
          <Button
            key={f}
            variant={filter === f ? "default" : "outline"}
            size="sm"
            onClick={() => setFilter(f)}
          >
            {f === "فعال" && (
              <span className="relative mr-1 flex size-2">
                <span className="absolute inline-flex size-full animate-ping rounded-full bg-green-400 opacity-75" />
                <span className="relative inline-flex size-2 rounded-full bg-green-500" />
              </span>
            )}
            {f}
          </Button>
        ))}
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        {filtered.map((poll) => (
          <PollCard key={poll.id} poll={poll} onClose={closePoll} />
        ))}
        {filtered.length === 0 && (
          <p className="col-span-full py-12 text-center text-sm text-muted-foreground">
            نظرسنجی‌ای یافت نشد
          </p>
        )}
      </div>
    </AppShell>
  );
}

function PollCard({ poll, onClose }: { poll: PollType; onClose: (id: string) => void }) {
  const isActive = poll.status === "فعال";

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex flex-wrap items-start justify-between gap-2">
          <CardTitle className="text-base">{poll.course}</CardTitle>
          <Badge variant={isActive ? "default" : "secondary"}>
            <span className="flex items-center gap-1.5">
              {isActive && (
                <span className="relative flex size-2">
                  <span className="absolute inline-flex size-full animate-ping rounded-full bg-green-400 opacity-75" />
                  <span className="relative inline-flex size-2 rounded-full bg-green-500" />
                </span>
              )}
              {poll.status}
            </span>
          </Badge>
        </div>
        <p className="text-sm font-medium leading-7">{poll.question}</p>
        <p className="text-xs text-muted-foreground">{poll.createdAt}</p>
      </CardHeader>
      <CardContent className="space-y-3">
        {poll.options.map((opt, i) => {
          const pct = poll.totalVoters > 0 ? Math.round((opt.votes / poll.totalVoters) * 100) : 0;

          return (
            <div key={i} className="space-y-1">
              <div className="flex items-center justify-between text-sm">
                <span>{opt.label}</span>
                <span className="text-muted-foreground">
                  {opt.votes} رأی ({pct}%)
                </span>
              </div>
              <Progress value={pct} />
            </div>
          );
        })}

        <div className="flex items-center justify-between border-t border-border pt-3">
          <span className="text-xs text-muted-foreground">
            مجموع رأی‌دهندگان: {poll.totalVoters}
          </span>
          {isActive && (
            <Button variant="outline" size="sm" onClick={() => onClose(poll.id)}>
              پایان نظرسنجی
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
