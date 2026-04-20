import { useState } from "react";
import { useLocation, Link } from "wouter";
import {
  useGetResource,
  useUpdateResource,
  useUpdateResourceStatus,
  useTogglePin,
  useRateResource,
  useDeleteResource,
  getListResourcesQueryKey,
  getGetDashboardStatsQueryKey,
  getGetNeglectedResourcesQueryKey,
  getGetRecentResourcesQueryKey,
  getGetResourceQueryKey } from
"@/lib/api-mock";
import { useQueryClient } from "@tanstack/react-query";
import {
  ArrowLeft,
  ExternalLink,
  Pin,
  Star,
  Trash2,
  CheckCircle2,
  CircleDashed,
  PlayCircle,
  Edit3,
  Save,
  X,
  File,
  Folder,
  Link as LinkIcon,
  Plus,
  ChevronRight,
  ChevronDown,
  Download,
  FolderPlus } from
"lucide-react";

const statusConfig = {
  not_started: { label: "Not Started", icon: CircleDashed, color: "text-slate-400 border-slate-400/20 bg-slate-400/10" },
  in_progress: { label: "In Progress", icon: PlayCircle, color: "text-blue-400 border-blue-400/20 bg-blue-400/10" },
  completed: { label: "Completed", icon: CheckCircle2, color: "text-green-400 border-green-400/20 bg-green-400/10" }
};

const priorityColors = {
  critical: "text-red-400 bg-red-400/10 border-red-400/20",
  high: "text-orange-400 bg-orange-400/10 border-orange-400/20",
  medium: "text-yellow-400 bg-yellow-400/10 border-yellow-400/20",
  low: "text-slate-400 bg-slate-400/10 border-slate-400/20"
};

function updateNestedChild(children, targetId, updaterFunc) {
  if (!children) return [];
  return children.map(child => {
    if (child.id === targetId) {
      return updaterFunc(child);
    }
    if (child.children) {
      return { ...child, children: updateNestedChild(child.children, targetId, updaterFunc) };
    }
    return child;
  });
}

function removeNestedChild(children, targetId) {
  if (!children) return [];
  return children.filter(c => c.id !== targetId).map(child => {
    if (child.children) {
      return { ...child, children: removeNestedChild(child.children, targetId) };
    }
    return child;
  });
}

