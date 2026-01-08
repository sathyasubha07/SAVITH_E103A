import { useState, useEffect } from "react";
import "./App.css";

export default function HomePage({ setPage, setPoints }) {
    const [stats, setStats] = useState({
        username: "User",
        lessonCount: 0,
        points: 0,
        streak: 0,
        badge: "Rookie"
    });

    const quotes = [
        "The expert in anything was once a beginner.",
        "Your attitude, not your aptitude, will determine your altitude.",
        "Education is the most powerful weapon which you can use to change the world.",
        "Knowledge is power. Information is liberating.",
        "The beautiful thing about learning is that no one can take it away from you."
    ];

    const [quote, setQuote] = useState(quotes[0]);

    useEffect(() => {
        const user = JSON.parse(localStorage.getItem("user") || "{}");
        const archive = JSON.parse(localStorage.getItem("notes_archive") || "[]");

        // --- Streak Logic ---
        const today = new Date().toLocaleDateString();
        const lastAwarded = localStorage.getItem("lastStreakAwarded");
        const lastLogin = localStorage.getItem("lastLogin");
        const streak = Number(localStorage.getItem("streak") || 0);

        if (lastAwarded !== today) {
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

            localStorage.setItem("lastLogin", today);
            localStorage.setItem("lastStreakAwarded", today);
            localStorage.setItem("streak", newStreak.toString());
            localStorage.setItem("points", updatedPoints.toString());

            // Grammatically correct pop-up
            alert(`Yay! You're on a ${newStreak}-day streak! You've received ${bonus} bonus points. Keep coming back daily to earn more!`);

            // Sync with App state
            if (typeof setPoints === "function") {
                setPoints(updatedPoints);
            }
        }
        // ---------------------

        const finalPoints = Number(localStorage.getItem("points") || 0);
        const finalStreak = Number(localStorage.getItem("streak") || 0);

        let badge = "Rookie";
        if (finalPoints >= 1000) badge = "Academic Weapon";
        else if (finalPoints >= 500) badge = "Expert";
        else if (finalPoints >= 100) badge = "Scholar";

        setStats({
            username: user.username || "Scholar",
            lessonCount: archive.length,
            points: finalPoints,
            streak: finalStreak,
            badge: badge
        });

        const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];
        setQuote(randomQuote);
    }, []);

    return (
        <div className="home-page">
            <header className="home-header">
                <h1>Welcome Back, <span className="highlight-text">{stats.username}</span>! 👋</h1>
                <p>Ready to sharpen your academic weapons today?</p>
            </header>

            <div className="stats-grid">
                <div className="stat-card">
                    <span className="stat-icon">📚</span>
                    <h3>Lessons Learned</h3>
                    <p className="stat-value">{stats.lessonCount}</p>
                </div>
                <div className="stat-card">
                    <span className="stat-icon">⭐</span>
                    <h3>Total Points</h3>
                    <p className="stat-value">{stats.points}</p>
                </div>
                <div className="stat-card">
                    <span className="stat-icon">🔥</span>
                    <h3>Streak</h3>
                    <p className="stat-value">{stats.streak} Days</p>
                </div>
                <div className="stat-card">
                    <span className="stat-icon">🎯</span>
                    <h3>Rank</h3>
                    <p className="stat-value">{stats.badge}</p>
                </div>
            </div>

            <div className="quote-section">
                <div className="quote-card">
                    <p className="quote-text">"{quote}"</p>
                    <span className="quote-refresh" onClick={() => setQuote(quotes[Math.floor(Math.random() * quotes.length)])}>🔄 New Inspiration</span>
                </div>
            </div>

            <div className="home-actions">
                <h2>Quick Actions</h2>
                <div className="action-btns">
                    <button className="action-btn primary" onClick={() => setPage("upload")}>
                        🚀 Start New Syllabus
                    </button>
                    <button className="action-btn secondary" onClick={() => setPage("yourNotes")}>
                        📂 Browse My Archive
                    </button>
                    <button className="action-btn secondary" onClick={() => setPage("doubts")}>
                        💬 Ask AI a Doubt
                    </button>
                </div>
            </div>
        </div>
    );
}
