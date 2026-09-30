import * as React from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { BookOpen, Calendar, CheckCircle2, FileDown, PlayCircle, Users, Video, Link2 } from "lucide-react";
import { toast } from "sonner";
import { AppShell } from "@/components/layout/AppShell";
import { courses } from "@/lib/mock-data";
import type { Course } from "@/lib/mock-data";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useRole } from "@/lib/role";
import { Input } from "@/components/ui/input";

export const Route = createFileRoute("/courses")({
  head: () => ({
    meta: [
      { title: "درس‌های من | سامانه آموزش مجازی دانشگاه" },
      {
        name: "description",
        content: "فهرست دروس ترم جاری و ترم‌های گذشته با محتوای درسی، اسلایدها و جلسات ضبط‌شده کلاس مجازی.",
      },
    ],
  }),
  component: CoursesPage,
});

const CURRENT_SEMESTER = "۱۴۰۵-۱";

function CoursesPage() {
  const currentCourses = courses.filter((c) => c.semester === CURRENT_SEMESTER);
  const pastCourses = courses.filter((c) => c.semester !== CURRENT_SEMESTER);

  const [selected, setSelected] = React.useState<string>(currentCourses[0]?.id ?? "");
  const course = courses.find((c) => c.id === selected);

  const pastSemesters = [...new Set(pastCourses.map((c) => c.semester))];

  return (
    <AppShell
      title="درس‌های من"
      subtitle={`${currentCourses.length} درس فعال — ترم جاری ${CURRENT_SEMESTER}`}
    >
      <Tabs defaultValue="current" dir="rtl">
        <TabsList className="mb-5">
          <TabsTrigger value="current" className="gap-1.5">
            <Calendar className="size-3.5" />
            ترم جاری ({currentCourses.length})
          </TabsTrigger>
          <TabsTrigger value="past" className="gap-1.5">
            <CheckCircle2 className="size-3.5" />
            ترم‌های گذشته ({pastCourses.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="current">
          <CurrentSemesterCourses
            courses={currentCourses}
            selected={selected}
            onSelect={setSelected}
            course={course}
          />
        </TabsContent>

        <TabsContent value="past">
          <PastSemestersCourses
            courses={pastCourses}
            pastSemesters={pastSemesters}
            selected={selected}
            onSelect={setSelected}
          />
        </TabsContent>
      </Tabs>
    </AppShell>
  );
}

function CurrentSemesterCourses({
  courses: list,
  selected,
  onSelect,
  course,
}: {
  courses: Course[];
  selected: string;
  onSelect: (id: string) => void;
  course: Course | undefined;
}) {
  const totalUnits = list.reduce((sum, c) => sum + c.units, 0);

  return (
    <div className="grid gap-5 lg:grid-cols-3">
      <div className="space-y-4 lg:col-span-2">
        <p className="text-sm text-muted-foreground">
          {list.length} درس فعال — {totalUnits} واحد در نیم‌سال {CURRENT_SEMESTER}
        </p>
        <div className="grid gap-4 sm:grid-cols-2">
          {list.map((c) => (
            <Card
              key={c.id}
              onClick={() => onSelect(c.id)}
              className={
                "cursor-pointer transition hover:shadow-md " +
                (c.id === selected ? "ring-2 ring-accent" : "")
              }
            >
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between gap-2">
                  <CardTitle className="text-base leading-6">{c.title}</CardTitle>
                  <Badge variant="secondary">{c.units} واحد</Badge>
                </div>
                <p className="text-xs text-muted-foreground">
                  {c.code} — {c.professor}
                </p>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center gap-4 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Users className="size-3.5" /> {c.students} دانشجو
                  </span>
                  <span className="flex items-center gap-1">
                    <Video className="size-3.5" /> {c.nextSession}
                  </span>
                </div>
                <div>
                  <div className="mb-1.5 flex justify-between text-[11px] text-muted-foreground">
                    <span>پیشرفت سرفصل</span>
                    <span>{c.progress}٪</span>
                  </div>
                  <Progress value={c.progress} />
                </div>
                <Button asChild size="sm" className="w-full">
                  <Link to="/classroom">ورود به کلاس مجازی</Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {course && <CourseDetailSidebar course={course} />}
    </div>
  );
}

function PastSemestersCourses({
  courses: list,
  pastSemesters,
  selected,
  onSelect,
}: {
  courses: Course[];
  pastSemesters: string[];
  selected: string;
  onSelect: (id: string) => void;
}) {
  const [activeSemester, setActiveSemester] = React.useState(pastSemesters[0] ?? "");
  const semesterCourses = list.filter((c) => c.semester === activeSemester);
  const selectedCourse = list.find((c) => c.id === selected);

  return (
    <div className="space-y-6">
      <Tabs value={activeSemester} onValueChange={setActiveSemester} dir="rtl">
        <TabsList>
          {pastSemesters.map((s) => (
            <TabsTrigger key={s} value={s}>
              {s}
            </TabsTrigger>
          ))}
        </TabsList>

        {pastSemesters.map((s) => (
          <TabsContent key={s} value={s}>
            <div className="grid gap-5 lg:grid-cols-3">
              <div className="space-y-4 lg:col-span-2">
                <div className="grid gap-4 sm:grid-cols-2">
                  {semesterCourses.map((c) => (
                    <Card
                      key={c.id}
                      onClick={() => onSelect(c.id)}
                      className={
                        "cursor-pointer transition hover:shadow-md " +
                        (c.id === selected ? "ring-2 ring-accent" : "")
                      }
                    >
                      <CardHeader className="pb-3">
                        <div className="flex items-start justify-between gap-2">
                          <CardTitle className="text-base leading-6">{c.title}</CardTitle>
                          <Badge variant="secondary">{c.units} واحد</Badge>
                        </div>
                        <p className="text-xs text-muted-foreground">
                          {c.code} — {c.professor}
                        </p>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <div className="flex items-center gap-4 text-xs text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <Users className="size-3.5" /> {c.students} دانشجو
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge variant="outline" className="gap-1">
                            <CheckCircle2 className="size-3 text-green-600" />
                            پایان یافته
                          </Badge>
                          {c.grade && (
                            <Badge variant="secondary" className="font-semibold">
                              نمره: {c.grade}
                            </Badge>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>

              {selectedCourse && selectedCourse.semester === activeSemester && (
                <CourseDetailSidebar course={selectedCourse} />
              )}
            </div>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}

function CourseDetailSidebar({ course }: { course: Course }) {
  const { role } = useRole();
  const isProfessor = role === "professor";
  const [link, setLink] = React.useState(course.classLink ?? "");
  const [slideFile, setSlideFile] = React.useState<File | null>(null);
  const [recFile, setRecFile] = React.useState<File | null>(null);

  return (
    <Card className="h-fit lg:sticky lg:top-24">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base">
          <BookOpen className="size-4 text-accent" /> محتوای درس {course.title}
        </CardTitle>
        <p className="text-xs text-muted-foreground">{course.room}</p>
      </CardHeader>
      <CardContent className="space-y-4">
        {isProfessor && (
          <div className="space-y-3">
            <div className="space-y-2">
              <p className="text-xs font-medium flex items-center gap-1"><Link2 className="size-3"/> لینک ورود به کلاس</p>
              <div className="flex gap-2">
                <Input value={link} onChange={e=>setLink(e.target.value)} placeholder="https://..." />
                <Button size="sm" onClick={()=> toast.success("لینک کلاس ذخیره شد")}>ذخیره</Button>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <Input type="date" placeholder="روز کلاس" />
              <Input type="time" placeholder="ساعت کلاس" />
            </div>
            <Button size="sm" className="w-full" onClick={()=> toast.success("جلسه کلاس ایجاد شد و لینک برای دانشجویان نمایش داده می‌شود")}>ایجاد لینک کلاس</Button>
          </div>
        )}
        <Tabs defaultValue="slides">
          <TabsList className="w-full">
            <TabsTrigger value="slides" className="flex-1">
              اسلایدها
            </TabsTrigger>
            <TabsTrigger value="rec" className="flex-1">
              جلسات ضبط‌شده
            </TabsTrigger>
          </TabsList>
          <TabsContent value="slides" className="mt-4 space-y-2">
            {isProfessor && (
              <div className="flex gap-2">
                <input type="file" accept=".pdf,.ppt,.pptx" onChange={e=> { if(e.target.files?.[0]) toast.success(`فایل ${e.target.files[0].name} آپلود شد (نمایشی)`); e.currentTarget.value=""; }} className="hidden" id="slide-upload" />
                <label htmlFor="slide-upload"><Button size="sm" variant="outline" asChild><span>آپلود اسلاید</span></Button></label>
              </div>
            )}
            {course.slides.map((s) => (
              <div
                key={s.title}
                className="flex items-center gap-3 rounded-xl border border-border p-3"
              >
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-sm">{s.title}</span>
                  <span className="block text-[11px] text-muted-foreground">{s.size}</span>
                </span>
                <Button
                  size="icon"
                  variant="ghost"
                  aria-label="دانلود"
                  onClick={() => toast.success("دانلود اسلاید آغاز شد (نمایشی)")}
                >
                  <FileDown className="size-4" />
                </Button>
              </div>
            ))}
          </TabsContent>
          <TabsContent value="rec" className="mt-4 space-y-2">
            {isProfessor && (
              <div className="flex gap-2">
                <input type="file" accept="video/*,audio/*" onChange={e=> { if(e.target.files?.[0]) toast.success(`جلسه ${e.target.files[0].name} آپلود شد (نمایشی)`); e.currentTarget.value=""; }} className="hidden" id="rec-upload" />
                <label htmlFor="rec-upload"><Button size="sm" variant="outline" asChild><span>آپلود/ضبط جلسه</span></Button></label>
              </div>
            )}
            {course.recordings.map((r) => (
              <div
                key={r.title}
                className="flex items-center gap-3 rounded-xl border border-border p-3"
              >
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-sm">{r.title}</span>
                  <span className="block text-[11px] text-muted-foreground">
                    {r.duration} — {r.date}
                  </span>
                </span>
                <Button
                  size="icon"
                  variant="ghost"
                  aria-label="پخش"
                  onClick={() => toast.info("پخش جلسه ضبط‌شده (نمایشی)")}
                >
                  <PlayCircle className="size-4" />
                </Button>
              </div>
            ))}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
