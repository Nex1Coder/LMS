// داده‌های نمونه سامانه جامع آموزش مجازی دانشگاه

export type Role = "student" | "professor" | "admin";

export const roleLabels: Record<Role, string> = {
  student: "دانشجو",
  professor: "استاد",
  admin: "واحد آموزش",
};

export const demoUsers: Record<Role, { name: string; meta: string; avatar: string }> = {
  student: { name: "سارا محمدی", meta: "کارشناسی مهندسی کامپیوتر — ورودی ۱۴۰۲", avatar: "س م" },
  professor: { name: "دکتر رضا کریمی", meta: "دانشکده فنی و مهندسی — گروه کامپیوتر", avatar: "ر ک" },
  admin: { name: "مهندس فاطمه احمدی", meta: "کارشناس واحد آموزش — معاونت آموزشی", avatar: "ف ا" },
};

export const testStudents = [
  { id: "s101", name: "علی احمدی", code: "942001", major: "مهندسی کامپیوتر", entry: "۱۴۰۲" },
  { id: "s102", name: "نازنین کریمی", code: "942015", major: "مهندسی کامپیوتر", entry: "۱۴۰۲" },
];

export type Course = {
  id: string;
  title: string;
  code: string;
  professor: string;
  units: number;
  students: number;
  progress: number;
  nextSession: string;
  room: string;
  color: string;
  semester: string;
  grade: string | null;
  slides: { title: string; size: string }[];
  recordings: { title: string; duration: string; date: string }[];
};

export const courses: Course[] = [
  {
    id: "c1",
    title: "مبانی هوش مصنوعی",
    code: "CE-4021",
    professor: "دکتر رضا کریمی",
    units: 3,
    students: 48,
    progress: 72,
    nextSession: "شنبه ۱۰:۰۰",
    room: "کلاس مجازی ۲۰۱",
    color: "bg-primary",
    semester: "۱۴۰۵-۱",
    grade: null,
    slides: [
      { title: "جلسه ۱ — مقدمه‌ای بر عامل‌های هوشمند", size: "۴٫۲ مگابایت" },
      { title: "جلسه ۲ — جست‌وجوی آگاهانه", size: "۳٫۱ مگابایت" },
      { title: "جلسه ۳ — بازی‌های دو نفره و مینی‌مکس", size: "۵٫۶ مگابایت" },
    ],
    recordings: [
      { title: "ضبط جلسه ۵ — یادگیری ماشین", duration: "۱:۳۲:۱۰", date: "۱۴۰۵/۰۶/۱۴" },
      { title: "ضبط جلسه ۶ — شبکه‌های عصبی", duration: "۱:۲۸:۴۵", date: "۱۴۰۵/۰۶/۲۱" },
    ],
  },
  {
    id: "c2",
    title: "پایگاه داده پیشرفته",
    code: "CE-3310",
    professor: "دکتر مریم نجفی",
    units: 3,
    students: 62,
    progress: 55,
    nextSession: "یکشنبه ۱۳:۳۰",
    room: "کلاس مجازی ۱۰۵",
    color: "bg-accent",
    semester: "۱۴۰۵-۱",
    grade: null,
    slides: [
      { title: "جلسه ۱ — مدل رابطه‌ای", size: "۲٫۸ مگابایت" },
      { title: "جلسه ۲ — نرمال‌سازی", size: "۳٫۴ مگابایت" },
    ],
    recordings: [{ title: "ضبط جلسه ۴ — تراکنش‌ها", duration: "۱:۱۵:۰۰", date: "۱۴۰۵/۰۶/۱۵" }],
  },
  {
    id: "c3",
    title: "معماری کامپیوتر",
    code: "CE-2205",
    professor: "دکتر حسین موسوی",
    units: 3,
    students: 55,
    progress: 40,
    nextSession: "دوشنبه ۰۸:۰۰",
    room: "کلاس مجازی ۳۰۲",
    color: "bg-primary",
    semester: "۱۴۰۵-۱",
    grade: null,
    slides: [{ title: "جلسه ۱ — مدارهای منطقی", size: "۲٫۲ مگابایت" }],
    recordings: [{ title: "ضبط جلسه ۳ — خط لوله دستورات", duration: "۱:۴۰:۲۲", date: "۱۴۰۵/۰۶/۱۶" }],
  },
  {
    id: "c4",
    title: "زبان تخصصی مهندسی",
    code: "GE-1120",
    professor: "دکتر لیلا شریفی",
    units: 2,
    students: 84,
    progress: 88,
    nextSession: "سه‌شنبه ۱۵:۰۰",
    room: "کلاس مجازی ۱۱۰",
    color: "bg-accent",
    semester: "۱۴۰۵-۱",
    grade: null,
    slides: [{ title: "جلسه ۱ — واژگان تخصصی", size: "۱٫۶ مگابایت" }],
    recordings: [{ title: "ضبط جلسه ۷ — مقاله‌خوانی", duration: "۰:۵۵:۳۰", date: "۱۴۰۵/۰۶/۱۸" }],
  },
  {
    id: "c5",
    title: "آمار و احتمال مهندسی",
    code: "MA-2140",
    professor: "دکتر بابک تهرانی",
    units: 3,
    students: 71,
    progress: 63,
    nextSession: "چهارشنبه ۱۰:۰۰",
    room: "کلاس مجازی ۲۰۸",
    color: "bg-primary",
    semester: "۱۴۰۵-۱",
    grade: null,
    slides: [{ title: "جلسه ۱ — فضای نمونه", size: "۲٫۰ مگابایت" }],
    recordings: [{ title: "ضبط جلسه ۵ — توزیع نرمال", duration: "۱:۲۰:۰۰", date: "۱۴۰۵/۰۶/۱۹" }],
  },
  {
    id: "c6",
    title: "سیستم‌عامل",
    code: "CE-3415",
    professor: "دکتر حسین موسوی",
    units: 3,
    students: 52,
    progress: 100,
    nextSession: "—",
    room: "—",
    color: "bg-primary",
    semester: "۱۴۰۴-۲",
    grade: "۱۷.۵۰",
    slides: [{ title: "جلسه ۱ — فرآیندها و ریسه‌ها", size: "۳٫۰ مگابایت" }],
    recordings: [{ title: "ضبط جلسه ۱۲ — حافظه مجازی", duration: "۱:۲۵:۰۰", date: "۱۴۰۴/۱۱/۲۰" }],
  },
  {
    id: "c7",
    title: "طراحی الگوریتم‌ها",
    code: "CE-3400",
    professor: "دکتر رضا کریمی",
    units: 3,
    students: 45,
    progress: 100,
    nextSession: "—",
    room: "—",
    color: "bg-accent",
    semester: "۱۴۰۴-۲",
    grade: "۱۸.۲۵",
    slides: [{ title: "جلسه ۱ — مرتب‌سازی تقسیم و حل", size: "۲٫۵ مگابایت" }],
    recordings: [{ title: "ضبط جلسه ۱۰ — مسئله کوله‌پشتی", duration: "۱:۱۸:۰۰", date: "۱۴۰۴/۱۱/۱۵" }],
  },
  {
    id: "c8",
    title: "ریاضی گسسته",
    code: "MA-2010",
    professor: "دکتر بابک تهرانی",
    units: 3,
    students: 78,
    progress: 100,
    nextSession: "—",
    room: "—",
    color: "bg-primary",
    semester: "۱۴۰۴-۱",
    grade: "۱۶.۰۰",
    slides: [{ title: "جلسه ۱ — منطق و مجموعه‌ها", size: "۲٫۱ مگابایت" }],
    recordings: [{ title: "ضبط جلسه ۸ — ترکیبیات", duration: "۱:۱۰:۰۰", date: "۱۴۰۴/۰۸/۱۲" }],
  },
  {
    id: "c9",
    title: "برنامه‌نویسی پیشرفته",
    code: "CE-2110",
    professor: "دکتر مریم نجفی",
    units: 3,
    students: 60,
    progress: 100,
    nextSession: "—",
    room: "—",
    color: "bg-accent",
    semester: "۱۴۰۴-۱",
    grade: "۱۹.۰۰",
    slides: [{ title: "جلسه ۱ — مفاهیم شی‌گرا", size: "۲٫۸ مگابایت" }],
    recordings: [{ title: "ضبط جلسه ۹ — الگوهای طراحی", duration: "۱:۲۲:۰۰", date: "۱۴۰۴/۰۸/۱۸" }],
  },
  {
    id: "test-c1",
    title: "جبر خطی پیشرفته — آزمایشی",
    code: "MATH-301",
    professor: "دکتر احمدی",
    units: 3,
    students: 2,
    progress: 30,
    nextSession: "یکشنبه ۱۰:۰۰",
    room: "کلاس مجازی ۱۰۱",
    color: "bg-primary",
    semester: "۱۴۰۵-۱",
    grade: null,
    slides: [{ title: "جلسه ۱ — ماتریس‌ها", size: "۲٫۵ مگابایت" }],
    recordings: [],
  },
  {
    id: "test-c2",
    title: "شبکه‌های کامپیوتری — آزمایشی",
    code: "NET-401",
    professor: "دکتر رضایی",
    units: 3,
    students: 2,
    progress: 15,
    nextSession: "دوشنبه ۱۴:۰۰",
    room: "کلاس مجازی ۱۰۲",
    color: "bg-accent",
    semester: "۱۴۰۵-۱",
    grade: null,
    slides: [{ title: "جلسه ۱ — لایه‌های OSI", size: "۳٫۰ مگابایت" }],
    recordings: [],
  },
];

