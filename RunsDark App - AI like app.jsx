import { useState, useEffect, useRef, useMemo } from "react";
import {
  ChevronRight, ChevronDown, Star, Circle, RefreshCw, MoreHorizontal,
  Search, Plus, X, MessageSquare, Trash2, CheckCircle2, AlertTriangle,
  Layers, Inbox, ListChecks, Clock3, Tag as TagIcon
} from "lucide-react";

const STORAGE_KEY = "queue:tasks";

const STATUS = {
  not_started: { label: "Unstarted", order: 0 },
  in_progress: { label: "Underway", order: 1 },
  pending: { label: "On Hold", order: 2 },
  action_required: { label: "Needs Attention", order: 3 },
  done: { label: "Closed Out", order: 4 },
};

const PRIORITY = {
  p0: { label: "P0", color: "var(--p0)" },
  p1: { label: "P1", color: "var(--p1)" },
  p2: { label: "P2", color: "var(--p2)" },
};

function uid() {
  return Math.random().toString(36).slice(2, 10);
}

function todayISO() {
  return new Date().toISOString();
}

function fmtDate(iso) {
  if (!iso) return "";
  const d = new Date(iso);
  const now = new Date();
  const diffMs = now - d;
  const diffMin = Math.round(diffMs / 60000);
  if (diffMin < 60 && diffMin >= 0) return `${Math.max(diffMin, 0)}m ago`;
  const diffH = Math.round(diffMin / 60);
  if (diffH < 24 && diffH >= 0) return `${diffH}h ago`;
  return d.toLocaleDateString(undefined, { month: "short", day: "numeric" });
}

const seedTasks = () => [
  {
    id: uid(),
    title: "Draft LinkedIn repurpose of latest essay",
    status: "in_progress",
    priority: "p1",
    starred: true,
    due: null,
    createdAt: todayISO(),
    completedAt: null,
    description: "",
    tags: ["needs GF's eyes"],
    subtasks: [
      { id: uid(), title: "Pull key quotes from essay", done: true },
      { id: uid(), title: "Draft hook + 3 variations", done: false },
      { id: uid(), title: "Send for review", done: false },
    ],
    comments: [],
  },
  {
    id: uid(),
    title: "Fibery dashboard cleanup",
    status: "not_started",
    priority: "p2",
    starred: false,
    due: null,
    createdAt: todayISO(),
    completedAt: null,
    description: "",
    tags: ["schedule"],
    subtasks: [],
    comments: [],
  },
  {
    id: uid(),
    title: "Reschedule intern onboarding call",
    status: "action_required",
    priority: "p0",
    starred: false,
    due: null,
    createdAt: todayISO(),
    completedAt: null,
    description: "",
    tags: [],
    subtasks: [],
    comments: [{ id: uid(), text: "Waiting on their reply to the last two slots.", createdAt: todayISO() }],
  },
];

