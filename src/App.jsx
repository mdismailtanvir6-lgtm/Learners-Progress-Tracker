import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/auth/Login";
import Dashboard from "./pages/dashboard/DashboardHome";
import ProtectedRoute from "./routes/ProtectedRoute";
import useTaskStore from "./stores/taskStore";

const App = () => {
  const { tasks, loading } = useTaskStore();
  console.log("Tasks:", tasks);

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
