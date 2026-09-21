// مدل داده و استور مشترک وایت‌برد استاد
// - ذخیره‌سازی پایدار در localStorage
// - همگام‌سازی زندهٔ چندتبی با BroadcastChannel (+ حضور ناظران)
// - undo/redo، صفحه‌بندی و جابه‌جایی اشیاء

export type WbTool =
  "select" | "pen" | "marker" | "eraser" | "line" | "rect" | "ellipse" | "arrow" | "text" | "laser";

export type WbPoint = { x: number; y: number };

export type WbStroke = {
  id: string;
  type: "stroke";
  tool: "pen" | "marker";
  points: WbPoint[];
  color: string;
  size: number;
};

export type WbShape = {
  id: string;
  type: "shape";
  kind: "line" | "rect" | "ellipse" | "arrow";
  x0: number;
  y0: number;
  x1: number;
  y1: number;
  color: string;
  size: number;
};

export type WbText = {
  id: string;
  type: "textbox";
  x: number;
  y: number;
  text: string;
  color: string;
  size: number;
};

export type WbImage = {
  id: string;
  type: "image";
  x: number;
  y: number;
  w: number;
  h: number;
  src: string;
};

export type WbElement = WbStroke | WbShape | WbText | WbImage;

export type WbPage = {
  id: string;
  title: string;
  elements: WbElement[];
};

export type WbSnapshot = {
  pages: WbPage[];
  current: number;
  canUndo: boolean;
  canRedo: boolean;
};

export type WbBox = { x: number; y: number; w: number; h: number };

let uid = 0;
function nextId(): string {
  uid += 1;
  return `wb-${Date.now().toString(36)}-${uid.toString(36)}`;
}

export function makePage(title?: string): WbPage {
  return { id: nextId(), title: title ?? "برگه جدید", elements: [] };
}

const HISTORY_LIMIT = 60;
const STORAGE_KEY = "vlms-whiteboard-v1";
const CHANNEL_NAME = "vlms-whiteboard-v1";

function isBrowser(): boolean {
  return typeof window !== "undefined" && typeof window.localStorage !== "undefined";
}

function loadPersisted(): { pages: WbPage[]; current: number } | null {
  if (!isBrowser()) return null;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as { pages?: WbPage[]; current?: number };
    if (!Array.isArray(parsed.pages) || parsed.pages.length === 0) return null;
    const current = Math.min(Math.max(parsed.current ?? 0, 0), parsed.pages.length - 1);
    return { pages: parsed.pages, current };
  } catch {
    return null;
  }
}

type SyncMsg =
  | { kind: "state"; pages: WbPage[]; current: number }
  | { kind: "laser"; x: number; y: number; active: boolean }
  | { kind: "ping"; id: string }
  | { kind: "pong"; id: string };

const initial = loadPersisted() ?? { pages: [makePage("برگه ۱")], current: 0 };

const subs = new Set<() => void>();
let pages: WbPage[] = initial.pages;
let current = initial.current;
let history: { pages: WbPage[]; current: number }[] = [];
let redoStack: { pages: WbPage[]; current: number }[] = [];
let batch: { pages: WbPage[]; current: number } | null = null;

let channel: BroadcastChannel | null = null;
if (isBrowser() && typeof window.BroadcastChannel !== "undefined") {
  try {
    channel = new BroadcastChannel(CHANNEL_NAME);
  } catch {
    channel = null;
  }
}

const clientId = Math.random().toString(36).slice(2);
const peerMap = new Map<string, number>();
const presenceSubs = new Set<() => void>();
let peerCount = 0;
const laserHandlers = new Set<(x: number, y: number, active: boolean) => void>();

function setPeerCount(n: number) {
  if (n === peerCount) return;
  peerCount = n;
  for (const fn of presenceSubs) fn();
}

function markPeer(id: string) {
  if (!id || id === clientId) return;
  peerMap.set(id, Date.now());
  setPeerCount(peerMap.size);
}

function prunePeers() {
  const now = Date.now();
  for (const [id, ts] of peerMap) if (now - ts > 9000) peerMap.delete(id);
  setPeerCount(peerMap.size);
}

function snapshotNow() {
  return { pages, current };
}

function broadcastState() {
  channel?.postMessage({ kind: "state", pages: structuredClone(pages), current } satisfies SyncMsg);
}

function persist() {
  if (!isBrowser()) return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify({ pages, current }));
  } catch {
    // ignore quota / privacy errors
  }
}

function notify() {
  for (const fn of subs) fn();
}

