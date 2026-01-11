import "./App.css";
import React from "react";
import { auth } from "./firebase/config";

const App = () => {
  console.log("Firebase Auth:", auth);

  return <div className="text-[14px] leading-[23px]">Firebase connected</div>;
};

export default App;
