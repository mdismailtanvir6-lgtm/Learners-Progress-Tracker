import { create } from "zustand";
import { startSession, stopSession } from "../services/timeService";

const useTimeStore = create((set, get) => ({
  sessions: [], // all task sessions
  runningSessions: {}, // taskId => sessionId
  loading: false,
  error: null,

  // ================= START TIMER =================
  startTimer: async (userId, taskId) => {
    set({ loading: true, error: null });
    try {
      const docRef = await startSession(userId, taskId);
      set((state) => ({
        runningSessions: {
          ...state.runningSessions,
          [taskId]: docRef.id
        },
        loading: false
      }));
    } catch (err) {
      set({ error: err.message, loading: false });
    }
  },

  // ================= STOP TIMER =================
  stopTimer: async (taskId) => {
    set({ loading: true, error: null });
    try {
      const sessionId = get().runningSessions[taskId];
      if (!sessionId) throw new Error("Timer not running for this task");

      await stopSession(sessionId);

      // Remove from runningSessions
      set((state) => {
        const updatedRunning = { ...state.runningSessions };
        delete updatedRunning[taskId];
        return {
          runningSessions: updatedRunning,
          loading: false
        };
      });
    } catch (err) {
      set({ error: err.message, loading: false });
    }
  },

  // ================= CLEAR STORE =================
  clearAll: () => {
    set({ sessions: [], runningSessions: {}, loading: false, error: null });
  }
}));

export default useTimeStore;