export type TodayClass = {
  id: string;
  course: string;
  time: string;
  professor: string;
  status: "درحال برگزاری" | "به‌زودی" | "پایان‌یافته";
  attendees?: number;
};

export const todayClasses: TodayClass[] = [
  { id: "t1", course: "مبانی هوش مصنوعی", time: "۱۰:۰۰ - ۱۱:۳۰", professor: "دکتر رضا کریمی", status: "درحال برگزاری", attendees: 41 },
  { id: "t2", course: "پایگاه داده پیشرفته", time: "۱۳:۳۰ - ۱۵:۰۰", professor: "دکتر مریم نجفی", status: "به‌زودی", attendees: 0 },
  { id: "t3", course: "آمار و احتمال مهندسی", time: "۱۵:۳۰ - ۱۷:۰۰", professor: "دکتر بابک تهرانی", status: "به‌زودی", attendees: 0 },
  { id: "t4", course: "زبان تخصصی مهندسی", time: "۰۸:۰۰ - ۰۹:۳۰", professor: "دکتر لیلا شریفی", status: "پایان‌یافته", attendees: 66 },
];

/**
 * جلسهٔ کلاس. هر جلسه یک ردیف مستقل است و لینک خودش را دارد،
 * چون استاد برای هر جلسه جداگانه لینک تعریف می‌کند.
 */
export type ClassSession = {
  id: string;
  course: string;
  professor: string;
  day: string;
  date: string;
  time: string;
  topic: string;
  /** لینک اولیه؛ استاد می‌تواند در مرورگر خودش آن را عوض کند. */
  link: string;
  live: boolean;
};

export const classSessions: ClassSession[] = [
  {
    id: "s1",
    course: "مبانی برنامه‌نویسی پیشرفته",
    professor: "دکتر رضا کریمی",
    day: "امروز",
    date: "۱۴۰۵/۰۶/۱۲",
    time: "۱۰:۰۰ - ۱۱:۳۰",
    topic: "حلقه‌ها و توابع بازگشتی",
    link: "https://meet.nine-green.academy/npu-1405",
    live: true,
  },
  {
    id: "s2",
    course: "پایگاه داده پیشرفته",
    professor: "دکتر مریم نجفی",
    day: "امروز",
    date: "۱۴۰۵/۰۶/۱۲",
    time: "۱۳:۳۰ - ۱۵:۰۰",
    topic: "ایندکس‌ها و بهینه‌سازی کوئری",
    link: "https://meet.nine-green.academy/db-1405",
    live: false,
  },
  {
    id: "s3",
    course: "مبانی هوش مصنوعی",
    professor: "دکتر رضا کریمی",
    day: "امروز",
    date: "۱۴۰۵/۰۶/۱۲",
    time: "۱۵:۳۰ - ۱۷:۰۰",
    topic: "یادگیری ماشین و داده‌های آموزشی",
    link: "https://meet.nine-green.academy/ai-1405",
    live: false,
  },
  {
    id: "s4",
    course: "معماری کامپیوتر",
    professor: "دکتر سعید احمدی",
    day: "فردا",
    date: "۱۴۰۵/۰۶/۱۳",
    time: "۰۸:۰۰ - ۰۹:۳۰",
    topic: "ریزپردازنده و چند هسته‌ای",
    link: "https://meet.nine-green.academy/ca-1405",
    live: false,
  },
  {
    id: "s5",
    course: "طراحی وب",
    professor: "دکتر مریم نجفی",
    day: "پنجشنبه",
    date: "۱۴۰۵/۰۶/۱۵",
    time: "۱۰:۰۰ - ۱۱:۳۰",
    topic: "ریسپانسیو و دسترسی‌پذیری",
    link: "",
    live: false,
  },
  {
    id: "s6",
    course: "امنیت شبکه",
    professor: "دکتر سعید احمدی",
    day: "شنبه",
    date: "۱۴۰۵/۰۶/۱۸",
    time: "۱۴:۰۰ - ۱۵:۳۰",
    topic: "رمزنگاری و دیواره آتش",
    link: "",
    live: false,
  },
];

/** جلساتی که هنوز برگزار نشده‌اند. */
export const upcomingSessions: ClassSession[] = classSessions.filter(
  (s) => s.day !== "امروز" || !s.live,
);

export const weekDays = ["شنبه", "یکشنبه", "دوشنبه", "سه‌شنبه", "چهارشنبه"];
export const timeSlots = ["۰۸:۰۰", "۱۰:۰۰", "۱۳:۳۰", "۱۵:۳۰"];

export const weeklyTimetable: Record<string, Record<string, string | null>> = {
  "شنبه": { "۰۸:۰۰": null, "۱۰:۰۰": "مبانی هوش مصنوعی", "۱۳:۳۰": "معماری کامپیوتر", "۱۵:۳۰": null },
  "یکشنبه": { "۰۸:۰۰": "زبان تخصصی مهندسی", "۱۰:۰۰": null, "۱۳:۳۰": "پایگاه داده پیشرفته", "۱۵:۳۰": "آمار و احتمال مهندسی" },
  "دوشنبه": { "۰۸:۰۰": "معماری کامپیوتر", "۱۰:۰۰": "آمار و احتمال مهندسی", "۱۳:۳۰": null, "۱۵:۳۰": null },
  "سه‌شنبه": { "۰۸:۰۰": null, "۱۰:۰۰": "مبانی هوش مصنوعی", "۱۳:۳۰": null, "۱۵:۳۰": "زبان تخصصی مهندسی" },
  "چهارشنبه": { "۰۸:۰۰": "پایگاه داده پیشرفته", "۱۰:۰۰": "آمار و احتمال مهندسی", "۱۳:۳۰": "معماری کامپیوتر", "۱۵:۳۰": null },
};

export type Assignment = {
  id: string;
  title: string;
  course: string;
  due: string;
  remaining: string;
  status: "در انتظار ارسال" | "ارسال شده" | "تصحیح شده" | "دیرکرد";
  grade: string | null;
  submissions?: number;
  total?: number;
};

export const assignments: Assignment[] = [
  { id: "a1", title: "تمرین سری سوم — الگوریتم‌های جست‌وجو", course: "مبانی هوش مصنوعی", due: "۱۴۰۵/۰۶/۲۸", remaining: "۳ روز", status: "در انتظار ارسال", grade: null, submissions: 22, total: 48 },
  { id: "a2", title: "پروژه طراحی پایگاه داده کتابخانه", course: "پایگاه داده پیشرفته", due: "۱۴۰۵/۰۷/۰۵", remaining: "۱۰ روز", status: "در انتظار ارسال", grade: null, submissions: 8, total: 62 },
  { id: "a3", title: "تمرین سری دوم — مدارهای ترتیبی", course: "معماری کامپیوتر", due: "۱۴۰۵/۰۶/۲۰", remaining: "پایان یافته", status: "ارسال شده", grade: null, submissions: 50, total: 55 },
  { id: "a4", title: "خلاصه‌نویسی مقاله انگلیسی", course: "زبان تخصصی مهندسی", due: "۱۴۰۵/۰۶/۱۲", remaining: "پایان یافته", status: "تصحیح شده", grade: "۱۸٫۵", submissions: 80, total: 84 },
  { id: "a5", title: "تمرین توزیع‌های احتمال", course: "آمار و احتمال مهندسی", due: "۱۴۰۵/۰۶/۱۰", remaining: "پایان یافته", status: "دیرکرد", grade: "۱۲", submissions: 65, total: 71 },
];

export type Exam = {
  id: string;
  course: string;
  type: "تستی آنلاین" | "تشریحی آنلاین" | "پروژه‌محور";
  date: string;
  time: string;
  duration: string;
  questions: number;
  status: "برنامه‌ریزی شده" | "فعال" | "برگزار شده";
};

export const exams: Exam[] = [
  { id: "e1", course: "مبانی هوش مصنوعی", type: "تستی آنلاین", date: "۱۴۰۵/۰۶/۳۰", time: "۱۰:۰۰", duration: "۹۰ دقیقه", questions: 40, status: "فعال" },
  { id: "e2", course: "پایگاه داده پیشرفته", type: "تشریحی آنلاین", date: "۱۴۰۵/۰۷/۰۸", time: "۱۳:۰۰", duration: "۱۲۰ دقیقه", questions: 6, status: "برنامه‌ریزی شده" },
  { id: "e3", course: "آمار و احتمال مهندسی", type: "تستی آنلاین", date: "۱۴۰۵/۰۷/۱۲", time: "۰۹:۰۰", duration: "۷۵ دقیقه", questions: 30, status: "برنامه‌ریزی شده" },
  { id: "e4", course: "زبان تخصصی مهندسی", type: "پروژه‌محور", date: "۱۴۰۵/۰۶/۱۵", time: "۱۶:۰۰", duration: "—", questions: 3, status: "برگزار شده" },
];

