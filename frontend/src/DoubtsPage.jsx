import { useState, useRef } from "react";
import "./App.css";

export default function DoubtsPage() {
    const [question, setQuestion] = useState("");
    const [chat, setChat] = useState([]);
    const [loading, setLoading] = useState(false);
    const [uploading, setUploading] = useState(false);
    const fileInputRef = useRef(null);

    const askAI = async () => {
        if (!question.trim()) return;

        const newChat = [...chat, { type: "user", text: question }];
        setChat(newChat);
        setQuestion("");
        setLoading(true);

        try {
            const res = await fetch("http://localhost:5000/ask-doubt", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ question }),
            });
            const data = await res.json();

            if (data.error) throw new Error(data.error);

            setChat([...newChat, { type: "ai", text: data.answer }]);
        } catch (err) {
            setChat([...newChat, { type: "ai", text: "Error: " + err.message }]);
        } finally {
            setLoading(false);
        }
    };

    const handleUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        setUploading(true);
        const formData = new FormData();
        formData.append("syllabus", file);

        try {
            const res = await fetch("http://localhost:5000/upload-syllabus", {
                method: "POST",
                body: formData,
            });
            const data = await res.json();
            if (data.error) throw new Error(data.error);

            setChat([...chat, { type: "ai", text: "✅ Syllabus updated successfully! I am now ready to answer questions about this new content." }]);
        } catch (err) {
            setChat([...chat, { type: "ai", text: "❌ Upload failed: " + err.message }]);
        } finally {
            setUploading(false);
        }
    };

    return (
        <div className="doubts-page">
            <header className="learning-header">
                <h1>Clear Your Doubts</h1>
                <p>Ask anything related to your syllabus</p>
            </header>

            <div className="chat-container">
                <div className="chat-window">
                    {chat.length === 0 && (
                        <div className="chat-placeholder">
                            Ask a question about your syllabus (e.g., "What are the main topics?")
                        </div>
                    )}
                    {chat.map((msg, idx) => (
                        <div key={idx} className={`message ${msg.type}`}>
                            <div className="msg-bubble">{msg.text}</div>
                        </div>
                    ))}
                    {loading && <div className="message ai"><div className="msg-bubble">Thinking...</div></div>}
                    {uploading && <div className="message ai"><div className="msg-bubble">Analyzing new syllabus...</div></div>}
                </div>

                <div className="chat-input-area">
                    <button
                        className="attach-btn"
                        onClick={() => fileInputRef.current.click()}
                        title="Upload new syllabus"
                    >
                        📎
                    </button>
                    <input
                        type="file"
                        ref={fileInputRef}
                        hidden
                        onChange={handleUpload}
                        accept=".pdf,.txt"
                    />
                    <input
                        value={question}
                        onChange={(e) => setQuestion(e.target.value)}
                        placeholder="Type your doubt here..."
                        onKeyPress={(e) => e.key === "Enter" && askAI()}
                        disabled={loading || uploading}
                    />
                    <button className="send-btn" onClick={askAI} disabled={loading || uploading}>Send</button>
                </div>
            </div>
        </div>
    );
}
