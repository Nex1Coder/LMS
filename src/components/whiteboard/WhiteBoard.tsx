import * as React from "react";
import { useSyncExternalStore } from "react";
import {
  Pen,
  Highlighter,
  Eraser,
  Slash,
  ArrowUpRight,
  Square,
  Circle,
  Type,
  Crosshair,
  MousePointer2,
  Undo2,
  Redo2,
  Plus,
  Copy,
  Trash2,
  ChevronRight,
  ChevronLeft,
  Download,
  ImagePlus,
  Grid3x3,
  Check,
  X,
  Waves,
  Play,
  Pause,
  SquareStop,
  Gauge,
  Wifi,
  Users,
} from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  whiteboard,
  whiteboardPresence,
  WB_COLORS,
  WB_SIZES,
  distToSegment,
  dist,
  elementBox,
  type WbElement,
  type WbPage,
  type WbPoint,
  type WbStroke,
  type WbShape,
  type WbText,
  type WbTool,
} from "@/lib/whiteboard-model";

const imageCache = new Map<string, HTMLImageElement>();

function loadImage(src: string, onDone: () => void): HTMLImageElement {
  let img = imageCache.get(src);
  if (!img) {
    img = new Image();
    img.onload = onDone;
    imageCache.set(src, img);
    img.src = src;
  }
  return img;
}

function normalizeRect(x0: number, y0: number, x1: number, y1: number) {
  return { x: Math.min(x0, x1), y: Math.min(y0, y1), w: Math.abs(x1 - x0), h: Math.abs(y1 - y0) };
}

function drawStrokePath(ctx: CanvasRenderingContext2D, el: WbStroke) {
  if (el.points.length < 2) return;
  ctx.beginPath();
  ctx.moveTo(el.points[0]?.x ?? 0, el.points[0]?.y ?? 0);
  for (const p of el.points) ctx.lineTo(p.x, p.y);
  ctx.stroke();
}

function drawArrowHead(ctx: CanvasRenderingContext2D, from: WbPoint, to: WbPoint, size: number) {
  const angle = Math.atan2(to.y - from.y, to.x - from.x);
  const len = 8 + size * 2.2;
  ctx.beginPath();
  ctx.moveTo(to.x, to.y);
  ctx.lineTo(to.x - len * Math.cos(angle - 0.42), to.y - len * Math.sin(angle - 0.42));
  ctx.moveTo(to.x, to.y);
  ctx.lineTo(to.x - len * Math.cos(angle + 0.42), to.y - len * Math.sin(angle + 0.42));
  ctx.stroke();
}

function paintElement(ctx: CanvasRenderingContext2D, el: WbElement, force: () => void) {
  ctx.lineCap = "round";
  ctx.lineJoin = "round";

  if (el.type === "stroke") {
    ctx.strokeStyle = el.color;
    ctx.lineWidth = el.size;
    ctx.globalAlpha = el.tool === "marker" ? 0.35 : 1;
    drawStrokePath(ctx, el);
  } else if (el.type === "shape") {
    ctx.strokeStyle = el.color;
    ctx.lineWidth = el.size;
    ctx.globalAlpha = 1;
    if (el.kind === "line") {
      ctx.beginPath();
      ctx.moveTo(el.x0, el.y0);
      ctx.lineTo(el.x1, el.y1);
      ctx.stroke();
    } else if (el.kind === "arrow") {
      ctx.beginPath();
      ctx.moveTo(el.x0, el.y0);
      ctx.lineTo(el.x1, el.y1);
      ctx.stroke();
      drawArrowHead(ctx, { x: el.x0, y: el.y0 }, { x: el.x1, y: el.y1 }, el.size);
    } else if (el.kind === "rect") {
      const r = normalizeRect(el.x0, el.y0, el.x1, el.y1);
      ctx.strokeRect(r.x, r.y, r.w, r.h);
    } else if (el.kind === "ellipse") {
      const r = normalizeRect(el.x0, el.y0, el.x1, el.y1);
      ctx.beginPath();
      ctx.ellipse(r.x + r.w / 2, r.y + r.h / 2, r.w / 2, r.h / 2, 0, 0, Math.PI * 2);
      ctx.stroke();
    }
  } else if (el.type === "textbox") {
    ctx.globalAlpha = 1;
    ctx.fillStyle = el.color;
    ctx.font = `bold ${el.size}px Vazirmatn, sans-serif`;
    ctx.textBaseline = "top";
    ctx.direction = "rtl";
    ctx.fillText(el.text, el.x, el.y);
  } else if (el.type === "image") {
    ctx.globalAlpha = 1;
    const img = imageCache.get(el.src);
    if (img && img.complete && img.naturalWidth > 0) {
      ctx.drawImage(img, el.x, el.y, el.w, el.h);
    } else {
      loadImage(el.src, force);
    }
  }
  ctx.globalAlpha = 1;
}

