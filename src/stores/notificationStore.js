import { create } from "zustand";
import useTaskStore from "./taskStore";
import useGoalStore from "./goalStore";
import useTimeStore from "./timeStore";

const useNotificationStore = create((set, get) => ({
  notifications: [], // {id, type, message, date}
  loading: false,

  // ================= GENERATE NOTIFICATIONS =================
  generateNotifications: () => {
    set({ loading: true });
    const tasks = useTaskStore.getState().tasks;
    const goals = useGoalStore.getState().goals;
    const sessions = useTimeStore.getState().sessions;

    const notifications = [];

    const now = new Date();

    // ----- TASK DEADLINE -----
    tasks.forEach((task) => {
      if (!task.dueDate || task.status === "done") return;

      const due = task.dueDate.toDate
        ? task.dueDate.toDate()
        : new Date(task.dueDate);
      const diffHours = (due - now) / (1000 * 60 * 60);

      if (diffHours <= 24 && diffHours > 0) {
        notifications.push({
          id: `task-${task.id}`,
          type: "taskDeadline",
          message: `Task "${task.title}" is due within 24h!`,
          date: now,
        });
      } else if (diffHours <= 0) {
        notifications.push({
          id: `task-${task.id}-overdue`,
          type: "taskOverdue",
          message: `Task "${task.title}" is overdue!`,
          date: now,
        });
      }
    });

    // ----- GOAL DEADLINE -----
    goals.forEach((goal) => {
      if (!goal.dueDate) return;

      const due = goal.dueDate.toDate
        ? goal.dueDate.toDate()
        : new Date(goal.dueDate);
      const diffHours = (due - now) / (1000 * 60 * 60);

      if (diffHours <= 48 && diffHours > 0) {
        notifications.push({
          id: `goal-${goal.id}`,
          type: "goalReminder",
          message: `Goal "${goal.title}" is due within 48h!`,
          date: now,
        });
      }
    });

    // ----- INACTIVITY -----
    const lastSession = sessions.length
      ? sessions[sessions.length - 1].endTime?.toDate
        ? sessions[sessions.length - 1].endTime.toDate()
        : new Date(sessions[sessions.length - 1].endTime)
      : null;

    if (lastSession) {
      const diffHours = (now - lastSession) / (1000 * 60 * 60);
      if (diffHours >= 24) {
        notifications.push({
          id: "inactivity",
          type: "inactivity",
          message: `You have not studied for ${Math.floor(diffHours)} hours!`,
          date: now,
        });
      }
    }

    set({ notifications, loading: false });
  },

  // ================= CLEAR NOTIFICATIONS =================
  clearNotifications: () => set({ notifications: [] }),
}));

export default useNotificationStore;
