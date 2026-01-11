import "./App.css";
// import React from "react";
import { auth } from "./firebase/config";
import { observeAuthState } from "./services/authService";
import { useEffect } from "react";
import { useAuth } from "./context/AuthContext";

const App = () => {
  // ========= firebase auth =======
  console.log("Firebase Auth:", auth);

  // ========= user observer auth state =======
  useEffect(() => {
    const unsubscribe = observeAuthState((user) => {
      console.log("Auth State Changed:", user);
    });

    return () => unsubscribe();
  }, []);

  const { user, loading } = useAuth();

  if (loading) return <p>Checking authentication...</p>;

  return (
    <div>
      {user ? (
        <h2>Welcome, {user.email}</h2>
      ) : (
        <h2>User not logged in or email not verified</h2>
      )}
    </div>
  );
};

export default App;
