import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

const STORAGE_KEY = "smarthub_resources_v3";

// Initial seed data
const getResources = () => {
  const data = localStorage.getItem(STORAGE_KEY);
  if (data) return JSON.parse(data);
  const initial = [
    {
      id: 1,
      title: "Complete React Documentation",
      type: "article",
      url: "https://react.dev",
      tags: ["React", "Frontend", "JavaScript"],
      priority: "high",
      status: "in_progress",
      rating: 4,
      pinned: true,
      notes: "Essential reading for hooks and concurrent features",
      lastAccessedAt: "2026-04-19T18:27:46.067Z",
      createdAt: "2026-04-19T15:22:52.627Z",
      updatedAt: "2026-04-19T18:27:46.068Z",
      children: [
        { id: 101, title: "Introduction to Hooks", type: "link", url: "https://react.dev/reference/react" },
        {
          id: 102,
          title: "State Management Subfolder",
          type: "folder",
          children: [
            { id: 1021, title: "Zustand docs", type: "link", url: "https://zustand-demo.pmnd.rs/" },
            { id: 1022, title: "Redux Setup Guide", type: "link", url: "https://redux-toolkit.js.org/" }
          ]
        },
        {
          id: 103,
          title: "Advanced React cheat sheet.pdf",
          type: "file",
          fileData: "data:application/pdf;base64,JVBERi0xLjcKCjEgMCBvYmogICUgZW50cnkgcG9pbnQKPDwKICAvVHlwZSAvQ2F0YWxvZwogIC9QYWdlcyAyIDAgUgo+PgplbmRvYmoKCjIgMCBvYmoKPDwKICAvVHlwZSAvUGFnZXMKICAvTWVkaWFCb3ggWyAwIDAgMjAwIDIwMCBdCiAgL0NvdW50IDEKICAvS2lkcyBbIDMgMCBSIF0KPj4KZW5kb2JqCgozIDAgb2JqCjw8CiAgL1R5cGUgL1BhZ2UKICAvUGFyZW50IDIgMCBSCiAgL1Jlc291cmNlcyA8PAogICAgL0ZvbnQgPDwKICAgICAgL0YxIDQgMCBSCgkJPDwKICAgICAgICAvVHlwZSAvRm9udAogICAgICAgIC9TdWJ0eXBlIC9UeXBlMQogICAgICAgIC9CYXNlRm9udCAvVGltZXMtUm9tYW4KICAgICAgPj4KICAgID4+CiAgPj4KICAvQ29udGVudHMgNSAwIFIKPj4KZW5kb2JqCgo0IDAgb2JqCjw8CiAgL1R5cGUgL0ZvbnQKICAvU3VidHlwZSAvVHlwZTEKICAvQmFzZUZvbnQgL1RpbWVzLVJvbWFuCj4+CmVuZG9iagoKNSAwIG9iago8PAogIC9MZW5ndGggNzcKPj4Kc3RyZWFtCkJUCjcwIDUwIFRECi9GMSAxMiBUZgpUagoKU0VMRUNURUQgTUlOSU1VTSBVU0VGVUwgUEQKClNUUkVBTSBFTkQKCmVuZHN0cmVhbQplbmRvYmoKCnhyZWYKMCA2CjAwMDAwMDAwMDAgNjU1MzUgZiAKMDAwMDAwMDAxMCAwMDAwMCBuIAowMDAwMDAwMDc5IDAwMDAwIG4gCjAwMDAwMDAxNzMgMDAwMDAgbiAKMDAwMDAwMDMwMSAwMDAwMCBuIAowMDAwMDAwMzk4IDAwMDAwIG4gCnRyYWlsZXIKPDwKICAvU2l6ZSA2CiAgL1Jvb3QgMSAwIFIKPj4Kc3RhcnR4cmVmCjQ5NQolJUVPRgo=",
          fileName: "Advanced React cheat sheet.pdf"
        }
      ]
    },
    {
      id: 2,
      title: "System Design Interview Prep",
      type: "video",
      url: "https://youtube.com",
      tags: ["SystemDesign", "DSA", "Interview"],
      priority: "critical",
      status: "not_started",
      pinned: true,
      notes: "Highly recommended series",
      createdAt: "2026-04-19T15:22:52.627Z",
      updatedAt: "2026-04-19T15:22:52.627Z",
      children: [
        { id: 201, title: "System Design Frameworks", type: "course", url: "https://educative.io/courses/grokking-modern-system-design-interview-for-engineers-managers" },
        { id: 202, title: "ByteByteGo YouTube Channel", type: "video", url: "https://www.youtube.com/@ByteByteGo" },
        { id: 203, title: "Latency Numbers Every Programmer Should Know", type: "article", url: "https://gist.github.com/jboner/2841832" }
      ]
    },
    {
      id: 3,
      title: "Advanced TypeScript Patterns",
      type: "article",
      url: "https://typescriptlang.org",
      tags: ["TypeScript", "Frontend", "JavaScript"],
      priority: "high",
      status: "completed",
      rating: 5,
      pinned: false,
      notes: "Covered generics and conditional types",
      lastAccessedAt: "2026-04-14T15:22:52.627Z",
      completedAt: "2026-04-18T15:22:52.627Z",
      createdAt: "2026-04-19T15:22:52.627Z",
      updatedAt: "2026-04-19T15:22:52.627Z",
      children: [
        { id: 301, title: "Type Challenges Repo", type: "github repo", url: "https://github.com/type-challenges/type-challenges" },
        { id: 302, title: "Utility Types Docs", type: "website", url: "https://www.typescriptlang.org/docs/handbook/utility-types.html" },
        { id: 303, title: "Matt Pocock TS Tips", type: "video", url: "https://www.youtube.com/@mattpocockuk" }
      ]
    },
    {
      id: 4,
      title: "Database Design Fundamentals",
      type: "pdf",
      url: "https://example.com/db.pdf",
      tags: ["Database", "SQL", "Backend"],
      priority: "medium",
      status: "not_started",
      pinned: false,
      createdAt: "2026-04-19T15:22:52.627Z",
      updatedAt: "2026-04-19T15:22:52.627Z",
      children: [
        { id: 401, title: "Normalization Cheat Sheet", type: "notes", fileData: "data:text/plain;base64,MU5GOiBBdG9taWMgdmFsdWVzCjJORjogTm8gcGFydGlhbCBkZXBlbmRlbmNpZXMKM05GOiBObyB0cmFuc2l0aXZlIGRlcGVuZGVuY2llcw==", fileName: "normalization_notes.txt" },
        { id: 402, title: "PostgreSQL Documentation", type: "website", url: "https://www.postgresql.org/docs/" }
      ]
    },
    {
      id: 5,
      title: "Cracking the Coding Interview",
      type: "book",
      tags: ["DSA", "Interview", "Algorithms"],
      priority: "critical",
      status: "in_progress",
      rating: 4,
      pinned: true,
      notes: "Chapter 4-6 remaining",
      lastAccessedAt: "2026-04-18T15:22:52.627Z",
      createdAt: "2026-04-19T15:22:52.627Z",
      updatedAt: "2026-04-19T15:22:52.627Z",
      children: [
        { 
          id: 501, 
          title: "Chapter 4: Trees & Graphs", 
          type: "folder", 
          children: [
            { id: 5011, title: "Graph Traversal BFS/DFS", type: "video", url: "https://youtube.com" },
            { id: 5012, title: "Blind 75 Leetcode Hub", type: "github repo", url: "https://github.com/ashishps1/awesome-leetcode-resources" }
          ]
        },
        { id: 502, title: "Chapter 5: Bit Manipulation", type: "folder", children: [] }
      ]
    },
    {
      id: 6,
      title: "CSS Grid Complete Guide",
      type: "article",
      url: "https://css-tricks.com",
      tags: ["CSS", "Frontend", "Design"],
      priority: "low",
      status: "completed",
      rating: 3,
      pinned: false,
      notes: "Good reference for grid layouts",
      lastAccessedAt: "2026-04-09T15:22:52.627Z",
      completedAt: "2026-04-12T15:22:52.627Z",
      createdAt: "2026-04-19T15:22:52.627Z",
      updatedAt: "2026-04-19T15:22:52.627Z",
      children: [
        { id: 601, title: "CSS Grid Garden Game", type: "website", url: "https://cssgridgarden.com/" },
        { id: 602, title: "Grid vs Flexbox comparison video", type: "video", url: "https://youtube.com/watch?v=hs3piaN4b5I" }
      ]
    },
    {
      id: 7,
      title: "Node.js Best Practices",
      type: "notes",
      tags: ["Node", "Backend", "JavaScript"],
      priority: "medium",
      status: "not_started",
      pinned: false,
      notes: "Personal notes from workshop",
      createdAt: "2026-04-19T15:22:52.627Z",
      updatedAt: "2026-04-19T15:22:52.627Z",
      children: []
    },
    {
      id: 8,
      title: "Machine Learning Crash Course",
      type: "course",
      url: "https://developers.google.com/machine-learning/crash-course",
      tags: ["ML", "Python", "AI"],
      priority: "medium",
      status: "not_started",
      pinned: false,
      notes: "Google ML course - 15 hours total",
      createdAt: "2026-04-19T15:22:52.627Z",
      updatedAt: "2026-04-19T15:22:52.627Z",
      children: [
        { id: 801, title: "TensorFlow Setup Guide", type: "website", url: "https://www.tensorflow.org/install" },
        { id: 802, title: "Kaggle Dataset Hub", type: "website", url: "https://www.kaggle.com/datasets" },
        { id: 803, title: "Mathematics for Machine Learning", type: "book", url: "https://mml-book.github.io/" }
      ]
    },
    {
      id: 9,
      title: "Docker and Kubernetes Deep Dive",
      type: "video",
      url: "https://youtube.com",
      tags: ["DevOps", "Docker", "Cloud"],
      priority: "high",
      status: "in_progress",
      rating: 3,
      pinned: false,
      notes: "Halfway through container orchestration section",
      lastAccessedAt: "2026-04-16T15:22:52.627Z",
      createdAt: "2026-04-19T15:22:52.627Z",
      updatedAt: "2026-04-19T15:22:52.627Z",
      children: [
        { 
          id: 901, 
          title: "K8s Config Files", 
          type: "folder", 
          children: [
            { id: 9011, title: "sample_deployment.yaml", type: "notes", fileData: "data:text/plain;base64,YXBpVmVyc2lvbjogYXBwcy92MQpraW5kOiBEZXBsb3ltZW50Cm1ldGFkYXRhOgogIG5hbWU6IG5naW54LWRlcGxveW1lbnQ=", fileName: "sample_deployment.yaml" }
          ] 
        },
        { id: 902, title: "Docker Networking explained", type: "article", url: "https://docs.docker.com/network/" }
      ]
    },
    {
      id: 10,
      title: "Operating System Concepts",
      type: "book",
      tags: ["OS", "Computer Science", "Interview"],
      priority: "medium",
      status: "completed",
      rating: 4,
      pinned: false,
      notes: "Silberschatz book - processes and memory management done",
      lastAccessedAt: "2026-04-04T15:22:52.627Z",
      completedAt: "2026-04-07T15:22:52.627Z",
      createdAt: "2026-04-19T15:22:52.627Z",
      updatedAt: "2026-04-19T15:22:52.627Z",
      children: []
    },
    {
      id: 11,
      title: "GraphQL Fundamentals",
      type: "article",
      url: "https://graphql.org",
      tags: ["GraphQL", "API", "Backend"],
      priority: "low",
      status: "not_started",
      pinned: false,
      createdAt: "2026-04-19T15:22:52.627Z",
      updatedAt: "2026-04-19T15:22:52.627Z",
      children: [
        { id: 1101, title: "Apollo Server Quickstart", type: "github repo", url: "https://github.com/apollographql/apollo-server" },
        { id: 1102, title: "GraphQL vs REST", type: "video", url: "https://www.youtube.com/watch?v=yWzKJPw_VzM" }
      ]
    },
    {
      id: 12,
      title: "Tailwind CSS Mastery",
      type: "video",
      url: "https://youtube.com",
      tags: ["CSS", "Tailwind", "Frontend"],
      priority: "low",
      status: "completed",
      rating: 5,
      pinned: false,
      notes: "All utility classes covered",
      lastAccessedAt: "2026-03-30T15:22:52.627Z",
      completedAt: "2026-04-01T15:22:52.627Z",
      createdAt: "2026-04-19T15:22:52.627Z",
      updatedAt: "2026-04-19T15:22:52.627Z",
      children: [
        { id: 1201, title: "Tailwind UI Components", type: "website", url: "https://tailwindui.com" },
        { id: 1202, title: "JIT Compiler deep dive", type: "article", url: "https://tailwindcss.com/blog/just-in-time-the-next-generation-of-tailwind-css" }
      ]
    }
  ];
  localStorage.setItem(STORAGE_KEY, JSON.stringify(initial));
  return initial;
};

