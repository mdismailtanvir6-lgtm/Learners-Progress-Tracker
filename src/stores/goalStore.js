import { create } from "zustand";
import { createGoal, getUserGoals, updateGoal, deleteGoal } from "../services/goalService";

const useGoalStore = create((set, get) => ({
  goals: [],
  loading: false,
  error: null,

  // ================= FETCH USER GOALS =================
  fetchGoals: async (userId) => {
    set({ loading: true, error: null });
    try {
      const goals = await getUserGoals(userId);
      set({ goals, loading: false });
    } catch (err) {
      set({ error: err.message, loading: false });
    }
  },

  // ================= CREATE GOAL =================
  addGoal: async (userId, goalData) => {
    set({ error: null });
    try {
      await createGoal(userId, goalData);
      await get().fetchGoals(userId);
    } catch (err) {
      set({ error: err.message });
    }
  },

  // ================= UPDATE GOAL =================
  updateGoalData: async (goalId, updatedData, userId) => {
    set({ error: null });
    try {
      await updateGoal(goalId, updatedData);
      await get().fetchGoals(userId);
    } catch (err) {
      set({ error: err.message });
    }
  },

  // ================= SOFT DELETE GOAL =================
  removeGoal: async (goalId, userId) => {
    set({ error: null });
    try {
      await deleteGoal(goalId);
      await get().fetchGoals(userId);
    } catch (err) {
      set({ error: err.message });
    }
  },

  // ================= CLEAR STORE =================
  clearGoals: () => set({ goals: [], loading: false, error: null }),
}));

export default useGoalStore;