function paintAll(
  ctx: CanvasRenderingContext2D,
  w: number,
  h: number,
  dpr: number,
  elements: WbElement[],
  grid: boolean,
  force: () => void,
) {
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  ctx.clearRect(0, 0, w, h);
  ctx.fillStyle = "#ffffff";
  ctx.fillRect(0, 0, w, h);

  if (grid) {
    ctx.strokeStyle = "#e2e8f0";
    ctx.lineWidth = 1;
    const step = 24;
    ctx.beginPath();
    for (let x = step; x < w; x += step) {
      ctx.moveTo(x, 0);
      ctx.lineTo(x, h);
    }
    for (let y = step; y < h; y += step) {
      ctx.moveTo(0, y);
      ctx.lineTo(w, y);
    }
    ctx.stroke();
  }

  for (const el of elements) paintElement(ctx, el, force);
}

function drawSelection(ctx: CanvasRenderingContext2D, el: WbElement) {
  const b = elementBox(el);
  ctx.save();
  ctx.setLineDash([6, 4]);
  ctx.strokeStyle = "#2563eb";
  ctx.lineWidth = 1.5;
  ctx.strokeRect(b.x, b.y, b.w, b.h);
  ctx.restore();
}

const TOOLS: { id: WbTool; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
  { id: "select", label: "انتخاب / جابه‌جایی", icon: MousePointer2 },
  { id: "pen", label: "قلم", icon: Pen },
  { id: "marker", label: "هایلایت", icon: Highlighter },
  { id: "eraser", label: "پاک‌کن", icon: Eraser },
  { id: "laser", label: "لیزر", icon: Crosshair },
  { id: "line", label: "خط", icon: Slash },
  { id: "arrow", label: "پیکان", icon: ArrowUpRight },
  { id: "rect", label: "مربع", icon: Square },
  { id: "ellipse", label: "دایره", icon: Circle },
  { id: "text", label: "متن", icon: Type },
];

function ToolButton({
  active,
  label,
  icon: Icon,
  onClick,
  disabled,
}: {
  active?: boolean;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  onClick: () => void;
  disabled?: boolean;
}) {
  return (
    <Button
      type="button"
      variant={active ? "default" : "ghost"}
      size="icon"
      className="size-8"
      title={label}
      aria-label={label}
      onClick={onClick}
      disabled={disabled}
    >
      <Icon className="size-4" />
    </Button>
  );
}

function PageThumb({
  page,
  index,
  active,
  boardW,
  boardH,
  onSelect,
}: {
  page: WbPage;
  index: number;
  active: boolean;
  boardW: number;
  boardH: number;
  onSelect: () => void;
}) {
  const ref = React.useRef<HTMLCanvasElement>(null);
  const [, force] = React.useState(0);
  const forceRedraw = React.useCallback(() => force((n) => n + 1), []);

  React.useEffect(() => {
    const c = ref.current;
    if (!c) return;
    const ctx = c.getContext("2d");
    if (!ctx) return;
    const w = c.width;
    const h = c.height;
    const logicalW = Math.max(boardW, 1);
    const logicalH = Math.max(boardH, 1);
    const scale = Math.min(w / logicalW, h / logicalH);
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.clearRect(0, 0, w, h);
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, w, h);
    ctx.save();
    ctx.scale(scale, scale);
    for (const el of page.elements) paintElement(ctx, el, forceRedraw);
    ctx.restore();
  }, [page, boardW, boardH, forceRedraw]);

  return (
    <button
      type="button"
      onClick={onSelect}
      className={cn(
        "shrink-0 overflow-hidden rounded-lg border-2 bg-white transition-all",
        active ? "border-primary ring-2 ring-primary/30" : "border-border hover:border-primary/50",
      )}
      title={page.title}
    >
      <canvas ref={ref} width={128} height={72} className="block" />
      <span className="block bg-muted/60 px-1 py-0.5 text-[10px] tabular-nums">{index + 1}</span>
    </button>
  );
}

