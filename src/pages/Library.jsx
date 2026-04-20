import { useState } from "react";
import { useListResources } from "@/lib/api-mock";
import { ResourceCard } from "../components/ResourceCard";
import { Link, useLocation } from "wouter";
import {
  Search,
  SlidersHorizontal,
  LayoutGrid,
  List,
  Plus,
  X } from
"lucide-react";

const TYPES = ["video", "article", "pdf", "notes", "course", "book", "github repo", "website"];
const STATUSES = ["not_started", "in_progress", "completed"];
const PRIORITIES = ["critical", "high", "medium", "low"];
const SORT_OPTIONS = [
{ value: "", label: "Newest" },
{ value: "priority", label: "Priority" },
{ value: "lastAccessed", label: "Last Accessed" },
{ value: "status", label: "Status" }];


const statusLabels = {
  not_started: "Not Started",
  in_progress: "In Progress",
  completed: "Completed"
};

export function Library() {
  const [location] = useLocation();
  const searchParams = new URLSearchParams(location.includes("?") ? location.split("?")[1] : "");

  const [search, setSearch] = useState(searchParams.get("search") ?? "");
  const [typeFilter, setTypeFilter] = useState(searchParams.get("type") ?? "");
  const [statusFilter, setStatusFilter] = useState(searchParams.get("status") ?? "");
  const [tagFilter, setTagFilter] = useState(searchParams.get("tag") ?? "");
  const [sortBy, setSortBy] = useState("");
  const [viewMode, setViewMode] = useState("grid");

  const { data: rawResources, isLoading } = useListResources();

  const allTags = Array.from(new Set(rawResources?.flatMap((r) => r.tags || []) ?? [])).sort();
  const hasFilters = search || typeFilter || statusFilter || tagFilter || sortBy;

  let resources = rawResources || [];

  if (search) {
    const q = search.toLowerCase();
    resources = resources.filter(r => r.title.toLowerCase().includes(q) || (r.notes && r.notes.toLowerCase().includes(q)));
  }

  if (typeFilter) {
    const hasType = (item, t) => {
      if (item.type === t) return true;
      if (item.children && item.children.length > 0) {
        return item.children.some(c => hasType(c, t));
      }
      return false;
    };
    resources = resources.filter(r => hasType(r, typeFilter));
  }

  if (statusFilter) {
    resources = resources.filter(r => r.status === statusFilter);
  }

  if (tagFilter) {
    resources = resources.filter(r => r.tags?.includes(tagFilter));
  }

  if (sortBy) {
    resources = [...resources].sort((a, b) => {
      if (sortBy === "priority") {
        const pOrder = { critical: 4, high: 3, medium: 2, low: 1 };
        return (pOrder[b.priority] || 0) - (pOrder[a.priority] || 0);
      }
      if (sortBy === "status") {
        const sOrder = { completed: 3, in_progress: 2, not_started: 1 };
        return (sOrder[b.status] || 0) - (sOrder[a.status] || 0);
      }
      if (sortBy === "lastAccessed") {
        return new Date(b.lastAccessedAt || 0) - new Date(a.lastAccessedAt || 0);
      }
      return new Date(b.createdAt || 0) - new Date(a.createdAt || 0);
    });
  }

  const clearFilters = () => {
    setSearch("");
    setTypeFilter("");
    setStatusFilter("");
    setTagFilter("");
    setSortBy("");
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-display font-bold text-foreground tracking-tight">
            Resource Library
          </h1>
          <p className="text-sm text-muted-foreground mt-0.5 font-mono">
            {resources?.length ?? 0} resources
          </p>
        </div>
        <Link href="/resources/new">
          <div className="flex items-center gap-2 px-4 py-2 rounded-md bg-primary text-primary-foreground text-sm font-semibold hover:opacity-90 transition-opacity cursor-pointer">
            <Plus size={15} />
            Add Resource
          </div>
        </Link>
      </div>

      <div className="glass-panel rounded-lg p-4 mb-6 space-y-3">
        <div className="flex items-center gap-3">
          <div className="flex-1 flex items-center gap-2 bg-background/50 border border-border/50 rounded-md px-3 py-2">
            <Search size={14} className="text-muted-foreground shrink-0" />
            <input
              type="text"
              placeholder="Search by title..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="flex-1 bg-transparent text-sm text-foreground placeholder:text-muted-foreground outline-none" />
            
            {search &&
            <button onClick={() => setSearch("")} className="text-muted-foreground hover:text-foreground">
                <X size={12} />
              </button>
            }
          </div>

          <div className="flex items-center gap-1 border border-border/50 rounded-md p-0.5">
            <button
              onClick={() => setViewMode("grid")}
              className={`p-1.5 rounded ${viewMode === "grid" ? "bg-primary/10 text-primary" : "text-muted-foreground hover:text-foreground"}`}>
              
              <LayoutGrid size={14} />
            </button>
            <button
              onClick={() => setViewMode("list")}
              className={`p-1.5 rounded ${viewMode === "list" ? "bg-primary/10 text-primary" : "text-muted-foreground hover:text-foreground"}`}>
              
              <List size={14} />
            </button>
          </div>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <SlidersHorizontal size={13} className="text-muted-foreground" />

          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="text-xs bg-background/50 border border-border/50 rounded px-2 py-1 text-foreground outline-none">
            
            <option value="">All Types</option>
            {TYPES.map((t) =>
            <option key={t} value={t} className="capitalize">Contains {t}</option>
            )}
          </select>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="text-xs bg-background/50 border border-border/50 rounded px-2 py-1 text-foreground outline-none">
            
            <option value="">All Statuses</option>
            {STATUSES.map((s) =>
            <option key={s} value={s}>{statusLabels[s]}</option>
            )}
          </select>

          <select
            value={tagFilter}
            onChange={(e) => setTagFilter(e.target.value)}
            className="text-xs bg-background/50 border border-border/50 rounded px-2 py-1 text-foreground outline-none">
            
            <option value="">All Tags</option>
            {allTags.map((tag) =>
            <option key={tag} value={tag}>{tag}</option>
            )}
          </select>

          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="text-xs bg-background/50 border border-border/50 rounded px-2 py-1 text-foreground outline-none">
            
            {SORT_OPTIONS.map((opt) =>
            <option key={opt.value} value={opt.value}>{opt.label}</option>
            )}
          </select>

          {hasFilters &&
          <button
            onClick={clearFilters}
            className="text-xs text-muted-foreground hover:text-destructive flex items-center gap-1 ml-auto">
            
              <X size={11} />
              Clear
            </button>
          }
        </div>
      </div>

      {isLoading ?
      <div className={`grid gap-4 ${viewMode === "grid" ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4" : "grid-cols-1"}`}>
          {Array.from({ length: 8 }).map((_, i) =>
        <div key={i} className="glass-panel rounded-lg p-4 animate-pulse">
              <div className="h-4 bg-border/30 rounded mb-3" />
              <div className="h-3 bg-border/20 rounded mb-2 w-2/3" />
              <div className="h-3 bg-border/20 rounded w-1/2" />
            </div>
        )}
        </div> :
      resources && resources.length > 0 ?
      <div className={`grid gap-4 ${viewMode === "grid" ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4" : "grid-cols-1 max-w-3xl"}`}>
          {resources.map((r) =>
        <ResourceCard key={r.id} resource={r} />
        )}
        </div> :

      <div className="text-center py-20">
          <div className="text-muted-foreground/30 mb-4">
            <Search size={40} className="mx-auto" />
          </div>
          <p className="text-muted-foreground text-sm">
            {hasFilters ? "No resources match your filters" : "No resources yet"}
          </p>
          {!hasFilters &&
        <Link href="/resources/new">
              <div className="inline-flex items-center gap-2 mt-4 px-4 py-2 bg-primary/10 border border-primary/20 text-primary text-sm rounded-md hover:bg-primary/20 transition-colors cursor-pointer">
                <Plus size={14} />
                Add your first resource
              </div>
            </Link>
        }
        </div>
      }
    </div>);

}