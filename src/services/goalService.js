import {
  collection,
  addDoc,
  getDocs,
  updateDoc,
  doc,
  query,
  where,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "../firebase/config";

// CREATE GOAL
export const createGoal = async (userId, goalData) => {
  return await addDoc(collection(db, "goals"), {
    userId,
    title: goalData.title,
    description: goalData.description || "",
    taskIds: goalData.taskIds || [],
    isDeleted: false,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
};

// GET USER GOALS
export const getUserGoals = async (userId) => {
  const q = query(
    collection(db, "goals"),
    where("userId", "==", userId),
    where("isDeleted", "==", false)
  );

  const snapshot = await getDocs(q);
  return snapshot.docs.map((docSnap) => ({
    id: docSnap.id,
    ...docSnap.data(),
  }));
};

// UPDATE GOAL
export const updateGoal = async (goalId, updatedData) => {
  return await updateDoc(doc(db, "goals", goalId), {
    ...updatedData,
    updatedAt: serverTimestamp(),
  });
};

// SOFT DELETE GOAL
export const deleteGoal = async (goalId) => {
  return await updateDoc(doc(db, "goals", goalId), {
    isDeleted: true,
    updatedAt: serverTimestamp(),
  });
};


