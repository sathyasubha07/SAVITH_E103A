import { useState, useEffect } from "react";
import "./App.css";

/* ================= MAIN APP ================= */

import SyllabusUpload from "./SyllabusUpload";
import LearningPage from "./LearningPage";
import FinalTest from "./FinalTest";
import DoubtsPage from "./DoubtsPage";
import HomePage from "./HomePage";
import HistoryPage from "./HistoryPage";

/* ================= MAIN APP ================= */

export default function App() {
  const [page, setPage] = useState("auth");
  const [level, setLevel] = useState("");
  const [points, setPoints] = useState(Number(localStorage.getItem("points") || 0));

  useEffect(() => {
    if (page === "home") {
      checkStreak();
    }
  }, [page]);

  const checkStreak = () => {
    const today = new Date().toLocaleDateString();
    const lastAwarded = localStorage.getItem("lastStreakAwarded");
    const lastLogin = localStorage.getItem("lastLogin");
    const streak = Number(localStorage.getItem("streak") || 0);

    // If already rewarded today, stop
    if (lastAwarded === today) return;

    let newStreak = 1;
    const bonus = 10;

    if (lastLogin) {
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      const yesterdayStr = yesterday.toLocaleDateString();

      if (lastLogin === yesterdayStr) {
        newStreak = streak + 1;
      }
    }

    const currentPoints = Number(localStorage.getItem("points") || 0);
    const updatedPoints = currentPoints + bonus;

    // Update storage
    localStorage.setItem("lastLogin", today);
    localStorage.setItem("lastStreakAwarded", today);
    localStorage.setItem("streak", newStreak.toString());
    localStorage.setItem("points", updatedPoints.toString());

    // Update state for immediate UI response
    setPoints(updatedPoints);

    // Grammatically correct pop-up
    alert(`Yay! You're on a ${newStreak}-day streak! You've received ${bonus} bonus points. Keep coming back daily to earn more!`);
  };

  const renderPage = () => {
    if (page === "home") return <HomePage setPage={setPage} setPoints={setPoints} />;
    if (page === "upload") return <SyllabusUpload goNext={() => setPage("level")} />;
    if (page === "level") return (
      <LevelSelection
        onSelect={(lvl) => {
          setLevel(lvl);
          localStorage.removeItem("saved_lesson");
          setPage("learning");
        }}
        onMock={() => setPage("mock")}
      />
    );
    if (page === "learning") return <LearningPage level={level} onComplete={() => setPage("finalTest")} />;
    if (page === "yourNotes") return <LearningPage mode="archive" onComplete={() => setPage("doubts")} />;
    if (page === "finalTest") return <FinalTest onFinish={() => {
      // Refresh points state when test finishes
      setPoints(Number(localStorage.getItem("points") || 0));
      setPage("complete");
    }} />;
    if (page === "doubts") return <DoubtsPage />;
    if (page === "history") return <HistoryPage />;
    if (page === "complete") return (
      <div className="complete-screen">
        <h1>🎊 Mission Complete! 🎊</h1>
        <p>You have finished your personalized learning journey.</p>
        <button className="login-btn" style={{ width: "200px" }} onClick={() => {
          localStorage.removeItem("saved_lesson");
          setPage("upload");
        }}>
          Start New Syllabus
        </button>
      </div>
    );
    if (page === "mock") return (
      <MockTest
        onFinish={(lvl) => {
          setLevel(lvl);
          localStorage.removeItem("saved_lesson");
          setPage("learning");
        }}
      />
    );
    return null;
  };

  if (page === "auth") return <AuthPage goNext={() => {
    setPoints(Number(localStorage.getItem("points") || 0));
    setPage("home");
  }} />;

  return (
    <div className="main-layout">
      <Sidebar activePage={page} setPage={setPage} />
      <main className="content-area">
        {renderPage()}
      </main>
    </div>
  );
}

/* ================= SIDEBAR ================= */

function Sidebar({ activePage, setPage }) {
  const menuItems = [
    { id: "home", label: "Dashboard", icon: "🏠" },
    { id: "upload", label: "Upload Syllabus", icon: "📁" },
    { id: "level", label: "Choose Level", icon: "🎯" },
    { id: "yourNotes", label: "Your Notes", icon: "📖" },
    { id: "history", label: "Test History", icon: "📊" },
    { id: "doubts", label: "Clear Doubts", icon: "💬" },
  ];

  const handleReset = async () => {
    if (!window.confirm("ARE YOU SURE? This will wipe ALL your progress, points, and notes!")) return;

    try {
      await fetch("http://localhost:5000/reset-system", { method: "POST" });
      localStorage.clear(); // Clear everything
      window.location.reload(); // Hard reset
    } catch (err) {
      alert("Reset failed: " + err.message);
    }
  };

  return (
    <div className="sidebar">
      <div className="sidebar-logo">
        <h2 style={{ color: "#8b5cf6" }}>AV</h2>
        <span>Academic Weapon</span>
      </div>

      <nav className="sidebar-nav">
        {menuItems.map((item) => (
          <div
            key={item.id}
            className={`nav-item ${activePage === item.id ? "active" : ""}`}
            onClick={() => setPage(item.id)}
          >
            <span className="nav-icon">{item.icon}</span>
            <span className="nav-label">{item.label}</span>
          </div>
        ))}
      </nav>
      <div className="sidebar-footer">
        <button className="reset-btn" onClick={handleReset}>Fresh Start 🧹</button>
        <button className="logout-btn" onClick={() => window.location.reload()}>Logout</button>
      </div>
    </div>
  );
}