export const examQuestions = [
  {
    q: "کدام گزینه یکی از ویژگی‌های عامل هوشمند عقلانی محسوب می‌شود؟",
    options: ["حذف کامل عدم قطعیت", "بیشینه‌سازی معیار کارایی مورد انتظار", "استفاده اجباری از شبکه عصبی", "نداشتن حافظه از محیط"],
  },
  {
    q: "الگوریتم جست‌وجوی A* در چه شرطی بهینه است؟",
    options: ["تابع اکتشافی بیش‌برآورد باشد", "تابع اکتشافی مقبول (admissible) باشد", "گراف حتماً درخت باشد", "هزینه یال‌ها منفی باشد"],
  },
  {
    q: "در یادگیری با نظارت، مجموعه داده شامل چه چیزی است؟",
    options: ["فقط ورودی‌ها", "ورودی و برچسب هدف", "فقط پاداش", "هیچ‌کدام"],
  },
];

export type Grade = {
  course: string;
  code: string;
  units: number;
  midterm: string;
  assignments: string;
  final: string;
  total: string;
  state: "قبول" | "در جریان";
};

export const grades: Grade[] = [
  { course: "مبانی هوش مصنوعی", code: "CE-4021", units: 3, midterm: "۱۷٫۲۵", assignments: "۱۹", final: "—", total: "در جریان", state: "در جریان" },
  { course: "پایگاه داده پیشرفته", code: "CE-3310", units: 3, midterm: "۱۵٫۵۰", assignments: "۱۷", final: "—", total: "در جریان", state: "در جریان" },
  { course: "معماری کامپیوتر", code: "CE-2205", units: 3, midterm: "۱۴٫۰۰", assignments: "۱۶", final: "۱۵٫۲۵", total: "۱۵٫۱۰", state: "قبول" },
  { course: "زبان تخصصی مهندسی", code: "GE-1120", units: 2, midterm: "۱۸٫۵۰", assignments: "۲۰", final: "۱۹٫۰۰", total: "۱۹٫۱۰", state: "قبول" },
  { course: "آمار و احتمال مهندسی", code: "MA-2140", units: 3, midterm: "۱۳٫۲۵", assignments: "۱۴", final: "۱۶٫۰۰", total: "۱۵٫۰۰", state: "قبول" },
];

export const gpaHistory = [
  { term: "۱۴۰۲-۱", gpa: 15.2 },
  { term: "۱۴۰۲-۲", gpa: 16.1 },
  { term: "۱۴۰۳-۱", gpa: 16.8 },
  { term: "۱۴۰۳-۲", gpa: 17.4 },
  { term: "۱۴۰۴-۱", gpa: 17.9 },
];

export type RequestItem = {
  id: string;
  type: string;
  student: string;
  date: string;
  status: "در حال بررسی" | "تایید شده" | "رد شده" | "ثبت شده";
  timeline: { title: string; date: string; done: boolean }[];
};

export const requestTypes = [
  "حذف و اضافه دروس",
  "مرخصی تحصیلی",
  "معرفی به استاد",
  "گواهی اشتغال به تحصیل",
  "حذف اضطراری درس",
  "درخواست تجدیدنظر نمره",
  "حذف ترم",
  "مهمانی (میهمانی بین‌دانشگاهی)",
];

export const requests: RequestItem[] = [
  {
    id: "R-140512",
    type: "حذف و اضافه دروس",
    student: "سارا محمدی",
    date: "۱۴۰۵/۰۶/۱۸",
    status: "در حال بررسی",
    timeline: [
      { title: "ثبت درخواست توسط دانشجو", date: "۱۴۰۵/۰۶/۱۸", done: true },
      { title: "بررسی استاد راهنما", date: "۱۴۰۵/۰۶/۱۹", done: true },
      { title: "بررسی واحد آموزش", date: "در انتظار", done: false },
      { title: "اعلام نتیجه نهایی", date: "—", done: false },
    ],
  },
  {
    id: "R-140498",
    type: "گواهی اشتغال به تحصیل",
    student: "سارا محمدی",
    date: "۱۴۰۵/۰۶/۱۰",
    status: "تایید شده",
    timeline: [
      { title: "ثبت درخواست توسط دانشجو", date: "۱۴۰۵/۰۶/۱۰", done: true },
      { title: "بررسی واحد آموزش", date: "۱۴۰۵/۰۶/۱۱", done: true },
      { title: "صدور گواهی و بارگذاری فایل", date: "۱۴۰۵/۰۶/۱۲", done: true },
    ],
  },
  {
    id: "R-140455",
    type: "مرخصی تحصیلی",
    student: "علی رضایی",
    date: "۱۴۰۵/۰۶/۰۲",
    status: "رد شده",
    timeline: [
      { title: "ثبت درخواست توسط دانشجو", date: "۱۴۰۵/۰۶/۰۲", done: true },
      { title: "بررسی شورای آموزشی", date: "۱۴۰۵/۰۶/۰۵", done: true },
      { title: "رد درخواست — عدم احراز شرایط", date: "۱۴۰۵/۰۶/۰۶", done: true },
    ],
  },
  {
    id: "R-140440",
    type: "معرفی به استاد",
    student: "نگار سلطانی",
    date: "۱۴۰۵/۰۵/۲۸",
    status: "در حال بررسی",
    timeline: [
      { title: "ثبت درخواست توسط دانشجو", date: "۱۴۰۵/۰۵/۲۸", done: true },
      { title: "بررسی مدیر گروه", date: "در انتظار", done: false },
    ],
  },
  {
    id: "R-140520",
    type: "حذف ترم",
    student: "امیرحسین قاسمی",
    date: "۱۴۰۵/۰۶/۲۰",
    status: "در حال بررسی",
    timeline: [
      { title: "ثبت درخواست توسط دانشجو", date: "۱۴۰۵/۰۶/۲۰", done: true },
      { title: "بررسی استاد راهنما", date: "۱۴۰۵/۰۶/۲۱", done: true },
      { title: "بررسی شورای آموزشی", date: "در انتظار", done: false },
      { title: "اعلام نتیجه نهایی", date: "—", done: false },
    ],
  },
  {
    id: "R-140501",
    type: "مهمانی (میهمانی بین‌دانشگاهی)",
    student: "زهرا بهرامی",
    date: "۱۴۰۵/۰۶/۰۸",
    status: "تایید شده",
    timeline: [
      { title: "ثبت درخواست توسط دانشجو", date: "۱۴۰۵/۰۶/۰۸", done: true },
      { title: "بررسی واحد آموزش", date: "۱۴۰۵/۰۶/۰۹", done: true },
      { title: "صدور معرفی‌نامه میهمانی", date: "۱۴۰۵/۰۶/۱۰", done: true },
    ],
  },
];

export const studentsList = [
  { id: "40212345", name: "سارا محمدی", major: "مهندسی کامپیوتر", present: true, grade: "" },
  { id: "40212346", name: "علی رضایی", major: "مهندسی کامپیوتر", present: true, grade: "" },
  { id: "40212347", name: "نگار سلطانی", major: "مهندسی برق", present: false, grade: "" },
  { id: "40212348", name: "امیرحسین قاسمی", major: "مهندسی کامپیوتر", present: true, grade: "" },
  { id: "40212349", name: "زهرا بهرامی", major: "مهندسی صنایع", present: true, grade: "" },
  { id: "40212350", name: "محمد اکبری", major: "مهندسی کامپیوتر", present: false, grade: "" },
];

export const adminStats = [
  { label: "کل دانشجویان", value: "۱۲٬۴۸۰", change: "+۳٫۲٪", icon: "users" },
  { label: "اعضای هیئت علمی", value: "۶۴۸", change: "+۱٫۱٪", icon: "professor" },
  { label: "کلاس‌های فعال", value: "۱٬۰۹۲", change: "+۵٫۷٪", icon: "classes" },
  { label: "نرخ رضایت", value: "۹۱٪", change: "+۲٫۴٪", icon: "smile" },
];

export const majors = [
  { name: "مهندسی کامپیوتر", students: 1840, courses: 62, head: "دکتر رضا کریمی" },
  { name: "مهندسی برق", students: 1520, courses: 58, head: "دکتر حسین موسوی" },
  { name: "مهندسی صنایع", students: 980, courses: 44, head: "دکتر مریم نجفی" },
  { name: "حسابداری", students: 1230, courses: 39, head: "دکتر بابک تهرانی" },
  { name: "روان‌شناسی", students: 1105, courses: 41, head: "دکتر لیلا شریفی" },
];

