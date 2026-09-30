import { createFileRoute } from "@tanstack/react-router";
import { Building2, BookOpen, Users, Sparkles, Plus, UserPlus, GraduationCap } from "lucide-react";
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
import { Input } from "@/components/ui/input";
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
            مجتمع‌ها
          </TabsTrigger>
          <TabsTrigger value="courses" className="gap-1.5">
            <BookOpen className="size-3.5" />
            تعریف دروس
          </TabsTrigger>
          <TabsTrigger value="professors" className="gap-1.5">
            <Users className="size-3.5" />
            اساتید و تخصیص درس
          </TabsTrigger>
          <TabsTrigger value="accounts" className="gap-1.5">
            <UserPlus className="size-3.5" />
            ایجاد حساب
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

        <TabsContent value="accounts">
          <AccountsTab />
        </TabsContent>
      </Tabs>
    </AppShell>
  );
}

function DepartmentsTab() {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader><CardTitle className="text-base">تعریف مجتمع و درس داخل آن</CardTitle></CardHeader>
        <CardContent className="space-y-3">
          <Input placeholder="نام مجتمع" />
          <div className="grid gap-3 sm:grid-cols-3">
            <Input placeholder="نام درس" />
            <Input placeholder="نام استاد" />
            <Button onClick={()=> toast.success("درس برای مجتمع ثبت و به استاد تخصیص یافت")}>ثبت درس در مجتمع</Button>
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader><CardTitle className="text-base">تعریف پژوهشکده و درس داخل آن</CardTitle></CardHeader>
        <CardContent className="space-y-3">
          <Input placeholder="نام پژوهشکده" />
          <div className="grid gap-3 sm:grid-cols-3">
            <Input placeholder="نام درس" />
            <Input placeholder="نام استاد" />
            <Button onClick={()=> toast.success("درس برای پژوهشکده ثبت و به استاد تخصیص یافت")}>ثبت درس در پژوهشکده</Button>
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader><CardTitle className="text-base">تعریف گروه علمی و درس داخل آن</CardTitle></CardHeader>
        <CardContent className="space-y-3">
          <Input placeholder="نام گروه علمی" />
          <div className="grid gap-3 sm:grid-cols-3">
            <Input placeholder="نام درس" />
            <Input placeholder="نام استاد" />
            <Button onClick={()=> toast.success("درس برای گروه علمی ثبت و به استاد تخصیص یافت")}>ثبت درس در گروه</Button>
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader><CardTitle className="text-base">تعریف درس مستقل</CardTitle></CardHeader>
        <CardContent className="space-y-3">
          <Input placeholder="کد درس" />
          <Input placeholder="نام درس" />
          <Input placeholder="واحد" />
          <Button onClick={()=> toast.success("درس جدید ثبت شد")}>ثبت درس</Button>
        </CardContent>
      </Card>
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
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">تخصیص درس به استاد</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-3 sm:grid-cols-4">
          <Input placeholder="نام استاد" />
          <Input placeholder="کد درس" />
          <Input placeholder="نام درس" />
          <Button onClick={()=> toast.success("درس با موفقیت به استاد تخصیص یافت")}>تخصیص درس</Button>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle className="text-base">فهرست اساتید</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">جدول اساتید و دروس تخصیصی اینجا نمایش داده می‌شود.</p>
        </CardContent>
      </Card>
    </div>
  );
}

function AccountsTab() {
  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">ایجاد حساب استاد</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <Input placeholder="نام کامل" />
          <Input placeholder="ایمیل دانشگاهی" />
          <Input placeholder="شماره پرسنلی" />
          <Button onClick={()=> toast.success("حساب استاد ایجاد و اطلاعات ورود ارسال شد")}>ایجاد حساب استاد</Button>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">ایجاد حساب دانشجو</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <Input placeholder="نام کامل" />
          <Input placeholder="شماره دانشجویی" />
          <Input placeholder="ایمیل دانشگاهی" />
          <Button onClick={()=> toast.success("حساب دانشجو ایجاد و اطلاعات ورود ارسال شد")}>ایجاد حساب دانشجو</Button>
        </CardContent>
      </Card>
    </div>
  );
}

