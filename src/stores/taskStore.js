import { create } from "zustand";
import {
  createTask,
  getUserTasks,
  updateTask,
  updateTaskStatus,
  deleteTask,
} from "../services/taskService";

const useTaskStore = create((set, get) => ({
  tasks: [],
  loading: false,
  error: null,

  // ================= FETCH TASKS =================
  fetchTasks: async (userId) => {
    set({ loading: true, error: null });

    try {
      const tasks = await getUserTasks(userId);
      set({ tasks, loading: false });
    } catch (error) {
      set({ error: error.message, loading: false });
    }
  },

  // ================= ADD TASK =================
  addTask: async (userId, taskData) => {
    try {
      await createTask(userId, taskData);
      await get().fetchTasks(userId);
    } catch (error) {
      set({ error: error.message });
    }
  },

  // ================= UPDATE TASK =================
  updateTaskData: async (taskId, updatedData, userId) => {
    try {
      await updateTask(taskId, updatedData);
      await get().fetchTasks(userId);
    } catch (error) {
      set({ error: error.message });
    }
  },

  // ================= UPDATE STATUS =================
  updateStatus: async (taskId, status, userId) => {
    try {
      await updateTaskStatus(taskId, status);
      await get().fetchTasks(userId);
    } catch (error) {
      set({ error: error.message });
    }
  },

  // ================= SOFT DELETE =================
  removeTask: async (taskId, userId) => {
    try {
      await deleteTask(taskId);
      await get().fetchTasks(userId);
    } catch (error) {
      set({ error: error.message });
    }
  },

  clearTasks: () => {
    set({ tasks: [], loading: false, error: null });
  },
}));

export default useTaskStore;
