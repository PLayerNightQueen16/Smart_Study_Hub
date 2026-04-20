import { useState } from "react";
import { Link, useLocation } from "wouter";
import { ConstellationBackground } from "./ConstellationBackground";
import {
  LayoutDashboard,
  Library,
  BarChart3,
  Plus,
  PanelLeftClose,
  PanelLeftOpen
} from
  "lucide-react";

const navItems = [
  { href: "/", label: "Dashboard", icon: LayoutDashboard },
  { href: "/resources", label: "Library", icon: Library },
  { href: "/analytics", label: "Analytics", icon: BarChart3 }];


export function Layout({ children }) {
  const [location] = useLocation();
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className="min-h-screen text-foreground relative">
      <ConstellationBackground />
      <div className="relative z-10 flex h-screen overflow-hidden">
        <aside className={`${collapsed ? "w-20" : "w-60"} transition-all duration-300 ease-in-out shrink-0 flex flex-col border-r border-border/50 bg-background/80 backdrop-blur-sm relative`}>

          <button
            onClick={() => setCollapsed(!collapsed)}
            className="absolute -right-3 top-5 bg-background border border-border/50 rounded-full p-1 text-muted-foreground hover:text-primary z-20 transition-colors"
          >
            {collapsed ? <PanelLeftOpen size={14} /> : <PanelLeftClose size={14} />}
          </button>

          <div className={`py-6 border-b border-border/50 flex flex-col items-center ${collapsed ? "px-1" : "px-4"}`}>
            <div className="flex flex-col items-center gap-3 w-full">
              <img src="/logo.jpg" alt="LearnOS Logo" className={`${collapsed ? "w-12 h-12" : "w-32 h-32"} shrink-0 object-contain transition-all duration-300`} />
              {!collapsed && (
                <span className="text-2xl font-display font-bold text-primary tracking-wide cyan-glow-text">
                  LearnOS
                </span>
              )}
            </div>
            {!collapsed && (
              <p className="text-xs text-muted-foreground mt-1 font-mono truncate">
                knowledge.system.v1
              </p>
            )}
          </div>

          <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto no-scrollbar">
            {navItems.map(({ href, label, icon: Icon }) => {
              const isActive =
                href === "/" ?
                  location === "/" || location === "" :
                  location.startsWith(href);
              return (
                <Link key={href} href={href}>
                  <div
                    className={`flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium transition-all cursor-pointer ${isActive ?
                        "bg-primary/10 text-primary border border-primary/20" :
                        "text-muted-foreground hover:text-foreground hover:bg-accent/50"} ${collapsed ? "justify-center px-0" : ""}`
                    }
                    title={collapsed ? label : undefined}
                  >
                    <Icon size={16} className="shrink-0" />
                    {!collapsed && <span>{label}</span>}
                    {!collapsed && isActive &&
                      <div className="ml-auto w-1 h-1 rounded-full bg-primary" />
                    }
                  </div>
                </Link>);
            })}
          </nav>

          <div className="px-3 pb-4 pt-2">
            <Link href="/resources/new">
              <div
                className={`flex items-center gap-2 py-2.5 rounded-md bg-primary/10 border border-primary/30 text-primary text-sm font-medium hover:bg-primary/20 transition-all cursor-pointer ${collapsed ? "justify-center px-0" : "px-3"}`}
                title={collapsed ? "Add Resource" : undefined}
              >
                <Plus size={16} className="shrink-0" />
                {!collapsed && <span>Add Resource</span>}
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