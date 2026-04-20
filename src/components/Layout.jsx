import { Link, useLocation } from "wouter";
import { ConstellationBackground } from "./ConstellationBackground";
import {
  LayoutDashboard,
  Library,
  BarChart3,
  Plus } from
"lucide-react";

const navItems = [
{ href: "/", label: "Dashboard", icon: LayoutDashboard },
{ href: "/resources", label: "Library", icon: Library },
{ href: "/analytics", label: "Analytics", icon: BarChart3 }];


export function Layout({ children }) {
  const [location] = useLocation();

  return (
    <div className="min-h-screen text-foreground relative">
      <ConstellationBackground />
      <div className="relative z-10 flex h-screen overflow-hidden">
        <aside className="w-60 shrink-0 flex flex-col border-r border-border/50 bg-background/80 backdrop-blur-sm">
          <div className="px-6 py-5 border-b border-border/50">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-primary shadow-[0_0_8px_2px_rgba(0,229,255,0.6)]" />
              <span className="text-sm font-mono font-semibold text-primary tracking-widest uppercase cyan-glow-text">
                LearnOS
              </span>
            </div>
            <p className="text-xs text-muted-foreground mt-1 font-mono">
              knowledge.system.v1
            </p>
          </div>
          <nav className="flex-1 px-3 py-4 space-y-1">
            {navItems.map(({ href, label, icon: Icon }) => {
              const isActive =
              href === "/" ?
              location === "/" || location === "" :
              location.startsWith(href);
              return (
                <Link key={href} href={href}>
                  <div
                    className={`flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium transition-all cursor-pointer ${
                    isActive ?
                    "bg-primary/10 text-primary border border-primary/20" :
                    "text-muted-foreground hover:text-foreground hover:bg-accent/50"}`
                    }>
                    
                    <Icon size={16} />
                    {label}
                    {isActive &&
                    <div className="ml-auto w-1 h-1 rounded-full bg-primary" />
                    }
                  </div>
                </Link>);

            })}
          </nav>
          <div className="px-3 pb-4">
            <Link href="/resources/new">
              <div className="flex items-center gap-2 px-3 py-2.5 rounded-md bg-primary/10 border border-primary/30 text-primary text-sm font-medium hover:bg-primary/20 transition-all cursor-pointer">
                <Plus size={16} />
                Add Resource
              </div>
            </Link>
          </div>
        </aside>
        <main className="flex-1 overflow-auto">
          {children}
        </main>
      </div>
    </div>);

}