import "./App.css";
// import React from "react";
import { auth } from "./firebase/config";
import { observeAuthState } from "./services/authService";
import { useEffect } from "react";

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

  return (
    <div className="text-[14px] leading-[23px]">Auth service is ready !</div>
  );
};

export default App;
