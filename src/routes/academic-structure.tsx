import { createFileRoute } from "@tanstack/react-router";
import { Building2, BookOpen, Users, Sparkles, Plus } from "lucide-react";
import { toast } from "sonner";
import { AppShell } from "@/components/layout/AppShell";
import {
  departments,
  facultyNames,
  courseCatalog,
  professors,
  formedClasses,
} from "@/lib/mock-data";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/academic-structure")({
  head: () => ({
    meta: [
      {
        title: "مدیریت ساختار آموزشی | سامانه آموزش مجازی دانشگاه",
      },
      {
        name: "description",
        content: "تعریف دانشکده، گروه، رشته، مقطع، دروس، اساتید و تشکیل کلاس‌ها",
      },
    ],
  }),
  component: AcademicStructurePage,
});

function AcademicStructurePage() {
  return (
    <AppShell
      title="مدیریت ساختار آموزشی"
      subtitle="تعریف دانشکده، گروه، رشته، مقطع، دروس، اساتید و تشکیل کلاس‌ها"
    >
      <Tabs defaultValue="departments" dir="rtl">
        <TabsList className="mb-5">
          <TabsTrigger value="departments" className="gap-1.5">
            <Building2 className="size-3.5" />
            دانشکده‌ها و گروه‌ها
          </TabsTrigger>
          <TabsTrigger value="courses" className="gap-1.5">
            <BookOpen className="size-3.5" />
            تعریف دروس
          </TabsTrigger>
          <TabsTrigger value="professors" className="gap-1.5">
            <Users className="size-3.5" />
            اساتید و تخصیص درس
          </TabsTrigger>
        </TabsList>

        <TabsContent value="departments">
          <DepartmentsTab />
        </TabsContent>

        <TabsContent value="courses">
          <CoursesTab />
        </TabsContent>

        <TabsContent value="professors">
          <ProfessorsTab />
        </TabsContent>
      </Tabs>
    </AppShell>
  );
}

