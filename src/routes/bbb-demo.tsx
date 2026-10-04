import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { AppShell } from "@/components/layout/AppShell";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { mockBBBJoinLink } from "@/lib/bbbService";
import { courses } from "@/lib/mock-data";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";

export const Route = createFileRoute("/bbb-demo")({
  component: BBBDemoPage,
});

function BBBDemoPage() {
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState<{title: string; code: string; link: string} | null>(null);

  const handleJoin = (c: any) => {
    setSelected({ title: c.title, code: c.code, link: mockBBBJoinLink(c.code, c.id) });
    setOpen(true);
  };

  return (
    <AppShell title="دموی BigBlueButton" subtitle="تست اتصال Mock به کلاس مجازی">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {courses.slice(0, 6).map((c) => (
          <Card key={c.id}>
            <CardHeader>
              <CardTitle className="text-base">{c.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-3">کد: {c.code}</p>
              <Button className="w-full" onClick={() => handleJoin(c)}>
                ورود به کلاس مجازی
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>اتصال به کلاس مجازی</DialogTitle>
            <DialogDescription>
              {selected && (
                <>
                  درس: {selected.title} — کد {selected.code}
                  <br />
                  لینک Mock: {selected.link}
                  <br />
                  <span className="text-amber-600">سرور BigBlueButton هنوز راه‌اندازی نشده است.</span>
                </>
              )}
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-end gap-2 pt-2">
            <Button variant="outline" onClick={() => setOpen(false)}>بستن</Button>
          </div>
        </DialogContent>
      </Dialog>
    </AppShell>
  );
}
