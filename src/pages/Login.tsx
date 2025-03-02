// firebaseConfig.ts - إعداد Firebase
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "YOUR_FIREBASE_API_KEY",
  authDomain: "your-project.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-project.appspot.com",
  messagingSenderId: "your-messaging-sender-id",
  appId: "your-app-id",
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);

// ------------------------------

// Signup.tsx - صفحة إنشاء الحساب
import { useState } from "react";
import { auth, db } from "../firebaseConfig";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";

const Signup = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState("");

  const handleSignup = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      await setDoc(doc(db, "users", user.uid), {
        name,
        email,
        uid: user.uid,
      });

      alert("تم إنشاء الحساب بنجاح!");
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div>
      <h2>إنشاء حساب جديد</h2>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <form onSubmit={handleSignup}>
        <input type="text" placeholder="الاسم" value={name} onChange={(e) => setName(e.target.value)} required />
        <input type="email" placeholder="البريد الإلكتروني" value={email} onChange={(e) => setEmail(e.target.value)} required />
        <input type="password" placeholder="كلمة المرور" value={password} onChange={(e) => setPassword(e.target.value)} required />
        <button type="submit">تسجيل</button>
      </form>
    </div>
  );
};

export default Signup;

// ------------------------------

// Login.tsx - صفحة تسجيل الدخول
import { useState, useEffect } from "react";
import { auth, db } from "../firebaseConfig";
import { signInWithEmailAndPassword, onAuthStateChanged, signOut } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const docRef = doc(db, "users", user.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setUserData(docSnap.data());
        }
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    try {
      await signInWithEmailAndPassword(auth, email, password);
      alert("تم تسجيل الدخول بنجاح!");
      window.location.href = "/dashboard";
    } catch (err) {
      setError("خطأ في تسجيل الدخول. تحقق من البريد وكلمة المرور.");
    }
  };

  const handleLogout = async () => {
    await signOut(auth);
    alert("تم تسجيل الخروج!");
    setUserData(null);
  };

  return (
    <div>
      <h2>تسجيل الدخول</h2>
      {error && <p style={{ color: "red" }}>{error}</p>}
      {loading ? <p>جاري التحميل...</p> : userData && <p>مرحبًا {userData.name}!</p>}
      <form onSubmit={handleLogin}>
        <input type="email" placeholder="البريد الإلكتروني" value={email} onChange={(e) => setEmail(e.target.value)} required />
        <input type="password" placeholder="كلمة المرور" value={password} onChange={(e) => setPassword(e.target.value)} required />
        <button type="submit">تسجيل الدخول</button>
      </form>
      {userData && <button onClick={handleLogout}>تسجيل الخروج</button>}
    </div>
  );
};

export default Login;
