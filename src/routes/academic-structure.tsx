import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/layout/AppShell";
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
        <Card>
          <CardHeader className="flex flex-row items-center gap-2">
            <Building2 className="size-5" />
            <CardTitle className="text-base">ساختار سازمانی</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
            <Input placeholder="مجتمع/دانشکده" />
            <Input placeholder="پژوهشکده" />
            <Input placeholder="گروه علمی" />
            <Input placeholder="رشته" />
            <Input placeholder="مقطع" />
            <Button className="sm:col-span-2" onClick={()=> toast.success("ساختار سازمانی ثبت شد")}>ثبت ساختار</Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center gap-2">
            <BookOpen className="size-5" />
            <CardTitle className="text-base">تعریف دروس</CardTitle>
          </CardHeader>
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

        <Card>
          <CardHeader className="flex flex-row items-center gap-2">
            <Users className="size-5" />
            <CardTitle className="text-base">اساتید و دانشجویان</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-3 sm:grid-cols-2">
            <Input placeholder="نام کامل" />
            <Input placeholder="ایمیل دانشگاهی" />
            <Input placeholder="شماره پرسنلی / دانشجویی" />
            <Input placeholder="گروه" />
            <Button onClick={()=> toast.success("حساب ایجاد و اطلاعات ورود ارسال شد")}>ایجاد حساب</Button>
            <Button variant="outline" onClick={()=> toast.success("احراز هویت انجام شد")}>احراز هویت</Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center gap-2">
            <GraduationCap className="size-5" />
            <CardTitle className="text-base">تشکیل کلاس‌ها</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-3 sm:grid-cols-4">
            <Input placeholder="نام استاد" />
            <Input placeholder="کد درس" />
            <Input placeholder="ظرفیت کلاس" />
            <Input placeholder="زمان‌بندی" />
            <Button className="sm:col-span-4" onClick={()=> toast.success("کلاس تشکیل و درس به استاد تخصیص یافت")}>تخصیص درس و ثبت کلاس</Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center gap-2">
            <BarChart3 className="size-5" />
            <CardTitle className="text-base">گزارش‌گیری</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-6 lg:grid-cols-3">
            <div className="p-4 border rounded-xl">
              <h4 className="font-medium mb-1">آمار ثبت‌نام</h4>
              <p className="text-sm text-muted-foreground">نمودار ثبت‌نام دانشجویان در کلاس‌ها.</p>
            </div>
            <div className="p-4 border rounded-xl">
              <h4 className="font-medium mb-1">تراکم کلاس</h4>
              <p className="text-sm text-muted-foreground">نمایش پر بودن کلاس‌ها و ظرفیت.</p>
            </div>
            <div className="p-4 border rounded-xl">
              <h4 className="font-medium mb-1">عملکرد اساتید</h4>
              <p className="text-sm text-muted-foreground">گزارش حضور، تکالیف و نمره‌دهی.</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center gap-2">
            <Settings className="size-5" />
            <CardTitle className="text-base">تنظیمات</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-3 sm:grid-cols-2">
            <Input placeholder="نام نقش" />
            <Input placeholder="دسترسی‌ها" />
            <Input placeholder="قالب/تم" />
            <Input placeholder="تنظیمات اعلان" />
            <Button onClick={()=> toast.success("تنظیمات ذخیره شد")}>ذخیره تنظیمات</Button>
          </CardContent>
        </Card>
      </div>
    </AppShell>
  );
}
