import { CalendarDays, Home, Lock, Trophy, Users } from "lucide-react";
import Link from "next/link";

const links = [
  { href: "/", label: "Home", icon: Home },
  { href: "/calendario", label: "Calendário", icon: CalendarDays },
  { href: "/ranking", label: "Ranking", icon: Trophy },
  { href: "/pilotos", label: "Pilotos", icon: Users },
];

export function TopBar() {
  return (
    <header className="topbar">
      <Link className="wordmark" href="/" aria-label="Velocidade Quase Máxima">
        <span>Velocidade</span>
        <strong>Quase Máxima</strong>
      </Link>
      <Link className="admin-lock" href="/admin" aria-label="Acesso administrativo">
        <Lock size={18} />
      </Link>
    </header>
  );
}

export function BottomNav() {
  return (
    <nav className="bottom-nav" aria-label="Navegação principal">
      {links.map((item) => {
        const Icon = item.icon;

        return (
          <Link key={item.href} href={item.href}>
            <Icon size={20} />
            <span>{item.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