export const enrollmentChart = [
  { term: "۱۴۰۳-۱", ثبت‌نام: 9800, فعال: 9100 },
  { term: "۱۴۰۳-۲", ثبت‌نام: 10400, فعال: 9700 },
  { term: "۱۴۰۴-۱", ثبت‌نام: 11200, فعال: 10500 },
  { term: "۱۴۰۴-۲", ثبت‌نام: 11800, فعال: 11100 },
  { term: "۱۴۰۵-۱", ثبت‌نام: 12480, فعال: 11900 },
];

export const attendanceChart = [
  { day: "شنبه", حضور: 88 },
  { day: "یکشنبه", حضور: 92 },
  { day: "دوشنبه", حضور: 85 },
  { day: "سه‌شنبه", حضور: 90 },
  { day: "چهارشنبه", حضور: 79 },
];

export const requestPie = [
  { name: "حذف و اضافه", value: 42 },
  { name: "گواهی تحصیلی", value: 28 },
  { name: "مرخصی تحصیلی", value: 16 },
  { name: "معرفی به استاد", value: 14 },
];

export const notifications = [
  { id: "n1", title: "نمره میان‌ترم پایگاه داده ثبت شد", time: "۱۰ دقیقه پیش", unread: true },
  { id: "n2", title: "مهلت تمرین سری سوم هوش مصنوعی نزدیک است", time: "۲ ساعت پیش", unread: true },
  { id: "n3", title: "کلاس آمار فردا ساعت ۱۰ برگزار می‌شود", time: "دیروز", unread: false },
  { id: "n4", title: "درخواست گواهی اشتغال به تحصیل تایید شد", time: "۳ روز پیش", unread: false },
];

export const classChat = [
  { id: 1, user: "دکتر رضا کریمی", text: "سلام به همه، جلسه امروز درباره شبکه‌های عصبی است.", me: false },
  { id: 2, user: "علی رضایی", text: "سلام استاد، صدا واضح است.", me: false },
  { id: 3, user: "سارا محمدی", text: "اسلایدها روی سامانه بارگذاری شده؟", me: true },
  { id: 4, user: "دکتر رضا کریمی", text: "بله، در بخش محتوای درس در دسترس است.", me: false },
];

export const aiSuggestions = [
  "خلاصه جلسه گذشته درس هوش مصنوعی را بگو",
  "برای آزمون آمار چه برنامه مطالعه‌ای پیشنهاد می‌کنی؟",
  "شرایط مرخصی تحصیلی در آیین‌نامه چیست؟",
  "تفاوت نرمال‌سازی سطح دوم و سوم را توضیح بده",
];

export const aiAnswers: Record<string, string> = {
  default:
    "بر اساس محتوای درسی و آیین‌نامه آموزشی دانشگاه، پاسخ شما این است:\n\n۱) نکته کلیدی: موضوع مطرح‌شده در جلسات اخیر همین درس پوشش داده شده است.\n۲) منابع پیشنهادی: اسلایدهای جلسه‌های ۴ تا ۶ و جلسه ضبط‌شده مربوطه.\n۳) گام بعدی: تمرین‌های نمونه پایان فصل را حل کنید و در صورت ابهام از استاد درس بپرسید.\n\n(این پاسخ نمونه و آزمایشی است.)",
  "شرایط مرخصی تحصیلی در آیین‌نامه چیست؟":
    "بر اساس آیین‌نامه آموزشی: دانشجو می‌تواند حداکثر دو نیم‌سال از مرخصی تحصیلی استفاده کند. درخواست باید پیش از پایان مهلت حذف و اضافه ثبت شود و مرخصی جزو سنوات تحصیلی محاسبه می‌شود. تایید نهایی بر عهده شورای آموزشی دانشکده است.",
};

export type SmartSummary = {
  course: string;
  type: "جزوه" | "ویدیوی کلاس";
  text: string;
};

export const smartSummaries: SmartSummary[] = [
  {
    course: "مبانی هوش مصنوعی",
    type: "جزوه",
    text: "در این جلسات مفاهیم عامل هوشمند (عقلانی، عاملیت، محیط) مرور شد. سپس سه رویکرد اصلی: جست‌وجوی آگاهانه (A* و اکتشافی‌های مقبول)، بازی‌های دو نفره (مینی‌مکس و برش آلفا-بتا) و مقدمه‌ای بر یادگیری ماشین (یادگیری با/بدون نظارت) بررسی شد. نکته کلیدی: عقلانیت = بیشینه‌سازی معیار کارایی مورد انتظار، نه دانش کامل. مینی‌مکس با برش آلفا-بتا معماری همان درخت را بررسی می‌کند ولی گره‌های غیرضروری را هرس می‌کند.",
  },
  {
    course: "مبانی هوش مصنوعی",
    type: "ویدیوی کلاس",
    text: "جلسه ۶ (شبکه‌های عصبی): ساختار پرسپترون چندلایه، تابع فعال‌سازی، پس‌انتشار خطا و نکات عملی مثل نرخ یادگیری و overfitting. استاد روی اهمیت split داده و اختلاف train/validation تأکید کرد. تمرین درسی: یک شبکه با دو لایه مخفی برای دسته‌بندی سه کلاس طراحی کنید.",
  },
  {
    course: "پایگاه داده پیشرفته",
    type: "جزوه",
    text: "مرور مدل رابطه‌ای (کلیدها، وابستگی تابعی) و نرمال‌سازی تا سومین فرم نرمال (3NF). اصول: جداسازی وابستگی‌های پاره‌ای و تعدی، حذف تکراری‌ها برای کاهش ناهنجاری‌های به‌روزرسانی. مثال پایانی: تبدیل جدول سفارش به سه جدول جدا از طریق تجزیه بدون اتلاف.",
  },
];

export type Flashcard = { front: string; back: string };

export const flashcardsByCourse: Record<string, Flashcard[]> = {
  "مبانی هوش مصنوعی": [
    { front: "عامل عقلانی چیست؟", back: "عاملی که معیار کارایی مورد انتظار را با توجه به ادراکات و اعمالش بیشینه می‌کند (منبع: جلسه ۱)." },
    { front: "شرط بهینه بودن A*", back: "تابع اکتشافی باید مقبول (admissible) و در عمل سازگار (consistent) باشد (جلسه ۲)." },
    { front: "برش آلفا-بتا چه می‌کند؟", back: "با نگهداری آلفا/بتا، زیردرخت‌های غیرمؤثر را در جست‌وجوی مینی‌مکس هرس می‌کند (جلسه ۳)." },
    { front: "یادگیری با/بدون نظارت", back: "با نظارت: ورودی+برچسب؛ بدون نظارت: خوشه‌بندی بدون برچسب (جلسه ۵)." },
  ],
  "پایگاه داده پیشرفته": [
    { front: "فرم نرمال دوم (2NF) چه شرطی دارد؟", back: "حذف وابستگی پاره‌ای؛ هر ویژگی غیرکلید باید به کل کلید اصلی وابسته باشد (جلسه ۲)." },
    { front: "تجزیه بدون اتلاف یعنی؟", back: "بازیابی دقیق رابطه اصلی از طریق join طبیعی اجزای تجزیه‌شده (جلسه ۲)." },
  ],
};

export const conceptMapsByCourse: Record<string, { root: string; children: string[] }> = {
  "مبانی هوش مصنوعی": {
    root: "عامل هوشمند",
    children: ["ادراک و عمل", "جست‌وجو (BFS/A*/مینی‌مکس)", "دانش و استنتاج", "یادگیری ماشین", "تصمیم‌گیری عقلانی"],
  },
  "پایگاه داده پیشرفته": {
    root: "طراحی پایگاه داده",
    children: ["مدل رابطه‌ای", "وابستگی تابعی", "نرمال‌سازی 1NF→3NF", "تجزیه بدون اتلاف", "شاخص و بهینه‌سازی پرس‌وجو"],
  },
};

export type PracticeQuestion = { q: string; options: string[]; answer: number; skill: string };

export const weakPoints = [
  { skill: "جست‌وجوی آگاهانه", level: "ضعیف", progress: 45, course: "مبانی هوش مصنوعی" },
  { skill: "نرمال‌سازی پایگاه داده", level: "متوسط", progress: 62, course: "پایگاه داده پیشرفته" },
  { skill: "خط لوله دستورات", level: "متوسط", progress: 58, course: "معماری کامپیوتر" },
];

