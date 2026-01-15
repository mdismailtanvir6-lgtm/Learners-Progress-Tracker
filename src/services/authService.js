// ====== importing firebase =======
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
} from "firebase/auth";

import { auth } from "../firebase/config";

// ================= SIGN UP =================
export const registerUser = async (email, password) => {
  const userCredential = await createUserWithEmailAndPassword(
    auth,
    email,
    password
  );

  return userCredential;
};

// ================= LOGIN =================
export const loginUser = async (email, password) => {
  return signInWithEmailAndPassword(auth, email, password);
};

// ================= LOGOUT =================
export const logoutUser = () => {
  return signOut(auth);
};

// ================= AUTH OBSERVER =================
export const observeAuthState = (callback) => {
  return onAuthStateChanged(auth, callback);
};
