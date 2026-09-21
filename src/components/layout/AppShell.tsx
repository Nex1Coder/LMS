import * as React from "react";
import { Link, useRouterState } from "@tanstack/react-router";
import {
  LayoutDashboard,
  BookOpen,
  ClipboardList,
  FileCheck2,
  GraduationCap,
  Video,
  Inbox,
  Bot,
  Menu,
  Search,
  Bell,
  CalendarClock,
  LogOut,
  PanelRightClose,
  PanelRightOpen,
  UserCog,
  Database,
  AlertTriangle,
  Send,
  Vote,
  Building2,
  ListChecks,
  ClipboardCheck,
  CalendarDays,
  BarChart3,
  Presentation,
} from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { useRole, usePersianClock } from "@/lib/role";
import { demoUsers, notifications, roleLabels, type Role } from "@/lib/mock-data";
import { RoleLogin } from "./RoleLogin";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Sheet, SheetContent, SheetTitle, SheetHeader } from "@/components/ui/sheet";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

type NavItem = { to: string; label: string; icon: typeof BookOpen; roles: Role[] };

const navItems: NavItem[] = [
  { to: "/", label: "داشبورد", icon: LayoutDashboard, roles: ["student", "professor", "admin"] },
  { to: "/courses", label: "درس‌های من", icon: BookOpen, roles: ["student", "professor"] },
  { to: "/assignments", label: "تکالیف", icon: ClipboardList, roles: ["student", "professor"] },
  { to: "/exams", label: "آزمون‌ها", icon: FileCheck2, roles: ["professor"] },
  { to: "/grades", label: "نمرات و کارنامه", icon: GraduationCap, roles: ["student", "professor"] },
  { to: "/classroom", label: "کلاس آنلاین", icon: Video, roles: ["student", "professor"] },
  { to: "/classroom", label: "وایت‌برد استاد", icon: Presentation, roles: ["professor"] },
  { to: "/requests", label: "درخواست‌های آموزشی", icon: Inbox, roles: ["student", "admin"] },
  { to: "/question-bank", label: "بانک سؤال", icon: Database, roles: ["professor"] },
  {
    to: "/at-risk-students",
    label: "دانشجویان کم‌فعال",
    icon: AlertTriangle,
    roles: ["professor"],
  },
  { to: "/send-notification", label: "ارسال اعلان", icon: Send, roles: ["professor", "admin"] },
  { to: "/live-polls", label: "نظرسنجی حین تدریس", icon: Vote, roles: ["professor"] },
  { to: "/smart-panel", label: "پنل هوشمند", icon: Bot, roles: ["student", "professor"] },
  { to: "/academic-structure", label: "ساختار آموزشی", icon: Building2, roles: ["admin"] },
  { to: "/scheduling", label: "زمان‌بندی و تداخل", icon: CalendarClock, roles: ["admin"] },
  { to: "/add-drop", label: "حذف و اضافه واحد", icon: ListChecks, roles: ["admin"] },
  { to: "/grade-workflow", label: "گردش کار نمرات", icon: ClipboardCheck, roles: ["admin"] },
  { to: "/academic-calendar", label: "تقویم آموزشی", icon: CalendarDays, roles: ["admin"] },
  { to: "/admin-reports", label: "گزارش‌های مدیریتی", icon: BarChart3, roles: ["admin"] },
];

function NavLinks({
  role,
  collapsed,
  onNavigate,
}: {
  role: Role;
  collapsed: boolean;
  onNavigate?: (() => void) | undefined;
}) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  return (
    <nav className="flex flex-col gap-1 px-3">
      {navItems
        .filter((i) => i.roles.includes(role))
        .map(({ to, label, icon: Icon }) => {
          const active = pathname === to;
          return (
            <Link
              key={label}
              to={to}
              onClick={onNavigate}
              className={cn(
                "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors",
                active
                  ? "bg-sidebar-primary text-sidebar-primary-foreground shadow"
                  : "text-sidebar-foreground/75 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
              )}
              title={label}
            >
              <Icon className="size-[18px] shrink-0" />
              {!collapsed && <span className="truncate">{label}</span>}
            </Link>
          );
        })}
    </nav>
  );
}

function SidebarBody({
  role,
  collapsed,
  onNavigate,
}: {
  role: Role;
  collapsed: boolean;
  onNavigate?: (() => void) | undefined;
}) {
  return (
    <div className="flex h-full flex-col bg-sidebar">
      <div className={cn("flex items-center gap-3 px-5 py-5", collapsed && "justify-center px-2")}>
        <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-sidebar-primary/20 ring-1 ring-sidebar-primary/40">
          <GraduationCap className="size-5 text-sidebar-primary" />
        </div>
        {!collapsed && (
          <div className="min-w-0">
            <p className="truncate text-sm font-bold text-sidebar-foreground">آموزش مجازی</p>
            <p className="truncate text-[11px] text-sidebar-foreground/60">دانشگاه — نسخه نمایشی</p>
          </div>
        )}
      </div>
      <div className="mx-3 mb-3 h-px bg-sidebar-border" />
      <div className="flex-1 overflow-y-auto scrollbar-thin pb-4">
        <NavLinks role={role} collapsed={collapsed} onNavigate={onNavigate} />
      </div>
      {!collapsed && (
        <div className="m-3 rounded-xl bg-sidebar-accent/60 p-3 text-[11px] leading-5 text-sidebar-foreground/70">
          نیم‌سال جاری: <span className="font-bold text-sidebar-foreground">۱۴۰۵ - ۱</span>
          <br />
          وضعیت سامانه: فعال
        </div>
      )}
    </div>
  );
}

