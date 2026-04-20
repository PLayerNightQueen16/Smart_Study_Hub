import { useState } from "react";
import { useLocation, Link } from "wouter";
import {
  useCreateResource,
  getListResourcesQueryKey,
  getGetDashboardStatsQueryKey,
  getGetRecentResourcesQueryKey } from
"@/lib/api-mock";
import { useQueryClient } from "@tanstack/react-query";
import { ArrowLeft, Plus, X } from "lucide-react";

const TYPES = ["article", "video", "pdf", "notes", "course", "book", "github repo", "website"];
const PRIORITIES = ["low", "medium", "high", "critical"];

export function AddResource() {
  const [, navigate] = useLocation();
  const queryClient = useQueryClient();
  const createResource = useCreateResource();

  const [title, setTitle] = useState("");
  const [type, setType] = useState("article");
  const [url, setUrl] = useState("");
  const [priority, setPriority] = useState("medium");
  const [notes, setNotes] = useState("");
  const [tagInput, setTagInput] = useState("");
  const [tags, setTags] = useState([]);
  const [file, setFile] = useState(null);

  const addTag = () => {
    const tagsToAdd = tagInput.split(/[\s,]+/).map(t => t.trim()).filter(Boolean);
    const newTags = tagsToAdd.filter(t => !tags.includes(t));
    if (newTags.length > 0) {
      setTags([...tags, ...newTags]);
    }
    setTagInput("");
  };

  const removeTag = (tag) => setTags(tags.filter((t) => t !== tag));

  const handleTagKeyDown = (e) => {
    if (e.key === "Enter" || e.key === "," || e.key === " ") {
      e.preventDefault();
      addTag();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim()) return;

    let fileData = null;
    let fileName = null;

    if (file) {
      fileName = file.name;
      if (file.size < 1024 * 1024 * 1.5) {
        fileData = await new Promise((resolve) => {
          const reader = new FileReader();
          reader.onloadend = () => resolve(reader.result);
          reader.readAsDataURL(file);
        });
      } else {
        fileData = URL.createObjectURL(file);
      }
    }

    const newChildren = [];
    if (url.trim()) {
      newChildren.push({
        id: Date.now() + Math.random(),
        type: 'link',
        title: 'Main Link',
        url: url.trim(),
        children: []
      });
    }
    if (file) {
      newChildren.push({
        id: Date.now() + Math.random(),
        type: 'file',
        title: fileName,
        fileName,
        fileData,
        children: []
      });
    }

    createResource.mutate(
      {
        data: {
          title: title.trim(),
          type,
          tags,
          priority,
          notes: notes.trim() || null,
          children: newChildren
        }
      },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: getListResourcesQueryKey() });
          queryClient.invalidateQueries({ queryKey: getGetDashboardStatsQueryKey() });
          queryClient.invalidateQueries({ queryKey: getGetRecentResourcesQueryKey() });
          navigate("/resources");
        }
      }
    );
  };

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <div className="flex items-center gap-3 mb-6">
        <Link href="/resources">
          <div className="p-2 rounded-md hover:bg-accent transition-colors cursor-pointer text-muted-foreground hover:text-foreground">
            <ArrowLeft size={16} />
          </div>
        </Link>
        <div>
          <h1 className="text-xl font-display font-bold text-foreground">Add Resource</h1>
          <p className="text-xs text-muted-foreground font-mono">catalog a new learning resource</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="glass-panel rounded-lg p-6 space-y-5">
        <div>
          <label className="text-xs font-mono text-muted-foreground uppercase tracking-wider mb-1.5 block">
            Title <span className="text-destructive">*</span>
          </label>
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g. Advanced TypeScript Patterns"
            required
            className="w-full bg-background/50 border border-border/50 rounded-md px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground/50 outline-none focus:border-primary/50 transition-colors" />
          
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-xs font-mono text-muted-foreground uppercase tracking-wider mb-1.5 block">Type</label>
            <select
              value={type}
              onChange={(e) => setType(e.target.value)}
              className="w-full bg-background/50 border border-border/50 rounded-md px-3 py-2.5 text-sm text-foreground outline-none focus:border-primary/50 capitalize">
              
              {TYPES.map((t) =>
              <option key={t} value={t} className="capitalize">{t}</option>
              )}
            </select>
          </div>
          <div>
            <label className="text-xs font-mono text-muted-foreground uppercase tracking-wider mb-1.5 block">Priority</label>
            <select
              value={priority}
              onChange={(e) => setPriority(e.target.value)}
              className="w-full bg-background/50 border border-border/50 rounded-md px-3 py-2.5 text-sm text-foreground outline-none focus:border-primary/50">
              
              {PRIORITIES.map((p) =>
              <option key={p} value={p} className="capitalize">{p}</option>
              )}
            </select>
          </div>
        </div>

        <div>
          <label className="text-xs font-mono text-muted-foreground uppercase tracking-wider mb-1.5 block">URL / Link</label>
          <input
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="https://..."
            type="url"
            className="w-full bg-background/50 border border-border/50 rounded-md px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground/50 outline-none focus:border-primary/50 transition-colors" />
          
        </div>

        <div>
          <label className="text-xs font-mono text-muted-foreground uppercase tracking-wider mb-1.5 block">Upload File</label>
          <input
            type="file"
            onChange={(e) => setFile(e.target.files[0])}
            className="w-full bg-background/50 border border-border/50 rounded-md px-3 py-2 text-sm text-foreground file:mr-4 file:py-1 file:px-3 file:rounded-md file:border-0 file:text-xs file:font-semibold file:bg-primary/20 file:text-primary hover:file:bg-primary/30 outline-none focus:border-primary/50 transition-colors" />
        </div>

        <div>
          <label className="text-xs font-mono text-muted-foreground uppercase tracking-wider mb-1.5 block">Tags</label>
          <div className="flex flex-wrap gap-1.5 mb-2">
            {tags.map((tag) =>
            <span key={tag} className="flex items-center gap-1 text-xs px-2 py-0.5 rounded bg-primary/10 border border-primary/20 text-primary font-mono">
                {tag}
                <button type="button" onClick={() => removeTag(tag)} className="hover:text-destructive">
                  <X size={10} />
                </button>
              </span>
            )}
          </div>
          <div className="flex items-center gap-2">
            <input
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              onKeyDown={handleTagKeyDown}
              placeholder="Type a tag, press space or comma"
              className="flex-1 bg-background/50 border border-border/50 rounded-md px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground/50 outline-none focus:border-primary/50 transition-colors" />
            
            <button
              type="button"
              onClick={addTag}
              className="px-3 py-2 rounded-md bg-accent text-foreground text-sm hover:bg-accent/80 transition-colors">
              
              <Plus size={14} />
            </button>
          </div>
        </div>

        <div>
          <label className="text-xs font-mono text-muted-foreground uppercase tracking-wider mb-1.5 block">Notes</label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Any notes about this resource..."
            rows={3}
            className="w-full bg-background/50 border border-border/50 rounded-md px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground/50 outline-none focus:border-primary/50 transition-colors resize-none" />
          
        </div>

        <div className="flex items-center gap-3 pt-2">
          <button
            type="submit"
            disabled={createResource.isPending || !title.trim()}
            className="flex items-center gap-2 px-5 py-2.5 bg-primary text-primary-foreground text-sm font-semibold rounded-md hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed">
            
            {createResource.isPending ? "Saving..." : "Add Resource"}
          </button>
          <Link href="/resources">
            <span className="px-5 py-2.5 text-muted-foreground text-sm rounded-md hover:bg-accent transition-colors cursor-pointer inline-block">
              Cancel
            </span>
          </Link>
        </div>
      </form>
    </div>);

}