export const practiceQuestionsByWeakness: Record<string, PracticeQuestion[]> = {
  "جست‌وجوی آگاهانه": [
    { q: "کدام تابع اکتشافی همیشه مقبول است؟", options: ["بیش‌برآورد واقعی", "کم‌برآورد یا برابر هزینه واقعی", "تصادفی", "صفر برای همه گره‌ها"], answer: 1, skill: "جست‌وجوی آگاهانه" },
    { q: "در A* هزینه g(n)+h(n) چه می‌کند؟", options: ["فقط هزینه پیموده‌شده", "تخمین کل هزینه از گره شروع تا هدف", "هزینه تنها", "محدودیت حافظه"], answer: 1, skill: "جست‌وجوی آگاهانه" },
  ],
  "نرمال‌سازی پایگاه داده": [
    { q: "وابستگی پاره‌ای یعنی؟", options: ["وابستگی به بخشی از کلید اصلی", "وابستگی تعدی", "وابستگی کامل", "عدم وابستگی"], answer: 0, skill: "نرمال‌سازی پایگاه داده" },
  ],
  "خط لوله دستورات": [
    { q: "خطر (Hazard) در خط لوله یعنی؟", options: ["افزایش سرعت", "شرطی که اجرای مرحله را متوقف می‌کند", "درهم‌ریختگی حافظه", "اشتراک داده مجاز"], answer: 1, skill: "خط لوله دستورات" },
  ],
};

export type ExamQuestion = {
  type: "mc" | "essay";
  q: string;
  options: string[];
  answer: number;
  modelAnswer: string;
};

export const examQuestionsByCourse: Record<string, ExamQuestion[]> = {
  "مبانی هوش مصنوعی": [
    {
      type: "mc",
      q: "در جست‌وجوی A*، برای به‌ینه بودن پاسخ چه شرطی بر تابع اکتشافی لازم است؟",
      options: [
        "بیش‌برآورد هزینه واقعی",
        "کم‌برآورد یا برابر با هزینه واقعی (مقبول بودن)",
        "مستقل بودن از هزینه مسیر",
        "هیچ شرطی لازم نیست",
      ],
      answer: 1,
      modelAnswer: "",
    },
    {
      type: "mc",
      q: "عامل عقلانی (Rational Agent) چه عاملی است؟",
      options: [
        "عاملی که همیشه بیشترین دانش را دارد",
        "عاملی که معیار کارایی مورد انتظار را با توجه به ادراکات و اعمالش بیشینه می‌کند",
        "عاملی که سریع‌ترین پاسخ را می‌دهد",
        "عاملی که از یادگیری ماشین استفاده می‌کند",
      ],
      answer: 1,
      modelAnswer: "",
    },
    {
      type: "essay",
      q: "تفاوت برش آلفا-بتا با جست‌وجوی مینی‌مکس در بازی‌های دو نفره را توضیح دهید و مزیت آن را بیان کنید.",
      options: [],
      answer: -1,
      modelAnswer: "برش آلفا-بتا همان درخت مینی‌مکس را بررسی می‌کند اما گره‌های غیرضروری را بر اساس کران آلفا و بتا هرس می‌کند؛ در نتیجه به همان مقدار بهینه می‌رسد ولی تعداد گره‌های بازدیدشده به‌طور قابل‌توجهی کمتر است.",
    },
  ],
  "پایگاه داده پیشرفته": [
    {
      type: "mc",
      q: "شرط فرم نرمال دوم (2NF) چیست؟",
      options: [
        "حذف وابستگی تعدی",
        "حذف وابستگی پاره‌ای؛ هر ویژگی غیرکلید به کل کلید اصلی وابسته باشد",
        "مستقل بودن همه ویژگی‌ها",
        "وجود کلید مرکب",
      ],
      answer: 1,
      modelAnswer: "",
    },
    {
      type: "essay",
      q: "مفهوم «تجزیه بدون اتلاف» را تعریف کنید و با یک مثال نشان دهید چگونه می‌توان جدولی را بدون از دست دادن اطلاعات تجزیه کرد.",
      options: [],
      answer: -1,
      modelAnswer: "تجزیه بدون اتلاف یعنی بتوان رابطه اصلی را از طریق join طبیعی اجزای تجزیه‌شده به‌طور دقیق بازسازی کرد. مثال: جدول سفارش را به سه جدول جدا تجزیه می‌کنیم؛ با join دوباره همان داده اولیه به‌دست می‌آید.",
    },
  ],
};

export type StudyPlanStep = { step: number; title: string; action: string; done: boolean };

export const studyPlanByCourse: Record<string, StudyPlanStep[]> = {
  "مبانی هوش مصنوعی": [
    { step: 1, title: "مرور عامل‌ها و جست‌وجو", action: "خلاصه جلسات ۱-۳ + حل ۸ تمرین آگاهانه", done: true },
    { step: 2, title: "یادگیری ماشین", action: "اسلایدهای ۴-۶ + جزوه ویدئویی جلسه ۶", done: false },
    { step: 3, title: "کارنامه تمرینی", action: "تمرین هوشمند نقاط ضعف (جست‌وجوی آگاهانه)", done: false },
    { step: 4, title: "آزمون شبیه‌سازی", action: "یک آزمون تستی ۴۰ سوالی در محیط سامانه", done: false },
  ],
  "پایگاه داده پیشرفته": [
    { step: 1, title: "مدل رابطه‌ای و کلیدها", action: "جلسات ۱ + جزوه", done: true },
    { step: 2, title: "نرمال‌سازی", action: "حل ۵ مثال جدول تا 3NF", done: false },
    { step: 3, title: "تراکنش‌ها", action: "جلسه ضبط‌شده ۴ (۱:۱۵)", done: false },
  ],
};

export type Explanation = { simple: string; advanced: string };

export const explanationTopics: Record<string, Explanation> = {
  "برش آلفا-بتا": {
    simple: "یک روش هوشمند برای کوتاه کردن بررسی حرکت‌های شطرنج‌گونه: اگر شاخه‌ای نتواند بهتر از بهترین قبلی شود، دیگر بررسی نمی‌شود.",
    advanced: "الگوریتمی بر مبنای مینی‌مکس که دو آستانه α (بیشترین برای بازیکن بیشینه‌ساز) و β (کمترین برای کمینه‌ساز) را نگه می‌دارد و در α≥β زیردرخت را هرس می‌کند. پیچیدگی در حالت ایده‌آل از O(b^m) به O(b^(m/2)) کاهش می‌یابد.",
  },
  "نرمال‌سازی 3NF": {
    simple: "قاعده‌ای برای مرتب‌کردن جدول‌ها که اطلاعات تکراری و خطای به‌روزرسانی را کم می‌کند.",
    advanced: "رابطه در 3NF است اگر در 2NF باشد و هیچ وابستگی تعدی (غیرکلید→غیرکلید) نداشته باشد؛ با حذف پارادوکس ذخیره‌سازی ناهنجاری‌های تغییر حذف می‌شود.",
  },
  "خطر خط لوله": {
    simple: "وقتی اجرای یک دستور باید منتظر شود چون به خروجی دستور قبلی نیاز دارد.",
    advanced: "Hazardهای ساختاری، داده‌ای و کنترلی؛ برطرف‌شدن با forwarding و stall؛ در معماری‌های فوق‌اسکالر با reorder buffer مدیریت می‌شود.",
  },
};

export type SmartSearchResult = {
  topic: string;
  snippet: string;
  source: string;
  session: string;
  page: string;
};

export const smartSearchIndex: SmartSearchResult[] = [
  { topic: "تابع اکتشافی", snippet: "تعریف اکتشافی مقبول و سازگار و نقش آن در بهینه بودن A*.", source: "جزوه", session: "۲", page: "۱۴" },
  { topic: "مینی‌مکس", snippet: "الگوریتم تصمیم‌گیری در بازی‌های دو نفره و ارزش‌گذاری برگ‌ها.", source: "اسلاید", session: "۳", page: "۸" },
  { topic: "پس‌انتشار خطا", snippet: "محاسبه گرادیان وزن‌ها در شبکه عصبی چندلایه از لایه خروجی به عقب.", source: "ویدیوی کلاس", session: "۶", page: "۲۲" },
  { topic: "وابستگی تابعی", snippet: "شرط X→Y در مدل رابطه‌ای و نقش آن در تشخیص ناهنجاری‌ها.", source: "جزوه", session: "۱", page: "۵" },
  { topic: "تجزیه بدون اتلاف", snippet: "شرطی که join طبیعی اجزا، رابطه اصلی را دقیق بازسازی کند.", source: "جزوه", session: "۲", page: "۱۹" },
  { topic: "خط لوله", snippet: "سیکل‌های Fetch/Decode/Execute و مدیریت hazardهای داده‌ای.", source: "ویدیوی کلاس", session: "۳", page: "۱۱" },
];

// ── بانک سؤال ────────────────────────────────────────────────────────────────

export type QuestionType = "تستی" | "تشریحی" | "پروژه‌ای";
export type Difficulty = "آسان" | "متوسط" | "سخت";

export type Question = {
  id: string;
  course: string;
  type: QuestionType;
  difficulty: Difficulty;
  topic: string;
  text: string;
  options?: string[];
  answer?: number;
  usedCount: number;
  lastUsed: string;
};

