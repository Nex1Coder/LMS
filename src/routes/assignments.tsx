import * as React from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Upload, CalendarClock, Plus, FileText, Star } from "lucide-react";
import { toast } from "sonner";
import { AppShell } from "@/components/layout/AppShell";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useAssignments } from "@/lib/assignments-store";
import { useRole } from "@/lib/role";
import { courses, demoUsers } from "@/lib/mock-data";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";

export const Route = createFileRoute("/assignments")({
  head: () => ({
    meta: [
      { title: "تکالیف | سامانه آموزش مجازی دانشگاه" },
      { name: "description", content: "تعریف تکلیف توسط استاد، ارسال پاسخ توسط دانشجو و نمره‌دهی." },
    ],
  }),
  component: AssignmentsPage,
});

function ProfessorCreateForm() {
  const { createAssignment } = useAssignments();
  const [title, setTitle] = React.useState("");
  const [course, setCourse] = React.useState("");
  const [due, setDue] = React.useState("");
  const [description, setDescription] = React.useState("");
  const [attachment, setAttachment] = React.useState("");

  const submit = () => {
    if (!title || !course || !due) {
      toast.error("عنوان، درس و مهلت الزامی است");
      return;
    }
    const payload: { title: string; course: string; due: string; description?: string; attachmentName?: string } = { title, course, due, description };
    if (attachment) payload.attachmentName = attachment;
    createAssignment(payload);
    setTitle(""); setCourse(""); setDue(""); setDescription(""); setAttachment("");
    toast.success("تکلیف جدید ثبت شد");
  };

  return (
    <Card className="mb-5">
      <CardHeader>
        <CardTitle className="text-base">تعریف تکلیف جدید</CardTitle>
      </CardHeader>
      <CardContent className="grid gap-3 sm:grid-cols-2">
        <div className="space-y-1">
          <Label>عنوان تکلیف</Label>
          <Input value={title} onChange={e=>setTitle(e.target.value)} placeholder="عنوان" />
        </div>
        <div className="space-y-1">
          <Label>درس</Label>
          <Select value={course} onValueChange={setCourse}>
            <SelectTrigger><SelectValue placeholder="انتخاب درس" /></SelectTrigger>
            <SelectContent>
              {courses.map(c => <SelectItem key={c.id} value={c.title}>{c.title}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-1">
          <Label>مهلت تحویل</Label>
          <Input type="date" value={due} onChange={e=>setDue(e.target.value)} />
        </div>
        <div className="space-y-1">
          <Label>فایل توضیحی</Label>
          <Input value={attachment} onChange={e=>setAttachment(e.target.value)} placeholder="نام فایل PDF" />
        </div>
        <div className="sm:col-span-2 space-y-1">
          <Label>توضیحات</Label>
          <Textarea value={description} onChange={e=>setDescription(e.target.value)} placeholder="دستورالعمل تکلیف..." />
        </div>
        <div className="sm:col-span-2">
          <Button onClick={submit}><Plus className="size-4"/> ایجاد تکلیف</Button>
        </div>
      </CardContent>
    </Card>
  );
}

function StudentAssignmentCard({ hw, grade }: { hw: any; grade: string | null }) {
  const { submissions, addSubmission } = useAssignments();
  const { role } = useRole();
  const studentId = "student-demo";
  const studentName = demoUsers.student?.name ?? "دانشجو";
  const [fileName, setFileName] = React.useState("");
  const mySubs = submissions[hw.id] ?? [];

  const submitFile = () => {
    if (!fileName) { toast.error("نام فایل را وارد کنید"); return; }
    addSubmission({ assignmentId: hw.id, studentId, studentName, fileName });
    setFileName("");
    toast.success("فایل ارسال شد");
  };

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-2">
          <CardTitle className="text-base">{hw.title}</CardTitle>
          <Badge variant="outline">{hw.status}</Badge>
        </div>
        <p className="text-xs text-muted-foreground">{hw.course}</p>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="text-xs text-muted-foreground flex items-center gap-2">
          <CalendarClock className="size-3.5"/> مهلت: {hw.due}
        </div>
        {hw.description && <p className="text-sm">{hw.description}</p>}
        {hw.attachmentName && (
          <div className="flex items-center gap-2 text-xs">
            <FileText className="size-4"/> فایل توضیحی: {hw.attachmentName}
          </div>
        )}
        <div className="flex gap-2">
          <Input placeholder="نام فایل پاسخ..." value={fileName} onChange={e=>setFileName(e.target.value)} />
          <Button size="sm" onClick={submitFile}><Upload className="size-4"/> آپلود</Button>
        </div>
        <div className="text-xs">
          نمره: {grade ?? "ثبت نشده"}
        </div>
        {mySubs.length > 0 && (
          <div className="text-xs text-muted-foreground">ارسال‌های شما: {mySubs.map(s=>s.fileName).join(", ")}</div>
        )}
      </CardContent>
    </Card>
  );
}

function ProfessorAssignmentCard({ hw }: { hw: any }) {
  const { submissions, setGrade, attachments } = useAssignments();
  const subs = submissions[hw.id] ?? [];
  const fileName = attachments[hw.id] ?? hw.attachmentName ?? "";

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-base">{hw.title}</CardTitle>
        <p className="text-xs text-muted-foreground">{hw.course} — مهلت {hw.due}</p>
      </CardHeader>
      <CardContent className="space-y-3">
        {fileName && <div className="text-xs"><FileText className="size-3 inline"/> فایل توضیحی: {fileName}</div>}
        {hw.description && <p className="text-sm">{hw.description}</p>}
        <div className="space-y-2">
          <p className="text-xs font-bold">پاسخ‌های دانشجویان ({subs.length})</p>
          {subs.length === 0 && <p className="text-xs text-muted-foreground">هنوز پاسخی ارسال نشده</p>}
          {subs.map(s => (
            <div key={s.id} className="flex items-center gap-2 rounded border p-2 text-xs">
              <span className="flex-1 truncate">{s.studentName} — {s.fileName}</span>
              <Input className="w-20" placeholder="نمره" onBlur={e=>setGrade(hw.id, s.studentId, e.target.value)} />
              <Star className="size-3"/>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

function AssignmentsPage() {
  const { homeworks } = useAssignments();
  const { role } = useRole();
  const isProfessor = role === "professor";

  return (
    <AppShell title="تکالیف" subtitle="تعریف تکلیف، ارسال پاسخ و نمره‌دهی">
      {isProfessor && <ProfessorCreateForm />}
      <Tabs defaultValue="all">
        <TabsList>
          <TabsTrigger value="all">همه تکالیف</TabsTrigger>
        </TabsList>
        <TabsContent value="all" className="mt-5 grid gap-4 lg:grid-cols-2">
          {homeworks.map(hw => (
            isProfessor
              ? <ProfessorAssignmentCard key={hw.id} hw={hw} />
              : <StudentAssignmentCard key={hw.id} hw={hw} grade={null} />
          ))}
        </TabsContent>
      </Tabs>
    </AppShell>
  );
}