const saveResources = (res) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(res));
};

export const getListResourcesQueryKey = () => ["resources"];
export const getGetDashboardStatsQueryKey = () => ["dashboardStats"];
export const getGetNeglectedResourcesQueryKey = () => ["neglected"];
export const getGetRecentResourcesQueryKey = () => ["recent"];
export const getGetPinnedResourcesQueryKey = () => ["pinned"];
export const getGetResourceQueryKey = (id) => ["resource", id];
export const getGetAnalyticsTrendsQueryKey = () => ["analyticsTrends"];

export function useGetDashboardStats() {
  return useQuery({
    queryKey: getGetDashboardStatsQueryKey(),
    queryFn: () => {
      const items = getResources();
      return {
        total: items.length,
        completed: items.filter(r => r.status === "completed").length,
        inProgress: items.filter(r => r.status === "in_progress").length,
        notStarted: items.filter(r => r.status === "not_started").length,
        completionRate: items.length ? Math.round((items.filter(r => r.status === "completed").length / items.length) * 100) : 0,
        pinned: items.filter(r => r.pinned).length,
        byType: ["article", "video", "notes"].map(t => ({ type: t, count: items.filter(r => r.type === t).length })),
        byPriority: ["critical", "high", "medium", "low"].map(p => ({ priority: p, count: items.filter(r => r.priority === p).length }))
      };
    }
  });
}

