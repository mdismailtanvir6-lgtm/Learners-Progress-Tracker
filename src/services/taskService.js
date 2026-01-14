import {
  collection,
  addDoc,
  query,
  where,
  getDocs,
  updateDoc,
  doc,
  serverTimestamp,
} from "firebase/firestore";

import { db } from "../firebase/config";

/*
 Task Model (create, read, update, Soft Delete)
 {
   userId: string,
   title: string,
   description: string,
   status: "todo" | "doing" | "done",
   priority: "low" | "medium" | "high",
   goalId: string | null,
   isDeleted: boolean,
   createdAt: timestamp,
   updatedAt: timestamp
 }
*/

// ================= CREATE TASK =================
export const createTask = async (userId, taskData) => {
  return await addDoc(collection(db, "tasks"), {
    userId,
    title: taskData.title,
    description: taskData.description || "",
    priority: taskData.priority || "medium",
    goalId: taskData.goalId || null,
    status: "todo",
    isDeleted: false,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
};

// ================= READ TASKS (USER ONLY) =================
export const getUserTasks = async (userId) => {
  const q = query(
    collection(db, "tasks"),
    where("userId", "==", userId),
    where("isDeleted", "==", false)
  );

  const snapshot = await getDocs(q);

  return snapshot.docs.map((docSnap) => ({
    id: docSnap.id,
    ...docSnap.data(),
  }));
};

// ================= UPDATE TASK STATUS =================
export const updateTaskStatus = async (taskId, status) => {
  return await updateDoc(doc(db, "tasks", taskId), {
    status,
    updatedAt: serverTimestamp(),
  });
};

// ================= UPDATE TASK (GENERIC) =================
export const updateTask = async (taskId, updatedData) => {
  return await updateDoc(doc(db, "tasks", taskId), {
    ...updatedData,
    updatedAt: serverTimestamp(),
  });
};

// ================= SOFT DELETE TASK =================
export const deleteTask = async (taskId) => {
  return await updateDoc(doc(db, "tasks", taskId), {
    isDeleted: true,
    updatedAt: serverTimestamp(),
  });
};

// ================= RESTORE TASK (OPTIONAL / FUTURE) =================
export const restoreTask = async (taskId) => {
  return await updateDoc(doc(db, "tasks", taskId), {
    isDeleted: false,
    updatedAt: serverTimestamp(),
  });
};
