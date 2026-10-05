// v2ئتادنمتدنم.
import { createFileRoute } from "@tanstack/react-router";
import { Building2, BookOpen, Users, Sparkles, UserPlus, GraduationCap, Plus, LayoutDashboard } from "lucide-react";
// force redeploy 2026-10-04
import { toast } from "sonner";
import { AppShell } from "@/components/layout/AppShell";
import { courseCatalog } from "@/lib/mock-data";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";

export const Route = createFileRoute("/academic-structure")({
  head: () => ({
    meta: [
      { title: "مدیریت ساختار آموزشی | سامانه آموزش مجازی دانشگاه" },
      { name: "description", content: "مدیریت ساختار سازمانی، دروس، اساتید و دانشجویان، تشکیل کلاس و گزارش" }
    ]
  }),
  component: AcademicStructurePage
});

function AcademicStructurePage() {
  return (
    <AppShell title="مدیریت ساختار آموزشی - NEW" subtitle="مدیریت ساختار سازمانی، دروس، اساتید و دانشجویان، تشکیل کلاس و گزارش - v2">
      <Tabs defaultValue="dashboard" dir="rtl">
        <TabsList className="mb-5">
          <TabsTrigger value="dashboard" className="gap-1.5"><LayoutDashboard className="size-3.5" />داشبورد</TabsTrigger>
          <TabsTrigger value="org" className="gap-1.5"><Building2 className="size-3.5" />مدیریت ساختار سازمانی</TabsTrigger>
          <TabsTrigger value="courses" className="gap-1.5"><BookOpen className="size-3.5" />تعریف دروس و پیش‌نیازها</TabsTrigger>
          <TabsTrigger value="users" className="gap-1.5"><Users className="size-3.5" />مدیریت اساتید و دانشجویان</TabsTrigger>
          <TabsTrigger value="classes" className="gap-1.5"><GraduationCap className="size-3.5" />تشکیل کلاس‌ها</TabsTrigger>
          <TabsTrigger value="reports" className="gap-1.5"><Sparkles className="size-3.5" />گزارش‌گیری پایه</TabsTrigger>
          <TabsTrigger value="settings" className="gap-1.5"><UserPlus className="size-3.5" />تنظیمات سامانه</TabsTrigger>
        </TabsList>
        <TabsContent value="dashboard"><DashboardTab /></TabsContent>
        <TabsContent value="org"><OrgTab /></TabsContent>
        <TabsContent value="courses"><CoursesTab /></TabsContent>
        <TabsContent value="users"><UsersTab /></TabsContent>
        <TabsContent value="classes"><ClassesTab /></TabsContent>
        <TabsContent value="reports"><ReportsTab /></TabsContent>
        <TabsContent value="settings"><SettingsTab /></TabsContent>
      </Tabs>
    </AppShell>
  );
}

function DashboardTab() {
  return (
    <div className="grid gap-6 lg:grid-cols-3">
      <Card>
        <CardHeader><CardTitle className="text-base">نمای کلی آموزشی</CardTitle></CardHeader>
        <CardContent className="space-y-3 text-sm">
          <div className="flex items-center justify-between"><span className="text-muted-foreground">مجتمع‌ها</span><span className="font-bold">۳</span></div>
          <div className="flex items-center justify-between"><span className="text-muted-foreground">پژوهشکده‌ها</span><span className="font-bold">۵</span></div>
          <div className="flex items-center justify-between"><span className="text-muted-foreground">گروه‌های علمی</span><span className="font-bold">۱۰</span></div>
          <div className="flex items-center justify-between"><span className="text-muted-foreground">رشته‌ها</span><span className="font-bold">۸</span></div>
          <div className="flex items-center justify-between"><span className="text-muted-foreground">دروس تعریف‌شده</span><span className="font-bold">۱۲۴</span></div>
        </CardContent>
      </Card>
      <Card className="lg:col-span-2">
        <CardHeader><CardTitle className="text-base">فعالیت اخیر</CardTitle></CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">خلاصه عملیات اخیر واحد آموزش: ثبت درس جدید، تخصیص استاد، تشکیل کلاس و گزارش‌های ثبت‌نام.</p>
        </CardContent>
      </Card>
    </div>
  );
}