/* ================= AUTH PAGE ================= */

function AuthPage({ goNext }) {
  const [mode, setMode] = useState("login");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleSignup = () => {
    if (!username || !password) {
      alert("Please fill all fields");
      return;
    }
    localStorage.setItem("user", JSON.stringify({ username, password }));
    localStorage.setItem("points", "0");
    localStorage.setItem("history", "[]");
    localStorage.setItem("notes_archive", "[]");
    alert("Signup successful! Please login.");
    setMode("login");
    setUsername("");
    setPassword("");
  };

  const handleLogin = () => {
    const saved = JSON.parse(localStorage.getItem("user"));
    if (!saved || saved.username !== username || saved.password !== password) {
      alert("Invalid credentials");
      return;
    }
    goNext();
    setPage("home");
  };

  return (
    <div className="login-container">
      <div className="login-left">
        <h1 className="welcome-title">Welcome to Academic Weapon</h1>

        <h2>{mode === "login" ? "Login" : "Sign Up"}</h2>

        <input
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

      <div
        className="login-right"
        style={{ backgroundImage: "url('/bg0.jpeg')" }}
      />
    </div>
  );
}



function LevelSelection({ onSelect, onMock }) {
  return (
    <div className="level-layout">
      <div className="level-left">
        <h1>Choose Your Level</h1>
        <p className="level-sub">
          Select how confident you are with this topic
        </p>

        <button className="level-btn" onClick={() => onSelect("Beginner")}>
          Beginner
        </button>
        <button className="level-btn" onClick={() => onSelect("Intermediate")}>
          Intermediate
        </button>
        <button className="level-btn" onClick={() => onSelect("Advanced")}>
          Advanced
        </button>

        <button className="mock-btn" onClick={onMock}>
          Not sure? Take a Mock Test
        </button>
      </div>

      <div className="level-right">
        <video src="/bg2.mp4" autoPlay loop muted playsInline />
      </div>
    </div>
  );
}

/* ================= MOCK TEST ================= */


function MockTest({ onFinish }) {
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [loading, setLoading] = useState(true);
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(0);

  useEffect(() => {
    fetchQuestions();
  }, []);

  const fetchQuestions = async () => {
    try {
      const res = await fetch("http://localhost:5000/generate-mock");
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      setQuestions(data);
      setLoading(false);
    } catch (err) {
      console.error(err);
      alert(`Test Error: ${err.message || "Please check if you uploaded a syllabus and try again."}`);
      setLoading(false);
    }
  };

  const handleSelect = (qId, option) => {
    if (submitted) return;
    setAnswers((prev) => ({ ...prev, [qId]: option }));
  };

  const submitTest = () => {
    let newScore = 0;
    questions.forEach((q) => {
      if (answers[q.id] === q.correctAnswer) {
        newScore++;
      }
    });

    setScore(newScore);
    setSubmitted(true);

    let lvl = "Beginner";
    if (newScore >= 4 && newScore <= 8) lvl = "Intermediate";
    if (newScore > 8) lvl = "Advanced";

    // Wait a bit so user can see score
    setTimeout(() => {
      alert(`You scored ${newScore}/10. Assigned Level: ${lvl}`);
      onFinish(lvl);
    }, 2000);
  };

  if (loading) return <div className="mock-page"><h1>Generating Questions...</h1></div>;

  return (
    <div className="mock-page">
      <h1>Mock Test</h1>
      {questions.map((q, i) => (
        <div key={q.id} className="question-card">
          <h3>{i + 1}. {q.question}</h3>
          <div className="options-grid">
            {q.options.map((opt) => {
              const isSelected = answers[q.id] === opt;
              const isCorrect = submitted && q.correctAnswer === opt;
              const isWrong = submitted && isSelected && q.correctAnswer !== opt;

              let btnClass = "option-btn";
              if (isCorrect) btnClass += " correct";
              if (isWrong) btnClass += " wrong";
              if (isSelected) btnClass += " selected";

              return (
                <button
                  key={opt}
                  className={btnClass}
                  onClick={() => handleSelect(q.id, opt)}
                >
                  {opt}
                </button>
              );
            })}
          </div>
        </div>
      ))}

      {!submitted && (
        <button className="mock-submit" onClick={submitTest} disabled={Object.keys(answers).length !== questions.length}>
          Submit Test
        </button>
      )}

      {submitted && (
        <div className="result-banner">
          <h2>Score: {score} / 10</h2>
        </div>
      )}
    </div>
  );
}