export const questionBank: Question[] = [
  { id: "q1", course: "مبانی هوش مصنوعی", type: "تستی", difficulty: "متوسط", topic: "عامل هوشمند", text: "کدام یک ویژگی عامل عقلانی نیست؟", options: ["بیشینه‌سازی معیار کارایی", " reacts to environment", "یادگیری از تجربه", "حذف عدم قطعیت"], answer: 3, usedCount: 12, lastUsed: "۱۴۰۵/۰۵/۱۰" },
  { id: "q2", course: "مبانی هوش مصنوعی", type: "تستی", difficulty: "سخت", topic: "جست‌وجو", text: "در A* در چه شرطی تضمین کننده کوتاه‌ترین مسیر است؟", options: ["h(n) همیشه صفر باشد", "h(n) مقبول (admissible) باشد", "h(n) بیش‌برآورد باشد", "g(n) نادیده گرفته شود"], answer: 1, usedCount: 8, lastUsed: "۱۴۰۵/۰۵/۱۵" },
  { id: "q3", course: "مبانی هوش مصنوعی", type: "تشریحی", difficulty: "سخت", topic: "یادگیری ماشین", text: "تفاوت یادگیری با نظارت و بدون نظارت را با ذکر مثال توضیح دهید.", usedCount: 4, lastUsed: "۱۴۰۵/۰۴/۲۰" },
  { id: "q4", course: "مبانی هوش مصنوعی", type: "پروژه‌ای", difficulty: "سخت", topic: "شبکه عصبی", text: "یک شبکه عصبی برای طبقه‌بندی MNIST طراحی و نتایج را گزارش کنید.", usedCount: 1, lastUsed: "۱۴۰۵/۰۳/۰۱" },
  { id: "q5", course: "پایگاه داده پیشرفته", type: "تستی", difficulty: "آسان", topic: "نرمال‌سازی", text: "در 2NF چه چیزی حذف می‌شود؟", options: ["وابستگی پاره‌ای", "وابستگی تعدی", "کلید اصلی", "اطلاعات تکراری"], answer: 0, usedCount: 15, lastUsed: "۱۴۰۵/۰۵/۱۲" },
  { id: "q6", course: "پایگاه داده پیشرفته", type: "تستی", difficulty: "متوسط", topic: "تراکنش", text: "کدام خاصیت تراکنش تضمین می‌کند که تراکنش قابل بازیابی است؟", options: ["ATOMICITY", "CONSISTENCY", "ISOLATION", "DURABILITY"], answer: 3, usedCount: 10, lastUsed: "۱۴۰۵/۰۵/۱۸" },
  { id: "q7", course: "پایگاه داده پیشرفته", type: "تشریحی", difficulty: "متوسط", topic: "تجزیه رابطه", text: "یک رابطه R(A,B,C,D) با وابستگی‌های A→B و B→C را تا 3NF نرمال‌سازی کنید.", usedCount: 6, lastUsed: "۱۴۰۵/۰۴/۲۵" },
  { id: "q8", course: "معماری کامپیوتر", type: "تستی", difficulty: "متوسط", topic: "خط لوله", text: "خطر داده‌ای (data hazard) چیست؟", options: ["افزایش فرکانس", "نیاز به داده خروجی دستور قبلی", "خرابی حافظه", "خطای کنترلی"], answer: 1, usedCount: 9, lastUsed: "۱۴۰۵/۰۵/۱۴" },
  { id: "q9", course: "معماری کامپیوتر", type: "تستی", difficulty: "آسان", topic: "حافظه", text: "حافظه کش چه مشکلی را حل می‌کند؟", options: ["کمبود حافظه اصلی", "شکاف سرعت CPU و RAM", "نیاز به فضای دیسک", "پردازش موازی"], answer: 1, usedCount: 18, lastUsed: "۱۴۰۵/۰۵/۲۰" },
  { id: "q10", course: "آمار و احتمال مهندسی", type: "تستی", difficulty: "متوسط", topic: "توزیع نرمال", text: "در توزیع نرمال استاندارد، درصد داده‌ها بین Z=−1 تا Z=+1 چقدر است؟", options: ["۶۸٪", "۹۵٪", "۹۹٪", "۵۰٪"], answer: 0, usedCount: 14, lastUsed: "۱۴۰۵/۰۵/۱۶" },
  { id: "q11", course: "آمار و احتمال مهندسی", type: "تشریحی", difficulty: "سخت", topic: "آزمون فرض", text: "آزمون فرض H₀: μ=۱۰ در مقابل H₁: μ>۱۰ را با داده‌های نمونه حل کنید.", usedCount: 3, lastUsed: "۱۴۰۵/۰۴/۱۰" },
];

// ── دانشجویان کم‌فعال / در معرض افت ─────────────────────────────────────────

export type AtRiskStudent = {
  id: string;
  name: string;
  course: string;
  attendanceRate: number;
  avgGrade: number;
  assignmentsDone: number;
  assignmentsTotal: number;
  risk: "بحرانی" | "هشدار" | "مرزی";
  lastActivity: string;
};

export const atRiskStudents: AtRiskStudent[] = [
  { id: "40212345", name: "محمد اکبری", course: "مبانی هوش مصنوعی", attendanceRate: 42, avgGrade: 9.5, assignmentsDone: 1, assignmentsTotal: 4, risk: "بحرانی", lastActivity: "۱۴۰۵/۰۵/۲۰" },
  { id: "40212350", name: "زهرا بهرامی", course: "پایگاه داده پیشرفته", attendanceRate: 55, avgGrade: 11.0, assignmentsDone: 2, assignmentsTotal: 4, risk: "هشدار", lastActivity: "۱۴۰۵/۰۵/۲۵" },
  { id: "40212347", name: "نگار سلطانی", course: "معماری کامپیوتر", attendanceRate: 60, avgGrade: 12.5, assignmentsDone: 3, assignmentsTotal: 4, risk: "مرزی", lastActivity: "۱۴۰۵/۰۵/۲۸" },
  { id: "40212360", name: "امیر حسینی", course: "مبانی هوش مصنوعی", attendanceRate: 38, avgGrade: 8.0, assignmentsDone: 0, assignmentsTotal: 4, risk: "بحرانی", lastActivity: "۱۴۰۵/۰۴/۱۵" },
  { id: "40212365", name: "رضا شمسی", course: "آمار و احتمال مهندسی", attendanceRate: 65, avgGrade: 13.0, assignmentsDone: 2, assignmentsTotal: 4, risk: "مرزی", lastActivity: "۱۴۰۵/۰۵/۲۷" },
];

// ── ارسال اعلان ──────────────────────────────────────────────────────────────

export type NotificationTarget = "همه دانشجویان" | "درس خاص" | "دانشجوی خاص";
export type SentNotification = {
  id: string;
  target: NotificationTarget;
  course?: string;
  student?: string;
  subject: string;
  body: string;
  sentAt: string;
  readBy: number;
  totalRecipients: number;
};

export const sentNotifications: SentNotification[] = [
  { id: "sn1", target: "همه دانشجویان", subject: "تغییر زمان امتحان پایانی", body: "امتحان پایانی مبانی هوش مصنوعی به تاریخ ۱۴۰۵/۰۷/۰۵ موکول شد.", sentAt: "۱۴۰۵/۰۶/۱۰ ۱۴:۳۰", readBy: 41, totalRecipients: 48 },
  { id: "sn2", target: "درس خاص", course: "پایگاه داده پیشرفته", subject: "یادآوری تمرین سری چهارم", body: "مهلت تمرین سری چهارم پایان هفته آینده است.", sentAt: "۱۴۰۵/۰۶/۱۲ ۰۹:۱۵", readBy: 30, totalRecipients: 62 },
  { id: "sn3", target: "دانشجوی خاص", student: "محمد اکبری", subject: "هشدار غیبت مکرر", body: "عدم حضور شما در ۳ جلسه اخیر ثبت شده. لطفاً وضعیت خود را بررسی کنید.", sentAt: "۱۴۰۵/۰۶/۱۵ ۱۱:۰۰", readBy: 1, totalRecipients: 1 },
];

// ── نظرسنجی حین تدریس ──────────────────────────────────────────────────────

export type PollOption = { label: string; votes: number };
export type Poll = {
  id: string;
  course: string;
  question: string;
  options: PollOption[];
  totalVoters: number;
  status: "فعال" | "بسته‌شده";
  createdAt: string;
};