function OrgTab() {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader><CardTitle className="text-base">مدیریت ساختار سازمانی</CardTitle></CardHeader>
        <CardContent className="space-y-3">
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            <Input placeholder="نام مجتمع/دانشکده" />
            <Input placeholder="نام پژوهشکده" />
            <Input placeholder="نام گروه علمی" />
            <Input placeholder="نام رشته" />
            <Input placeholder="مقطع" />
            <Button onClick={()=> toast.success("ساختار سازمانی ثبت شد")}>ثبت ساختار</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function CoursesTab() {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader><CardTitle className="text-base">تعریف دروس و پیش‌نیازها</CardTitle></CardHeader>
        <CardContent className="space-y-3">
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            <Input placeholder="کد درس" />
            <Input placeholder="نام درس" />
            <Input placeholder="واحد" />
            <Input placeholder="ظرفیت" />
            <Input placeholder="سطح/مقطع" />
            <Input placeholder="پیش‌نیاز" />
          </div>
          <Button onClick={()=> toast.success("درس ثبت شد")}>ثبت درس</Button>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="overflow-x-auto pt-6">
          <Table className="min-w-[800px]">
            <TableHeader>
              <TableRow>
                <TableHead>درس</TableHead>
                <TableHead>واحد</TableHead>
                <TableHead>گروه</TableHead>
                <TableHead>مقطع</TableHead>
                <TableHead>پیش‌نیاز</TableHead>
                <TableHead>ظرفیت ثبت‌نام</TableHead>
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
                    <TableCell><Badge variant="secondary">{c.level}</Badge></TableCell>
                    <TableCell>{c.prereq}</TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <div className="flex items-center justify-between text-[11px]">
                          <span className="text-muted-foreground">{c.registered} / {c.capacity}</span>
                          <span className="font-semibold">{percent}%</span>
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

function UsersTab() {
  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <Card>
        <CardHeader><CardTitle className="flex items-center gap-2">مدیریت اساتید و دانشجویان</CardTitle></CardHeader>
        <CardContent className="space-y-3">
          <Input placeholder="نام کامل" />
          <Input placeholder="ایمیل دانشگاهی" />
          <Input placeholder="شماره پرسنلی / دانشجویی" />
          <div className="grid gap-3 sm:grid-cols-2">
            <Button onClick={()=> toast.success("حساب ایجاد و اطلاعات ورود ارسال شد")}>ایجاد حساب</Button>
            <Button variant="outline" onClick={()=> toast.success("احراز هویت انجام شد")}>احراز هویت</Button>
          </div>
          <p className="text-xs text-muted-foreground">گروه‌بندی و وضعیت در نمای جدول قابل مدیریت است.</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader><CardTitle className="text-base">فهرست کاربران</CardTitle></CardHeader>
        <CardContent><p className="text-sm text-muted-foreground">جدول اساتید و دانشجویان با امکان گروه‌بندی و تغییر وضعیت.</p></CardContent>
      </Card>
    </div>
  );
}

function ClassesTab() {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader><CardTitle className="flex items-center gap-2">تشکیل کلاس‌ها</CardTitle></CardHeader>
        <CardContent className="grid gap-3 sm:grid-cols-4">
          <Input placeholder="نام استاد" />
          <Input placeholder="کد درس" />
          <Input placeholder="ظرفیت کلاس" />
          <Input placeholder="زمان‌بندی کلاس" />
          <Button onClick={()=> toast.success("کلاس تشکیل و درس به استاد تخصیص یافت")} className="sm:col-span-4">تخصیص درس و ثبت کلاس</Button>
        </CardContent>
      </Card>
      <Card>
        <CardHeader><CardTitle className="text-base">فهرست کلاس‌های تشکیل‌شده</CardTitle></CardHeader>
        <CardContent><p className="text-sm text-muted-foreground">جدول کلاس‌ها با ظرفیت و زمان‌بندی.</p></CardContent>
      </Card>
    </div>
  );
}

function ReportsTab() {
  return (
    <div className="grid gap-6 lg:grid-cols-3">
      <Card><CardHeader><CardTitle className="text-base">آمار ثبت‌نام</CardTitle></CardHeader><CardContent><p className="text-sm text-muted-foreground">نمودار ثبت‌نام دانشجویان در کلاس‌ها.</p></CardContent></Card>
      <Card><CardHeader><CardTitle className="text-base">تراکم کلاس</CardTitle></CardHeader><CardContent><p className="text-sm text-muted-foreground">نمایش پر بودن کلاس‌ها و ظرفیت.</p></CardContent></Card>
      <Card><CardHeader><CardTitle className="text-base">عملکرد اساتید</CardTitle></CardHeader><CardContent><p className="text-sm text-muted-foreground">گزارش حضور، تکالیف و نمره‌دهی اساتید.</p></CardContent></Card>
    </div>
  );
}

function SettingsTab() {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader><CardTitle className="text-base">تنظیمات سامانه</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-3 sm:grid-cols-2">
            <Input placeholder="نام نقش" />
            <Input placeholder="دسترسی‌ها" />
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            <Input placeholder="قالب/تم" />
            <Input placeholder="تنظیمات اعلان" />
          </div>
          <Button onClick={()=> toast.success("تنظیمات ذخیره شد")}>ذخیره تنظیمات</Button>
        </CardContent>
      </Card>
    </div>
  );
}
