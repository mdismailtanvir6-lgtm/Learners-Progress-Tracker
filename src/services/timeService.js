import { collection, addDoc, updateDoc, doc, serverTimestamp } from "firebase/firestore";
import { db } from "../firebase/config";

// START TIMER
export const startSession = async (userId, taskId) => {
  return await addDoc(collection(db, "taskSessions"), {
    userId,
    taskId,
    startTime: serverTimestamp(),
    endTime: null,
    duration: null,
    createdAt: serverTimestamp()
  });
};

// STOP TIMER
export const stopSession = async (sessionId) => {
  const sessionRef = doc(db, "taskSessions", sessionId);
  const now = serverTimestamp();
  // Firebase serverTimestamp cannot be used to calculate duration on client side
  // Duration calculation can be done in cloud function OR on fetch
  return await updateDoc(sessionRef, {
    endTime: now,
    duration: null
  });
};


