import { useState, useEffect } from "react";
import "./App.css";

export default function HistoryPage() {
    const [history, setHistory] = useState([]);

    useEffect(() => {
        const savedHistory = JSON.parse(localStorage.getItem("history") || "[]");
        // Sort by date/latest first if possible, though date is just a string now
        setHistory(savedHistory.reverse());
    }, []);

    return (
        <div className="history-page">
            <header className="home-header">
                <h1>Assessment <span className="highlight-text">History</span> 📉</h1>
                <p>Track your past performance and growth</p>
            </header>

            <div className="history-container">
                {history.length === 0 ? (
                    <div className="empty-history">
                        <span className="empty-icon">📂</span>
                        <h3>No assessment history yet.</h3>
                        <p>Complete your first lesson and final test to see your scores here!</p>
                    </div>
                ) : (
                    <table className="history-table">
                        <thead>
                            <tr>
                                <th>Date</th>
                                <th>Score</th>
                                <th>Points Earned</th>
                                <th>Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {history.map((log, idx) => (
                                <tr key={idx} className={log.passed ? "pass-row" : "fail-row"}>
                                    <td>{log.date}</td>
                                    <td className="score-cell">{log.score} / {log.total}</td>
                                    <td className="points-cell">⭐ {log.points}</td>
                                    <td>
                                        <span className={`status-badge ${log.passed ? "passed" : "failed"}`}>
                                            {log.passed ? "PASSED" : "RETRY"}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
}