function emit(opts: { persist?: boolean; broadcast?: boolean } = {}) {
  lastSnapshot = { pages, current, canUndo: history.length > 0, canRedo: redoStack.length > 0 };
  if (opts.persist !== false) persist();
  if (opts.broadcast !== false) broadcastState();
  notify();
}

let lastSnapshot: WbSnapshot = { pages, current, canUndo: false, canRedo: false };

function trimHistory() {
  if (history.length > HISTORY_LIMIT) history.splice(0, history.length - HISTORY_LIMIT);
}

function commit(nextPages: WbPage[], nextCurrent: number, record = true) {
  if (record) {
    history.push(structuredClone(snapshotNow()));
    trimHistory();
    redoStack = [];
  }
  pages = nextPages;
  current = nextCurrent;
  emit();
}

function applyRemote(nextPages: WbPage[], nextCurrent: number) {
  pages = nextPages;
  current = Math.min(Math.max(nextCurrent, 0), nextPages.length - 1);
  emit({ broadcast: false });
}

function handleMessage(msg: SyncMsg) {
  if (!msg || typeof msg !== "object") return;
  if (msg.kind === "state") {
    applyRemote(msg.pages, msg.current);
  } else if (msg.kind === "laser") {
    for (const fn of laserHandlers) fn(msg.x, msg.y, msg.active);
  } else if (msg.kind === "ping") {
    markPeer(msg.id);
    channel?.postMessage({ kind: "pong", id: clientId } satisfies SyncMsg);
  } else if (msg.kind === "pong") {
    markPeer(msg.id);
  }
}

if (channel) channel.onmessage = (e: MessageEvent) => handleMessage(e.data as SyncMsg);

// پشتیبان برای مرورگرهای بدون BroadcastChannel
if (isBrowser()) {
  window.addEventListener("storage", (e) => {
    if (e.key !== STORAGE_KEY || !e.newValue) return;
    try {
      const parsed = JSON.parse(e.newValue) as { pages?: WbPage[]; current?: number };
      if (Array.isArray(parsed.pages) && parsed.pages.length > 0) {
        applyRemote(parsed.pages, parsed.current ?? 0);
      }
    } catch {
      // ignore
    }
  });

  const heartbeat = window.setInterval(() => {
    channel?.postMessage({ kind: "ping", id: clientId } satisfies SyncMsg);
    prunePeers();
  }, 3000);
  window.setTimeout(() => {
    channel?.postMessage({ kind: "ping", id: clientId } satisfies SyncMsg);
  }, 400);
  window.addEventListener("beforeunload", () => window.clearInterval(heartbeat));
}

export const whiteboardPresence = {
  subscribe(fn: () => void) {
    presenceSubs.add(fn);
    return () => {
      presenceSubs.delete(fn);
    };
  },
  getSnapshot(): number {
    return peerCount;
  },
};