type ReplayState = { playing: boolean; index: number; points: number; speed: number };

export function WhiteBoard({ readOnly }: { readOnly?: boolean }) {
  const snap = useSyncExternalStore(whiteboard.subscribe, whiteboard.getSnapshot);
  const peers = useSyncExternalStore(whiteboardPresence.subscribe, whiteboardPresence.getSnapshot);
  const page = snap.pages[snap.current];

  const [tool, setTool] = React.useState<WbTool>("pen");
  const [color, setColor] = React.useState<string>(WB_COLORS[0] ?? "#1e293b");
  const [size, setSize] = React.useState<number>(4);
  const [grid, setGrid] = React.useState(true);

  const wrapRef = React.useRef<HTMLDivElement>(null);
  const canvasRef = React.useRef<HTMLCanvasElement>(null);
  const [dims, setDims] = React.useState({ w: 0, h: 420 });
  const [, setForce] = React.useState(0);
  const forceRedraw = React.useCallback(() => setForce((n) => n + 1), []);

  const [draft, setDraft] = React.useState<WbStroke | WbShape | null>(null);
  const [eraserHits, setEraserHits] = React.useState<Set<string>>(new Set());
  const [laser, setLaser] = React.useState<WbPoint | null>(null);
  const [remoteLaser, setRemoteLaser] = React.useState<WbPoint | null>(null);
  const [textBox, setTextBox] = React.useState<{ x: number; y: number; value: string } | null>(
    null,
  );
  const [selectedId, setSelectedId] = React.useState<string | null>(null);
  const [replay, setReplay] = React.useState<ReplayState | null>(null);

  const textRef = React.useRef<HTMLTextAreaElement>(null);
  const drawing = React.useRef(false);
  const dragRef = React.useRef<{ id: string; last: WbPoint } | null>(null);
  const elementsRef = React.useRef<WbElement[]>([]);
  elementsRef.current = page?.elements ?? [];

  React.useLayoutEffect(() => {
    const node = wrapRef.current;
    if (!node) return;
    const ro = new ResizeObserver((entries) => {
      const r = entries[0]?.contentRect;
      if (!r) return;
      setDims((p) => {
        if (Math.abs(p.w - r.width) < 1) return p;
        return { w: r.width, h: Math.max(320, r.height) };
      });
    });
    ro.observe(node);
    return () => ro.disconnect();
  }, []);

  // لیزِر راه دور (نمایش تدریس استاد در تب دانشجو)
  React.useEffect(() => {
    return whiteboard.onRemoteLaser((x, y, active) => {
      setRemoteLaser(active ? { x, y } : null);
    });
  }, []);

  // موتور پخش ضربات
  React.useEffect(() => {
    if (!replay?.playing) return;
    const id = window.setInterval(() => {
      setReplay((r) => {
        if (!r) return r;
        const els = elementsRef.current;
        const el = els[r.index];
        if (!el) return { ...r, playing: false };
        if (el.type === "stroke") {
          const step = Math.max(2, Math.ceil(el.points.length / 30));
          if (r.points + step < el.points.length) return { ...r, points: r.points + step };
        }
        return { ...r, index: r.index + 1, points: 0 };
      });
    }, replay.speed);
    return () => window.clearInterval(id);
  }, [replay?.playing, replay?.speed]);

  // حذف شیء انتخاب‌شده با کلید Delete
  React.useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.key === "Delete" || e.key === "Backspace") && selectedId) {
        whiteboard.removeElements(new Set([selectedId]));
        setSelectedId(null);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [selectedId]);

  React.useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || dims.w === 0) return;
    const dpr = window.devicePixelRatio || 1;
    canvas.width = Math.round(dims.w * dpr);
    canvas.height = Math.round(dims.h * dpr);
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const all = page?.elements ?? [];
    const live = all.filter((e) => !eraserHits.has(e.id));

    let toDraw: WbElement[] = live;
    let partial: WbStroke | null = null;
    if (replay) {
      toDraw = all.slice(0, replay.index);
      const cur = all[replay.index];
      if (cur) {
        if (cur.type === "stroke") {
          partial = { ...cur, points: cur.points.slice(0, Math.max(replay.points, 1)) };
        } else {
          toDraw = [...toDraw, cur];
        }
      }
    }

    paintAll(ctx, dims.w, dims.h, dpr, toDraw, grid, forceRedraw);

    if (partial && partial.points.length >= 2) {
      ctx.lineCap = "round";
      ctx.lineJoin = "round";
      ctx.strokeStyle = partial.color;
      ctx.lineWidth = partial.size;
      ctx.globalAlpha = partial.tool === "marker" ? 0.35 : 1;
      drawStrokePath(ctx, partial);
      ctx.globalAlpha = 1;
    }

    if (!replay && draft) {
      if (draft.type === "stroke" && draft.points.length >= 2) {
        ctx.lineCap = "round";
        ctx.lineJoin = "round";
        ctx.strokeStyle = draft.color;
        ctx.lineWidth = draft.size;
        ctx.globalAlpha = draft.tool === "marker" ? 0.35 : 1;
        drawStrokePath(ctx, draft);
        ctx.globalAlpha = 1;
      } else if (draft.type === "shape") {
        paintElement(ctx, draft, forceRedraw);
      }
    }

    if (!replay && selectedId) {
      const el = all.find((e) => e.id === selectedId);
      if (el) drawSelection(ctx, el);
    }

    if (!replay && laser) {
      ctx.strokeStyle = "rgba(220, 38, 38, 0.9)";
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(laser.x, laser.y, 14, 0, Math.PI * 2);
      ctx.stroke();
      ctx.fillStyle = "rgba(220, 38, 38, 0.6)";
      ctx.beginPath();
      ctx.arc(laser.x, laser.y, 4, 0, Math.PI * 2);
      ctx.fill();
    }

    if (remoteLaser) {
      ctx.strokeStyle = "rgba(37, 99, 235, 0.9)";
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(remoteLaser.x, remoteLaser.y, 16, 0, Math.PI * 2);
      ctx.stroke();
      ctx.fillStyle = "rgba(37, 99, 235, 0.55)";
      ctx.beginPath();
      ctx.arc(remoteLaser.x, remoteLaser.y, 5, 0, Math.PI * 2);
      ctx.fill();
    }
  }, [
    snap,
    draft,
    eraserHits,
    laser,
    remoteLaser,
    grid,
    dims,
    page,
    forceRedraw,
    replay,
    selectedId,
  ]);

  const getPos = (e: React.PointerEvent): WbPoint => {
    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) return { x: 0, y: 0 };
    return { x: e.clientX - rect.left, y: e.clientY - rect.top };
  };

  const hitRadius = Math.max(size * 2 + 10, 18);

  const elementHitTest = (el: WbElement, p: WbPoint): boolean => {
    if (el.type === "stroke") return el.points.some((pt) => dist(pt, p) <= hitRadius);
    if (el.type === "shape") {
      const r = normalizeRect(el.x0, el.y0, el.x1, el.y1);
      if (el.kind === "rect" || el.kind === "ellipse") {
        return (
          p.x >= r.x - hitRadius &&
          p.x <= r.x + r.w + hitRadius &&
          p.y >= r.y - hitRadius &&
          p.y <= r.y + r.h + hitRadius
        );
      }
      return distToSegment(p, { x: el.x0, y: el.y0 }, { x: el.x1, y: el.y1 }) <= hitRadius;
    }
    const b = elementBox(el);
    return p.x >= b.x && p.x <= b.x + b.w && p.y >= b.y && p.y <= b.y + b.h;
  };

  const topElementAt = (p: WbPoint): WbElement | null => {
    const els = page?.elements ?? [];
    for (let i = els.length - 1; i >= 0; i--) {
      const el = els[i];
      if (el && elementHitTest(el, p)) return el;
    }
    return null;
  };

  const onPointerDown = (e: React.PointerEvent) => {
    if (readOnly || replay) return;
    if (textBox) {
      commitText();
      return;
    }
    drawing.current = true;
    (e.target as HTMLElement).setPointerCapture?.(e.pointerId);
    const p = getPos(e);

    if (tool === "select") {
      const hit = topElementAt(p);
      setSelectedId(hit?.id ?? null);
      if (hit) {
        dragRef.current = { id: hit.id, last: p };
        whiteboard.beginBatch();
      }
      return;
    }
    if (tool === "pen" || tool === "marker") {
      setDraft({
        id: `draft-${Date.now()}`,
        type: "stroke",
        tool,
        points: [p],
        color,
        size: tool === "marker" ? size * 2.2 : size,
      });
    } else if (tool === "line" || tool === "arrow" || tool === "rect" || tool === "ellipse") {
      setDraft({
        id: `draft-${Date.now()}`,
        type: "shape",
        kind: tool,
        x0: p.x,
        y0: p.y,
        x1: p.x,
        y1: p.y,
        color,
        size,
      });
    } else if (tool === "eraser") {
      const hits = new Set<string>();
      for (const el of page?.elements ?? []) if (elementHitTest(el, p)) hits.add(el.id);
      setEraserHits(hits);
    } else if (tool === "text") {
      setTextBox({ x: p.x, y: p.y, value: "" });
    } else if (tool === "laser") {
      setLaser(p);
      whiteboard.sendLaser(p.x, p.y, true);
    }
  };

  const onPointerMove = (e: React.PointerEvent) => {
    if (readOnly || !drawing.current || replay) return;
    const p = getPos(e);

    if (tool === "select") {
      const drag = dragRef.current;
      if (drag) {
        whiteboard.translateElement(drag.id, p.x - drag.last.x, p.y - drag.last.y);
        drag.last = p;
      }
      return;
    }
    if (tool === "pen" || tool === "marker") {
      setDraft((d) => {
        if (!d || d.type !== "stroke") return d;
        const last = d.points[d.points.length - 1];
        if (last && dist(last, p) < 1.5) return d;
        return { ...d, points: [...d.points, p] };
      });
    } else if (tool === "line" || tool === "arrow" || tool === "rect" || tool === "ellipse") {
      setDraft((d) => (d && d.type === "shape" ? { ...d, x1: p.x, y1: p.y } : d));
    } else if (tool === "eraser") {
      const hits = new Set(eraserHits);
      for (const el of page?.elements ?? []) if (elementHitTest(el, p)) hits.add(el.id);
      setEraserHits(hits);
    } else if (tool === "laser") {
      setLaser(p);
      whiteboard.sendLaser(p.x, p.y, true);
    }
  };

  const onPointerUp = () => {
    drawing.current = false;
    if (readOnly) return;
    if (tool === "select") {
      if (dragRef.current) {
        whiteboard.endBatch();
        dragRef.current = null;
      }
      return;
    }
    if (
      tool === "pen" ||
      tool === "marker" ||
      tool === "line" ||
      tool === "arrow" ||
      tool === "rect" ||
      tool === "ellipse"
    ) {
      if (draft) {
        whiteboard.addElement(draft as WbElement);
        setDraft(null);
      }
    } else if (tool === "eraser") {
      if (eraserHits.size > 0) {
        whiteboard.removeElements(eraserHits);
        toast.info(`${eraserHits.size} مورد پاک شد`);
      }
      setEraserHits(new Set());
    } else if (tool === "laser") {
      setLaser(null);
      whiteboard.sendLaser(0, 0, false);
    }
  };

  const commitText = () => {
    const t = textBox;
    setTextBox(null);
    if (!t || !t.value.trim()) return;
    const el: WbText = {
      id: `txt-${Date.now()}`,
      type: "textbox",
      x: t.x,
      y: t.y,
      text: t.value.trim(),
      color,
      size: Math.max(16, size * 6),
    };
    whiteboard.addElement(el);
  };

  const onImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const src = String(reader.result ?? "");
      const img = loadImage(src, forceRedraw);
      const maxW = dims.w * 0.7;
      const scale = Math.min(1, maxW / Math.max(img.naturalWidth, 1));
      const w = Math.max(img.naturalWidth * scale, 80);
      const h = Math.max(img.naturalHeight * scale, 60);
      whiteboard.addElement({
        id: `img-${Date.now()}`,
        type: "image",
        x: Math.max(16, (dims.w - w) / 2),
        y: Math.max(16, (dims.h - h) / 2),
        w,
        h,
        src,
      });
    };
    reader.readAsDataURL(file);
  };

  const exportPng = () => {
    const canvas = document.createElement("canvas");
    const scale = 2;
    canvas.width = Math.round(dims.w * scale);
    canvas.height = Math.round(dims.h * scale);
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    paintAll(ctx, dims.w, dims.h, scale, page?.elements ?? [], grid, forceRedraw);
    const a = document.createElement("a");
    a.href = canvas.toDataURL("image/png");
    a.download = `whiteboard-${page?.title ?? "page"}.png`;
    a.click();
    toast.success("نسخه تصویری برگه دانلود شد");
  };

  const startReplay = () => setReplay({ playing: true, index: 0, points: 0, speed: 60 });
  const pauseReplay = () => setReplay((r) => (r ? { ...r, playing: !r.playing } : r));
  const stopReplay = () => setReplay(null);
  const cycleSpeed = () =>
    setReplay((r) => {
      if (!r) return r;
      const next = r.speed <= 40 ? 90 : r.speed <= 90 ? 160 : 40;
      return { ...r, speed: next };
    });

  const editing = !readOnly;
  const pageIndex = snap.current;
  const pageCount = snap.pages.length;
  const totalElements = page?.elements.length ?? 0;

  return (
    <div className="w-full overflow-hidden rounded-2xl border border-border bg-card">
      {editing && (
        <div className="flex flex-wrap items-center gap-1 border-b border-border bg-muted/40 p-2">
          <div className="flex flex-wrap items-center gap-1">
            {TOOLS.map((t) => (
              <ToolButton
                key={t.id}
                label={t.label}
                icon={t.icon}
                active={tool === t.id}
                onClick={() => {
                  if (textBox) commitText();
                  setTool(t.id);
                  if (t.id !== "select") setSelectedId(null);
                }}
              />
            ))}
          </div>

          <div className="mx-1 h-6 w-px bg-border" />

          <div className="flex flex-wrap items-center gap-1">
            {WB_COLORS.map((c) => (
              <button
                key={c}
                type="button"
                className={cn(
                  "size-5 rounded-full border-2 transition-transform",
                  color === c ? "scale-110 border-foreground" : "border-transparent",
                )}
                style={{ backgroundColor: c }}
                title={`رنگ ${c}`}
                aria-label={`رنگ ${c}`}
                onClick={() => setColor(c)}
              />
            ))}
          </div>

          <div className="mx-1 h-6 w-px bg-border" />

          <div className="flex items-center gap-1">
            {WB_SIZES.map((s) => (
              <Button
                key={s}
                variant={size === s ? "default" : "ghost"}
                size="sm"
                className="h-7 px-2 text-[11px]"
                onClick={() => setSize(s)}
              >
                <Waves className="size-3" />
                {s === 2
                  ? "نازک"
                  : s === 4
                    ? "متوسط"
                    : s === 7
                      ? "ضخیم"
                      : s === 11
                        ? "خیلی ضخیم"
                        : "ماژیک"}
              </Button>
            ))}
          </div>

          <div className="ms-auto flex flex-wrap items-center gap-1">
            <Button
              variant={grid ? "default" : "ghost"}
              size="sm"
              className="h-7 px-2 text-[11px]"
              onClick={() => setGrid((g) => !g)}
            >
              <Grid3x3 className="size-3" /> شبکه
            </Button>
            <ToolButton
              label="حذف انتخاب‌شده"
              icon={Trash2}
              disabled={!selectedId}
              onClick={() => {
                if (selectedId) {
                  whiteboard.removeElements(new Set([selectedId]));
                  setSelectedId(null);
                }
              }}
            />
            <ToolButton
              label="واگرد"
              icon={Undo2}
              disabled={!snap.canUndo}
              onClick={() => whiteboard.undo()}
            />
            <ToolButton
              label="از نو"
              icon={Redo2}
              disabled={!snap.canRedo}
              onClick={() => whiteboard.redo()}
            />
            <ToolButton
              label="پاک کردن برگه"
              icon={Eraser}
              onClick={() => {
                whiteboard.clearPage();
                toast.success("برگه پاک شد");
              }}
            />
          </div>
        </div>
      )}

      <div ref={wrapRef} className="relative" style={{ height: editing ? "52vh" : 420 }}>
        <canvas
          ref={canvasRef}
          className="h-full w-full touch-none"
          style={{
            cursor:
              tool === "eraser"
                ? "cell"
                : tool === "laser"
                  ? "none"
                  : tool === "select"
                    ? "move"
                    : "crosshair",
          }}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
          onPointerCancel={onPointerUp}
        />

        {laser && tool === "laser" && editing && !replay && (
          <div
            className="pointer-events-none absolute z-10"
            style={{ left: laser.x - 14, top: laser.y - 14 }}
          >
            <div className="size-7 rounded-full border-2 border-destructive" />
          </div>
        )}

        {textBox && (
          <div className="absolute z-20" style={{ left: textBox.x, top: textBox.y }}>
            <textarea
              ref={textRef}
              value={textBox.value}
              onChange={(e) => setTextBox({ ...textBox, value: e.target.value })}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  commitText();
                }
                if (e.key === "Escape") setTextBox(null);
              }}
              autoFocus
              dir="rtl"
              placeholder="متن را بنویس…"
              className="w-56 resize-none rounded-lg border border-primary bg-background/95 p-2 text-sm shadow-lg focus:outline-none"
              rows={2}
            />
            <div className="mt-1 flex gap-1">
              <Button type="button" size="sm" className="h-7 px-2 text-[11px]" onClick={commitText}>
                <Check className="size-3" /> ثبت متن
              </Button>
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="h-7 px-2 text-[11px]"
                onClick={() => setTextBox(null)}
              >
                <X className="size-3" /> لغو
              </Button>
            </div>
          </div>
        )}

        <div className="pointer-events-none absolute end-3 top-3 z-10 rounded-lg bg-navy/70 px-2 py-1 text-[11px] text-primary-foreground">
          {readOnly ? "نمای دانشجو — فقط‌خواندنی" : "وایت‌برد استاد"}
        </div>

        <div className="pointer-events-none absolute bottom-2 start-3 z-10 flex items-center gap-2 rounded-lg bg-navy/70 px-2 py-1 text-[11px] text-primary-foreground">
          <span className="flex items-center gap-1">
            <Wifi className="size-3 text-accent" /> همگام‌سازی زنده
          </span>
          <span className="flex items-center gap-1">
            <Users className="size-3" /> {peers} ناظر آنلاین
          </span>
        </div>

        {replay && (
          <div className="pointer-events-none absolute end-3 bottom-2 z-10 rounded-lg bg-primary/90 px-2 py-1 text-[11px] text-primary-foreground">
            {replay.playing ? "در حال پخش ضربات…" : "پخش متوقف شده"} — {replay.index}/
            {totalElements}
          </div>
        )}
      </div>

      {/* نوار بندانگشتی برگه‌ها */}
      <div className="flex items-center gap-2 overflow-x-auto border-t border-border bg-muted/20 p-2 scrollbar-thin">
        {snap.pages.map((pg, i) => (
          <PageThumb
            key={pg.id}
            page={pg}
            index={i}
            active={i === pageIndex}
            boardW={dims.w}
            boardH={dims.h}
            onSelect={() => whiteboard.gotoPage(i)}
          />
        ))}
        {editing && (
          <button
            type="button"
            onClick={() => whiteboard.addPage()}
            className="flex size-[104px] shrink-0 flex-col items-center justify-center gap-1 rounded-lg border-2 border-dashed border-border text-xs text-muted-foreground hover:border-primary hover:text-primary"
          >
            <Plus className="size-4" /> برگه جدید
          </button>
        )}
      </div>

      <div className="flex flex-wrap items-center gap-1 border-t border-border bg-muted/40 p-2">
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="icon"
            className="size-8"
            title="برگه قبل"
            aria-label="برگه قبل"
            disabled={pageIndex <= 0}
            onClick={() => whiteboard.gotoPage(pageIndex - 1)}
          >
            <ChevronRight className="size-4" />
          </Button>
          <span className="min-w-14 text-center text-xs tabular-nums">
            برگه {pageIndex + 1} از {pageCount}
          </span>
          <Button
            variant="ghost"
            size="icon"
            className="size-8"
            title="برگه بعد"
            aria-label="برگه بعد"
            disabled={pageIndex >= pageCount - 1}
            onClick={() => whiteboard.gotoPage(pageIndex + 1)}
          >
            <ChevronLeft className="size-4" />
          </Button>
        </div>

        <div className="mx-1 h-6 w-px bg-border" />

        <div className="flex items-center gap-1">
          <Button
            variant={replay?.playing ? "default" : "ghost"}
            size="sm"
            className="h-7 px-2 text-[11px]"
            onClick={replay ? pauseReplay : startReplay}
          >
            {replay?.playing ? <Pause className="size-3" /> : <Play className="size-3" />}
            {replay?.playing ? "توقف موقت" : replay ? "ادامه" : "پخش ضربات"}
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="h-7 px-2 text-[11px]"
            disabled={!replay}
            onClick={stopReplay}
          >
            <SquareStop className="size-3" /> پایان پخش
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="h-7 px-2 text-[11px]"
            disabled={!replay}
            onClick={cycleSpeed}
          >
            <Gauge className="size-3" /> سرعت
          </Button>
        </div>

        {editing && (
          <>
            <div className="mx-1 h-6 w-px bg-border" />
            <Button
              variant="ghost"
              size="sm"
              className="h-7 px-2 text-[11px]"
              disabled={pageCount >= 12}
              onClick={() => whiteboard.duplicatePage()}
            >
              <Copy className="size-3" /> کپی برگه
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="h-7 px-2 text-[11px] text-destructive"
              disabled={pageCount <= 1}
              onClick={() => whiteboard.removePage()}
            >
              <Trash2 className="size-3" /> حذف برگه
            </Button>

            <div className="mx-1 h-6 w-px bg-border" />

            <label className="inline-flex cursor-pointer">
              <Button variant="ghost" size="sm" className="h-7 px-2 text-[11px]" asChild>
                <span>
                  <ImagePlus className="size-3" /> افزودن تصویر
                </span>
              </Button>
              <input type="file" accept="image/*" className="sr-only" onChange={onImageUpload} />
            </label>
            <Button variant="ghost" size="sm" className="h-7 px-2 text-[11px]" onClick={exportPng}>
              <Download className="size-3" /> ذخیره PNG
            </Button>

            <div className="ms-auto flex min-w-0 items-center gap-1">
              <span className="text-[11px] text-muted-foreground">عنوان برگه:</span>
              <Input
                value={page?.title ?? ""}
                onChange={(e) => whiteboard.setPageTitle(e.target.value)}
                className="h-7 w-36 text-[11px]"
              />
            </div>
          </>
        )}

        {!editing && (
          <span className="ms-auto text-[11px] text-muted-foreground">
            محتوای زندهٔ استاد در همین ترم به‌روزرسانی می‌شود
          </span>
        )}
      </div>
    </div>
  );
}
