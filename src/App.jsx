import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useEffect } from "react";

import Login from "./pages/auth/Login";
import Dashboard from "./pages/dashboard/DashboardHome";
import ProtectedRoute from "./routes/ProtectedRoute";

import useAuthStore from "./stores/authStore";
import useTaskStore from "./stores/taskStore";

const App = () => {
  // ===== auth store =====
  const user = useAuthStore((state) => state.user);
  const authLoading = useAuthStore((state) => state.loading);
  const initAuthListener = useAuthStore((state) => state.initAuthListener);

  // ===== task store =====
  const fetchTasks = useTaskStore((state) => state.fetchTasks);
  const clearTasks = useTaskStore((state) => state.clearTasks);
  const tasks = useTaskStore((state) => state.tasks);

  // 🔹 init auth listener once
  useEffect(() => {
    const unsubscribe = initAuthListener();
    return () => unsubscribe();
  }, []);

  // 🔥 AUTH ↔ TASK BINDING
  useEffect(() => {
    if (user) {
      fetchTasks(user.uid);
    } else {
      clearTasks();
    }
  }, [user]);


  if (authLoading) return <div>Loading...</div>;

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />

        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
