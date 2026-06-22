"use client";

import { BarChart3, Calendar, Home, Lock, User } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const navItems = [
  { href: "/", id: "home", label: "Home", icon: Home },
  { href: "/calendario", id: "calendar", label: "Calendário", icon: Calendar },
  { href: "/ranking", id: "ranking", label: "Ranking", icon: BarChart3 },
  { href: "/pilotos", id: "drivers", label: "Pilotos", icon: User },
];

const homeTitle = "Velocidade quase máxima";

function titleForPath(pathname: string) {
  if (pathname.startsWith("/admin")) return "Admin";
  if (pathname.startsWith("/calendario")) return "Calendário";
  if (pathname.startsWith("/ranking") || pathname.includes("/ranking")) return "Ranking";
  if (pathname.startsWith("/pilotos/")) return "Perfil do Piloto";
  if (pathname.startsWith("/pilotos")) return "Pilotos";
  if (pathname.includes("/baterias/")) return "Corrida";
  return homeTitle;
}

function activeForPath(pathname: string) {
  if (pathname.startsWith("/calendario")) return "calendar";
  if (pathname.startsWith("/ranking") || pathname.includes("/ranking")) return "ranking";
  if (pathname.startsWith("/pilotos")) return "drivers";
  return "home";
}

export function TopBar() {
  const pathname = usePathname();
  const isAdmin = pathname.startsWith("/admin");
  const title = titleForPath(pathname);

  return (
    <header className={`topbar ${isAdmin ? "dark" : ""}`}>
      <div className="topbar-side" />
      <Link className={`chrome-title ${title === homeTitle ? "brand" : ""}`} href="/">
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

  return (
    <nav className="bottom-nav" aria-label="Navegação principal">
      {navItems.map((item) => {
        const Icon = item.icon;
        const on = active === item.id;
        return (
          <Link className={on ? "active" : ""} key={item.href} href={item.href}>
            <Icon size={22} strokeWidth={on ? 2.4 : 1.85} />
            <span>{item.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
