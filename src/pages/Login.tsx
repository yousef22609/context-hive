import { useState, useEffect } from "react";
import { auth, db } from "../firebaseConfig";
import { signInWithEmailAndPassword, onAuthStateChanged, signOut } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const docRef = doc(db, "users", user.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setUserData(docSnap.data());
        }
        navigate("/dashboard");
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, [navigate]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    try {
      await signInWithEmailAndPassword(auth, email, password);
      alert("تم تسجيل الدخول بنجاح!");
      navigate("/dashboard");
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
