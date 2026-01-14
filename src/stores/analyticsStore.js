import { create } from "zustand";
import useTaskStore from "./taskStore";
import useGoalStore from "./goalStore";
import useTimeStore from "./timeStore";

const useAnalyticsStore = create((set) => ({
  taskCompletionRate: 0,
  goalProgress: {},
  totalStudyTime: 0, // seconds
  dailyStudyTime: {}, // day => seconds
  weeklyStudyTime: 0,

  // ================= CALCULATE ANALYTICS =================
  computeAnalytics: () => {
    const tasks = useTaskStore.getState().tasks;
    const goals = useGoalStore.getState().goals;
    const sessions = useTimeStore.getState().sessions;

    // ----- TASK COMPLETION RATE -----
    const totalTasks = tasks.length;
    const doneTasks = tasks.filter((t) => t.status === "done").length;
    const taskCompletionRate = totalTasks ? (doneTasks / totalTasks) * 100 : 0;

    // ----- GOAL PROGRESS -----
    const goalProgress = {};
    goals.forEach((goal) => {
      if (!goal.taskIds || !goal.taskIds.length) {
        goalProgress[goal.id] = 0;
      } else {
        const completed = goal.taskIds.filter((tid) => {
          const task = tasks.find((t) => t.id === tid);
          return task?.status === "done";
        }).length;
        goalProgress[goal.id] = (completed / goal.taskIds.length) * 100;
      }
    });

    // ----- TOTAL STUDY TIME -----
    let totalStudyTime = 0;
    const dailyStudyTime = {};

    sessions.forEach((s) => {
      if (!s.duration) return;
      totalStudyTime += s.duration;

      const day = s.startTime?.toDate?.()
        ? s.startTime.toDate().toISOString().split("T")[0]
        : new Date().toISOString().split("T")[0];
      dailyStudyTime[day] = (dailyStudyTime[day] || 0) + s.duration;
    });

    // Weekly study time (last 7 days)
    const today = new Date();
    let weeklyStudyTime = 0;
    for (let i = 0; i < 7; i++) {
      const d = new Date(today);
      d.setDate(today.getDate() - i);
      const dayStr = d.toISOString().split("T")[0];
      weeklyStudyTime += dailyStudyTime[dayStr] || 0;
    }

    set({
      taskCompletionRate,
      goalProgress,
      totalStudyTime,
      dailyStudyTime,
      weeklyStudyTime,
    });
  },
}));

export default useAnalyticsStore;
