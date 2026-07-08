"use client";

import { BarChart3, BookOpenText, Calendar, Home, Lock, User } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const navItems = [
  { path: "/", id: "home", label: "Home", icon: Home },
  { path: "/calendario", id: "calendar", label: "Calendário", icon: Calendar },
  { path: "/ranking", id: "ranking", label: "Ranking", icon: BarChart3 },
  { path: "/regulamento", id: "regulation", label: "Regulamento", icon: BookOpenText },
  { path: "/pilotos", id: "drivers", label: "Pilotos", icon: User },
];

const homeTitle = "Velocidade quase máxima";

function seasonContext(pathname: string) {
  const match = pathname.match(/^\/temporadas\/([^/]+)(\/.*)?$/);
  if (!match) return { basePath: "", path: pathname };
  return {
    basePath: `/temporadas/${match[1]}`,
    path: match[2] || "/",
  };
}

function titleForPath(pathname: string) {
  if (pathname === "/temporadas") return "Temporadas";
  const { path } = seasonContext(pathname);

  if (pathname.startsWith("/admin")) return "Admin";
  if (path.startsWith("/calendario")) return "Calendário";
  if (path.startsWith("/ranking") || path.includes("/ranking")) return "Ranking";
  if (path.startsWith("/regulamento")) return "Regulamento";
  if (path.includes("/baterias/")) return "Corrida";
  if (path.startsWith("/pilotos/")) return "Perfil do Piloto";
  if (path.startsWith("/pilotos")) return "Pilotos";
  return homeTitle;
}

function activeForPath(pathname: string) {
  if (pathname === "/temporadas") return "ranking";
  const { path } = seasonContext(pathname);

  if (path.startsWith("/calendario")) return "calendar";
  if (path.includes("/baterias/")) return "calendar";
  if (path.startsWith("/ranking") || path.includes("/ranking")) return "ranking";
  if (path.startsWith("/regulamento")) return "regulation";
  if (path.startsWith("/pilotos")) return "drivers";
  return "home";
}

export function TopBar() {
  const pathname = usePathname();
  const isAdmin = pathname.startsWith("/admin");
  const title = titleForPath(pathname);
  const { basePath } = seasonContext(pathname);

  return (
    <header className={`topbar ${isAdmin ? "dark" : ""}`}>
      <div className="topbar-side" />
      <Link className={`chrome-title ${title === homeTitle ? "brand" : ""}`} href={basePath || "/"}>
        {title}
      </Link>
      <Link className="admin-lock" href="/admin" aria-label="Acesso administrativo">
        <Lock size={22} strokeWidth={2} />
      </Link>
    </header>
  );
}

export function BottomNav() {
  const pathname = usePathname();
  if (pathname.startsWith("/admin")) return null;

  const active = activeForPath(pathname);
  const { basePath } = seasonContext(pathname);

  return (
    <nav className="bottom-nav" aria-label="Navegação principal">
      {navItems.map((item) => {
        const Icon = item.icon;
        const on = active === item.id;
        const href = basePath ? `${basePath}${item.path === "/" ? "" : item.path}` : item.path;
        return (
          <Link className={on ? "active" : ""} key={item.path} href={href}>
            <Icon size={22} strokeWidth={on ? 2.4 : 1.85} />
            <span>{item.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
