import * as React from "react";
import type { Role } from "./mock-data";

type Ctx = {
  role: Role | null;
  ready: boolean;
  login: (role: Role) => void;
  logout: () => void;
};

const RoleContext = React.createContext<Ctx>({
  role: null,
  ready: false,
  login: () => {},
  logout: () => {},
});

const KEY = "vlms-role";

export function RoleProvider({ children }: { children: React.ReactNode }) {
  const [role, setRole] = React.useState<Role | null>(null);
  const [ready, setReady] = React.useState(false);

  React.useEffect(() => {
    const stored = window.localStorage.getItem(KEY) as Role | null;
    if (stored === "student" || stored === "professor" || stored === "admin") setRole(stored);
    setReady(true);
  }, []);

  const login = React.useCallback((r: Role) => {
    window.localStorage.setItem(KEY, r);
    setRole(r);
  }, []);

  const logout = React.useCallback(() => {
    window.localStorage.removeItem(KEY);
    setRole(null);
  }, []);

  return (
    <RoleContext.Provider value={{ role, ready, login, logout }}>{children}</RoleContext.Provider>
  );
}

export function useRole() {
  return React.useContext(RoleContext);
}

export function usePersianClock() {
  const [now, setNow] = React.useState<string>("");

  React.useEffect(() => {
    const update = () => {
      const d = new Date();
      const date = new Intl.DateTimeFormat("fa-IR", {
        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric",
      }).format(d);
      const time = new Intl.DateTimeFormat("fa-IR", {
        hour: "2-digit",
        minute: "2-digit",
      }).format(d);
      setNow(`${date} — ${time}`);
    };
    update();
    const i = window.setInterval(update, 30000);
    return () => window.clearInterval(i);
  }, []);

  return now;
}
