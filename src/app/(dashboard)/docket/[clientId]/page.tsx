"use client";

import { trpc } from "@/lib/trpc/client";
import { useState, useMemo, useRef, useEffect } from "react";
import {
  Plus, Trash2, Check, ChevronDown, ChevronRight, Star, X,
  Search, MessageSquare, Clock3, RefreshCw, AlertTriangle, Circle,
  Inbox, ListChecks, Layers, PanelLeft, PanelRight
} from "lucide-react";

const STATUS = {
  not_started: { label: "Unstarted", order: 0, color: "text-text-muted", icon: Circle },
  in_progress: { label: "Underway", order: 1, color: "text-accent-primary", icon: RefreshCw },
  pending: { label: "On Hold", order: 2, color: "text-yellow-500", icon: Clock3 },
  action_required: { label: "Needs Attention", order: 3, color: "text-status-danger", icon: AlertTriangle },
  done: { label: "Closed Out", order: 4, color: "text-status-success", icon: Check },
};

const PRIORITY = {
  p0: { label: "P0", color: "#f0575a" },
  p1: { label: "P1", color: "#f2ac3d" },
  p2: { label: "P2", color: "#4ade93" },
};

export default function DocketPage({ params }: { params: { clientId: string } }) {
  const [view, setView] = useState<"queue" | "recaps" | "all">("queue");
  const [groupBy, setGroupBy] = useState<"status" | "priority" | "due" | "none">("status");
  const [query, setQuery] = useState("");
  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null);
  const [collapsedGroups, setCollapsedGroups] = useState<Record<string, boolean>>({});
  const [expandedSubtasks, setExpandedSubtasks] = useState<Record<string, boolean>>({});
  const [newTaskTitle, setNewTaskTitle] = useState("");
  const [newSubtaskText, setNewSubtaskText] = useState<Record<string, string>>({});
  const [newCommentText, setNewCommentText] = useState<Record<string, string>>({});
  const [groupMenuOpen, setGroupMenuOpen] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [detailPanelOpen, setDetailPanelOpen] = useState(true);
  const menuRef = useRef<HTMLDivElement>(null);
  const utils = trpc.useUtils();

  const { data: tasks = [], isLoading } = trpc.docket.listTasks.useQuery({
    clientId: params.clientId,
  });

  const createTaskMutation = trpc.docket.createTask.useMutation({
    onSuccess: () => {
      utils.docket.listTasks.invalidate();
      setNewTaskTitle("");
    },
  });

  const updateStatusMutation = trpc.docket.updateTaskStatus.useMutation({
    onSuccess: () => {
      utils.docket.listTasks.invalidate();
    },
  });

  const updatePriorityMutation = trpc.docket.updateTaskPriority.useMutation({
    onSuccess: () => {
      utils.docket.listTasks.invalidate();
    },
  });

  const toggleStarMutation = trpc.docket.toggleTaskStar.useMutation({
    onSuccess: () => {
      utils.docket.listTasks.invalidate();
    },
  });

  const deleteTaskMutation = trpc.docket.deleteTask.useMutation({
    onSuccess: () => {
      utils.docket.listTasks.invalidate();
      setSelectedTaskId(null);
    },
  });

  const addSubtaskMutation = trpc.docket.addSubtask.useMutation({
    onSuccess: () => {
      utils.docket.listTasks.invalidate();
      setNewSubtaskText((p) => ({ ...p, [selectedTaskId || ""]: "" }));
    },
  });

  const toggleSubtaskMutation = trpc.docket.toggleSubtask.useMutation({
    onSuccess: () => {
      utils.docket.listTasks.invalidate();
    },
  });

  const deleteSubtaskMutation = trpc.docket.deleteSubtask.useMutation({
    onSuccess: () => {
      utils.docket.listTasks.invalidate();
    },
  });

  const addCommentMutation = trpc.docket.addComment.useMutation({
    onSuccess: () => {
      utils.docket.listTasks.invalidate();
      setNewCommentText((p) => ({ ...p, [selectedTaskId || ""]: "" }));
    },
  });

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setGroupMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return tasks.filter((t: any) => (q ? t.title.toLowerCase().includes(q) : true));
  }, [tasks, query]);

  const queueTasks = filtered.filter((t: any) => t.status !== "done");
  const listForView = view === "all" ? filtered : queueTasks;

  const groups = useMemo(() => {
    if (groupBy === "none") return [{ key: "all", label: "Everything", items: listForView }];

    const map: Record<string, any[]> = {};
    listForView.forEach((t: any) => {
      const k = groupBy === "status" ? t.status : groupBy === "priority" ? (t.priority || "none") : "all";
      (map[k] = map[k] || []).push(t);
    });

    const orderKeys = groupBy === "status"
      ? Object.keys(STATUS).filter((k) => view === "all" ? true : k !== "done")
      : Object.keys(map);

    return orderKeys.filter((k) => map[k]).map((k) => {
      const label = groupBy === "status"
        ? STATUS[k as keyof typeof STATUS]?.label
        : groupBy === "priority"
        ? (k === "none" ? "Unranked" : PRIORITY[k as keyof typeof PRIORITY]?.label)
        : "All";
      return { key: k, label, items: map[k] };
    });
  }, [listForView, groupBy, view]);

  const completedTasks = tasks.filter((t: any) => t.status === "done").sort((a: any, b: any) =>
    new Date(b.completed_at).getTime() - new Date(a.completed_at).getTime()
  );

  const recapDays = useMemo(() => {
    const byDay: Record<string, any[]> = {};
    completedTasks.forEach((t: any) => {
      const key = new Date(t.completed_at).toDateString();
      (byDay[key] = byDay[key] || []).push(t);
    });
    return Object.entries(byDay);
  }, [completedTasks]);

  const selected: any = tasks.find((t: any) => t.id === selectedTaskId) || null;

  const handleCreateTask = () => {
    if (!newTaskTitle.trim()) return;
    createTaskMutation.mutate({
      clientId: params.clientId,
      title: newTaskTitle,
    });
  };

  const cycleStatus = (task: any) => {
    const order = ["not_started", "in_progress", "pending", "action_required", "done"];
    const idx = order.indexOf(task.status);
    const next = order[(idx + 1) % order.length];
    updateStatusMutation.mutate({ taskId: task.id, status: next as any });
  };

  const formatDate = (iso: string) => {
    if (!iso) return "";
    const d = new Date(iso);
    const now = new Date();
    const diffMs = now.getTime() - d.getTime();
    const diffMin = Math.round(diffMs / 60000);
    if (diffMin < 60 && diffMin >= 0) return `${Math.max(diffMin, 0)}m ago`;
    const diffH = Math.round(diffMin / 60);
    if (diffH < 24 && diffH >= 0) return `${diffH}h ago`;
    return d.toLocaleDateString(undefined, { month: "short", day: "numeric" });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-text-secondary">Loading tasks...</p>
      </div>
    );
  }

  return (
    <div className="flex gap-4 h-full -mx-6 -my-6 px-6 py-6">
      {/* Sidebar */}
      {sidebarOpen && (
      <div className="w-56 flex-shrink-0 space-y-6 pr-4 border-r border-bg-border">
        <div className="space-y-2">
          {[
            { key: "queue", label: "Open Items", icon: Inbox },
            { key: "recaps", label: "Wrap-ups", icon: ListChecks },
            { key: "all", label: "Everything", icon: Layers },
          ].map((n) => {
            const Icon = n.icon;
            return (
              <button
                key={n.key}
                onClick={() => setView(n.key as any)}
                className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-colors ${
                  view === n.key
                    ? "bg-accent-primary/10 text-accent-primary font-semibold"
                    : "text-text-secondary hover:bg-bg-surface"
                }`}
              >
                <Icon size={16} />
                {n.label}
              </button>
            );
          })}
        </div>
      </div>
      )}

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        {view !== "recaps" && (
          <div className="flex gap-3 mb-6 pb-6 border-b border-bg-border">
            <div className="flex-1 flex items-center gap-2 px-3 py-2 bg-bg-surface border border-bg-border rounded-lg">
              <Search size={16} className="text-text-muted" />
              <input
                placeholder="Search tasks..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="flex-1 bg-none border-none outline-none text-white text-sm placeholder-text-muted"
              />
            </div>
            <div className="relative" ref={menuRef}>
              <button
                onClick={() => setGroupMenuOpen(!groupMenuOpen)}
                className="flex items-center gap-2 px-3 py-2 bg-bg-surface border border-bg-border rounded-lg text-sm text-text-secondary hover:text-text-primary transition-colors"
              >
                Sort: {groupBy}
                <ChevronDown size={14} />
              </button>
              {groupMenuOpen && (
                <div className="absolute right-0 top-full mt-2 bg-bg-surface border border-bg-border rounded-lg z-10 overflow-hidden min-w-40">
                  {["status", "priority", "due", "none"].map((g) => (
                    <button
                      key={g}
                      onClick={() => {
                        setGroupBy(g as any);
                        setGroupMenuOpen(false);
                      }}
                      className={`block w-full text-left px-4 py-2 text-sm transition-colors ${
                        groupBy === g
                          ? "bg-accent-primary/10 text-accent-primary"
                          : "text-text-secondary hover:bg-bg-border hover:text-text-primary"
                      }`}
                    >
                      {g === "none" ? "Flat list" : `By ${g}`}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Toggle Buttons */}
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="flex items-center gap-2 px-3 py-2 bg-bg-surface border border-bg-border rounded-lg text-text-secondary hover:text-text-primary transition-colors"
              title={sidebarOpen ? "Hide sidebar" : "Show sidebar"}
            >
              <PanelLeft size={16} />
            </button>
            <button
              onClick={() => setDetailPanelOpen(!detailPanelOpen)}
              className="flex items-center gap-2 px-3 py-2 bg-bg-surface border border-bg-border rounded-lg text-text-secondary hover:text-text-primary transition-colors"
              title={detailPanelOpen ? "Hide details" : "Show details"}
            >
              <PanelRight size={16} />
            </button>
          </div>
        )}

        {/* Task List / Recaps */}
        <div className="flex-1 overflow-y-auto mb-6">
          {view !== "recaps" ? (
            <div className="space-y-6">
              {groups.length === 0 && (
                <p className="text-text-muted text-center py-8">No tasks yet.</p>
              )}
              {groups.map((g) => {
                const isCollapsed = collapsedGroups[g.key];
                return (
                  <div key={g.key}>
                    {groupBy !== "none" && (
                      <button
                        onClick={() =>
                          setCollapsedGroups((c) => ({ ...c, [g.key]: !c[g.key] }))
                        }
                        className="flex items-center gap-2 px-3 py-2 mb-3 text-sm font-semibold text-text-primary cursor-pointer group"
                      >
                        <ChevronDown
                          size={14}
                          style={{ transform: isCollapsed ? "rotate(-90deg)" : "none", transition: "transform 0.15s" }}
                        />
                        {g.label}
                        <span className="text-text-muted">· {g.items.length}</span>
                        <div className="flex-1 h-px bg-bg-border ml-2" />
                      </button>
                    )}
                    {!isCollapsed &&
                      g.items.map((t: any) => {
                        const StatusIcon = STATUS[t.status as keyof typeof STATUS]?.icon || Circle;
                        return (
                          <div key={t.id}>
                            <button
                              onClick={() => setSelectedTaskId(t.id)}
                              className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg mb-2 transition-colors text-left group ${
                                selectedTaskId === t.id
                                  ? "bg-bg-surface border border-bg-border"
                                  : "hover:bg-bg-surface/50"
                              }`}
                            >
                              {t.subtasks?.length > 0 && (
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setExpandedSubtasks((x) => ({ ...x, [t.id]: !x[t.id] }));
                                  }}
                                  className="flex-shrink-0 w-4"
                                >
                                  <ChevronRight
                                    size={14}
                                    style={{
                                      transform: expandedSubtasks[t.id] ? "rotate(90deg)" : "none",
                                      transition: "transform 0.15s",
                                    }}
                                  />
                                </button>
                              )}
                              {!t.subtasks?.length && <div className="flex-shrink-0 w-4" />}

                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  toggleStarMutation.mutate({ taskId: t.id });
                                }}
                                className="flex-shrink-0"
                              >
                                <Star
                                  size={14}
                                  fill={t.starred ? "#f2ac3d" : "none"}
                                  color={t.starred ? "#f2ac3d" : "currentColor"}
                                  className="text-text-muted"
                                />
                              </button>

                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  cycleStatus(t);
                                }}
                                className="flex-shrink-0"
                              >
                                <StatusIcon
                                  size={14}
                                  className={STATUS[t.status as keyof typeof STATUS]?.color}
                                />
                              </button>

                              <span className={`flex-1 text-sm ${t.status === "done" ? "line-through text-text-muted" : "text-white"}`}>
                                {t.title}
                              </span>

                              {t.priority && (
                                <span
                                  className="px-2 py-1 rounded text-xs font-semibold flex-shrink-0"
                                  style={{ color: PRIORITY[t.priority as keyof typeof PRIORITY]?.color }}
                                >
                                  {PRIORITY[t.priority as keyof typeof PRIORITY]?.label}
                                </span>
                              )}

                              <div className="flex items-center gap-3 text-xs text-text-muted flex-shrink-0">
                                {t.task_comments?.length > 0 && (
                                  <span className="flex items-center gap-1">
                                    <MessageSquare size={12} /> {t.task_comments.length}
                                  </span>
                                )}
                                <span>{formatDate(t.created_at)}</span>
                              </div>

                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  deleteTaskMutation.mutate({ taskId: t.id });
                                }}
                                className="opacity-0 group-hover:opacity-100 flex-shrink-0 text-text-muted hover:text-status-danger transition-all"
                              >
                                <Trash2 size={14} />
                              </button>
                            </button>

                            {expandedSubtasks[t.id] && t.subtasks?.length > 0 && (
                              <div className="pl-6 pb-2 space-y-1">
                                {t.subtasks.map((s: any) => (
                                  <button
                                    key={s.id}
                                    onClick={() => toggleSubtaskMutation.mutate({ subtaskId: s.id })}
                                    className="w-full flex items-center gap-2 px-3 py-1 rounded text-sm text-text-secondary hover:bg-bg-surface/50 transition-colors text-left group"
                                  >
                                    <input
                                      type="checkbox"
                                      checked={s.done === "true" || s.done === true}
                                      onChange={() => {}}
                                      className="cursor-pointer"
                                    />
                                    <span className={s.done === "true" || s.done === true ? "line-through text-text-muted" : ""}>
                                      {s.title}
                                    </span>
                                    <button
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        deleteSubtaskMutation.mutate({ subtaskId: s.id });
                                      }}
                                      className="ml-auto opacity-0 group-hover:opacity-100 text-text-muted hover:text-status-danger"
                                    >
                                      <X size={12} />
                                    </button>
                                  </button>
                                ))}
                              </div>
                            )}
                          </div>
                        );
                      })}
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="space-y-6">
              {recapDays.length === 0 && (
                <p className="text-text-muted text-center py-8">No completed tasks yet.</p>
              )}
              {recapDays.map(([day, items]) => (
                <div key={day}>
                  <h3 className="text-sm font-semibold text-white mb-3">
                    {new Date(day).toLocaleDateString(undefined, { weekday: "long", month: "short", day: "numeric" })}
                  </h3>
                  <div className="space-y-1">
                    {items.map((t: any) => (
                      <div key={t.id} className="flex items-center gap-2 text-sm text-text-secondary">
                        <Check size={14} className="text-status-success flex-shrink-0" />
                        {t.title}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Add Task Footer */}
        {view !== "recaps" && (
          <div className="flex gap-2 pt-6 border-t border-bg-border">
            <input
              type="text"
              value={newTaskTitle}
              onChange={(e) => setNewTaskTitle(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleCreateTask();
              }}
              placeholder="Log a new item..."
              className="flex-1 px-3 py-2 rounded-lg bg-bg-surface border border-bg-border text-white text-sm placeholder-text-muted focus:border-accent-primary focus:outline-none transition-colors"
            />
            <button
              onClick={handleCreateTask}
              disabled={createTaskMutation.isPending}
              className="px-4 py-2 bg-accent-primary text-white rounded-lg font-semibold hover:bg-blue-600 disabled:opacity-50 transition-colors flex items-center gap-2 flex-shrink-0"
            >
              <Plus size={16} />
            </button>
          </div>
        )}
      </div>

      {/* Detail Panel */}
      {selected && detailPanelOpen && (
        <div className="w-80 flex-shrink-0 pl-4 border-l border-bg-border space-y-4 overflow-y-auto">
          <div className="flex items-start justify-between">
            <input
              type="text"
              value={selected.title}
              onChange={(e) => {
                // TODO: Implement task title update
                void e.target.value;
              }}
              className="flex-1 text-lg font-semibold bg-none border-none outline-none text-white"
            />
            <button
              onClick={() => setSelectedTaskId(null)}
              className="text-text-muted hover:text-white transition-colors"
            >
              <X size={18} />
            </button>
          </div>

          <textarea
            placeholder="Notes for yourself..."
            value={selected.description || ""}
            className="w-full px-3 py-2 bg-bg-surface border border-bg-border rounded-lg text-text-secondary text-sm resize-none focus:border-accent-primary focus:outline-none"
            rows={3}
          />

          <div className="space-y-3 pt-4 border-t border-bg-border">
            <div className="text-xs text-text-muted uppercase tracking-wider font-semibold">Details</div>

            <div>
              <label className="text-xs text-text-muted mb-1 block">Stage</label>
              <select
                value={selected.status}
                onChange={(e) =>
                  updateStatusMutation.mutate({ taskId: selected.id, status: e.target.value as any })
                }
                className="w-full px-3 py-2 bg-bg-surface border border-bg-border rounded-lg text-white text-sm outline-none focus:border-accent-primary"
              >
                {Object.entries(STATUS).map(([k, v]) => (
                  <option key={k} value={k}>{v.label}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-xs text-text-muted mb-1 block">Urgency</label>
              <select
                value={selected.priority || ""}
                onChange={(e) =>
                  updatePriorityMutation.mutate({ taskId: selected.id, priority: (e.target.value || null) as any })
                }
                className="w-full px-3 py-2 bg-bg-surface border border-bg-border rounded-lg text-white text-sm outline-none focus:border-accent-primary"
              >
                <option value="">Unranked</option>
                <option value="p0">P0</option>
                <option value="p1">P1</option>
                <option value="p2">P2</option>
              </select>
            </div>
          </div>

          <div className="space-y-3 pt-4 border-t border-bg-border">
            <div className="text-xs text-text-muted uppercase tracking-wider font-semibold">
              Steps · {selected.subtasks?.filter((s: any) => s.done === "true" || s.done === true).length || 0}/{selected.subtasks?.length || 0}
            </div>
            <div className="space-y-1">
              {selected.subtasks?.map((s: any) => (
                <div key={s.id} className="flex items-center gap-2 group">
                  <input
                    type="checkbox"
                    checked={s.done === "true" || s.done === true}
                    onChange={() => toggleSubtaskMutation.mutate({ subtaskId: s.id })}
                    className="cursor-pointer"
                  />
                  <span className={`flex-1 text-sm ${s.done === "true" || s.done === true ? "line-through text-text-muted" : "text-text-secondary"}`}>
                    {s.title}
                  </span>
                  <button
                    onClick={() => deleteSubtaskMutation.mutate({ subtaskId: s.id })}
                    className="opacity-0 group-hover:opacity-100 text-text-muted hover:text-status-danger transition-all"
                  >
                    <X size={14} />
                  </button>
                </div>
              ))}
            </div>
            <div className="flex gap-2 pt-2">
              <input
                type="text"
                value={newSubtaskText[selected.id] || ""}
                onChange={(e) => setNewSubtaskText((p) => ({ ...p, [selected.id]: e.target.value }))}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    addSubtaskMutation.mutate({ taskId: selected.id, title: newSubtaskText[selected.id] });
                  }
                }}
                placeholder="Add a step..."
                className="flex-1 px-3 py-2 bg-bg-surface border border-bg-border rounded-lg text-text-secondary text-sm placeholder-text-muted outline-none focus:border-accent-primary"
              />
            </div>
          </div>

          <div className="space-y-3 pt-4 border-t border-bg-border">
            <div className="text-xs text-text-muted uppercase tracking-wider font-semibold">
              Updates · {selected.task_comments?.length || 0}
            </div>
            <div className="space-y-2">
              {selected.task_comments?.map((c: any) => (
                <div key={c.id} className="p-2 bg-bg-surface rounded-lg text-sm text-text-secondary">
                  {c.text}
                  <div className="text-xs text-text-muted mt-1">{formatDate(c.created_at)}</div>
                </div>
              ))}
            </div>
            <div className="flex gap-2">
              <input
                type="text"
                value={newCommentText[selected.id] || ""}
                onChange={(e) => setNewCommentText((p) => ({ ...p, [selected.id]: e.target.value }))}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    addCommentMutation.mutate({ taskId: selected.id, text: newCommentText[selected.id] });
                  }
                }}
                placeholder="Leave an update..."
                className="flex-1 px-3 py-2 bg-bg-surface border border-bg-border rounded-lg text-text-secondary text-sm placeholder-text-muted outline-none focus:border-accent-primary"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
