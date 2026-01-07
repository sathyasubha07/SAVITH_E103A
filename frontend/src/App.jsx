import { useState } from "react";
import "./App.css";

/* ================= MAIN APP ================= */

export default function App() {
  const [page, setPage] = useState("auth");

  if (page === "upload") {
    return <SyllabusUpload />;
  }

  return <AuthPage goNext={() => setPage("upload")} />;
}

/* ================= AUTH PAGE (LOGIN + SIGNUP) ================= */

function AuthPage({ goNext }) {
  const [mode, setMode] = useState("login"); // login | signup
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleSignup = () => {
    if (!username || !password) {
      alert("Please fill all fields");
      return;
    }

    localStorage.setItem(
      "user",
      JSON.stringify({ username, password })
    );

    alert("Signup successful! Please login.");
    setMode("login");
    setUsername("");
    setPassword("");
  };

  const handleLogin = () => {
    const savedUser = JSON.parse(localStorage.getItem("user"));

    if (!savedUser) {
      alert("No account found. Please sign up first.");
      setMode("signup");
      return;
    }

    if (
      savedUser.username === username &&
      savedUser.password === password
    ) {
      alert("Login successful!");
      goNext();
    } else {
      alert("Invalid credentials");
    }
  };

  return (
    <div className="login-container">
      {/* LEFT PANEL */}
      <div className="login-left">
        <h1 className="welcome-title">Welcome to Academic Weapon</h1>

        <h2>{mode === "login" ? "Login" : "Sign Up"}</h2>
        <p className="subtitle">
          {mode === "login"
            ? "Enter your account details"
            : "Create your account"}
        </p>

        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        {mode === "login" ? (
          <>
            <button className="login-btn" onClick={handleLogin}>
              Login
            </button>

            <p className="signup">
              Don’t have an account?{" "}
              <span onClick={() => setMode("signup")}>Sign up</span>
            </p>
          </>
        ) : (
          <>
            <button className="login-btn" onClick={handleSignup}>
              Sign Up
            </button>

            <p className="signup">
              Already have an account?{" "}
              <span onClick={() => setMode("login")}>Login</span>
            </p>
          </>
        )}
      </div>

      {/* RIGHT PANEL */}
      <div
        className="login-right"
        style={{ backgroundImage: "url('/bg0.jpeg')" }}
      />
    </div>
  );
}

/* ================= SYLLABUS UPLOAD PAGE ================= */

function SyllabusUpload() {
  const [file, setFile] = useState(null);
  const [status, setStatus] = useState("");

  const uploadSyllabus = async () => {
    if (!file) {
      alert("Please choose a syllabus file");
      return;
    }

    const formData = new FormData();
    formData.append("syllabus", file);

    setStatus("Analyzing syllabus...");

    try {
      await fetch("http://localhost:5000/upload-syllabus", {
        method: "POST",
        body: formData,
      });

      setStatus("Syllabus analyzed successfully ✅");
    } catch (err) {
      console.error(err);
      setStatus("Upload failed ❌");
    }
  };

  return (
    <div className="upload-layout">
      {/* LEFT VIDEO */}
      <div className="video-section">
        <video
          src="/bg1.mp4"
          autoPlay
          loop
          muted
          playsInline
        />
      </div>

      {/* RIGHT GLASS BOX */}
      <div className="upload-section">
        <div className="upload-glass">
          <h1>Upload Your Syllabus</h1>
          <p className="upload-subtitle">
            Let AI understand your syllabus and personalize learning
          </p>

          <label className="file-picker">
            <input
              type="file"
              hidden
              onChange={(e) => setFile(e.target.files[0])}
            />
            {file ? file.name : "Choose syllabus file"}
          </label>

          <button className="upload-btn" onClick={uploadSyllabus}>
            Upload & Analyze
          </button>

          {status && <p className="status-text">{status}</p>}
        </div>
      </div>
    </div>
  );
}
