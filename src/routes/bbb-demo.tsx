import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/layout/AppShell";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { mockBBBJoinLink } from "@/lib/bbbService";
import { courses } from "@/lib/mock-data";

export const Route = createFileRoute("/bbb-demo")({
  component: BBBDemoPage,
});

function BBBDemoPage() {
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
              <Button asChild className="w-full">
                <a href={mockBBBJoinLink(c.code, c.id)} target="_blank" rel="noreferrer">
                  ورود به کلاس مجازی
                </a>
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </AppShell>
  );
}