export function useGetNeglectedResources() {
  return useQuery({
    queryKey: getGetNeglectedResourcesQueryKey(),
    queryFn: () => getResources().filter(r => r.status === "not_started").slice(0, 5)
  });
}

export function useGetRecentResources() {
  return useQuery({
    queryKey: getGetRecentResourcesQueryKey(),
    queryFn: () => getResources().sort((a,b) => new Date(b.createdAt) - new Date(a.createdAt)).slice(0, 5)
  });
}

export function useGetPinnedResources() {
  return useQuery({
    queryKey: getGetPinnedResourcesQueryKey(),
    queryFn: () => getResources()
      .filter(r => r.pinned)
      .sort((a,b) => new Date(b.createdAt) - new Date(a.createdAt))
      .slice(0, 4)
  });
}

export function useCreateResource() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ data }) => {
      const items = getResources();
      const newResource = {
        id: Date.now(),
        status: "not_started",
        pinned: false,
        tags: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        children: [],
        ...data
      };
      saveResources([...items, newResource]);
      return newResource;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: getListResourcesQueryKey() });
      queryClient.invalidateQueries({ queryKey: getGetDashboardStatsQueryKey() });
    }
  });
}

export function useGetResource(id, options) {
  return useQuery({
    queryKey: getGetResourceQueryKey(id),
    queryFn: () => getResources().find(r => r.id === parseInt(id)),
    ...options?.query
  });
}