function DepartmentsTab() {
  const grouped = facultyNames.map((f) => ({
    faculty: f,
    depts: departments.filter((d) => d.faculty === f),
  }));

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          {departments.length} گروه آموزشی در {facultyNames.length} دانشکده
        </p>
        <Button size="sm" onClick={() => toast.success("افزودن گروه جدید (نمایشی)")}>
          <Plus className="size-4" /> افزودن گروه
        </Button>
      </div>

      <Accordion type="multiple" className="space-y-2">
        {grouped.map(({ faculty, depts }) => (
          <AccordionItem key={faculty} value={faculty} className="rounded-xl border px-4">
            <AccordionTrigger className="text-base font-bold">
              <span className="flex items-center gap-2">
                <Building2 className="size-4 text-accent" />
                {faculty}
                <Badge variant="secondary" className="text-[10px]">
                  {depts.length} گروه
                </Badge>
              </span>
            </AccordionTrigger>
            <AccordionContent className="space-y-4 pt-2">
              {depts.map((dept) => (
                <Card key={dept.id}>
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between gap-2">
                      <CardTitle className="text-sm">{dept.name}</CardTitle>
                      <Badge variant="outline" className="text-[10px]">
                        مدیر گروه: {dept.head}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>رشته</TableHead>
                          <TableHead>مقطع</TableHead>
                          <TableHead>تعداد دانشجو</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {dept.fields.map((f) => (
                          <TableRow key={f.id}>
                            <TableCell className="font-medium">{f.name}</TableCell>
                            <TableCell>
                              <Badge variant="secondary">{f.level}</Badge>
                            </TableCell>
                            <TableCell>{f.students.toLocaleString("fa-IR")}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>
              ))}
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
}

function CoursesTab() {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">{courseCatalog.length} درس تعریف‌شده</p>
        <Button size="sm" onClick={() => toast.success("تعریف درس جدید (نمایشی)")}>
          <Plus className="size-4" /> تعریف درس جدید
        </Button>
      </div>

      <Card>
        <CardContent className="overflow-x-auto scrollbar-thin pt-6">
          <Table className="min-w-[800px]">
            <TableHeader>
              <TableRow>
                <TableHead>درس</TableHead>
                <TableHead>واحد</TableHead>
                <TableHead>گروه</TableHead>
                <TableHead>مقطع</TableHead>
                <TableHead>پیش‌نیاز</TableHead>
                <TableHead>هم‌نیاز</TableHead>
                <TableHead className="min-w-[160px]">ظرفیت ثبت‌نام</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {courseCatalog.map((c) => {
                const percent = Math.round((c.registered / c.capacity) * 100);
                return (
                  <TableRow key={c.code}>
                    <TableCell>
                      <div>
                        <span className="block font-medium">{c.title}</span>
                        <span className="block text-[11px] text-muted-foreground">{c.code}</span>
                      </div>
                    </TableCell>
                    <TableCell>{c.units}</TableCell>
                    <TableCell>{c.department}</TableCell>
                    <TableCell>
                      <Badge variant="secondary">{c.level}</Badge>
                    </TableCell>
                    <TableCell>
                      {c.prereq === "—" ? (
                        <span className="text-muted-foreground">—</span>
                      ) : (
                        <Badge variant="outline" className="text-[10px]">
                          {c.prereq}
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell>
                      {c.coreq === "—" ? (
                        <span className="text-muted-foreground">—</span>
                      ) : (
                        <Badge variant="outline" className="text-[10px]">
                          {c.coreq}
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <div className="flex items-center justify-between text-[11px]">
                          <span className="text-muted-foreground">
                            {c.registered} / {c.capacity}
                          </span>
                          <span className="font-semibold">{percent}٪</span>
                        </div>
                        <Progress value={percent} className="h-1.5" />
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}

const degreeBadgeClass: Record<string, string> = {
  استادیار: "bg-blue-100 text-blue-700",
  دانشیار: "bg-violet-100 text-violet-700",
  "استاد تمام": "bg-amber-100 text-amber-700",
};

const statusBadgeClass: Record<string, string> = {
  "تشکیل شد": "bg-emerald-100 text-emerald-700",
  تکمیل: "bg-amber-100 text-amber-700",
  "تشکیل نشد": "bg-muted text-muted-foreground",
};

function ProfessorsTab() {
  return (
    <div className="space-y-6">
      <div className="space-y-3">
        <h3 className="flex items-center gap-2 text-sm font-bold">
          <Users className="size-4 text-accent" />
          فهرست اساتید
        </h3>
        <Card>
          <CardContent className="overflow-x-auto scrollbar-thin pt-6">
            <Table className="min-w-[740px]">
              <TableHeader>
                <TableRow>
                  <TableHead>نام استاد</TableHead>
                  <TableHead>گروه</TableHead>
                  <TableHead>مرتبه</TableHead>
                  <TableHead>دروس تخصیصی</TableHead>
                  <TableHead className="min-w-[160px]">ساعات تدریس</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {professors.map((p) => {
                  const hoursPercent = Math.round((p.weeklyHours / p.limit) * 100);
                  return (
                    <TableRow key={p.id}>
                      <TableCell className="font-medium">{p.name}</TableCell>
                      <TableCell>{p.department}</TableCell>
                      <TableCell>
                        <Badge className={cn("text-[10px]", degreeBadgeClass[p.degree])}>
                          {p.degree}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-wrap gap-1">
                          {p.courses.map((c) => (
                            <Badge key={c} variant="outline" className="text-[10px]">
                              {c}
                            </Badge>
                          ))}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          <div className="flex items-center justify-between text-[11px]">
                            <span className="text-muted-foreground">
                              {p.weeklyHours} از {p.limit} ساعت
                            </span>
                            <span className="font-semibold">{hoursPercent}٪</span>
                          </div>
                          <Progress value={hoursPercent} className="h-1.5" />
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2 text-base">
              <Sparkles className="size-4 text-accent" />
              تشکیل خودکار کلاس‌ها
            </CardTitle>
            <Button size="sm" onClick={() => toast.success("گروه‌های کلاسی تشکیل شد")}>
              <Sparkles className="size-4" /> اجرای تشکیل کلاس
            </Button>
          </div>
        </CardHeader>
        <CardContent className="overflow-x-auto scrollbar-thin">
          <Table className="min-w-[600px]">
            <TableHeader>
              <TableRow>
                <TableHead>درس</TableHead>
                <TableHead>گروه</TableHead>
                <TableHead>دانشجو / ظرفیت</TableHead>
                <TableHead>وضعیت</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {formedClasses.map((cls) => (
                <TableRow key={cls.id}>
                  <TableCell className="font-medium">{cls.course}</TableCell>
                  <TableCell>{cls.group}</TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      <div className="flex items-center justify-between text-[11px]">
                        <span className="text-muted-foreground">
                          {cls.students} از {cls.capacity}
                        </span>
                        <span className="font-semibold">
                          {cls.capacity > 0 ? Math.round((cls.students / cls.capacity) * 100) : 0}٪
                        </span>
                      </div>
                      <Progress
                        value={
                          cls.capacity > 0 ? Math.round((cls.students / cls.capacity) * 100) : 0
                        }
                        className="h-1.5"
                      />
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge className={cn("text-[10px]", statusBadgeClass[cls.status])}>
                      {cls.status}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
