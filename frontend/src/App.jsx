import { useState, useEffect } from "react";
import "./App.css";

/* ================= MAIN APP ================= */

import SyllabusUpload from "./SyllabusUpload";
import LearningPage from "./LearningPage";
import FinalTest from "./FinalTest";
import DoubtsPage from "./DoubtsPage";

/* ================= MAIN APP ================= */

export default function App() {
  const [page, setPage] = useState("auth");
  const [level, setLevel] = useState("");

  const renderPage = () => {
    if (page === "upload") return <SyllabusUpload goNext={() => setPage("level")} />;
    if (page === "level") return (
      <LevelSelection
        onSelect={(lvl) => { setLevel(lvl); setPage("learning"); }}
        onMock={() => setPage("mock")}
      />
    );
    if (page === "learning") return <LearningPage level={level} onComplete={() => setPage("finalTest")} />;
    if (page === "finalTest") return <FinalTest onFinish={() => setPage("complete")} />;
    if (page === "doubts") return <DoubtsPage />;
    if (page === "complete") return (
      <div className="complete-screen">
        <h1>🎊 Mission Complete! 🎊</h1>
        <p>You have finished your personalized learning journey.</p>
        <button className="login-btn" style={{ width: "200px" }} onClick={() => setPage("upload")}>
          Start New Syllabus
        </button>
      </div>
    );
    if (page === "mock") return (
      <MockTest
        onFinish={(lvl) => { setLevel(lvl); setPage("learning"); }}
      />
    );
    return null;
  };

  if (page === "auth") return <AuthPage goNext={() => setPage("upload")} />;

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
    { id: "upload", label: "Upload Syllabus", icon: "📁" },
    { id: "level", label: "Choose Level", icon: "🎯" },
    { id: "mock", label: "Mock Test", icon: "📝" },
    { id: "learning", label: "Learning Notes", icon: "📖" },
    { id: "finalTest", label: "Final Assessment", icon: "🏆" },
    { id: "doubts", label: "Clear Doubts", icon: "💬" },
  ];

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
