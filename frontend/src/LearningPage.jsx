import { useState, useEffect } from "react";
import "./App.css";

export default function LearningPage({ level, onComplete, mode = "lesson" }) {
    const [lesson, setLesson] = useState(null);
    const [loading, setLoading] = useState(mode === "lesson");
    const [archive, setArchive] = useState([]);
    const [selectedLesson, setSelectedLesson] = useState(null);

    useEffect(() => {
        const saved = JSON.parse(localStorage.getItem("notes_archive") || "[]");
        setArchive(saved);

        if (mode === "lesson") {
            fetchLesson();
        }
    }, [level, mode]);

    const fetchLesson = async () => {
        if (!level) return;
        setLoading(true);
        try {
            const res = await fetch("http://localhost:5000/teach", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ level }),
            });
            const data = await res.json();
            if (data.error) throw new Error(data.error);

            setLesson(data);

            // Add to archive
            const newArchive = [
                { id: Date.now(), ...data, level, date: new Date().toLocaleDateString() },
                ...archive
            ];
            // Filter out duplicates by title
            const uniqueArchive = Array.from(new Map(newArchive.map(item => [item.title, item])).values());

            localStorage.setItem("notes_archive", JSON.stringify(uniqueArchive));
            setArchive(uniqueArchive);
            setLoading(false);
        } catch (err) {
            console.error(err);
            alert(`Failed to load lesson content: ${err.message}`);
            setLoading(false);
        }
    };

    if (loading) return (
        <div className="learning-page">
            <h2>Creating your personalized {level} curriculum...</h2>
            <div className="loader">AI is thinking...</div>
        </div>
    );

    if (mode === "archive" && !selectedLesson) {
        return (
            <div className="archive-page">
                <header className="learning-header">
                    <h1>Your Notes Archive</h1>
                    <p>Select a saved syllabus to view details</p>
                </header>
                <div className="archive-grid">
                    {archive.length === 0 ? (
                        <p style={{ color: "#555", gridColumn: "1/-1" }}>No notes saved yet. Complete a lesson to see it here!</p>
                    ) : (
                        archive.map((note) => (
                            <div key={note.id} className="archive-box" onClick={() => setSelectedLesson(note)}>
                                <div className="archive-icon">📄</div>
                                <h3 className="archive-title">{note.title}</h3>
                                <span className="archive-level">{note.level}</span>
                                <span className="archive-date">{note.date}</span>
                            </div>
                        ))
                    )}
                </div>
            </div>
        );
    }

    const currentLesson = selectedLesson || lesson;

    if (!currentLesson) return <div className="learning-page">No lesson found.</div>;

    return (
        <div className="learning-page">
            <header className="learning-header">
                {mode === "archive" && <button onClick={() => setSelectedLesson(null)} className="back-btn">← Back to Archive</button>}
                <h1>{currentLesson.title}</h1>
                <span className="badge">{currentLesson.level || level} Level</span>
            </header>

            <div className="content-container">
                <section className="intro-section">
                    <h3>Introduction</h3>
                    <p>{currentLesson.introduction}</p>
                </section>

                {currentLesson.sections.map((sec, idx) => (
                    <div key={idx} className="lesson-card">
                        <h2>{idx + 1}. {sec.heading}</h2>
                        <p>{sec.content}</p>

                        {sec.youtubeQuery && (
                            <div className="video-placeholder">
                                <p>Recommended Search: <strong>{sec.youtubeQuery}</strong></p>
                                <a
                                    href={`https://www.youtube.com/results?search_query=${encodeURIComponent(sec.youtubeQuery)}`}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="video-link"
                                >
                                    Watch Video Tutorial →
                                </a>
                            </div>
                        )}
                    </div>
                ))}

                <section className="summary-section">
                    <h3>Summary</h3>
                    <p>{currentLesson.summary}</p>
                </section>

                {mode === "lesson" && (
                    <button className="complete-btn" onClick={onComplete}>
                        Notes Saved to Archive → Test My Knowledge 🏁
                    </button>
                )}
            </div>
        </div>
    );
}
