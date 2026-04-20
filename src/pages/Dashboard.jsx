import { useGetDashboardStats, useGetNeglectedResources, useGetRecentResources, useGetPinnedResources } from "@/lib/api-mock";
import { ResourceCard } from "../components/ResourceCard";
import {

  BookOpen,
  CheckCircle2,
  Clock,
  AlertTriangle,
  Pin,
  TrendingUp,
  CircleDashed,
  PlayCircle } from
"lucide-react";
import { Link } from "wouter";

export function Dashboard() {
  const { data: stats, isLoading: statsLoading } = useGetDashboardStats();
  const { data: neglected } = useGetNeglectedResources();
  const { data: recent } = useGetRecentResources();
  const { data: pinned } = useGetPinnedResources();

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-display font-bold text-foreground tracking-tight">
          Command Center
        </h1>
        <p className="text-sm text-muted-foreground mt-1 font-mono">
          {new Date().toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}
        </p>
      </div>

      {statsLoading ?
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {Array.from({ length: 4 }).map((_, i) =>
        <div key={i} className="glass-panel rounded-lg p-4 animate-pulse">
              <div className="h-8 bg-border/30 rounded mb-2" />
              <div className="h-4 bg-border/20 rounded" />
            </div>
        )}
        </div> :
      stats ?
      <>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <StatCard
            label="Total Resources"
            value={stats.total}
            icon={<BookOpen size={18} className="text-primary" />}
            accent />
          
            <StatCard
            label="Completed"
            value={stats.completed}
            icon={<CheckCircle2 size={18} className="text-green-400" />}
            sub={`${stats.completionRate}% rate`} />
          
            <StatCard
            label="In Progress"
            value={stats.inProgress}
            icon={<PlayCircle size={18} className="text-blue-400" />} />
          
            <StatCard
            label="Not Started"
            value={stats.notStarted}
            icon={<CircleDashed size={18} className="text-slate-400" />} />
          
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            <div className="glass-panel rounded-lg p-5 lg:col-span-2">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-sm font-semibold text-foreground flex items-center gap-2">
                  <TrendingUp size={15} className="text-primary" />
                  Completion Rate
                </h2>
                <span className="font-mono text-primary text-sm">{stats.completionRate}%</span>
              </div>
              <div className="w-full bg-border/30 rounded-full h-2 mb-4">
                <div
                className="h-2 rounded-full bg-gradient-to-r from-primary to-cyan-300 transition-all"
                style={{ width: `${stats.completionRate}%` }} />
              
              </div>

              <div className="grid grid-cols-2 gap-4 mt-5">
                <div>
                  <p className="text-xs text-muted-foreground font-mono mb-2 uppercase tracking-wider">By Type</p>
                  <div className="space-y-2">
                    {stats.byType.map(({ type, count }) =>
                  <div key={type} className="flex items-center gap-2">
                        <div className="flex-1 bg-border/20 rounded h-1.5">
                          <div
                        className="h-1.5 rounded bg-primary/50"
                        style={{ width: `${count / stats.total * 100}%` }} />
                      
                        </div>
                        <span className="text-xs font-mono text-muted-foreground w-16 capitalize">{type}</span>
                        <span className="text-xs font-mono text-foreground w-4 text-right">{count}</span>
                      </div>
                  )}
                  </div>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground font-mono mb-2 uppercase tracking-wider">By Priority</p>
                  <div className="space-y-2">
                    {stats.byPriority.map(({ priority, count }) =>
                  <div key={priority} className="flex items-center gap-2">
                        <div className="flex-1 bg-border/20 rounded h-1.5">
                          <div
                        className="h-1.5 rounded"
                        style={{
                          width: `${count / stats.total * 100}%`,
                          backgroundColor: priority === "critical" ? "#f87171" : priority === "high" ? "#fb923c" : priority === "medium" ? "#facc15" : "#94a3b8"
                        }} />
                      
                        </div>
                        <span className="text-xs font-mono text-muted-foreground w-16 capitalize">{priority}</span>
                        <span className="text-xs font-mono text-foreground w-4 text-right">{count}</span>
                      </div>
                  )}
                  </div>
                </div>
              </div>
            </div>

            <div className="glass-panel rounded-lg p-5">
              <h2 className="text-sm font-semibold text-foreground flex items-center gap-2 mb-4">
                <Pin size={15} className="text-primary" />
                Quick Stats
              </h2>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-muted-foreground">Pinned</span>
                  <span className="font-mono text-sm text-foreground">{stats.pinned}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-muted-foreground">Neglected</span>
                  <span className="font-mono text-sm text-yellow-400">{neglected?.length ?? 0}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-muted-foreground">Topics tracked</span>
                  <span className="font-mono text-sm text-foreground">
                    {new Set(recent?.flatMap((r) => r.tags) ?? []).size}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </> :
      null}

      {pinned && pinned.length > 0 &&
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-semibold text-foreground flex items-center gap-2">
              <Pin size={15} className="text-primary" />
              Pinned Resources
            </h2>
            <Link href="/resources">
              <span className="text-xs text-muted-foreground hover:text-primary transition-colors cursor-pointer">
                View all
              </span>
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {pinned.map((r) =>
              <ResourceCard key={r.id} resource={r} />
            )}
          </div>
        </div>
      }

      {neglected && neglected.length > 0 &&
      <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-semibold text-foreground flex items-center gap-2">
              <AlertTriangle size={15} className="text-yellow-400" />
              Neglected Resources
              <span className="text-xs font-mono text-yellow-400 bg-yellow-400/10 border border-yellow-400/20 px-2 py-0.5 rounded">
                needs attention
              </span>
            </h2>
            <Link href="/resources?status=not_started">
              <span className="text-xs text-muted-foreground hover:text-primary transition-colors cursor-pointer">
                View all
              </span>
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {neglected.slice(0, 4).map((r) =>
          <ResourceCard key={r.id} resource={r} />
          )}
          </div>
        </div>
      }

      {recent && recent.length > 0 &&
      <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-semibold text-foreground flex items-center gap-2">
              <Clock size={15} className="text-primary" />
              Recently Added
            </h2>
            <Link href="/resources">
              <span className="text-xs text-muted-foreground hover:text-primary transition-colors cursor-pointer">
                View all
              </span>
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {recent.map((r) =>
          <ResourceCard key={r.id} resource={r} />
          )}
          </div>
        </div>
      }
    </div>);

}

function StatCard({
  label,
  value,
  icon,
  sub,
  accent






}) {
  return (
    <div className={`glass-panel rounded-lg p-4 ${accent ? "border-primary/30" : ""}`}>
      <div className="flex items-center justify-between mb-2">
        {icon}
        {accent && <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />}
      </div>
      <div className="text-2xl font-display font-bold text-foreground">{value}</div>
      <div className="text-xs text-muted-foreground mt-0.5">{label}</div>
      {sub && <div className="text-xs text-primary font-mono mt-1">{sub}</div>}
    </div>);

}