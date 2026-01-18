import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";

const firebaseConfig = {
  apiKey: "AIzaSyDgYvSC1EK8FbEj_PuFWvYWBHANU2jdUQU",
  authDomain: "cold-storage-95af9.firebaseapp.com",
  databaseURL: "https://cold-storage-95af9-default-rtdb.firebaseio.com",
  projectId: "cold-storage-95af9",
};

const app = initializeApp(firebaseConfig);
export const database = getDatabase(app);
