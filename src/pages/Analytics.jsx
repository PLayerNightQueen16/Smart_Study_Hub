import { useGetLearningAnalytics, useGetDashboardStats } from "@/lib/api-mock";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
  PieChart,
  Pie,
  Legend } from
"recharts";
import { BarChart3, TrendingUp, Tag } from "lucide-react";

const COLORS = ["#00e5ff", "#a855f7", "#22c55e", "#f97316", "#ec4899"];

export function Analytics() {
  const { data: analytics, isLoading: analyticsLoading } = useGetLearningAnalytics();
  const { data: stats } = useGetDashboardStats();

  const pieData = stats ?
  [
  { name: "Completed", value: stats.completed, fill: "#22c55e" },
  { name: "In Progress", value: stats.inProgress, fill: "#00e5ff" },
  { name: "Not Started", value: stats.notStarted, fill: "#64748b" }].
  filter((d) => d.value > 0) :
  [];

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-display font-bold text-foreground tracking-tight">
          Learning Analytics
        </h1>
        <p className="text-sm text-muted-foreground mt-1 font-mono">
          topic-wise progress and insights
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div className="glass-panel rounded-lg p-5">
          <h2 className="text-sm font-semibold text-foreground flex items-center gap-2 mb-5">
            <BarChart3 size={15} className="text-primary" />
            Overall Progress
          </h2>
          {stats &&
          <div className="h-48">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={80}
                  paddingAngle={3}
                  dataKey="value">
                  
                    {pieData.map((entry, index) =>
                  <Cell key={index} fill={entry.fill} />
                  )}
                  </Pie>
                  <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(225 45% 10%)",
                    border: "1px solid hsl(225 30% 18%)",
                    borderRadius: "6px",
                    color: "hsl(210 40% 98%)",
                    fontSize: "12px"
                  }} />
                
                  <Legend
                  formatter={(value) =>
                  <span style={{ color: "hsl(215 20% 65%)", fontSize: "12px" }}>{value}</span>
                  } />
                
                </PieChart>
              </ResponsiveContainer>
            </div>
          }
        </div>

        <div className="glass-panel rounded-lg p-5">
          <h2 className="text-sm font-semibold text-foreground flex items-center gap-2 mb-5">
            <TrendingUp size={15} className="text-primary" />
            Resources by Type
          </h2>
          {stats && stats.byType.length > 0 &&
          <div className="h-48">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={stats.byType} layout="vertical" barSize={12}>
                  <XAxis type="number" tick={{ fill: "hsl(215 20% 65%)", fontSize: 11 }} axisLine={false} tickLine={false} />
                  <YAxis
                  type="category"
                  dataKey="type"
                  tick={{ fill: "hsl(215 20% 65%)", fontSize: 11 }}
                  axisLine={false}
                  tickLine={false}
                  width={55} />
                
                  <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(225 45% 10%)",
                    border: "1px solid hsl(225 30% 18%)",
                    borderRadius: "6px",
                    color: "hsl(210 40% 98%)",
                    fontSize: "12px"
                  }} />
                
                  <Bar dataKey="count" radius={[0, 4, 4, 0]}>
                    {stats.byType.map((_, index) =>
                  <Cell key={index} fill={COLORS[index % COLORS.length]} fillOpacity={0.8} />
                  )}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          }
        </div>
      </div>

      <div className="glass-panel rounded-lg p-5">
        <h2 className="text-sm font-semibold text-foreground flex items-center gap-2 mb-5">
          <Tag size={15} className="text-primary" />
          Topic Breakdown
        </h2>

        {analyticsLoading ?
        <div className="space-y-3">
            {Array.from({ length: 5 }).map((_, i) =>
          <div key={i} className="animate-pulse">
                <div className="h-4 bg-border/20 rounded mb-1 w-1/4" />
                <div className="h-2 bg-border/20 rounded" />
              </div>
          )}
          </div> :
        analytics && analytics.length > 0 ?
        <>
            <div className="mb-6 h-52">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={analytics.slice(0, 10)} barSize={14}>
                  <XAxis
                  dataKey="tag"
                  tick={{ fill: "hsl(215 20% 65%)", fontSize: 10 }}
                  axisLine={false}
                  tickLine={false} />
                
                  <YAxis
                  tick={{ fill: "hsl(215 20% 65%)", fontSize: 10 }}
                  axisLine={false}
                  tickLine={false} />
                
                  <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(225 45% 10%)",
                    border: "1px solid hsl(225 30% 18%)",
                    borderRadius: "6px",
                    color: "hsl(210 40% 98%)",
                    fontSize: "12px"
                  }} />
                
                  <Bar dataKey="completed" stackId="a" name="Completed" fill="#22c55e" fillOpacity={0.8} radius={[0, 0, 0, 0]} />
                  <Bar dataKey="inProgress" stackId="a" name="In Progress" fill="#00e5ff" fillOpacity={0.8} />
                  <Bar dataKey="notStarted" stackId="a" name="Not Started" fill="#475569" fillOpacity={0.8} radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {analytics.map((item) =>
            <div key={item.tag} className="bg-background/30 border border-border/30 rounded-md p-3">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-mono font-semibold text-foreground">{item.tag}</span>
                    <span className="text-xs font-mono text-primary">{item.completionRate}%</span>
                  </div>
                  <div className="w-full bg-border/30 rounded-full h-1.5 mb-2">
                    <div
                  className="h-1.5 rounded-full bg-gradient-to-r from-primary to-cyan-300 transition-all"
                  style={{ width: `${item.completionRate}%` }} />
                
                  </div>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground font-mono">
                    <span className="text-green-400">{item.completed} done</span>
                    <span>/</span>
                    <span>{item.total} total</span>
                  </div>
                </div>
            )}
            </div>
          </> :

        <div className="text-center py-12">
            <p className="text-muted-foreground text-sm">
              No tagged resources yet. Add tags to your resources to see analytics.
            </p>
          </div>
        }
      </div>
    </div>);

}