export const livePolls: Poll[] = [
  {
    id: "p1",
    course: "مبانی هوش مصنوعی",
    question: "کدام الگوریتم جست‌وجو برای مشکل امروز مناسب‌تر است؟",
    options: [
      { label: "BFS", votes: 12 },
      { label: "DFS", votes: 5 },
      { label: "A*", votes: 28 },
      { label: "IDS", votes: 3 },
    ],
    totalVoters: 48,
    status: "فعال",
    createdAt: "۱۴۰۵/۰۶/۱۶ ۱۰:۱۵",
  },
  {
    id: "p2",
    course: "مبانی هوش مصنوعی",
    question: "مفهوم مینی‌مکس چقدر واضح بود؟",
    options: [
      { label: "کاملاً واضح", votes: 22 },
      { label: "تا حدی", votes: 18 },
      { label: "نیاز به توضیح بیشتر", votes: 8 },
    ],
    totalVoters: 48,
    status: "بسته‌شده",
    createdAt: "۱۴۰۵/۰۶/۱۴ ۱۰:۰۰",
  },
  {
    id: "p3",
    course: "پایگاه داده پیشرفته",
    question: "آیا نرمال‌سازی تا 3NF کافی است یا به 4NF هم نیاز داریم؟",
    options: [
      { label: "3NF کافی است", votes: 35 },
      { label: "4NF لازم است", votes: 15 },
      { label: "مطمئن نیستم", votes: 12 },
    ],
    totalVoters: 62,
    status: "بسته‌شده",
    createdAt: "۱۴۰۵/۰۶/۱۱ ۱۳:۴۵",
  },
];

// ── ساختار آموزشی (واحد آموزش) ───────────────────────────────────────────────

export type Field = { id: string; name: string; level: "کارشناسی" | "کارشناسی ارشد" | "دکتری"; students: number };

export type Department = {
  id: string;
  faculty: string;
  name: string;
  head: string;
  fields: Field[];
};

export const departments: Department[] = [
  {
    id: "d1",
    faculty: "فنی و مهندسی",
    name: "گروه کامپیوتر",
    head: "دکتر رضا کریمی",
    fields: [
      { id: "f1", name: "مهندسی کامپیوتر", level: "کارشناسی", students: 1840 },
      { id: "f2", name: "هوش مصنوعی", level: "کارشناسی ارشد", students: 240 },
      { id: "f3", name: "مهندسی نرم‌افزار", level: "کارشناسی ارشد", students: 310 },
    ],
  },
  {
    id: "d2",
    faculty: "فنی و مهندسی",
    name: "گروه برق و الکترونیک",
    head: "دکتر حسین موسوی",
    fields: [
      { id: "f4", name: "مهندسی برق", level: "کارشناسی", students: 1520 },
      { id: "f5", name: "مهندسی قدرت", level: "کارشناسی ارشد", students: 180 },
    ],
  },
  {
    id: "d3",
    faculty: "فنی و مهندسی",
    name: "گروه صنایع و مدیریت",
    head: "دکتر مریم نجفی",
    fields: [
      { id: "f6", name: "مهندسی صنایع", level: "کارشناسی", students: 980 },
      { id: "f7", name: "مدیریت فناوری اطلاعات", level: "کارشناسی ارشد", students: 160 },
    ],
  },
  {
    id: "d4",
    faculty: "علوم پایه",
    name: "گروه ریاضی و آمار",
    head: "دکتر بابک تهرانی",
    fields: [
      { id: "f8", name: "ریاضیات", level: "کارشناسی", students: 760 },
      { id: "f9", name: "آمار و احتمال", level: "کارشناسی ارشد", students: 130 },
    ],
  },
  {
    id: "d5",
    faculty: "علوم انسانی",
    name: "گروه زبان و ادبیات",
    head: "دکتر لیلا شریفی",
    fields: [{ id: "f10", name: "زبان انگلیسی", level: "کارشناسی", students: 1105 }],
  },
];

export const facultyNames = ["فنی و مهندسی", "علوم پایه", "علوم انسانی"];

// کاتالوگ دروس تعریف‌شده
export type CourseCatalogItem = {
  code: string;
  title: string;
  units: number;
  department: string;
  level: "کارشناسی" | "کارشناسی ارشد";
  prereq: string;
  coreq: string;
  capacity: number;
  registered: number;
};

export const courseCatalog: CourseCatalogItem[] = [
  { code: "CE-4021", title: "مبانی هوش مصنوعی", units: 3, department: "گروه کامپیوتر", level: "کارشناسی", prereq: "برنامه‌نویسی پیشرفته", coreq: "طراحی الگوریتم‌ها", capacity: 60, registered: 48 },
  { code: "CE-3310", title: "پایگاه داده پیشرفته", units: 3, department: "گروه کامپیوتر", level: "کارشناسی", prereq: "پایگاه داده مقدماتی", coreq: "—", capacity: 70, registered: 62 },
  { code: "CE-2205", title: "معماری کامپیوتر", units: 3, department: "گروه کامپیوتر", level: "کارشناسی", prereq: "مدارهای منطقی", coreq: "—", capacity: 60, registered: 55 },
  { code: "CE-3415", title: "سیستم‌عامل", units: 3, department: "گروه کامپیوتر", level: "کارشناسی", prereq: "معماری کامپیوتر", coreq: "—", capacity: 55, registered: 52 },
  { code: "CE-4212", title: "طراحی کامپایلر", units: 3, department: "گروه کامپیوتر", level: "کارشناسی", prereq: "سیستم‌عامل", coreq: "نظریه زبان‌ها", capacity: 45, registered: 18 },
  { code: "MA-2140", title: "آمار و احتمال مهندسی", units: 3, department: "گروه ریاضی و آمار", level: "کارشناسی", prereq: "ریاضی عمومی ۱", coreq: "—", capacity: 80, registered: 71 },
  { code: "EE-3101", title: "مدارهای الکتریکی ۲", units: 3, department: "گروه برق و الکترونیک", level: "کارشناسی", prereq: "مدارهای الکتریکی ۱", coreq: "—", capacity: 55, registered: 50 },
  { code: "GE-1120", title: "زبان تخصصی مهندسی", units: 2, department: "گروه زبان و ادبیات", level: "کارشناسی", prereq: "زبان عمومی", coreq: "—", capacity: 90, registered: 84 },
];

// تعریف استاد و تخصیص درس
export type ProfessorInfo = {
  id: string;
  name: string;
  department: string;
  degree: "استادیار" | "دانشیار" | "استاد تمام";
  courses: string[];
  weeklyHours: number;
  limit: number;
};

export const professors: ProfessorInfo[] = [
  { id: "p1", name: "دکتر رضا کریمی", department: "گروه کامپیوتر", degree: "دانشیار", courses: ["مبانی هوش مصنوعی", "طراحی الگوریتم‌ها"], weeklyHours: 12, limit: 16 },
  { id: "p2", name: "دکتر مریم نجفی", department: "گروه صنایع و مدیریت", degree: "استادیار", courses: ["پایگاه داده پیشرفته", "مدیریت فناوری اطلاعات"], weeklyHours: 14, limit: 16 },
  { id: "p3", name: "دکتر حسین موسوی", department: "گروه برق و الکترونیک", degree: "استاد تمام", courses: ["معماری کامپیوتر", "سیستم‌عامل"], weeklyHours: 10, limit: 20 },
  { id: "p4", name: "دکتر بابک تهرانی", department: "گروه ریاضی و آمار", degree: "دانشیار", courses: ["آمار و احتمال مهندسی", "ریاضی گسسته"], weeklyHours: 8, limit: 16 },
  { id: "p5", name: "دکتر لیلا شریفی", department: "گروه زبان و ادبیات", degree: "استادیار", courses: ["زبان تخصصی مهندسی"], weeklyHours: 6, limit: 16 },
];

// تشکیل خودکار کلاس‌ها
export type FormedClass = {
  id: string;
  course: string;
  group: string;
  students: number;
  capacity: number;
  status: "تشکیل شد" | "تکمیل" | "تشکیل نشد";
};

export const formedClasses: FormedClass[] = [
  { id: "g1", course: "مبانی هوش مصنوعی", group: "گروه ۱", students: 48, capacity: 60, status: "تشکیل شد" },
  { id: "g2", course: "پایگاه داده پیشرفته", group: "گروه ۱", students: 62, capacity: 70, status: "تشکیل شد" },
  { id: "g3", course: "پایگاه داده پیشرفته", group: "گروه ۲", students: 0, capacity: 70, status: "تشکیل نشد" },
  { id: "g4", course: "طراحی کامپایلر", group: "گروه ۱", students: 18, capacity: 45, status: "تشکیل نشد" },
  { id: "g5", course: "هوش مصنوعی پیشرفته", group: "گروه ۱", students: 52, capacity: 50, status: "تکمیل" },
];

// ── زمان‌بندی کلاس و امتحان + تشخیص تداخل ────────────────────────────────────

export type ScheduleItem = {
  id: string;
  course: string;
  professor: string;
  kind: "کلاس" | "امتحان";
  day: string;
  time: string;
  room: string;
  capacity: number;
  students: number;
  conflict?: "تداخل استاد" | "تداخل دانشجو" | "تداخل فضا" | null;
};

