
import { useQueryClient } from "@tanstack/react-query";
import {
  useUpdateResourceStatus,
  useTogglePin,
  useRateResource,
  useDeleteResource,
  getListResourcesQueryKey,
  getGetDashboardStatsQueryKey,
  getGetNeglectedResourcesQueryKey,
  getGetRecentResourcesQueryKey } from
"@/lib/api-mock";

import {
  Video,
  FileText,

  StickyNote,
  GraduationCap,
  Book,
  Pin,
  Star,
  ExternalLink,
  Trash2,
  Clock,
  CheckCircle2,
  CircleDashed,
  PlayCircle,
  GitBranch,
  Folder,
  Globe } from
"lucide-react";
import { Link } from "wouter";

const typeIcons = {
  video: Video,
  article: FileText,
  pdf: FileText,
  notes: StickyNote,
  course: GraduationCap,
  book: Book,
  "github repo": GitBranch,
  website: Globe
};

const typeColors = {
  video: "text-red-400",
  article: "text-blue-400",
  pdf: "text-orange-400",
  notes: "text-yellow-400",
  course: "text-purple-400",
  book: "text-green-400",
  "github repo": "text-slate-200",
  website: "text-cyan-400"
};

const priorityColors = {
  critical: "text-red-400 bg-red-400/10 border-red-400/20",
  high: "text-orange-400 bg-orange-400/10 border-orange-400/20",
  medium: "text-yellow-400 bg-yellow-400/10 border-yellow-400/20",
  low: "text-slate-400 bg-slate-400/10 border-slate-400/20"
};

const statusConfig = {
  not_started: { label: "Not Started", icon: CircleDashed, color: "text-slate-400" },
  in_progress: { label: "In Progress", icon: PlayCircle, color: "text-blue-400" },
  completed: { label: "Completed", icon: CheckCircle2, color: "text-green-400" }
};





export function ResourceCard({ resource }) {
  const queryClient = useQueryClient();
  const updateStatus = useUpdateResourceStatus();
  const togglePin = useTogglePin();
  const rateResource = useRateResource();
  const deleteResource = useDeleteResource();

  const invalidateAll = () => {
    queryClient.invalidateQueries({ queryKey: getListResourcesQueryKey() });
    queryClient.invalidateQueries({ queryKey: getGetDashboardStatsQueryKey() });
    queryClient.invalidateQueries({ queryKey: getGetNeglectedResourcesQueryKey() });
    queryClient.invalidateQueries({ queryKey: getGetRecentResourcesQueryKey() });
  };

  const TypeIcon = typeIcons[resource.type] ?? FileText;
  const typeColor = typeColors[resource.type] ?? "text-slate-400";
  const statusInfo = statusConfig[resource.status] ?? statusConfig.not_started;
  const StatusIcon = statusInfo.icon;

  const cycleStatus = () => {
    const statusOrder = ["not_started", "in_progress", "completed"];
    const next = statusOrder[(statusOrder.indexOf(resource.status) + 1) % 3];
    updateStatus.mutate(
      { id: resource.id, data: { status: next } },
      { onSuccess: invalidateAll }
    );
  };

  const handlePin = (e) => {
    e.preventDefault();
    togglePin.mutate({ id: resource.id }, { onSuccess: invalidateAll });
  };

  const handleDelete = (e) => {
    e.preventDefault();
    if (confirm("Delete this resource?")) {
      deleteResource.mutate({ id: resource.id }, { onSuccess: invalidateAll });
    }
  };

  const handleRate = (e, rating) => {
    e.preventDefault();
    rateResource.mutate({ id: resource.id, data: { rating } }, { onSuccess: invalidateAll });
  };

  return (
    <div className="glass-panel rounded-lg p-4 hover:border-primary/30 transition-all group relative">
      {resource.pinned &&
      <div className="absolute top-3 right-3 text-primary/60">
          <Pin size={12} fill="currentColor" />
        </div>
      }
      <Link href={`/resources/${resource.id}`}>
        <div className="cursor-pointer">
          <div className="flex items-start gap-3 mb-3">
            <div className="flex-1 min-w-0">
              <h3 className="text-sm font-semibold text-foreground leading-snug truncate group-hover:text-primary transition-colors">
                {resource.title}
              </h3>
              <div className="flex items-center gap-2 mt-1 flex-wrap">
                <span className={`text-xs px-2 py-0.5 rounded border font-mono flex items-center gap-1 text-blue-400 bg-blue-400/5 border-blue-400/20`}>
                  <Folder size={11} className="inline-block" />
                  {resource.children?.length || 0} Items
                </span>
                <span className={`text-xs px-2 py-0.5 rounded border font-mono ${priorityColors[resource.priority] ?? priorityColors.low}`}>
                  {resource.priority}
                </span>
                <span className={`text-xs flex items-center gap-1 ${statusInfo.color}`}>
                  <StatusIcon size={11} />
                  {statusInfo.label}
                </span>
              </div>
            </div>
          </div>

          {resource.tags.length > 0 &&
          <div className="flex flex-wrap gap-1 mb-3">
              {resource.tags.slice(0, 4).map((tag) =>
            <span
              key={tag}
              className="text-xs px-1.5 py-0.5 rounded bg-primary/5 border border-primary/10 text-primary/70 font-mono">
              
                  {tag}
                </span>
            )}
              {resource.tags.length > 4 &&
            <span className="text-xs text-muted-foreground">+{resource.tags.length - 4}</span>
            }
            </div>
          }
        </div>
      </Link>

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-0.5">
          {[1, 2, 3, 4, 5].map((star) =>
          <button
            key={star}
            onClick={(e) => handleRate(e, star)}
            className={`transition-colors ${
            star <= (resource.rating ?? 0) ? "text-yellow-400" : "text-muted-foreground/30 hover:text-yellow-400/50"}`
            }>
            
              <Star size={11} fill={star <= (resource.rating ?? 0) ? "currentColor" : "none"} />
            </button>
          )}
        </div>

        <div className="flex items-center gap-1">
          <button
            onClick={cycleStatus}
            className="p-1.5 rounded hover:bg-accent transition-colors text-muted-foreground hover:text-foreground"
            title="Cycle status">
            
            <StatusIcon size={13} className={statusInfo.color} />
          </button>
          <button
            onClick={handlePin}
            className={`p-1.5 rounded hover:bg-accent transition-colors ${resource.pinned ? "text-primary" : "text-muted-foreground hover:text-foreground"}`}
            title={resource.pinned ? "Unpin" : "Pin"}>
            
            <Pin size={13} fill={resource.pinned ? "currentColor" : "none"} />
          </button>
          {resource.url &&
          <a
            href={resource.url}
            target="_blank"
            rel="noopener noreferrer"
            className="p-1.5 rounded hover:bg-accent transition-colors text-muted-foreground hover:text-foreground"
            onClick={(e) => e.stopPropagation()}>
            
              <ExternalLink size={13} />
            </a>
          }
          <button
            onClick={handleDelete}
            className="p-1.5 rounded hover:bg-destructive/10 transition-colors text-muted-foreground hover:text-destructive">
            
            <Trash2 size={13} />
          </button>
        </div>
      </div>

      {resource.lastAccessedAt &&
      <div className="flex items-center gap-1 mt-2 text-xs text-muted-foreground/60">
          <Clock size={10} />
          <span>
            {new Date(resource.lastAccessedAt).toLocaleDateString()}
          </span>
        </div>
      }
    </div>);

}