import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/layout/AppShell";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { Building2, BookOpen, Users, GraduationCap, BarChart3, Settings } from "lucide-react";

export const Route = createFileRoute("/academic-structure")({
  component: AcademicStructurePage,
});

function AcademicStructurePage() {
  return (
    <AppShell title="مدیریت ساختار آموزشی" subtitle="پنل واحد آموزش">
      <div className="p-6 space-y-6">
        <Tabs defaultValue="org" dir="rtl" className="w-full">
          <TabsList className="grid w-full grid-cols-3 md:grid-cols-6">
            <TabsTrigger value="org" className="gap-1.5"><Building2 className="size-4" />ساختار سازمانی</TabsTrigger>
            <TabsTrigger value="courses" className="gap-1.5"><BookOpen className="size-4" />تعریف دروس</TabsTrigger>
            <TabsTrigger value="users" className="gap-1.5"><Users className="size-4" />اساتید و دانشجویان</TabsTrigger>
            <TabsTrigger value="classes" className="gap-1.5"><GraduationCap className="size-4" />تشکیل کلاس‌ها</TabsTrigger>
            <TabsTrigger value="reports" className="gap-1.5"><BarChart3 className="size-4" />گزارش‌گیری</TabsTrigger>
            <TabsTrigger value="settings" className="gap-1.5"><Settings className="size-4" />تنظیمات</TabsTrigger>
          </TabsList>

          <TabsContent value="org">
            <Card>
              <CardHeader><CardTitle className="text-base">مدیریت ساختار سازمانی</CardTitle></CardHeader>
              <CardContent className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
                <Input placeholder="مجتمع/دانشکده" />
                <Input placeholder="پژوهشکده" />
                <Input placeholder="گروه علمی" />
                <Input placeholder="رشته" />
                <Input placeholder="مقطع" />
                <Button className="sm:col-span-2" onClick={()=> toast.success("ساختار سازمانی ثبت شد")}>ثبت ساختار</Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="courses">
            <Card>
              <CardHeader><CardTitle className="text-base">تعریف دروس و پیش‌نیازها</CardTitle></CardHeader>
              <CardContent className="grid gap-3 sm:grid-cols-2 lg:grid-cols-6">
                <Input placeholder="کد درس" />
                <Input placeholder="نام درس" />
                <Input placeholder="واحد" />
                <Input placeholder="ظرفیت" />
                <Input placeholder="سطح" />
                <Input placeholder="پیش‌نیاز" />
                <Button onClick={()=> toast.success("درس ثبت شد")}>ثبت درس</Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="users">
            <Card>
              <CardHeader><CardTitle className="text-base">مدیریت اساتید و دانشجویان</CardTitle></CardHeader>
              <CardContent className="grid gap-3 sm:grid-cols-2">
                <Input placeholder="نام کامل" />
                <Input placeholder="ایمیل دانشگاهی" />
                <Input placeholder="شماره پرسنلی / دانشجویی" />
                <Input placeholder="گروه" />
                <Button onClick={()=> toast.success("حساب ایجاد و اطلاعات ورود ارسال شد")}>ایجاد حساب</Button>
                <Button variant="outline" onClick={()=> toast.success("احراز هویت انجام شد")}>احراز هویت</Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="classes">
            <Card>
              <CardHeader><CardTitle className="text-base">تشکیل کلاس‌ها</CardTitle></CardHeader>
              <CardContent className="grid gap-3 sm:grid-cols-4">
                <Input placeholder="نام استاد" />
                <Input placeholder="کد درس" />
                <Input placeholder="ظرفیت کلاس" />
                <Input placeholder="زمان‌بندی" />
                <Button className="sm:col-span-4" onClick={()=> toast.success("کلاس تشکیل و درس به استاد تخصیص یافت")}>تخصیص درس و ثبت کلاس</Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="reports">
            <div className="grid gap-6 lg:grid-cols-3">
              <Card><CardHeader><CardTitle className="text-base">آمار ثبت‌نام</CardTitle></CardHeader><CardContent><p className="text-sm text-muted-foreground">نمودار ثبت‌نام دانشجویان در کلاس‌ها.</p></CardContent></Card>
              <Card><CardHeader><CardTitle className="text-base">تراکم کلاس</CardTitle></CardHeader><CardContent><p className="text-sm text-muted-foreground">نمایش پر بودن کلاس‌ها و ظرفیت.</p></CardContent></Card>
              <Card><CardHeader><CardTitle className="text-base">عملکرد اساتید</CardTitle></CardHeader><CardContent><p className="text-sm text-muted-foreground">گزارش حضور، تکالیف و نمره‌دهی.</p></CardContent></Card>
            </div>
          </TabsContent>

          <TabsContent value="settings">
            <Card>
              <CardHeader><CardTitle className="text-base">تنظیمات سامانه</CardTitle></CardHeader>
              <CardContent className="grid gap-3 sm:grid-cols-2">
                <Input placeholder="نام نقش" />
                <Input placeholder="دسترسی‌ها" />
                <Input placeholder="قالب/تم" />
                <Input placeholder="تنظیمات اعلان" />
                <Button onClick={()=> toast.success("تنظیمات ذخیره شد")}>ذخیره تنظیمات</Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </AppShell>
  );
}