export function AppShell({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle?: string | undefined;
  children: React.ReactNode;
}) {
  const { role, ready, login, logout } = useRole();
  const [collapsed, setCollapsed] = React.useState(false);
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const clock = usePersianClock();
  const unread = notifications.filter((n) => n.unread).length;

  if (!ready) {
    return <div className="min-h-screen bg-background" />;
  }
  if (!role) return <RoleLogin />;

  const user = demoUsers[role];

  return (
    <div className="flex min-h-screen bg-background">
      <aside
        className={cn(
          "sticky top-0 hidden h-screen shrink-0 border-l border-sidebar-border transition-all lg:block",
          collapsed ? "w-[76px]" : "w-64",
        )}
      >
        <SidebarBody role={role} collapsed={collapsed} />
      </aside>

      <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
        <SheetContent side="right" className="w-72 border-l-0 p-0">
          <SheetHeader className="sr-only">
            <SheetTitle>منوی اصلی</SheetTitle>
          </SheetHeader>
          <SidebarBody role={role} collapsed={false} onNavigate={() => setMobileOpen(false)} />
        </SheetContent>
      </Sheet>

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-30 border-b border-border bg-card/90 backdrop-blur">
          <div className="flex items-center gap-2 px-3 py-3 sm:px-5">
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden"
              onClick={() => setMobileOpen(true)}
              aria-label="منو"
            >
              <Menu className="size-5" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="hidden lg:inline-flex"
              onClick={() => setCollapsed((c) => !c)}
              aria-label="جمع کردن منو"
            >
              {collapsed ? (
                <PanelRightOpen className="size-5" />
              ) : (
                <PanelRightClose className="size-5" />
              )}
            </Button>

            <div className="relative hidden flex-1 md:block md:max-w-sm">
              <Search className="pointer-events-none absolute end-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="جست‌وجوی درس، تکلیف، دانشجو…"
                className="pe-9"
                onKeyDown={(e) => {
                  if (e.key === "Enter") toast.info("جست‌وجو در نسخه نمایشی فعال نیست");
                }}
              />
            </div>

            <div className="me-auto flex items-center gap-1 sm:gap-2">
              <div className="hidden items-center gap-2 rounded-xl bg-secondary px-3 py-2 text-xs text-secondary-foreground xl:flex">
                <CalendarClock className="size-4 text-accent" />
                <span>{clock}</span>
              </div>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="relative" aria-label="اعلان‌ها">
                    <Bell className="size-5" />
                    {unread > 0 && (
                      <span className="absolute end-1.5 top-1.5 size-2 rounded-full bg-accent" />
                    )}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start" className="w-80">
                  <DropdownMenuLabel>اعلان‌ها ({unread} خوانده‌نشده)</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  {notifications.map((n) => (
                    <DropdownMenuItem key={n.id} className="flex-col items-start gap-1 py-2.5">
                      <span className="text-sm leading-5">{n.title}</span>
                      <span className="text-[11px] text-muted-foreground">{n.time}</span>
                    </DropdownMenuItem>
                  ))}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={() => toast.success("همه اعلان‌ها خوانده شد")}
                    className="justify-center text-xs"
                  >
                    علامت‌گذاری همه به‌عنوان خوانده‌شده
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="h-auto gap-2 px-2 py-1.5">
                    <span className="flex size-9 items-center justify-center rounded-full bg-navy text-[11px] font-bold text-primary-foreground">
                      {user.avatar}
                    </span>
                    <span className="hidden text-start sm:block">
                      <span className="block text-xs font-bold">{user.name}</span>
                      <span className="block text-[11px] text-muted-foreground">
                        {roleLabels[role]}
                      </span>
                    </span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start" className="w-64">
                  <DropdownMenuLabel className="leading-6">
                    {user.name}
                    <span className="block text-[11px] font-normal text-muted-foreground">
                      {user.meta}
                    </span>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuLabel className="flex items-center gap-2 text-xs text-muted-foreground">
                    <UserCog className="size-3.5" /> تغییر نقش نمایشی
                  </DropdownMenuLabel>
                  {(["student", "professor", "admin"] as Role[]).map((r) => (
                    <DropdownMenuItem
                      key={r}
                      onClick={() => {
                        login(r);
                        toast.success(`نقش فعال: ${roleLabels[r]}`);
                      }}
                    >
                      {roleLabels[r]}
                      {r === role && (
                        <Badge variant="secondary" className="ms-auto text-[10px]">
                          فعال
                        </Badge>
                      )}
                    </DropdownMenuItem>
                  ))}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={() => {
                      logout();
                      toast.info("از سامانه خارج شدید");
                    }}
                  >
                    <LogOut className="size-4" /> خروج از سامانه
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </header>

        <main className="flex-1 px-3 py-5 sm:px-5 lg:px-7">
          <div className="mb-5">
            <h1 className="text-xl font-bold text-foreground sm:text-2xl">{title}</h1>
            {subtitle && <p className="mt-1 text-sm text-muted-foreground">{subtitle}</p>}
          </div>
          {children}
        </main>

        <footer className="border-t border-border px-5 py-4 text-center text-[11px] text-muted-foreground">
          سامانه جامع آموزش مجازی دانشگاه — نمونه نمایشی با داده‌های آزمایشی
        </footer>
      </div>
    </div>
  );
}
