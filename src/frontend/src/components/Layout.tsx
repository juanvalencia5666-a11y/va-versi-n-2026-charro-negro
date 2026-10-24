import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";
import { useActiveSection } from "@/hooks/use-active-section";
import { NAV_ITEMS } from "@/lib/sections";
import type { ReactNode } from "react";

interface LayoutProps {
  children: ReactNode;
}

const SECTION_IDS = NAV_ITEMS.map((item) => item.id);

export function Layout({ children }: LayoutProps) {
  const activeId = useActiveSection(SECTION_IDS);

  return (
    <div className="flex min-h-dvh flex-col bg-background">
      <SiteHeader activeId={activeId} />
      <main className="flex-1">{children}</main>
      <SiteFooter />
    </div>
  );
}
