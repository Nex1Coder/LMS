# Learning Oasis Persian

Build a comprehensive university Virtual Learning System (سامانه جامع آموزش مجازی دانشگاه) prototype in Persian (RTL) with mock data.

Key specs:
- Direction: Full RTL support (dir="rtl", Persian typography/font styling like Vazirmatn).
- Color theme: Soft navy blue (سرمه‌ای ملایم), turquoise/cyan (فیروزه‌ای), and clean white/slate backgrounds.
- Layout: Responsive layout with collapsible sidebar, top navigation bar (search, notifications dropdown, Persian date/time indicator, and user profile switcher).
- Mock Authentication / Demo Login:
  - Role switcher at login or top bar to toggle between 3 roles:
    1. دانشجو (Student)
    2. استاد (Professor)
    3. واحد آموزش (Academic Affairs / Admin)
  - Easy 1-click login for each role without real credentials.

Dashboards & views per role:
1. Student Dashboard (داشبورد دانشجو):
   - امروز (Today's classes schedule with join button)
   - برنامه هفتگی (Weekly timetable)
   - تکالیف تحویلی (Active assignments & deadlines)
   - آزمون‌های پیش‌رو (Upcoming exams)
   - کارنامه و نمرات اخیر (Recent grades summary and GPA)
   - درس‌های من (Quick access to enrolled courses)
   - دستیار هوشمند درس (AI study assistant widget)

2. Professor Dashboard (داشبورد استاد):
   - کلاس‌های امروز (Today's lectures)
   - لیست درس‌ها و آمار دانشجویان (Courses taught & student counts)
   - تکالیف نیازمند تصحیح (Assignments pending grading)
   - مدیریت آزمون‌ها (Exams created/scheduled)
   - حضور و غیاب (Quick attendance tracker modal/section)
   - ثبت سریع نمرات (Grade submission shortcut)

3. Academic Affairs Dashboard (داشبورد واحد آموزش):
   - کارت‌های آماری کلان (تعداد کل دانشجویان، استادان، کلاس‌های فعال، نرخ رضایت)
   - مدیریت دروس و ترم (لیست رشته‌ها، ارائه دروس ترم جدید)
   - برنامه کلاس‌ها و زمان‌بندی امتحانات پایان ترم
   - کارتابل درخواست‌های آموزشی (حذف و اضافه، مرخصی تحصیلی، معرفی به استاد، گواهی اشتغال به تحصیل)
   - نمودارها و گزارش‌های تحلیلی

Dedicated clickable pages with full Persian mock data:
- درس‌های من (/courses): فهرست دروس با امکان مشاهده محتوا، اسلایدها و جلسات ضبط شده
- تکالیف (/assignments): ارسال پاسخ، مهلت تحویل، وضعیت بررسی و نمره
- آزمون‌ها (/exams): آزمون‌های آنلاین و تستی با شبیه‌ساز ورود به آزمون
- نمرات و کارنامه (/grades): جدول نمرات تفکیکی، معدل ترم، اعتراض به نمره
- کلاس آنلاین (/classroom): شبیه‌ساز فضای کلاس زنده (تخته، چت کلاس، اشتراک‌گذاری تصویر و صدا)
- درخواست‌های آموزشی (/requests): فرم ثبت درخواست جدید و پیگیری وضعیت با تایم‌لاین
- دستیار هوشمند دانشگاه (/ai-assistant): چت‌بات هوش مصنوعی فارسی برای پاسخ به سوالات درسی و آیین‌نامه‌ها

Include responsive mobile drawer navigation, toast notifications for demo actions, clear active navigation state, and rich Persian dummy data.

This project was built with [Lovable](https://lovable.dev).

**Live app**: https://uni-learn-persian.lovable.app

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/0e33b49f-cf15-47e0-9ed9-2910d720753b).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
