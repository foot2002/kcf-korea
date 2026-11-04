import {
  Award,
  BadgeCheck,
  Briefcase,
  CirclePlay,
  ClipboardCheck,
  FilePenLine,
  GraduationCap,
  History,
  Landmark,
  Mail,
  Newspaper,
  ScanSearch,
  Search,
  ShieldCheck,
  Trophy,
  Users,
  type LucideIcon,
} from "lucide-react";

const ICONS: Record<string, LucideIcon> = {
  Award,
  BadgeCheck,
  Briefcase,
  ClipboardCheck,
  FileSignature: FilePenLine,
  GraduationCap,
  History,
  Landmark,
  Mail,
  Newspaper,
  PlayCircle: CirclePlay,
  ScanSearch,
  Search,
  ShieldCheck,
  Trophy,
  Users,
};

export function HomeIcon({ name, className }: { name: string; className?: string }) {
  const Icon = ICONS[name] ?? Search;
  return <Icon className={className} aria-hidden="true" />;
}
