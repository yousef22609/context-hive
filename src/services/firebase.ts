
import { initializeApp } from "firebase/app";
import { 
  getAuth, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  User as FirebaseUser
} from "firebase/auth";
import { getDatabase, ref, set, get, update } from "firebase/database";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAxr_6LmjVgzrT34en3LGCSM9wxFUJtkoE",
  authDomain: "yoma-3390d.firebaseapp.com",
  projectId: "yoma-3390d",
  storageBucket: "yoma-3390d.firebasestorage.app",
  messagingSenderId: "387090327193",
  appId: "1:387090327193:web:2540dc9f62b8f4a499ba08"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const database = getDatabase(app);

// User profile type
export interface UserProfile {
  username: string;
  points: number;
  cashNumber: string;
  avatar?: string;
  lastPlayedQuiz?: Record<string, string>;
  showPromotion?: boolean;
}

// Firebase authentication functions
export const firebaseAuth = {
  // Create a new user with email and password
  register: async (email: string, password: string) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      // Create user profile in database
      await set(ref(database, `users/${userCredential.user.uid}`), {
        username: email.split('@')[0], // Use part of email as username
        points: 0,
        cashNumber: '',
        showPromotion: true,
        lastPlayedQuiz: {}
      });
      return userCredential.user;
    } catch (error) {
      console.error("Error registering user:", error);
      throw error;
    }
  },

  // Sign in existing user with email and password
  login: async (email: string, password: string) => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      return userCredential.user;
    } catch (error) {
      console.error("Error logging in:", error);
      throw error;
    }
  },

  // Sign out current user
  logout: async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error("Error signing out:", error);
      throw error;
    }
  },

  // Get current authenticated user
  getCurrentUser: () => {
    return auth.currentUser;
  },

  // Observe auth state changes
  onAuthStateChanged: (callback: (user: FirebaseUser | null) => void) => {
    return onAuthStateChanged(auth, callback);
  }
};

// Firebase database operations
export const firebaseDB = {
  // Get user profile from database
  getUserProfile: async (userId: string): Promise<UserProfile | null> => {
    try {
      const snapshot = await get(ref(database, `users/${userId}`));
      if (snapshot.exists()) {
        return snapshot.val() as UserProfile;
      } else {
        return null;
      }
    } catch (error) {
      console.error("Error getting user profile:", error);
      throw error;
    }
  },

  // Update user profile in database
  updateUserProfile: async (userId: string, data: Partial<UserProfile>) => {
    try {
      await update(ref(database, `users/${userId}`), data);
    } catch (error) {
      console.error("Error updating user profile:", error);
      throw error;
    }
  },

  // Update user points
  updatePoints: async (userId: string, points: number) => {
    try {
      // First get current points
      const snapshot = await get(ref(database, `users/${userId}/points`));
      const currentPoints = snapshot.exists() ? snapshot.val() : 0;
      
      // Update with new total points
      await set(ref(database, `users/${userId}/points`), currentPoints + points);
    } catch (error) {
      console.error("Error updating points:", error);
      throw error;
    }
  },

  // Update last played quiz
  updateLastPlayedQuiz: async (userId: string, categoryId: string) => {
    try {
      const updates: Record<string, string> = {};
      updates[`users/${userId}/lastPlayedQuiz/${categoryId}`] = new Date().toISOString();
      await update(ref(database), updates);
    } catch (error) {
      console.error("Error updating last played quiz:", error);
      throw error;
    }
  },

  // Get all users (for leaderboard)
  getAllUsers: async (): Promise<Array<UserProfile & { id: string }>> => {
    try {
      const snapshot = await get(ref(database, 'users'));
      if (snapshot.exists()) {
        const users: Array<UserProfile & { id: string }> = [];
        snapshot.forEach((childSnapshot) => {
          users.push({
            id: childSnapshot.key as string,
            ...childSnapshot.val() as UserProfile
          });
        });
        return users;
      }
      return [];
    } catch (error) {
      console.error("Error getting all users:", error);
      throw error;
    }
  }
};

export default app;
