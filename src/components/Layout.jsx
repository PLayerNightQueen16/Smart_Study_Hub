import { useState } from "react";
import { Link, useLocation } from "wouter";
import { ConstellationBackground } from "./ConstellationBackground";
import logo from '/public/logo.jpg';
import {
  LayoutDashboard,
  Library,
  BarChart3,
  Plus,
  PanelLeftClose,
  PanelLeftOpen,
  Menu,
  X
} from
  "lucide-react";

const navItems = [
  { href: "/", label: "Dashboard", icon: LayoutDashboard },
  { href: "/resources", label: "Library", icon: Library },
  { href: "/analytics", label: "Analytics", icon: BarChart3 }];


export function Layout({ children }) {
  const [location] = useLocation();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen text-foreground relative">
      <ConstellationBackground />
      <div className="relative z-10 flex h-screen overflow-hidden">
        
        {mobileMenuOpen && (
          <div 
            className="md:hidden fixed inset-0 bg-black/60 z-40 backdrop-blur-sm transition-opacity"
            onClick={() => setMobileMenuOpen(false)}
          />
        )}

        <aside className={`absolute md:relative z-50 h-full ${mobileMenuOpen ? "translate-x-0" : "-translate-x-full"} md:translate-x-0 ${collapsed ? "md:w-20" : "md:w-60"} w-64 transition-all duration-300 ease-in-out shrink-0 flex flex-col border-r border-border/50 bg-background/95 backdrop-blur-xl`}>

          <button
            onClick={() => setCollapsed(!collapsed)}
            className="hidden md:flex absolute -right-3 top-5 bg-background border border-border/50 rounded-full p-1 text-muted-foreground hover:text-primary z-20 transition-colors"
          >
            {collapsed ? <PanelLeftOpen size={14} /> : <PanelLeftClose size={14} />}
          </button>
          
          <button 
             onClick={() => setMobileMenuOpen(false)}
             className="md:hidden absolute right-4 top-4 p-2 text-muted-foreground hover:text-foreground hover:bg-accent rounded-full transition-colors"
          >
             <X size={20} />
          </button>

          <div className={`py-6 border-b border-border/50 flex flex-col items-center ${collapsed ? "md:px-1" : "px-4"}`}>
            <div className="flex flex-col items-center gap-3 w-full">
              <img src={logo} alt="LearnOS Logo" className={`${collapsed ? "md:w-12 md:h-12 w-24 h-24" : "w-32 h-32"} shrink-0 object-contain transition-all duration-300`} />
              <span className={`text-2xl font-display font-bold text-primary tracking-wide cyan-glow-text ${collapsed ? "md:hidden" : ""}`}>
                LearnOS
              </span>
            </div>
            <p className={`text-xs text-muted-foreground mt-1 font-mono truncate ${collapsed ? "md:hidden" : ""}`}>
              knowledge.system.v1
            </p>
          </div>

          <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto no-scrollbar">
            {navItems.map(({ href, label, icon: Icon }) => {
              const isActive =
                href === "/" ?
                  location === "/" || location === "" :
                  location.startsWith(href);
              return (
                <Link key={href} href={href} onClick={() => setMobileMenuOpen(false)}>
                  <div
                    className={`flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium transition-all cursor-pointer ${isActive ?
                        "bg-primary/10 text-primary border border-primary/20" :
                        "text-muted-foreground hover:text-foreground hover:bg-accent/50"} ${collapsed ? "md:justify-center md:px-0" : ""}`
                    }
                    title={collapsed ? label : undefined}
                  >
                    <Icon size={16} className="shrink-0" />
                    <span className={collapsed ? "md:hidden" : ""}>{label}</span>
                    {isActive &&
                      <div className={`ml-auto w-1 h-1 rounded-full bg-primary ${collapsed ? "md:hidden" : ""}`} />
                    }
                  </div>
                </Link>);
            })}
          </nav>

          <div className="px-3 pb-4 pt-2">
            <Link href="/resources/new" onClick={() => setMobileMenuOpen(false)}>
              <div
                className={`flex items-center gap-2 py-2.5 rounded-md bg-primary/10 border border-primary/30 text-primary text-sm font-medium hover:bg-primary/20 transition-all cursor-pointer ${collapsed ? "md:justify-center md:px-0" : "px-3"}`}
                title={collapsed ? "Add Resource" : undefined}
              >
                <Plus size={16} className="shrink-0" />
                <span className={collapsed ? "md:hidden" : ""}>Add Resource</span>
              </div>
            </Link>
          </div>
        </aside>
        
        <div className="flex-1 flex flex-col h-screen overflow-hidden relative">
          <div className="md:hidden shrink-0 h-14 bg-background/80 backdrop-blur-md border-b border-border/50 flex items-center px-4 z-40">
            <button onClick={() => setMobileMenuOpen(true)} className="p-2 text-foreground/80 hover:text-primary transition-colors">
              <Menu size={20} />
            </button>
            <span className="ml-3 font-display font-bold text-primary tracking-wide text-lg cyan-glow-text shadow-glow">LearnOS</span>
          </div>

          <main className="flex-1 overflow-auto w-full">
            {children}
          </main>
        </div>
      </div>
    </div>);

}