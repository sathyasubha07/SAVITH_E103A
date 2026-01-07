import { useState, useEffect } from "react";
import "./App.css";

export default function Dashboard() {
    const [points, setPoints] = useState(0);
    const [history, setHistory] = useState([]);
    const [badge, setBadge] = useState("Novice");

    useEffect(() => {
        const p = Number(localStorage.getItem("points") || 0);
        const h = JSON.parse(localStorage.getItem("history") || "[]");
        setPoints(p);
        setHistory(h);

        if (p > 50) setBadge("Bronze Scholar");
        if (p > 100) setBadge("Silver Master");
        if (p > 200) setBadge("Gold Legend");
    }, []);

    return (
        <div className="dashboard-page">
            <header className="dash-header">
                <h1>Student Dashboard</h1>
                <div className="stats-row">
                    <div className="stat-card">
                        <h3>Total Points</h3>
                        <div className="number">{points}</div>
                    </div>
                    <div className="stat-card">
                        <h3>Current Badge</h3>
                        <div className="badge-display">{badge}</div>
                    </div>
                </div>
            </header>

            <section className="history-section">
                <h2>Test History</h2>
                {history.length === 0 ? <p>No tests taken yet.</p> : (
                    <table className="history-table">
                        <thead>
                            <tr>
                                <th>Date</th>
                                <th>Score</th>
                                <th>Result</th>
                                <th>Points Earned</th>
                            </tr>
                        </thead>
                        <tbody>
                            {history.map((h, i) => (
                                <tr key={i}>
                                    <td>{h.date}</td>
                                    <td>{h.score}/{h.total}</td>
                                    <td className={h.passed ? "pass" : "fail"}>{h.passed ? "PASSED" : "FAILED"}</td>
                                    <td>+{h.points}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </section>

            <div className="actions">
                <button onClick={() => window.location.reload()}>Start New Topic</button>
            </div>
        </div>
    );
}