export default function QueueApp() {
  const [tasks, setTasks] = useState([]);
  const [loaded, setLoaded] = useState(false);
  const [view, setView] = useState("queue"); // queue | all | recaps
  const [query, setQuery] = useState("");
  const [groupBy, setGroupBy] = useState("status");
  const [groupMenuOpen, setGroupMenuOpen] = useState(false);
  const [selectedId, setSelectedId] = useState(null);
  const [collapsedGroups, setCollapsedGroups] = useState({});
  const [expandedTasks, setExpandedTasks] = useState({});
  const [newTaskText, setNewTaskText] = useState("");
  const [subtaskDrafts, setSubtaskDrafts] = useState({});
  const [commentDrafts, setCommentDrafts] = useState({});
  const [recapPreset, setRecapPreset] = useState("7");
  const [recapStart, setRecapStart] = useState("");
  const [recapEnd, setRecapEnd] = useState("");
  const menuRef = useRef(null);

  // load
  useEffect(() => {
    (async () => {
      try {
        const res = await window.storage.get(STORAGE_KEY, false);
        const parsed = res ? JSON.parse(res.value) : null;
        setTasks(parsed && parsed.length ? parsed : seedTasks());
      } catch {
        setTasks(seedTasks());
      } finally {
        setLoaded(true);
      }
    })();
  }, []);

  // save
  useEffect(() => {
    if (!loaded) return;
    window.storage.set(STORAGE_KEY, JSON.stringify(tasks), false).catch(() => {});
  }, [tasks, loaded]);

  useEffect(() => {
    function onClick(e) {
      if (menuRef.current && !menuRef.current.contains(e.target)) setGroupMenuOpen(false);
    }
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  const selected = tasks.find((t) => t.id === selectedId) || null;

  function patchTask(id, patch) {
    setTasks((ts) => ts.map((t) => (t.id === id ? { ...t, ...patch } : t)));
  }

  function addTask(title) {
    const trimmed = title.trim();
    if (!trimmed) return;
    const t = {
      id: uid(),
      title: trimmed,
      status: "not_started",
      priority: null,
      starred: false,
      due: null,
      createdAt: todayISO(),
      completedAt: null,
      description: "",
      tags: [],
      subtasks: [],
      comments: [],
    };
    setTasks((ts) => [t, ...ts]);
    setNewTaskText("");
  }

  function deleteTask(id) {
    setTasks((ts) => ts.filter((t) => t.id !== id));
    if (selectedId === id) setSelectedId(null);
  }

  function setStatus(id, status) {
    patchTask(id, {
      status,
      completedAt: status === "done" ? todayISO() : null,
    });
  }

  function toggleStar(id) {
    setTasks((ts) => ts.map((t) => (t.id === id ? { ...t, starred: !t.starred } : t)));
  }

  function addSubtask(taskId, title) {
    const trimmed = (title || "").trim();
    if (!trimmed) return;
    setTasks((ts) =>
      ts.map((t) =>
        t.id === taskId
          ? { ...t, subtasks: [...t.subtasks, { id: uid(), title: trimmed, done: false }] }
          : t
      )
    );
    setSubtaskDrafts((d) => ({ ...d, [taskId]: "" }));
  }

  function toggleSubtask(taskId, subId) {
    setTasks((ts) =>
      ts.map((t) =>
        t.id === taskId
          ? {
              ...t,
              subtasks: t.subtasks.map((s) => (s.id === subId ? { ...s, done: !s.done } : s)),
            }
          : t
      )
    );
  }

  function deleteSubtask(taskId, subId) {
    setTasks((ts) =>
      ts.map((t) =>
        t.id === taskId ? { ...t, subtasks: t.subtasks.filter((s) => s.id !== subId) } : t
      )
    );
  }

  function addComment(taskId, text) {
    const trimmed = (text || "").trim();
    if (!trimmed) return;
    setTasks((ts) =>
      ts.map((t) =>
        t.id === taskId
          ? { ...t, comments: [...t.comments, { id: uid(), text: trimmed, createdAt: todayISO() }] }
          : t
      )
    );
    setCommentDrafts((d) => ({ ...d, [taskId]: "" }));
  }

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return tasks.filter((t) => (q ? t.title.toLowerCase().includes(q) : true));
  }, [tasks, query]);

  const queueTasks = filtered.filter((t) => t.status !== "done");
  const listForView = view === "all" ? filtered : queueTasks;

  function groupKeyOf(t) {
    if (groupBy === "status") return t.status;
    if (groupBy === "priority") return t.priority || "none";
    if (groupBy === "due") return t.due ? "scheduled" : "no_due";
    return "all";
  }

  function groupLabel(key) {
    if (groupBy === "status") return STATUS[key]?.label || key;
    if (groupBy === "priority") return key === "none" ? "Unranked" : PRIORITY[key]?.label;
    if (groupBy === "due") return key === "scheduled" ? "Dated" : "No date yet";
    return "Everything";
  }

  const groups = useMemo(() => {
    if (groupBy === "none") return [{ key: "all", items: listForView }];
    const map = {};
    listForView.forEach((t) => {
      const k = groupKeyOf(t);
      (map[k] = map[k] || []).push(t);
    });
    const orderKeys =
      groupBy === "status"
        ? Object.keys(STATUS).filter((k) => (view === "all" ? true : k !== "done"))
        : Object.keys(map);
    return orderKeys.filter((k) => map[k]).map((k) => ({ key: k, items: map[k] }));
  }, [listForView, groupBy, view]);

  const completedTasks = tasks
    .filter((t) => t.status === "done" && t.completedAt)
    .sort((a, b) => new Date(b.completedAt) - new Date(a.completedAt));

  const recapFiltered = useMemo(() => {
    if (recapPreset === "all") return completedTasks;
    if (recapPreset === "custom") {
      if (!recapStart && !recapEnd) return completedTasks;
      const startMs = recapStart ? new Date(recapStart + "T00:00:00").getTime() : -Infinity;
      const endMs = recapEnd ? new Date(recapEnd + "T23:59:59").getTime() : Infinity;
      return completedTasks.filter((t) => {
        const ms = new Date(t.completedAt).getTime();
        return ms >= startMs && ms <= endMs;
      });
    }
    const days = parseInt(recapPreset, 10);
    const cutoff = Date.now() - days * 24 * 60 * 60 * 1000;
    return completedTasks.filter((t) => new Date(t.completedAt).getTime() >= cutoff);
  }, [completedTasks, recapPreset, recapStart, recapEnd]);

  const recapDays = useMemo(() => {
    const byDay = {};
    recapFiltered.forEach((t) => {
      const key = new Date(t.completedAt).toDateString();
      (byDay[key] = byDay[key] || []).push(t);
    });
    return Object.entries(byDay);
  }, [recapFiltered]);

  const recapPresets = [
    { key: "1", label: "Today" },
    { key: "7", label: "Past week" },
    { key: "30", label: "Past month" },
    { key: "all", label: "Everything" },
    { key: "custom", label: "Pick dates" },
  ];

  function StatusIcon({ status, size = 15 }) {
    if (status === "done") return <CheckCircle2 size={size} style={{ color: "var(--p2)" }} />;
    if (status === "in_progress")
      return <RefreshCw size={size} style={{ color: "var(--accent)" }} />;
    if (status === "pending")
      return <Clock3 size={size} style={{ color: "var(--pending)" }} />;
    if (status === "action_required")
      return <AlertTriangle size={size} style={{ color: "var(--p0)" }} />;
    return <Circle size={size} style={{ color: "var(--text-faint)" }} />;
  }

  function cycleStatus(t) {
    const order = ["not_started", "in_progress", "pending", "action_required", "done"];
    const idx = order.indexOf(t.status);
    const next = order[(idx + 1) % order.length];
    setStatus(t.id, next);
  }

  const navItems = [
    { key: "queue", label: "Open Items", icon: Inbox },
    { key: "recaps", label: "Wrap-ups", icon: ListChecks },
    { key: "all", label: "Everything", icon: Layers },
  ];

  return (
    <div className="qapp">
      <style>{`
        .qapp {
          --bg: #0b0d10;
          --surface: #14171c;
          --surface-2: #1a1e25;
          --border: #262b33;
          --text: #e7e9ed;
          --text-dim: #9aa0ab;
          --text-faint: #565c68;
          --accent: #6fd8c4;
          --accent-dim: #2c4740;
          --p0: #f0575a;
          --p1: #f2ac3d;
          --p2: #4ade93;
          --pending: #d7ad63;
          font-family: ui-sans-serif, Inter, system-ui, -apple-system, sans-serif;
          background: var(--bg);
          color: var(--text);
          display: flex;
          height: 100%;
          min-height: 640px;
          border-radius: 10px;
          overflow: hidden;
          border: 1px solid var(--border);
        }
        .qapp * { box-sizing: border-box; }
        .qsidebar {
          width: 220px;
          flex-shrink: 0;
          background: var(--surface);
          border-right: 1px solid var(--border);
          display: flex;
          flex-direction: column;
          padding: 18px 14px;
        }
        .qwordmark {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 15px;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          font-weight: 700;
          color: var(--text);
          margin-bottom: 22px;
          padding-left: 2px;
        }
        .qdot {
          width: 9px; height: 9px; border-radius: 50%;
          background: var(--p0);
          animation: qpulse 3.2s infinite;
          flex-shrink: 0;
        }
        @keyframes qpulse {
          0% { background: var(--p0); }
          25% { background: var(--p1); }
          55% { background: var(--accent); }
          80% { background: var(--p2); }
          100% { background: var(--p0); }
        }
        .qnav-item {
          display: flex; align-items: center; gap: 10px;
          padding: 8px 10px; border-radius: 7px;
          font-size: 13.5px; color: var(--text-dim);
          cursor: pointer; margin-bottom: 2px;
          border: none; background: none; width: 100%; text-align: left;
        }
        .qnav-item:hover { background: var(--surface-2); color: var(--text); }
        .qnav-item.active { background: var(--accent-dim); color: var(--accent); font-weight: 600; }
        .qtags-title {
          font-size: 10.5px; letter-spacing: 0.1em; text-transform: uppercase;
          color: var(--text-faint); margin: 20px 0 8px 10px;
        }
        .qtag-row { display: flex; align-items: center; gap: 8px; padding: 5px 10px; font-size: 12.5px; color: var(--text-dim); }
        .qtag-dot { width: 7px; height: 7px; border-radius: 50%; }
        .qmain { flex: 1; display: flex; min-width: 0; }
        .qcenter { flex: 1; display: flex; flex-direction: column; min-width: 0; }
        .qtopbar { display: flex; align-items: center; gap: 10px; padding: 14px 18px; border-bottom: 1px solid var(--border); }
        .qsearch { flex: 1; display: flex; align-items: center; gap: 8px; background: var(--surface); border: 1px solid var(--border); border-radius: 8px; padding: 7px 10px; }
        .qsearch input { background: none; border: none; outline: none; color: var(--text); font-size: 13px; width: 100%; }
        .qsearch input::placeholder { color: var(--text-faint); }
        .qgroupbtn { position: relative; }
        .qgroupbtn button { display: flex; align-items: center; gap: 6px; background: var(--surface); border: 1px solid var(--border); color: var(--text-dim); font-size: 12.5px; padding: 7px 10px; border-radius: 8px; cursor: pointer; }
        .qgroupbtn button:hover { color: var(--text); }
        .qmenu { position: absolute; right: 0; top: 34px; background: var(--surface-2); border: 1px solid var(--border); border-radius: 8px; min-width: 150px; z-index: 20; overflow: hidden; box-shadow: 0 10px 30px rgba(0,0,0,0.4); }
        .qmenu button { display: block; width: 100%; text-align: left; padding: 8px 12px; font-size: 12.5px; color: var(--text-dim); background: none; border: none; cursor: pointer; }
        .qmenu button:hover { background: var(--surface); color: var(--text); }
        .qmenu button.active { color: var(--accent); }
        .qlist { flex: 1; overflow-y: auto; padding: 6px 18px 18px; }
        .qgroup-header { display: flex; align-items: center; gap: 8px; padding: 14px 4px 8px; cursor: pointer; user-select: none; }
        .qgroup-header .chev { color: var(--text-faint); transition: transform 0.15s; }
        .qgroup-header span.label { font-size: 13px; font-weight: 600; color: var(--text); }
        .qgroup-header span.count { font-size: 12px; color: var(--text-faint); }
        .qgroup-line { flex: 1; height: 1px; background: var(--border); }
        .qrow { display: flex; align-items: center; gap: 10px; padding: 9px 6px; border-radius: 7px; cursor: pointer; border: 1px solid transparent; }
        .qrow:hover { background: var(--surface); }
        .qrow.selected { background: var(--surface); border-color: var(--border); }
        .qrow .chev-btn { color: var(--text-faint); flex-shrink: 0; cursor: pointer; width: 14px; }
        .qrow .star-btn { flex-shrink: 0; cursor: pointer; }
        .qrow .status-btn { flex-shrink: 0; cursor: pointer; display: flex; }
        .qrow .title { flex: 1; font-size: 13.5px; color: var(--text); min-width: 0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
        .qrow .title.done { color: var(--text-faint); text-decoration: line-through; }
        .qpill { font-size: 10px; padding: 2px 7px; border-radius: 999px; font-weight: 600; flex-shrink: 0; }
        .qmeta { display: flex; align-items: center; gap: 12px; flex-shrink: 0; color: var(--text-faint); font-size: 11.5px; }
        .qmeta .comment { display: flex; align-items: center; gap: 3px; }
        .qmore { color: var(--text-faint); cursor: pointer; flex-shrink: 0; }
        .qmore:hover { color: var(--text); }
        .qsubtasks { padding-left: 42px; padding-bottom: 6px; }
        .qsubrow { display: flex; align-items: center; gap: 8px; padding: 5px 4px; font-size: 12.5px; color: var(--text-dim); }
        .qsubrow input[type=checkbox] { accent-color: var(--accent); }
        .qsubrow .done { text-decoration: line-through; color: var(--text-faint); }
        .qsubrow .del { margin-left: auto; color: var(--text-faint); cursor: pointer; opacity: 0; }
        .qsubrow:hover .del { opacity: 1; }
        .qaddsub { display: flex; gap: 8px; padding: 5px 4px; }
        .qaddsub input { flex: 1; background: none; border: none; outline: none; color: var(--text-dim); font-size: 12.5px; }
        .qaddsub input::placeholder { color: var(--text-faint); }
        .qfooter { border-top: 1px solid var(--border); padding: 12px 18px; }
        .qaddtask { display: flex; align-items: center; gap: 10px; background: var(--surface); border: 1px solid var(--border); border-radius: 9px; padding: 10px 12px; }
        .qaddtask input { flex: 1; background: none; border: none; outline: none; color: var(--text); font-size: 13.5px; }
        .qaddtask input::placeholder { color: var(--text-faint); }
        .qdetail { width: 340px; flex-shrink: 0; border-left: 1px solid var(--border); background: var(--surface); padding: 20px; overflow-y: auto; }
        .qdetail h2 { font-size: 17px; font-weight: 700; margin: 0 0 14px; border: none; background: none; color: var(--text); width: 100%; outline: none; font-family: inherit; }
        .qdetail-close { float: right; color: var(--text-faint); cursor: pointer; }
        .qdetail textarea { width: 100%; background: var(--surface-2); border: 1px solid var(--border); border-radius: 8px; color: var(--text-dim); font-size: 12.5px; padding: 10px; resize: vertical; min-height: 60px; outline: none; font-family: inherit; }
        .qsection { margin-top: 20px; }
        .qsection-title { font-size: 11px; text-transform: uppercase; letter-spacing: 0.08em; color: var(--text-faint); margin-bottom: 10px; }
        .qproprow { display: flex; align-items: center; justify-content: space-between; padding: 6px 0; font-size: 12.5px; color: var(--text-dim); }
        .qproprow select { background: var(--surface-2); border: 1px solid var(--border); color: var(--text); font-size: 12px; padding: 4px 6px; border-radius: 6px; outline: none; }
        .qcomment { background: var(--surface-2); border: 1px solid var(--border); border-radius: 8px; padding: 8px 10px; font-size: 12.5px; color: var(--text-dim); margin-bottom: 8px; }
        .qcomment-time { font-size: 10.5px; color: var(--text-faint); margin-top: 4px; }
        .qcommentinput { display: flex; gap: 6px; }
        .qcommentinput input { flex: 1; background: var(--surface-2); border: 1px solid var(--border); border-radius: 8px; padding: 8px 10px; color: var(--text); font-size: 12.5px; outline: none; }
        .qempty { color: var(--text-faint); font-size: 13px; padding: 30px 6px; text-align: center; }
        .qrecap-presets { display: flex; gap: 6px; flex-wrap: wrap; }
        .qrecap-preset { background: var(--surface); border: 1px solid var(--border); color: var(--text-dim); font-size: 12px; padding: 6px 11px; border-radius: 999px; cursor: pointer; }
        .qrecap-preset:hover { color: var(--text); }
        .qrecap-preset.active { background: var(--accent-dim); border-color: var(--accent); color: var(--accent); }
        .qrecap-customrange { display: flex; align-items: center; gap: 8px; }
        .qrecap-customrange input[type=date] { background: var(--surface); border: 1px solid var(--border); color: var(--text); font-size: 12px; padding: 5px 8px; border-radius: 7px; outline: none; }
        .qrecap-day { margin-bottom: 22px; }
        .qrecap-day h3 { font-size: 13px; color: var(--text); margin: 0 0 8px; }
        .qrecap-item { display: flex; align-items: center; gap: 8px; font-size: 13px; color: var(--text-dim); padding: 5px 0; }
        .qscroll::-webkit-scrollbar { width: 8px; }
        .qscroll::-webkit-scrollbar-thumb { background: var(--border); border-radius: 4px; }
        @media (max-width: 760px) {
          .qapp { flex-direction: column; height: auto; }
          .qsidebar { width: 100%; flex-direction: row; overflow-x: auto; padding: 10px; }
          .qdetail { width: 100%; border-left: none; border-top: 1px solid var(--border); }
        }
      `}</style>

      <div className="qsidebar">
        <div className="qwordmark">
          <span className="qdot" />
          Docket
        </div>
        {navItems.map((n) => {
          const Icon = n.icon;
          return (
            <button
              key={n.key}
              className={"qnav-item" + (view === n.key ? " active" : "")}
              onClick={() => setView(n.key)}
            >
              <Icon size={15} />
              {n.label}
            </button>
          );
        })}
        <div className="qtags-title">Urgency</div>
        <div className="qtag-row"><span className="qtag-dot" style={{ background: "var(--p0)" }} />P0 · on fire</div>
        <div className="qtag-row"><span className="qtag-dot" style={{ background: "var(--p1)" }} />P1 · this week</div>
        <div className="qtag-row"><span className="qtag-dot" style={{ background: "var(--p2)" }} />P2 · someday</div>
      </div>

      <div className="qmain">
        <div className="qcenter">
          {view !== "recaps" && (
            <div className="qtopbar">
              <div className="qsearch">
                <Search size={14} color="var(--text-faint)" />
                <input
                  placeholder="Search open items"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                />
              </div>
              <div className="qgroupbtn" ref={menuRef}>
                <button onClick={() => setGroupMenuOpen((o) => !o)}>
                  Sort: {groupBy === "none" ? "flat list" : groupBy}
                  <ChevronDown size={13} />
                </button>
                {groupMenuOpen && (
                  <div className="qmenu">
                    {["status", "priority", "due", "none"].map((g) => (
                      <button
                        key={g}
                        className={groupBy === g ? "active" : ""}
                        onClick={() => {
                          setGroupBy(g);
                          setGroupMenuOpen(false);
                        }}
                      >
                        {g === "none" ? "Flat list" : `By ${g}`}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {view === "recaps" && (
            <div className="qtopbar" style={{ flexWrap: "wrap" }}>
              <div className="qrecap-presets">
                {recapPresets.map((p) => (
                  <button
                    key={p.key}
                    className={"qrecap-preset" + (recapPreset === p.key ? " active" : "")}
                    onClick={() => setRecapPreset(p.key)}
                  >
                    {p.label}
                  </button>
                ))}
              </div>
              {recapPreset === "custom" && (
                <div className="qrecap-customrange">
                  <input
                    type="date"
                    value={recapStart}
                    onChange={(e) => setRecapStart(e.target.value)}
                  />
                  <span style={{ color: "var(--text-faint)" }}>to</span>
                  <input
                    type="date"
                    value={recapEnd}
                    onChange={(e) => setRecapEnd(e.target.value)}
                  />
                </div>
              )}
            </div>
          )}

          {view !== "recaps" ? (
            <div className="qlist qscroll">
              {groups.length === 0 && <div className="qempty">Clear for now — log something below whenever it comes up.</div>}
              {groups.map((g) => {
                const isCollapsed = collapsedGroups[g.key];
                return (
                  <div key={g.key}>
                    {groupBy !== "none" && (
                      <div
                        className="qgroup-header"
                        onClick={() =>
                          setCollapsedGroups((c) => ({ ...c, [g.key]: !c[g.key] }))
                        }
                      >
                        <ChevronDown
                          size={14}
                          className="chev"
                          style={{ transform: isCollapsed ? "rotate(-90deg)" : "none" }}
                        />
                        <span className="label">{groupLabel(g.key)}</span>
                        <span className="count">· {g.items.length}</span>
                        <div className="qgroup-line" />
                      </div>
                    )}
                    {!isCollapsed &&
                      g.items.map((t) => (
                        <div key={t.id}>
                          <div
                            className={"qrow" + (selectedId === t.id ? " selected" : "")}
                            onClick={() => setSelectedId(t.id)}
                          >
                            <span
                              className="chev-btn"
                              onClick={(e) => {
                                e.stopPropagation();
                                setExpandedTasks((x) => ({ ...x, [t.id]: !x[t.id] }));
                              }}
                            >
                              {t.subtasks.length > 0 && (
                                <ChevronRight
                                  size={13}
                                  style={{
                                    transform: expandedTasks[t.id] ? "rotate(90deg)" : "none",
                                  }}
                                />
                              )}
                            </span>
                            <span
                              className="star-btn"
                              onClick={(e) => {
                                e.stopPropagation();
                                toggleStar(t.id);
                              }}
                            >
                              <Star
                                size={14}
                                fill={t.starred ? "var(--p1)" : "none"}
                                color={t.starred ? "var(--p1)" : "var(--text-faint)"}
                              />
                            </span>
                            <span
                              className="status-btn"
                              onClick={(e) => {
                                e.stopPropagation();
                                cycleStatus(t);
                              }}
                              title="Click to move it to the next stage"
                            >
                              <StatusIcon status={t.status} />
                            </span>
                            <span className={"title" + (t.status === "done" ? " done" : "")}>
                              {t.title}
                            </span>
                            {t.priority && (
                              <span
                                className="qpill"
                                style={{
                                  color: PRIORITY[t.priority].color,
                                  background: "rgba(255,255,255,0.06)",
                                }}
                              >
                                {PRIORITY[t.priority].label}
                              </span>
                            )}
                            <div className="qmeta">
                              {t.comments.length > 0 && (
                                <span className="comment">
                                  <MessageSquare size={12} /> {t.comments.length}
                                </span>
                              )}
                              <span>{fmtDate(t.createdAt)}</span>
                            </div>
                            <span
                              className="qmore"
                              onClick={(e) => {
                                e.stopPropagation();
                                deleteTask(t.id);
                              }}
                              title="Remove this item"
                            >
                              <Trash2 size={13} />
                            </span>
                          </div>
                          {expandedTasks[t.id] && (
                            <div className="qsubtasks">
                              {t.subtasks.map((s) => (
                                <div className="qsubrow" key={s.id}>
                                  <input
                                    type="checkbox"
                                    checked={s.done}
                                    onChange={() => toggleSubtask(t.id, s.id)}
                                  />
                                  <span className={s.done ? "done" : ""}>{s.title}</span>
                                  <span
                                    className="del"
                                    onClick={() => deleteSubtask(t.id, s.id)}
                                  >
                                    <X size={12} />
                                  </span>
                                </div>
                              ))}
                              <div className="qaddsub">
                                <Plus size={12} color="var(--text-faint)" />
                                <input
                                  placeholder="Add a step"
                                  value={subtaskDrafts[t.id] || ""}
                                  onChange={(e) =>
                                    setSubtaskDrafts((d) => ({ ...d, [t.id]: e.target.value }))
                                  }
                                  onKeyDown={(e) => {
                                    if (e.key === "Enter") addSubtask(t.id, subtaskDrafts[t.id]);
                                  }}
                                />
                              </div>
                            </div>
                          )}
                        </div>
                      ))}
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="qlist qscroll">
              {recapDays.length === 0 && (
                <div className="qempty">
                  {completedTasks.length === 0
                    ? "Nothing wrapped up yet — closed items will land here."
                    : "Nothing closed out in that window."}
                </div>
              )}
              {recapDays.map(([day, items]) => (
                <div className="qrecap-day" key={day}>
                  <h3>{new Date(day).toLocaleDateString(undefined, { weekday: "long", month: "short", day: "numeric" })}</h3>
                  {items.map((t) => (
                    <div className="qrecap-item" key={t.id}>
                      <CheckCircle2 size={14} style={{ color: "var(--p2)" }} />
                      {t.title}
                    </div>
                  ))}
                </div>
              ))}
            </div>
          )}

          {view !== "recaps" && (
            <div className="qfooter">
              <div className="qaddtask">
                <Plus size={15} color="var(--text-faint)" />
                <input
                  placeholder="Log a new item"
                  value={newTaskText}
                  onChange={(e) => setNewTaskText(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") addTask(newTaskText);
                  }}
                />
              </div>
            </div>
          )}
        </div>

        {selected && (
          <div className="qdetail qscroll">
            <span className="qdetail-close" onClick={() => setSelectedId(null)}>
              <X size={16} />
            </span>
            <input
              value={selected.title}
              onChange={(e) => patchTask(selected.id, { title: e.target.value })}
              style={{
                fontSize: 17,
                fontWeight: 700,
                background: "none",
                border: "none",
                color: "var(--text)",
                width: "100%",
                outline: "none",
                fontFamily: "inherit",
                marginBottom: 14,
                marginTop: 4,
              }}
            />
            <textarea
              placeholder="Notes for yourself..."
              value={selected.description}
              onChange={(e) => patchTask(selected.id, { description: e.target.value })}
            />

            <div className="qsection">
              <div className="qsection-title">Details</div>
              <div className="qproprow">
                <span>Stage</span>
                <select
                  value={selected.status}
                  onChange={(e) => setStatus(selected.id, e.target.value)}
                >
                  {Object.entries(STATUS).map(([k, v]) => (
                    <option key={k} value={k}>{v.label}</option>
                  ))}
                </select>
              </div>
              <div className="qproprow">
                <span>Urgency</span>
                <select
                  value={selected.priority || ""}
                  onChange={(e) => patchTask(selected.id, { priority: e.target.value || null })}
                >
                  <option value="">Unranked</option>
                  <option value="p0">P0</option>
                  <option value="p1">P1</option>
                  <option value="p2">P2</option>
                </select>
              </div>
            </div>

            <div className="qsection">
              <div className="qsection-title">
                Steps {selected.subtasks.length > 0 && `· ${selected.subtasks.filter((s) => s.done).length}/${selected.subtasks.length}`}
              </div>
              {selected.subtasks.map((s) => (
                <div className="qsubrow" key={s.id} style={{ paddingLeft: 0 }}>
                  <input type="checkbox" checked={s.done} onChange={() => toggleSubtask(selected.id, s.id)} />
                  <span className={s.done ? "done" : ""}>{s.title}</span>
                  <span className="del" onClick={() => deleteSubtask(selected.id, s.id)}>
                    <X size={12} />
                  </span>
                </div>
              ))}
              <div className="qaddsub" style={{ paddingLeft: 0 }}>
                <Plus size={12} color="var(--text-faint)" />
                <input
                  placeholder="Add a step"
                  value={subtaskDrafts[selected.id] || ""}
                  onChange={(e) => setSubtaskDrafts((d) => ({ ...d, [selected.id]: e.target.value }))}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") addSubtask(selected.id, subtaskDrafts[selected.id]);
                  }}
                />
              </div>
            </div>

            <div className="qsection">
              <div className="qsection-title">Updates · {selected.comments.length}</div>
              {selected.comments.map((c) => (
                <div className="qcomment" key={c.id}>
                  {c.text}
                  <div className="qcomment-time">{fmtDate(c.createdAt)}</div>
                </div>
              ))}
              <div className="qcommentinput">
                <input
                  placeholder="Leave an update"
                  value={commentDrafts[selected.id] || ""}
                  onChange={(e) => setCommentDrafts((d) => ({ ...d, [selected.id]: e.target.value }))}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") addComment(selected.id, commentDrafts[selected.id]);
                  }}
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
