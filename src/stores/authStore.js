import { create } from "zustand";
import {
  registerUser,
  loginUser,
  logoutUser,
  observeAuthState,
} from "../services/authService";

const useAuthStore = create((set) => ({
  user: null,
  loading: true,
  error: null,

  // ================= OBSERVE AUTH =================
  initAuthListener: () => {
    return observeAuthState((user) => {
      set({
        user,
        loading: false,
      });
    });
  },

  // ================= REGISTER =================
  register: async (email, password) => {
    set({ error: null });
    try {
      const res = await registerUser(email, password);
      set({ user: res.user });
    } catch (err) {
      set({ error: err.message });
    }
  },

  // ================= LOGIN =================
  login: async (email, password) => {
    set({ error: null });
    try {
      const res = await loginUser(email, password);
      set({ user: res.user });
    } catch (err) {
      set({ error: err.message });
    }
  },

  // ================= LOGOUT =================
  logout: async () => {
    try {
      await logoutUser();
      set({ user: null });
    } catch (err) {
      set({ error: err.message });
    }
  },
}));

export default useAuthStore;
