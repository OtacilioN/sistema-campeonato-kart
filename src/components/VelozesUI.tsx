import {
  ArrowLeft,
  BarChart3,
  Calendar,
  CalendarClock,
  Check,
  ChevronRight,
  CircleCheck,
  Clock,
  Crown,
  FileText,
  Flag,
  Gauge,
  Info,
  Keyboard,
  Lock,
  MapPin,
  Star,
  Timer,
  Trophy,
  UploadCloud,
  User,
  UserPlus,
  Users,
  type LucideIcon,
} from "lucide-react";
import Link from "next/link";

const icons: Record<string, LucideIcon> = {
  "arrow-left": ArrowLeft,
  "bar-chart-3": BarChart3,
  calendar: Calendar,
  "calendar-clock": CalendarClock,
  check: Check,
  "chevron-right": ChevronRight,
  "circle-check": CircleCheck,
  clock: Clock,
  crown: Crown,
  "file-text": FileText,
  flag: Flag,
  gauge: Gauge,
  info: Info,
  keyboard: Keyboard,
  lock: Lock,
  "map-pin": MapPin,
  star: Star,
  timer: Timer,
  trophy: Trophy,
  "upload-cloud": UploadCloud,
  user: User,
  "user-plus": UserPlus,
  users: Users,
};

export function VzIcon({ name, size = 20, className }: { name: string; size?: number; className?: string }) {
  const Icon = icons[name] ?? Info;
  return <Icon aria-hidden="true" className={className} size={size} strokeWidth={1.9} />;
}

export function VzCard({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return <section className={`vz-card ${className}`}>{children}</section>;
}

export function VzButton({
  children,
  href,
  type = "button",
  variant = "primary",
  className = "",
}: {
  children: React.ReactNode;
  href?: string;
  type?: "button" | "submit";
  variant?: "primary" | "dark" | "secondary" | "ghost" | "danger";
  className?: string;
}) {
  const classes = `vz-button ${variant} ${className}`;
  if (href) return <Link className={classes} href={href}>{children}</Link>;
  return <button className={classes} type={type}>{children}</button>;
}

export function VzBadge({
  children,
  tone = "neutral",
  icon,
}: {
  children: React.ReactNode;
  tone?: "success" | "warning" | "danger" | "info" | "neutral" | "brand" | "dark";
  icon?: string;
}) {
  return (
    <span className={`vz-badge ${tone}`}>
      {icon ? <VzIcon name={icon} size={12} /> : null}
      {children}
    </span>
  );
}

export function VzChip({
  children,
  active = false,
  href,
}: {
  children: React.ReactNode;
  active?: boolean;
  href?: string;
}) {
  const className = `vz-chip ${active ? "active" : ""}`;
  if (href) {
    return (
      <Link aria-current={active ? "page" : undefined} className={className} href={href}>
        {children}
      </Link>
    );
  }
  return <span className={className}>{children}</span>;
}

export function IconTile({
  name,
  tone = "muted",
  size = 44,
}: {
  name: string;
  tone?: "muted" | "dark" | "brand";
  size?: number;
}) {
  return (
    <span className={`icon-tile ${tone}`} style={{ width: size, height: size }}>
      <VzIcon name={name} size={Math.round(size * 0.48)} />
    </span>
  );
}

export function SectionHead({
  icon,
  title,
  sub,
  right,
}: {
  icon?: string;
  title: string;
  sub?: string;
  right?: React.ReactNode;
}) {
  return (
    <div className="section-head">
      {icon ? <IconTile name={icon} /> : null}
      <div>
        <h2>{title}</h2>
        {sub ? <p>{sub}</p> : null}
      </div>
      {right ? <div className="section-head-right">{right}</div> : null}
    </div>
  );
}

export function RankRow({
  rank,
  name,
  meta,
  points,
  href,
  podium = false,
}: {
  rank: number;
  name: React.ReactNode;
  meta?: React.ReactNode;
  points: number;
  href?: string;
  podium?: boolean;
}) {
  const content = (
    <>
      <span className={`rank-pos ${podium && rank <= 3 ? `top-${rank}` : ""}`}>{rank}</span>
      <span className="rank-driver">
        <strong>{name}</strong>
        {meta ? <small>{meta}</small> : null}
      </span>
      <span className="rank-points">
        <strong>{points}</strong>
        <small>pts</small>
      </span>
      <VzIcon name="chevron-right" size={16} className="rank-chevron" />
    </>
  );

  if (href) return <Link className="rank-row" href={href}>{content}</Link>;
  return <div className="rank-row">{content}</div>;
}

export function DateBlock({
  day,
  mon,
  dow,
}: {
  day: string;
  mon: string;
  dow: string;
}) {
  return (
    <span className="date-block">
      <span>{mon}</span>
      <strong>{day}</strong>
      <span>{dow}</span>
    </span>
  );
}

export function CheckeredFlag({ size = 22 }: { size?: number }) {
  return <span aria-hidden="true" className="checkered-flag" style={{ width: size, height: size }} />;
}