export function useUpdateResource() {
  return useMutation({
    mutationFn: async ({ id, data }) => {
      const items = getResources();
      const idx = items.findIndex(r => r.id === parseInt(id));
      if (idx !== -1) {
        items[idx] = { ...items[idx], ...data, updatedAt: new Date().toISOString() };
        saveResources(items);
        return items[idx];
      }
      throw new Error("Not found");
    }
  });
}

export function useUpdateResourceStatus() {
  return useUpdateResource();
}

export function useTogglePin() {
  return useMutation({
    mutationFn: async ({ id }) => {
      const items = getResources();
      const idx = items.findIndex(r => r.id === parseInt(id));
      if (idx !== -1) {
        items[idx].pinned = !items[idx].pinned;
        saveResources(items);
        return items[idx];
      }
    }
  });
}

export function useRateResource() {
  return useUpdateResource();
}

export function useDeleteResource() {
  return useMutation({
    mutationFn: async ({ id }) => {
      let items = getResources();
      items = items.filter(r => r.id !== parseInt(id));
      saveResources(items);
    }
  });
}

export function useListResources(options) {
  return useQuery({
    queryKey: getListResourcesQueryKey(),
    queryFn: () => {
      let items = getResources();
      return items;
    },
    ...options?.query
  });
}

export function useGetLearningAnalytics() {
  return useQuery({
    queryKey: getGetAnalyticsTrendsQueryKey(),
    queryFn: () => {
      const items = getResources();
      
      const tagStats = {};
      items.forEach(r => {
        (r.tags || []).forEach(tag => {
          if (!tagStats[tag]) {
            tagStats[tag] = { tag, total: 0, completed: 0, inProgress: 0, notStarted: 0 };
          }
          tagStats[tag].total += 1;
          if (r.status === "completed") tagStats[tag].completed += 1;
          else if (r.status === "in_progress") tagStats[tag].inProgress += 1;
          else tagStats[tag].notStarted += 1;
        });
      });
      
      return Object.values(tagStats).map(stat => ({
        ...stat,
        completionRate: stat.total > 0 ? Math.round((stat.completed / stat.total) * 100) : 0
      })).sort((a, b) => b.total - a.total);
    }
  });
}
