import { initializeApp } from "firebase/app";
import { doc, getFirestore, onSnapshot } from "firebase/firestore";
import {  type User, getAuth, onAuthStateChanged } from "firebase/auth";
import { getStorage } from "firebase/storage";
import { derived, writable, type Readable } from "svelte/store";

const firebaseConfig = {

  apiKey: "AIzaSyDzCcDje2bTKkb1DDVDNBScpInNVabvwaM",

  authDomain: "svelte-project-e2ced.firebaseapp.com",

  projectId: "svelte-project-e2ced",

  storageBucket: "svelte-project-e2ced.appspot.com",

  messagingSenderId: "952927924329",

  appId: "1:952927924329:web:1b50383f2506b13b92f2f8",

  measurementId: "G-PLTVDFHD7B"

};



// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const db = getFirestore();
export const auth = getAuth();
export const storage = getStorage();

function userStore() {
  let unsubscribe: () => void;

  if (!auth || !globalThis.window) {
    console.warn('Auth is not initialized or not in browser');
    const { subscribe } = writable<User | null>(null);
    return {
      subscribe,
    }
  }

  const { subscribe } = writable(auth?.currentUser ?? null, (set) => {
    unsubscribe = onAuthStateChanged(auth, (user) => {
      set(user);
    });

    return () => unsubscribe();
  });

  return {
    subscribe,
  };
}

export const user = userStore();

/**
 * @param  {string} path document path or reference
 * @returns a store with realtime updates on document data
 */
export function docStore<T>(
  path: string,
) {
  let unsubscribe: () => void;

  const docRef = doc(db, path);

  const { subscribe } = writable<T | null>(null, (set) => {
    unsubscribe = onSnapshot(docRef, (snapshot) => {
      set((snapshot.data() as T) ?? null);
    });

    return () => unsubscribe();
  });

  return {
    subscribe,
    ref: docRef,
    id: docRef.id,
  };
}

interface UserData {
  username: string;
  bio: string;
  photoURL: string;
  links: unknown[];
  firstTime: boolean;
}

export const userData: Readable<UserData | null> = derived(user, ($user, set) => { 
  if ($user) {
    return docStore<UserData>(`users/${$user.uid}`).subscribe(set);
  } else {
    set(null); 
  }
});  
