// ====== importing firebase =======
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  sendEmailVerification,
} from "firebase/auth";

import { auth } from "../firebase/config";

// ================= SIGN UP =================
export const registerUser = async (email, password) => {
  const userCredential = await createUserWithEmailAndPassword(
    auth,
    email,
    password
  );

  // send verification email
  await sendEmailVerification(userCredential.user);

  // logout immediately (force verify first)
  await signOut(auth);

  return userCredential;
};

// ================= LOGIN =================
export const loginUser = async (email, password) => {
  const userCredential = await signInWithEmailAndPassword(
    auth,
    email,
    password
  );

  // block unverified users
  if (!userCredential.user.emailVerified) {
    await signOut(auth);
    throw new Error("Please verify your email before logging in.");
  }

  return userCredential;
};

// ================= LOGOUT =================
export const logoutUser = () => {
  return signOut(auth);
};

// ================= AUTH OBSERVER =================
export const observeAuthState = (callback) => {
  return onAuthStateChanged(auth, (user) => {
    if (user && !user.emailVerified) {
      callback(null);
    } else {
      callback(user);
    }
  });
};
