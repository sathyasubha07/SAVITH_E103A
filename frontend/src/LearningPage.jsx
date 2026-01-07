import { useState, useEffect } from "react";
import "./App.css";

export default function LearningPage({ level, onComplete }) {
    const [lesson, setLesson] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchLesson();
    }, []);

    const fetchLesson = async () => {
        try {
            const res = await fetch("http://localhost:5000/teach", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ level }),
            });
            const data = await res.json();
            setLesson(data);
            setLoading(false);
        } catch (err) {
            console.error(err);
            alert("Failed to load lesson content.");
        }
    };

    if (loading) return (
        <div className="learning-page">
            <h2>Creating your personalized {level} curriculum...</h2>
            <div className="loader">AI is thinking...</div>
        </div>
    );

    return (
        <div className="learning-page">
            <header className="learning-header">
                <h1>{lesson.title}</h1>
                <span className="badge">{level} Level</span>
            </header>

            <div className="content-container">
                <section className="intro-section">
                    <h3>Introduction</h3>
                    <p>{lesson.introduction}</p>
                </section>

                {lesson.sections.map((sec, idx) => (
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
                    <p>{lesson.summary}</p>
                </section>

                <button className="complete-btn" onClick={onComplete}>
                    I've Completed This Lesson → Take Final Test
                </button>
            </div>
        </div>
    );
}
