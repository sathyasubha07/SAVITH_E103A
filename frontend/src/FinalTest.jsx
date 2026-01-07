import { useState, useEffect } from "react";
import "./App.css";

// Reuse the MockTest structure but with different logic for finals
export default function FinalTest({ onFinish }) {
    const [questions, setQuestions] = useState([]);
    const [answers, setAnswers] = useState({});
    const [loading, setLoading] = useState(true);
    const [submitted, setSubmitted] = useState(false);
    const [score, setScore] = useState(0);

    useEffect(() => {
        // Ideally we'd have a specific "generate-final-test" endpoint that is harder
        // For prototype, we reuse the generate-mock but treat it as the final
        fetchQuestions();
    }, []);

    const fetchQuestions = async () => {
        try {
            const res = await fetch("http://localhost:5000/generate-mock");
            const data = await res.json();
            setQuestions(data);
            setLoading(false);
        } catch (err) {
            console.error(err);
            alert("Failed to load test.");
        }
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

        const percentage = (newScore / questions.length) * 100;
        const passed = percentage >= 60;

        // Save to local storage for Dashboard
        const totalPoints = passed ? newScore * 10 : newScore * 2; // Bonus for passing
        const history = JSON.parse(localStorage.getItem("history") || "[]");
        history.push({
            date: new Date().toLocaleDateString(),
            score: newScore,
            total: questions.length,
            passed,
            points: totalPoints
        });
        localStorage.setItem("history", JSON.stringify(history));

        // Update global points
        const currentPoints = Number(localStorage.getItem("points") || 0);
        localStorage.setItem("points", currentPoints + totalPoints);

        setTimeout(() => {
            if (passed) {
                alert(`Congratulations! You passed with ${percentage}%. You earned ${totalPoints} points.`);
            } else {
                alert(`You scored ${percentage}%. Keep learning! You earned ${totalPoints} points.`);
            }
            onFinish();
        }, 2000);
    };

    if (loading) return <div className="mock-page"><h1>Loading Final Test...</h1></div>;

    return (
        <div className="mock-page">
            <h1>Final Assessment</h1>
            {questions.map((q, i) => (
                <div key={q.id} className="question-card">
                    <h3>{i + 1}. {q.question}</h3>
                    <div className="options-grid">
                        {q.options.map((opt) => (
                            <button
                                key={opt}
                                className={`option-btn ${answers[q.id] === opt ? "selected" : ""}`}
                                onClick={() => setAnswers({ ...answers, [q.id]: opt })}
                                disabled={submitted}
                            >
                                {opt}
                            </button>
                        ))}
                    </div>
                </div>
            ))}
            {!submitted && <button className="mock-submit" onClick={submitTest}>Submit Final Test</button>}
        </div>
    );
}