export const scheduleItems: ScheduleItem[] = [
  { id: "s1", course: "مبانی هوش مصنوعی", professor: "دکتر رضا کریمی", kind: "کلاس", day: "شنبه", time: "۱۰:۰۰ - ۱۱:۳۰", room: "۲۰۱", capacity: 60, students: 48 },
  { id: "s2", course: "پایگاه داده پیشرفته", professor: "دکتر مریم نجفی", kind: "کلاس", day: "یکشنبه", time: "۱۳:۳۰ - ۱۵:۰۰", room: "۱۰۵", capacity: 70, students: 62 },
  { id: "s3", course: "معماری کامپیوتر", professor: "دکتر حسین موسوی", kind: "کلاس", day: "دوشنبه", time: "۰۸:۰۰ - ۰۹:۳۰", room: "۳۰۲", capacity: 60, students: 55 },
  { id: "s4", course: "سیستم‌عامل", professor: "دکتر حسین موسوی", kind: "کلاس", day: "دوشنبه", time: "۱۰:۰۰ - ۱۱:۳۰", room: "۳۰۲", capacity: 55, students: 42, conflict: "تداخل فضا" },
  { id: "s5", course: "آمار و احتمال مهندسی", professor: "دکتر بابک تهرانی", kind: "کلاس", day: "چهارشنبه", time: "۱۰:۰۰ - ۱۱:۳۰", room: "۲۰۸", capacity: 80, students: 71 },
  { id: "s6", course: "طراحی کامپایلر", professor: "دکتر رضا کریمی", kind: "کلاس", day: "شنبه", time: "۱۰:۰۰ - ۱۱:۳۰", room: "۳۱۵", capacity: 45, students: 18, conflict: "تداخل استاد" },
  { id: "s7", course: "مبانی هوش مصنوعی", professor: "دکتر رضا کریمی", kind: "امتحان", day: "شنبه", time: "۱۳:۰۰ - ۱۴:۳۰", room: "سالن آمفی‌تئاتر", capacity: 120, students: 48 },
  { id: "s8", course: "پایگاه داده پیشرفته", professor: "دکتر مریم نجفی", kind: "امتحان", day: "یکشنبه", time: "۱۳:۰۰ - ۱۵:۰۰", room: "سالن آمفی‌تئاتر", capacity: 120, students: 62 },
  { id: "s9", course: "آمار و احتمال مهندسی", professor: "دکتر بابک تهرانی", kind: "امتحان", day: "یکشنبه", time: "۱۳:۰۰ - ۱۴:۳۰", room: "سالن آمفی‌تئاتر", capacity: 120, students: 71, conflict: "تداخل فضا" },
];

// ── حذف و اضافه / انتخاب واحد اضطراری ──────────────────────────────────────

export type AddDropRequest = {
  id: string;
  student: string;
  course: string;
  kind: "اضافه" | "حذف" | "اضافه اضطراری";
  capacity: number;
  registered: number;
  status: "در انتظار بررسی" | "تایید شده" | "رد شده" | "لیست انتظار";
};

export const addDropRequests: AddDropRequest[] = [
  { id: "AD-901", student: "سارا محمدی", course: "طراحی کامپایلر", kind: "اضافه", capacity: 45, registered: 18, status: "در انتظار بررسی" },
  { id: "AD-902", student: "علی رضایی", course: "هوش مصنوعی پیشرفته", kind: "اضافه اضطراری", capacity: 50, registered: 52, status: "لیست انتظار" },
  { id: "AD-903", student: "نگار سلطانی", course: "معماری کامپیوتر", kind: "حذف", capacity: 60, registered: 55, status: "در انتظار بررسی" },
  { id: "AD-904", student: "زهرا بهرامی", course: "مبانی هوش مصنوعی", kind: "اضافه", capacity: 60, registered: 48, status: "تایید شده" },
  { id: "AD-905", student: "محمد اکبری", course: "پایگاه داده پیشرفته", kind: "اضافه", capacity: 70, registered: 62, status: "رد شده" },
  { id: "AD-906", student: "امیرحسین قاسمی", course: "طراحی کامپایلر", kind: "اضافه اضطراری", capacity: 45, registered: 18, status: "تایید شده" },
];

// ── گردش کار ثبت نمرات ──────────────────────────────────────────────────────

export type GradeWorkflowItem = {
  id: string;
  course: string;
  professor: string;
  graded: number;
  total: number;
  status: "در انتظار ثبت استاد" | "منتظر تأیید واحد آموزش" | "تأیید نهایی شده";
  lastAction: string;
};

export const gradeWorkflow: GradeWorkflowItem[] = [
  { id: "gw1", course: "مبانی هوش مصنوعی", professor: "دکتر رضا کریمی", graded: 48, total: 48, status: "منتظر تأیید واحد آموزش", lastAction: "۱۴۰۵/۰۶/۲۸" },
  { id: "gw2", course: "پایگاه داده پیشرفته", professor: "دکتر مریم نجفی", graded: 30, total: 62, status: "در انتظار ثبت استاد", lastAction: "۱۴۰۵/۰۶/۲۵" },
  { id: "gw3", course: "معماری کامپیوتر", professor: "دکتر حسین موسوی", graded: 55, total: 55, status: "تأیید نهایی شده", lastAction: "۱۴۰۵/۰۶/۲۰" },
  { id: "gw4", course: "آمار و احتمال مهندسی", professor: "دکتر بابک تهرانی", graded: 40, total: 71, status: "در انتظار ثبت استاد", lastAction: "۱۴۰۵/۰۶/۲۲" },
  { id: "gw5", course: "زبان تخصصی مهندسی", professor: "دکتر لیلا شریفی", graded: 84, total: 84, status: "منتظر تأیید واحد آموزش", lastAction: "۱۴۰۵/۰۶/۲۶" },
];

// ── تقویم آموزشی دانشگاه ────────────────────────────────────────────────────

export type AcademicEvent = {
  id: string;
  date: number; // روز ماه (شهریور ۱۴۰۵)
  title: string;
  kind: "آموزشی" | "امتحان" | "انتخاب واحد" | "رویداد اداری";
  desc: string;
};

export const academicEvents: AcademicEvent[] = [
  { id: "e1", date: 1, title: "شروع ثبت‌نام ترم جدید", kind: "انتخاب واحد", desc: "شروع انتخاب واحد نیم‌سال ۱۴۰۵-۲ برای کلیه مقاطع" },
  { id: "e2", date: 4, title: "پایان انتخاب واحد", kind: "انتخاب واحد", desc: "مهلت تکمیل انتخاب واحد بدون جریمه" },
  { id: "e3", date: 6, title: "شروع حذف و اضافه", kind: "انتخاب واحد", desc: "مهلت ۵ روزه حذف و اضافه دروس" },
  { id: "e4", date: 10, title: "شروع کلاس‌های نیم‌سال", kind: "آموزشی", desc: "آغاز تدریس کلاس‌های نیم‌سال ۱۴۰۵-۲" },
  { id: "e5", date: 14, title: "امتحان میان‌ترم هوش مصنوعی", kind: "امتحان", desc: "مبانی هوش مصنوعی — ساعت ۱۰:۰۰" },
  { id: "e6", date: 16, title: "جلسه شورای آموزشی", kind: "رویداد اداری", desc: "بررسی موارد آموزشی دانشکده‌ها — ساعت ۱۳:۰۰" },
  { id: "e7", date: 22, title: "آخرین مهلت ثبت ترم تابستان", kind: "انتخاب واحد", desc: "پایان مهلت ثبت‌نام ترم تابستانی با شهریه" },
  { id: "e8", date: 26, title: "امتحانات پایان ترم", kind: "امتحان", desc: "شروع امتحان‌های پایان نیم‌سال ۱۴۰۵-۲" },
];

// ── گزارش‌های مدیریتی ───────────────────────────────────────────────────────

export const capacityReport = [
  { name: "مبانی هوش مصنوعی", ظرفیت: 60, ثبت‌نام: 48 },
  { name: "پایگاه داده پیشرفته", ظرفیت: 70, ثبت‌نام: 62 },
  { name: "معماری کامپیوتر", ظرفیت: 60, ثبت‌نام: 55 },
  { name: "سیستم‌عامل", ظرفیت: 55, ثبت‌نام: 42 },
  { name: "طراحی کامپایلر", ظرفیت: 45, ثبت‌نام: 18 },
];

export const teachingLoad = [
  { name: "دکتر کریمی", hours: 12, limit: 16 },
  { name: "دکتر نجفی", hours: 14, limit: 16 },
  { name: "دکتر موسوی", hours: 10, limit: 20 },
  { name: "دکتر تهرانی", hours: 8, limit: 16 },
  { name: "دکتر شریفی", hours: 6, limit: 16 },
];

export const facultyDistribution = [
  { name: "فنی و مهندسی", students: 5830, professors: 410 },
  { name: "علوم پایه", students: 1890, professors: 128 },
  { name: "علوم انسانی", students: 2335, professors: 156 },
];

export const gradeDistribution = [
  { name: "۱۷-۲۰", count: 38 },
  { name: "۱۴-۱۶.۹۹", count: 52 },
  { name: "۱۰-۱۳.۹۹", count: 24 },
  { name: "زیر ۱۰", count: 9 },
];