function ResourceNode({ item, onUpdate, onDelete }) {
  const [expanded, setExpanded] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const [addType, setAddType] = useState('link');
  const [title, setTitle] = useState('');
  const [url, setUrl] = useState('');
  const [file, setFile] = useState(null);

  const isFolder = item.type === 'folder';

  const handleAddChild = async (e) => {
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

    const baseNewChild = {
      id: Date.now() + Math.random(),
      title: title.trim(),
      type: addType,
      children: []
    };

    let newChildren = [];
    if (url.trim()) {
       newChildren.push({ ...baseNewChild, id: Date.now() + Math.random(), type: addType === 'folder' ? 'link' : addType, url: url.trim(), title: file ? title.trim() + " (Link)" : title.trim() });
    }
    if (fileData) {
       newChildren.push({ ...baseNewChild, id: Date.now() + Math.random(), type: addType === 'folder' ? 'file' : addType, fileName, fileData, title: url.trim() ? title.trim() + " (File)" : title.trim() });
    }
    
    // Fallback if they just create a folder without url or file
    if (newChildren.length === 0) {
       newChildren.push(baseNewChild);
    }

    onUpdate(item.id, (prev) => ({
      ...prev,
      children: [...(prev.children || []), ...newChildren]
    }));

    setTitle('');
    setUrl('');
    setFile(null);
    setIsAdding(false);
    setExpanded(true);
  };

  const Icon = item.type === 'folder' ? Folder : item.type === 'link' ? LinkIcon : File;

  return (
    <div className="ml-4 mt-2">
      <div className="flex items-center gap-2 group p-1.5 rounded-md hover:bg-white/5 transition-colors">
        {isFolder ? (
          <button onClick={() => setExpanded(!expanded)} className="text-muted-foreground hover:text-foreground">
            {expanded ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
          </button>
        ) : (
          <div className="w-3.5" />
        )}
        <Icon size={14} className={item.type === 'folder' ? "text-primary/70" : "text-muted-foreground"} />
        
        {!item.fileData && item.url && (
          <a href={item.url} target="_blank" rel="noopener noreferrer" className="text-sm flex-1 text-primary hover:underline truncate">
            {item.title}
          </a>
        )}

        {item.fileData && (
          <span 
            onClick={() => {
              if (item.fileData && (item.fileData.startsWith('data:') || item.fileData.startsWith('blob:'))) {
                if (item.fileData.startsWith('blob:')) {
                  window.open(item.fileData, '_blank');
                } else {
                  fetch(item.fileData).then(r => r.blob()).then(blob => {
                    const blobUrl = URL.createObjectURL(blob);
                    window.open(blobUrl, '_blank');
                  });
                }
              } else {
                alert("File data is corrupt or strictly visual.");
              }
            }}
            className="text-sm flex-1 text-primary hover:underline truncate cursor-pointer"
          >
            {item.title}
          </span>
        )}

        {!item.fileData && !item.url && (
          <span className="text-sm flex-1 text-foreground truncate cursor-default">{item.title}</span>
        )}

        {isFolder && (
          <button onClick={() => { setIsAdding(!isAdding); setExpanded(true); }} className="opacity-0 group-hover:opacity-100 p-1 text-muted-foreground hover:text-primary transition-opacity" title="Add inside folder">
            <Plus size={14} />
          </button>
        )}
        <button onClick={() => onDelete(item.id)} className="opacity-0 group-hover:opacity-100 p-1 text-muted-foreground hover:text-destructive transition-opacity" title="Delete">
          <Trash2 size={14} />
        </button>
      </div>

      {isAdding && isFolder && (
        <form onSubmit={handleAddChild} className="ml-6 mt-2 p-3 bg-black/20 border border-primary/20 rounded-md space-y-2">
          <div className="flex items-center gap-2">
            <select value={addType} onChange={e => setAddType(e.target.value)} className="bg-background border border-border/50 rounded-md px-2 py-1.5 text-xs text-foreground outline-none w-28 capitalize">
              {['folder', 'article', 'video', 'pdf', 'notes', 'course', 'book', 'github repo', 'website'].map(t => <option key={t} value={t}>{t}</option>)}
            </select>
            <input value={title} onChange={e => setTitle(e.target.value)} placeholder="Title *" required className="flex-1 bg-background/50 border border-border/50 rounded-md px-2 py-1.5 text-xs text-foreground outline-none" />
          </div>
          <div className="flex items-center gap-2">
            <input value={url} onChange={e => setUrl(e.target.value)} placeholder="URL / Link (optional)" type="url" className="flex-1 bg-background/50 border border-border/50 rounded-md px-2 py-1.5 text-xs text-foreground outline-none" />
            <input type="file" onChange={e => setFile(e.target.files[0])} className="flex-1 bg-background/50 border border-border/50 rounded-md px-2 py-1 text-xs text-foreground outline-none" />
          </div>
          <div className="flex items-center gap-2">
            <button type="submit" className="text-xs px-4 py-1.5 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 font-medium">Add Content</button>
            <button type="button" onClick={() => setIsAdding(false)} className="text-xs px-3 py-1.5 text-muted-foreground hover:bg-accent rounded-md">Cancel</button>
          </div>
        </form>
      )}

      {expanded && isFolder && item.children && item.children.length > 0 && (
        <div className="border-l border-border/30 ml-2.5">
          {item.children.map(child => (
            <ResourceNode key={child.id} item={child} onUpdate={onUpdate} onDelete={onDelete} />
          ))}
        </div>
      )}
    </div>
  );
}

export function ResourceDetail({ id }) {
  const resourceId = parseInt(id, 10);
  const [, navigate] = useLocation();
  const queryClient = useQueryClient();

  const { data: resource, isLoading } = useGetResource(resourceId, {
    query: { enabled: !!resourceId, queryKey: getGetResourceQueryKey(resourceId) }
  });

  const updateResource = useUpdateResource();
  const updateStatus = useUpdateResourceStatus();
  const togglePin = useTogglePin();
  const rateResource = useRateResource();
  const deleteResource = useDeleteResource();

  const [editing, setEditing] = useState(false);
  const [editTitle, setEditTitle] = useState("");
  const [editUrl, setEditUrl] = useState("");
  const [editNotes, setEditNotes] = useState("");
  const [newTagInput, setNewTagInput] = useState("");

  const invalidateAll = () => {
    queryClient.invalidateQueries({ queryKey: getListResourcesQueryKey() });
    queryClient.invalidateQueries({ queryKey: getGetDashboardStatsQueryKey() });
    queryClient.invalidateQueries({ queryKey: getGetNeglectedResourcesQueryKey() });
    queryClient.invalidateQueries({ queryKey: getGetRecentResourcesQueryKey() });
    queryClient.invalidateQueries({ queryKey: getGetResourceQueryKey(resourceId) });
  };

  const startEditing = () => {
    if (!resource) return;
    setEditTitle(resource.title);
    setEditUrl(resource.url ?? "");
    setEditNotes(resource.notes ?? "");
    setEditing(true);
  };

  const saveEdit = () => {
    if (!resource) return;
    updateResource.mutate(
      {
        id: resourceId,
        data: {
          title: editTitle,
          url: editUrl || null,
          notes: editNotes || null
        }
      },
      { onSuccess: () => {invalidateAll();setEditing(false);} }
    );
  };

  const cycleStatus = () => {
    if (!resource) return;
    const order = ["not_started", "in_progress", "completed"];
    const next = order[(order.indexOf(resource.status) + 1) % 3];
    updateStatus.mutate({ id: resourceId, data: { status: next } }, { onSuccess: invalidateAll });
  };

  const handlePin = () => {
    togglePin.mutate({ id: resourceId }, { onSuccess: invalidateAll });
  };

  const handleRate = (rating) => {
    rateResource.mutate({ id: resourceId, data: { rating } }, { onSuccess: invalidateAll });
  };

  const handleDelete = () => {
    if (confirm("Delete this resource?")) {
      deleteResource.mutate({ id: resourceId }, {
        onSuccess: () => {
          invalidateAll();
          navigate("/resources");
        }
      });
    }
  };

  const markAccessed = () => {
    if (!resource) return;
    updateStatus.mutate(
      { id: resourceId, data: { status: resource.status } },
      { onSuccess: invalidateAll }
    );
  };

  const handleUpdateChild = (childId, updaterFunc) => {
    const newChildren = updateNestedChild(resource.children || [], childId, updaterFunc);
    updateResource.mutate({ id: resourceId, data: { ...resource, children: newChildren } }, { onSuccess: invalidateAll });
  };

  const handleDeleteChild = (childId) => {
    if (confirm("Delete this item?")) {
      const newChildren = removeNestedChild(resource.children || [], childId);
      updateResource.mutate({ id: resourceId, data: { ...resource, children: newChildren } }, { onSuccess: invalidateAll });
    }
  };

  const handleAddTagInline = (e) => {
    e?.preventDefault();
    if (!newTagInput.trim()) return;

    const tagsToAdd = newTagInput.split(/[\s,]+/).map(t => t.trim()).filter(Boolean);
    const currentTags = resource.tags || [];
    
    const newUniqueTags = tagsToAdd.filter(t => !currentTags.includes(t));
    if (newUniqueTags.length > 0) {
      const updatedTags = [...currentTags, ...newUniqueTags];
      updateResource.mutate({ id: resourceId, data: { tags: updatedTags } }, { onSuccess: invalidateAll });
    }
    setNewTagInput("");
  };

  const handleRemoveTagInline = (tagToRemove) => {
    const currentTags = resource.tags || [];
    const updatedTags = currentTags.filter(t => t !== tagToRemove);
    updateResource.mutate({ id: resourceId, data: { tags: updatedTags } }, { onSuccess: invalidateAll });
  };

  const handleTagKeyDown = (e) => {
    if (e.key === "Enter" || e.key === " " || e.key === ",") {
      e.preventDefault();
      handleAddTagInline();
    }
  };

  const [isAddingTop, setIsAddingTop] = useState(false);
  const [topAddType, setTopAddType] = useState('link');
  const [topTitle, setTopTitle] = useState('');
  const [topUrl, setTopUrl] = useState('');
  const [topFile, setTopFile] = useState(null);

  const handleAddTopChild = async (e) => {
    e.preventDefault();
    if (!topTitle.trim()) return;

    let fileData = null;
    let fileName = null;

    if (topFile) {
      fileName = topFile.name;
      if (topFile.size < 1024 * 1024 * 1.5) {
        fileData = await new Promise((resolve) => {
          const reader = new FileReader();
          reader.onloadend = () => resolve(reader.result);
          reader.readAsDataURL(topFile);
        });
      } else {
        fileData = URL.createObjectURL(topFile);
      }
    }

    const baseNewChild = {
      id: Date.now() + Math.random(),
      title: topTitle.trim(),
      type: topAddType,
      children: []
    };

    let newChildren = [];
    if (topUrl.trim()) {
       newChildren.push({ ...baseNewChild, id: Date.now() + Math.random(), type: topAddType === 'folder' ? 'link' : topAddType, url: topUrl.trim(), title: topFile ? topTitle.trim() + " (Link)" : topTitle.trim() });
    }
    if (fileData) {
       newChildren.push({ ...baseNewChild, id: Date.now() + Math.random(), type: topAddType === 'folder' ? 'file' : topAddType, fileName, fileData, title: topUrl.trim() ? topTitle.trim() + " (File)" : topTitle.trim() });
    }
    
    if (newChildren.length === 0) {
       newChildren.push(baseNewChild);
    }

    updateResource.mutate({ id: resourceId, data: { ...resource, children: [...(resource.children || []), ...newChildren] } }, { onSuccess: invalidateAll });

    setTopTitle('');
    setTopUrl('');
    setTopFile(null);
    setIsAddingTop(false);
  };

  if (isLoading) {
    return (
      <div className="p-6">
        <div className="animate-pulse space-y-4 max-w-2xl">
          <div className="h-8 bg-border/30 rounded w-1/2" />
          <div className="h-4 bg-border/20 rounded w-1/3" />
          <div className="h-32 bg-border/20 rounded" />
        </div>
      </div>);

  }

  if (!resource) {
    return (
      <div className="p-6 text-center">
        <p className="text-muted-foreground">Resource not found.</p>
        <Link href="/resources">
          <span className="text-primary text-sm mt-2 inline-block cursor-pointer">Back to library</span>
        </Link>
      </div>);

  }

  const statusInfo = statusConfig[resource.status] ?? statusConfig.not_started;
  const StatusIcon = statusInfo.icon;

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <div className="flex items-center gap-3 mb-6">
        <Link href="/resources">
          <div className="p-2 rounded-md hover:bg-accent transition-colors cursor-pointer text-muted-foreground hover:text-foreground">
            <ArrowLeft size={16} />
          </div>
        </Link>
        <div className="flex-1" />
        <button onClick={handlePin} className={`p-2 rounded-md hover:bg-accent transition-colors ${resource.pinned ? "text-primary" : "text-muted-foreground hover:text-foreground"}`}>
          <Pin size={16} fill={resource.pinned ? "currentColor" : "none"} />
        </button>
        {!editing &&
        <button onClick={startEditing} className="p-2 rounded-md hover:bg-accent transition-colors text-muted-foreground hover:text-foreground">
            <Edit3 size={16} />
          </button>
        }
        <button onClick={handleDelete} className="p-2 rounded-md hover:bg-destructive/10 transition-colors text-muted-foreground hover:text-destructive">
          <Trash2 size={16} />
        </button>
      </div>

      <div className="glass-panel rounded-lg p-6 space-y-6">
        {editing ?
        <div className="space-y-4">
            <div>
              <label className="text-xs font-mono text-muted-foreground uppercase tracking-wider mb-1 block">Title</label>
              <input
              value={editTitle}
              onChange={(e) => setEditTitle(e.target.value)}
              className="w-full bg-background/50 border border-border/50 rounded-md px-3 py-2 text-sm text-foreground outline-none focus:border-primary/50" />
            
            </div>
            <div>
              <label className="text-xs font-mono text-muted-foreground uppercase tracking-wider mb-1 block">URL</label>
              <input
              value={editUrl}
              onChange={(e) => setEditUrl(e.target.value)}
              className="w-full bg-background/50 border border-border/50 rounded-md px-3 py-2 text-sm text-foreground outline-none focus:border-primary/50" />
            
            </div>
            <div>
              <label className="text-xs font-mono text-muted-foreground uppercase tracking-wider mb-1 block">Notes</label>
              <textarea
              value={editNotes}
              onChange={(e) => setEditNotes(e.target.value)}
              rows={4}
              className="w-full bg-background/50 border border-border/50 rounded-md px-3 py-2 text-sm text-foreground outline-none focus:border-primary/50 resize-none" />
            
            </div>
            <div className="flex items-center gap-2">
              <button onClick={saveEdit} className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground text-sm rounded-md hover:opacity-90 transition-opacity">
                <Save size={14} />
                Save
              </button>
              <button onClick={() => setEditing(false)} className="flex items-center gap-2 px-4 py-2 text-muted-foreground text-sm rounded-md hover:bg-accent transition-colors">
                <X size={14} />
                Cancel
              </button>
            </div>
          </div> :

        <>
            <div>
              <div className="flex items-start gap-2 mb-2">
                <h1 className="text-xl font-display font-bold text-foreground flex-1">{resource.title}</h1>
              </div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-xs px-2 py-0.5 rounded bg-primary/10 border border-primary/20 text-primary font-mono capitalize flex items-center gap-1.5">
                  <Folder size={12} />
                  {resource.children?.length || 0} Items
                </span>
                <span className={`text-xs px-2 py-0.5 rounded border font-mono capitalize ${priorityColors[resource.priority] ?? ""}`}>
                  {resource.priority}
                </span>
              </div>
            </div>

            <div>
              <p className="text-xs font-mono text-muted-foreground uppercase tracking-wider mb-2 block">Tags</p>
              <div className="flex flex-wrap gap-1.5 items-center mb-2">
                {(resource.tags || []).map((tag) =>
                  <span key={tag} className="flex items-center gap-1 text-xs px-2 py-0.5 rounded bg-primary/10 border border-primary/20 text-primary font-mono group">
                    {tag}
                    <button type="button" onClick={() => handleRemoveTagInline(tag)} className="text-muted-foreground hover:text-destructive transition-colors"><X size={10}/></button>
                  </span>
                )}
              </div>
              <div className="flex items-center gap-2 max-w-xs">
                <input
                  value={newTagInput}
                  onChange={(e) => setNewTagInput(e.target.value)}
                  onKeyDown={handleTagKeyDown}
                  placeholder="Type tag, press space/comma..."
                  className="flex-1 bg-background/50 border border-border/50 rounded-md px-3 py-1.5 text-xs text-foreground placeholder:text-muted-foreground/50 outline-none focus:border-primary/50 transition-colors"
                />
                <button
                  type="button"
                  onClick={handleAddTagInline}
                  className="px-2 py-1.5 rounded-md bg-accent text-foreground text-xs hover:bg-accent/80 transition-colors">
                  <Plus size={14} />
                </button>
              </div>
            </div>



            {resource.notes &&
          <div>
                <p className="text-xs font-mono text-muted-foreground uppercase tracking-wider mb-2">Notes</p>
                <p className="text-sm text-foreground/80 leading-relaxed">{resource.notes}</p>
              </div>
          }

          <div className="mt-8 border-t border-border/50 pt-6">
            <div className="flex items-center justify-between mb-4">
              <p className="text-xs font-mono text-muted-foreground uppercase tracking-wider">Contents</p>
              <button onClick={() => setIsAddingTop(!isAddingTop)} className="flex items-center gap-1 px-2 py-1 bg-primary/10 text-primary text-xs rounded hover:bg-primary/20 transition-colors">
                {isAddingTop ? <X size={12} /> : <Plus size={12} />}
                {isAddingTop ? 'Cancel' : 'Add Content'}
              </button>
            </div>
            
            {isAddingTop && (
              <form onSubmit={handleAddTopChild} className="mb-4 p-3 bg-primary/5 border border-primary/20 rounded-md space-y-2">
                <div className="flex items-center gap-2">
                  <select value={topAddType} onChange={e => setTopAddType(e.target.value)} className="bg-background border border-border/50 rounded-md px-2 py-1.5 text-xs text-foreground outline-none w-32 capitalize">
                    {['folder', 'article', 'video', 'pdf', 'notes', 'course', 'book', 'github repo', 'website'].map(t => <option key={t} value={t}>{t}</option>)}
                  </select>
                  <input value={topTitle} onChange={e => setTopTitle(e.target.value)} placeholder="Title *" required className="flex-1 bg-background/50 border border-border/50 rounded-md px-2 py-1.5 text-xs text-foreground outline-none" />
                </div>
                <div className="flex items-center gap-2">
                  <input value={topUrl} onChange={e => setTopUrl(e.target.value)} placeholder="URL / Link (optional)" type="url" className="flex-1 bg-background/50 border border-border/50 rounded-md px-2 py-1.5 text-xs text-foreground outline-none" />
                  <input type="file" onChange={e => setTopFile(e.target.files[0])} className="flex-1 bg-background/50 border border-border/50 rounded-md px-2 py-1 text-xs text-foreground outline-none" />
                </div>
                <div className="flex items-center gap-2 pt-1">
                  <button type="submit" className="text-xs px-4 py-1.5 bg-primary text-primary-foreground font-medium rounded-md hover:bg-primary/90">Add to Contents</button>
                </div>
              </form>
            )}

            <div className="bg-black/10 rounded-lg p-2 border border-border/30">
               <div className="flex items-center gap-2 px-6 pb-2 mb-2 border-b border-white/5 text-[10px] font-mono text-muted-foreground uppercase tracking-wider">
                 <div className="flex-1">Title</div>
                 <div className="w-16 text-right">Actions</div>
               </div>
               
               {resource.url && (
                 <ResourceNode item={{ id: 'legacy-link', type: 'link', title: 'Main Link', url: resource.url }} onUpdate={() => {}} onDelete={() => {}} />
               )}
               {resource.fileName && resource.fileData && (
                 <ResourceNode item={{ id: 'legacy-file', type: 'file', title: resource.fileName, fileData: resource.fileData }} onUpdate={() => {}} onDelete={() => {}} />
               )}

               {resource.children && resource.children.length > 0 ? (
                 resource.children.map(child => (
                   <ResourceNode key={child.id} item={child} onUpdate={handleUpdateChild} onDelete={handleDeleteChild} />
                 ))
               ) : !resource.url && !resource.fileName && (
                 <p className="text-sm text-muted-foreground text-center py-4">No contents yet. Add files, links or subfolders!</p>
               )}
            </div>
          </div>
          </>
        }

        <div className="border-t border-border/50 pt-5 space-y-4">
          <div>
            <p className="text-xs font-mono text-muted-foreground uppercase tracking-wider mb-2">Status</p>
            <button
              onClick={cycleStatus}
              className={`flex items-center gap-2 px-3 py-1.5 rounded border text-sm transition-all ${statusInfo.color}`}>
              
              <StatusIcon size={14} />
              {statusInfo.label}
              <span className="text-xs opacity-60 ml-1">(click to change)</span>
            </button>
          </div>

          <div>
            <p className="text-xs font-mono text-muted-foreground uppercase tracking-wider mb-2">Rating</p>
            <div className="flex items-center gap-1">
              {[1, 2, 3, 4, 5].map((star) =>
              <button
                key={star}
                onClick={() => handleRate(star)}
                className={`transition-colors ${star <= (resource.rating ?? 0) ? "text-yellow-400" : "text-muted-foreground/30 hover:text-yellow-400/50"}`}>
                
                  <Star size={18} fill={star <= (resource.rating ?? 0) ? "currentColor" : "none"} />
                </button>
              )}
              {resource.rating &&
              <span className="text-xs font-mono text-muted-foreground ml-2">{resource.rating}/5</span>
              }
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 text-xs font-mono text-muted-foreground">
            <div>
              <span className="uppercase tracking-wider block mb-1 text-muted-foreground/60">Added</span>
              {new Date(resource.createdAt).toLocaleDateString()}
            </div>
            {resource.lastAccessedAt &&
            <div>
                <span className="uppercase tracking-wider block mb-1 text-muted-foreground/60">Last Accessed</span>
                {new Date(resource.lastAccessedAt).toLocaleDateString()}
              </div>
            }
            {resource.completedAt &&
            <div>
                <span className="uppercase tracking-wider block mb-1 text-muted-foreground/60">Completed</span>
                {new Date(resource.completedAt).toLocaleDateString()}
              </div>
            }
          </div>
        </div>
      </div>
    </div>);

}