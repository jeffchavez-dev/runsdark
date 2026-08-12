"use client";

import { trpc } from "@/lib/trpc/client";
import { useState } from "react";
import { Plus, Trash2, Check } from "lucide-react";

export default function DocketPage({ params }: { params: { clientId: string } }) {
  const [newTaskTitle, setNewTaskTitle] = useState("");
  const utils = trpc.useUtils();

  // Fetch tasks for this client
  const { data: tasks = [], isLoading } = trpc.docket.listTasks.useQuery({
    clientId: params.clientId,
  });

  // Mutations
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

  const deleteTaskMutation = trpc.docket.deleteTask.useMutation({
    onSuccess: () => {
      utils.docket.listTasks.invalidate();
    },
  });

  const handleCreateTask = () => {
    if (!newTaskTitle.trim()) return;
    createTaskMutation.mutate({
      clientId: params.clientId,
      title: newTaskTitle,
    });
  };

  const handleStatusCycle = (taskId: string, currentStatus: string) => {
    const statusOrder = [
      "not_started",
      "in_progress",
      "pending",
      "action_required",
      "done",
    ];
    const currentIndex = statusOrder.indexOf(currentStatus);
    const nextStatus = statusOrder[(currentIndex + 1) % statusOrder.length];

    updateStatusMutation.mutate({
      taskId,
      status: nextStatus as any,
    });
  };

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      not_started: "text-text-muted",
      in_progress: "text-accent-primary",
      pending: "text-yellow-500",
      action_required: "text-status-danger",
      done: "text-status-success",
    };
    return colors[status] || "text-text-muted";
  };

  const getStatusLabel = (status: string) => {
    const labels: Record<string, string> = {
      not_started: "Unstarted",
      in_progress: "Underway",
      pending: "On Hold",
      action_required: "Needs Attention",
      done: "Closed Out",
    };
    return labels[status] || status;
  };

  if (isLoading)
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-text-secondary">Loading tasks...</p>
      </div>
    );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-white">Docket</h1>
        <p className="text-text-secondary mt-2">Task tracker for this client</p>
      </div>

      {/* Add Task */}
      <div className="flex gap-2">
        <input
          type="text"
          value={newTaskTitle}
          onChange={(e) => setNewTaskTitle(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") handleCreateTask();
          }}
          placeholder="Add a new task..."
          className="flex-1 px-4 py-3 rounded-lg bg-bg-surface border border-bg-border text-white placeholder-text-muted focus:border-accent-primary focus:outline-none transition-colors"
        />
        <button
          onClick={handleCreateTask}
          disabled={createTaskMutation.isPending}
          className="px-4 py-3 bg-accent-primary text-white rounded-lg font-semibold hover:bg-blue-600 disabled:opacity-50 transition-smooth flex items-center gap-2"
        >
          <Plus className="w-5 h-5" />
          Add
        </button>
      </div>

      {/* Tasks List */}
      {tasks.length === 0 ? (
        <div className="p-12 rounded-lg bg-bg-surface border border-bg-border text-center">
          <p className="text-text-secondary">No tasks yet. Add one above to get started!</p>
        </div>
      ) : (
        <div className="space-y-2">
          {tasks.map((task: any) => (
            <div
              key={task.id}
              className="p-4 rounded-lg bg-bg-surface border border-bg-border hover:border-bg-border transition-colors flex items-start gap-3 group"
            >
              {/* Status indicator */}
              <button
                onClick={() => handleStatusCycle(task.id, task.status)}
                className={`flex-shrink-0 w-8 h-8 rounded-full border-2 flex items-center justify-center mt-0.5 cursor-pointer hover:scale-110 transition-transform ${
                  task.status === "done"
                    ? "bg-status-success/20 border-status-success text-status-success"
                    : `border-${getStatusColor(task.status)} ${getStatusColor(task.status)}`
                }`}
                title="Click to change status"
              >
                {task.status === "done" && <Check className="w-4 h-4" />}
              </button>

              {/* Task content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <p className={task.status === "done" ? "line-through text-text-muted" : "text-white"}>
                    {task.title}
                  </p>
                </div>
                <p className="text-xs text-text-muted">
                  {getStatusLabel(task.status)} · {task.subtasks?.length || 0} steps
                </p>
              </div>

              {/* Delete button */}
              <button
                onClick={() => deleteTaskMutation.mutate({ taskId: task.id })}
                disabled={deleteTaskMutation.isPending}
                className="opacity-0 group-hover:opacity-100 transition-opacity p-2 text-text-muted hover:text-status-danger"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 pt-8 border-t border-bg-border">
        <div className="p-4 rounded-lg bg-bg-surface">
          <p className="text-text-secondary text-sm">Total Tasks</p>
          <p className="text-2xl font-bold text-white mt-2">{tasks.length}</p>
        </div>
        <div className="p-4 rounded-lg bg-bg-surface">
          <p className="text-text-secondary text-sm">In Progress</p>
          <p className="text-2xl font-bold text-white mt-2">
            {tasks.filter((t: any) => t.status === "in_progress").length}
          </p>
        </div>
        <div className="p-4 rounded-lg bg-bg-surface">
          <p className="text-text-secondary text-sm">Completed</p>
          <p className="text-2xl font-bold text-white mt-2">
            {tasks.filter((t: any) => t.status === "done").length}
          </p>
        </div>
      </div>
    </div>
  );
}
