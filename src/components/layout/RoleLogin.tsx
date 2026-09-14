import { GraduationCap, Presentation, Building2, ArrowLeft } from "lucide-react";
import { toast } from "sonner";
import { useRole } from "@/lib/role";
import { demoUsers, roleLabels, type Role } from "@/lib/mock-data";
import { Button } from "@/components/ui/button";

const items: { role: Role; icon: typeof GraduationCap; desc: string }[] = [
  {
    role: "student",
    icon: GraduationCap,
    desc: "کلاس‌های آنلاین، تکالیف، آزمون‌ها، کارنامه و دستیار هوشمند درس",
  },
  {
    role: "professor",
    icon: Presentation,
    desc: "مدیریت کلاس‌ها، تصحیح تکالیف، طراحی آزمون، حضور و غیاب و ثبت نمره",
  },
  {
    role: "admin",
    icon: Building2,
    desc: "آمار کلان دانشگاه، ارائه دروس ترم، زمان‌بندی امتحانات و کارتابل درخواست‌ها",
  },
];

export function RoleLogin() {
  const { login } = useRole();

  return (
    <div className="min-h-screen bg-gradient-to-br from-navy via-navy-soft to-navy px-4 py-10">
      <div className="mx-auto max-w-5xl">
        <div className="text-center text-primary-foreground">
          <div className="mx-auto flex size-14 items-center justify-center rounded-2xl bg-accent/20 ring-1 ring-accent/40">
            <GraduationCap className="size-7 text-accent" />
          </div>
          <h1 className="mt-5 text-2xl font-bold sm:text-3xl">سامانه جامع آموزش مجازی دانشگاه</h1>
          <p className="mt-3 text-sm text-primary-foreground/70">
            نسخه نمایشی — برای ورود، نقش کاربری خود را انتخاب کنید. نیازی به نام کاربری و گذرواژه
            نیست.
          </p>
        </div>

        <div className="mt-10 grid gap-5 md:grid-cols-3">
          {items.map(({ role, icon: Icon, desc }) => (
            <div
              key={role}
              className="flex flex-col rounded-2xl border border-white/10 bg-white/95 p-6 shadow-xl transition hover:-translate-y-1"
            >
              <div className="flex size-11 items-center justify-center rounded-xl bg-accent/15 text-navy">
                <Icon className="size-5" />
              </div>
              <h2 className="mt-4 text-lg font-bold text-navy">{roleLabels[role]}</h2>
              <p className="mt-1 text-xs text-muted-foreground">{demoUsers[role].name}</p>
              <p className="mt-3 flex-1 text-sm leading-6 text-slate-600">{desc}</p>
              <Button
                className="mt-5 w-full"
                onClick={() => {
                  login(role);
                  toast.success(`با نقش ${roleLabels[role]} وارد شدید`, {
                    description: demoUsers[role].name,
                  });
                }}
              >
                ورود سریع
                <ArrowLeft className="size-4" />
              </Button>
            </div>
          ))}
        </div>

        <p className="mt-8 text-center text-xs text-primary-foreground/50">
          تمام داده‌های این سامانه نمایشی و آزمایشی است.
        </p>
      </div>
    </div>
  );
}