export const whiteboard = {
  subscribe(fn: () => void) {
    subs.add(fn);
    return () => {
      subs.delete(fn);
    };
  },
  getSnapshot(): WbSnapshot {
    return lastSnapshot;
  },
  currentElements(): WbElement[] {
    return pages[current]?.elements ?? [];
  },
  addElement(el: WbElement) {
    const next = structuredClone(pages);
    next[current]?.elements.push(el);
    commit(next, current);
  },
  removeElements(ids: Set<string>) {
    if (ids.size === 0) return;
    const next = structuredClone(pages);
    const page = next[current];
    if (!page) return;
    page.elements = page.elements.filter((e) => !ids.has(e.id));
    commit(next, current);
  },
  clearPage() {
    const next = structuredClone(pages);
    const page = next[current];
    if (page) page.elements = [];
    commit(next, current);
  },
  addPage() {
    const next = structuredClone(pages);
    next.push(makePage(`برگه ${next.length + 1}`));
    commit(next, next.length - 1);
  },
  duplicatePage() {
    const next = structuredClone(pages);
    const page = next[current];
    if (!page) return;
    const copy: WbPage = {
      ...page,
      id: nextId(),
      title: `${page.title} (کپی)`,
      elements: structuredClone(page.elements),
    };
    next.splice(current + 1, 0, copy);
    commit(next, current + 1);
  },
  removePage() {
    if (pages.length <= 1) return;
    const next = structuredClone(pages);
    next.splice(current, 1);
    commit(next, Math.min(current, next.length - 1));
  },
  gotoPage(index: number) {
    if (index < 0 || index >= pages.length || index === current) return;
    commit(structuredClone(pages), index);
  },
  setPageTitle(title: string) {
    const next = structuredClone(pages);
    const page = next[current];
    if (page) page.title = title;
    commit(next, current);
  },
  // جابه‌جایی زندهٔ یک شیء (بدون ثبت در تاریخچه تا پایان درگ)
  beginBatch() {
    if (!batch) batch = structuredClone(snapshotNow());
  },
  endBatch() {
    if (!batch) return;
    history.push(batch);
    trimHistory();
    redoStack = [];
    batch = null;
    emit();
  },
  translateElement(id: string, dx: number, dy: number) {
    const next = structuredClone(pages);
    const page = next[current];
    if (!page) return;
    const idx = page.elements.findIndex((e) => e.id === id);
    const el = idx >= 0 ? page.elements[idx] : undefined;
    if (!el) return;
    if (el.type === "stroke") {
      el.points = el.points.map((p) => ({ x: p.x + dx, y: p.y + dy }));
    } else if (el.type === "shape") {
      el.x0 += dx;
      el.y0 += dy;
      el.x1 += dx;
      el.y1 += dy;
    } else {
      el.x += dx;
      el.y += dy;
    }
    pages = next;
    emit({ persist: false });
  },
  undo() {
    if (history.length === 0) return;
    redoStack.push(structuredClone(snapshotNow()));
    const prev = history.pop();
    if (!prev) return;
    pages = prev.pages;
    current = prev.current;
    emit();
  },
  redo() {
    if (redoStack.length === 0) return;
    history.push(structuredClone(snapshotNow()));
    const next = redoStack.pop();
    if (!next) return;
    pages = next.pages;
    current = next.current;
    emit();
  },
  reset() {
    history = [];
    redoStack = [];
    pages = [makePage("برگه ۱")];
    current = 0;
    emit();
  },
  sendLaser(x: number, y: number, active: boolean) {
    channel?.postMessage({ kind: "laser", x, y, active } satisfies SyncMsg);
  },
  onRemoteLaser(fn: (x: number, y: number, active: boolean) => void) {
    laserHandlers.add(fn);
    return () => {
      laserHandlers.delete(fn);
    };
  },
};

export function elementBox(el: WbElement): WbBox {
  if (el.type === "stroke") {
    let minX = Infinity;
    let minY = Infinity;
    let maxX = -Infinity;
    let maxY = -Infinity;
    for (const p of el.points) {
      minX = Math.min(minX, p.x);
      minY = Math.min(minY, p.y);
      maxX = Math.max(maxX, p.x);
      maxY = Math.max(maxY, p.y);
    }
    if (!Number.isFinite(minX)) return { x: 0, y: 0, w: 0, h: 0 };
    const pad = el.size + 4;
    return { x: minX - pad, y: minY - pad, w: maxX - minX + pad * 2, h: maxY - minY + pad * 2 };
  }
  if (el.type === "shape") {
    const x = Math.min(el.x0, el.x1);
    const y = Math.min(el.y0, el.y1);
    const pad = el.size + 4;
    return {
      x: x - pad,
      y: y - pad,
      w: Math.abs(el.x1 - el.x0) + pad * 2,
      h: Math.abs(el.y1 - el.y0) + pad * 2,
    };
  }
  if (el.type === "textbox") {
    const w = Math.max(el.text.length * el.size * 0.62, el.size);
    return { x: el.x - 6, y: el.y - 6, w: w + 12, h: el.size + 12 };
  }
  return { x: el.x - 4, y: el.y - 4, w: el.w + 8, h: el.h + 8 };
}

// رنگ‌ها و ضخامت‌های پرکاربرد
export const WB_COLORS = [
  "#1e293b",
  "#dc2626",
  "#ea580c",
  "#d97706",
  "#16a34a",
  "#0d9488",
  "#2563eb",
  "#7c3aed",
  "#db2777",
] as const;

export const WB_SIZES = [2, 4, 7, 11, 16] as const;

export function dist(a: WbPoint, b: WbPoint): number {
  return Math.hypot(a.x - b.x, a.y - b.y);
}

export function distToSegment(p: WbPoint, a: WbPoint, b: WbPoint): number {
  const dx = b.x - a.x;
  const dy = b.y - a.y;
  const len2 = dx * dx + dy * dy;
  if (len2 === 0) return dist(p, a);
  let t = ((p.x - a.x) * dx + (p.y - a.y) * dy) / len2;
  t = Math.max(0, Math.min(1, t));
  return dist(p, { x: a.x + t * dx, y: a.y + t * dy });
}
