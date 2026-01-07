import { useState } from "react";
import "./App.css";

export default function SyllabusUpload({ goNext }) {
    const [file, setFile] = useState(null);
    const [status, setStatus] = useState("");
    const [done, setDone] = useState(false);

    const uploadSyllabus = async () => {
        if (!file) {
            alert("Please choose a syllabus file");
            return;
        }

        const formData = new FormData();
        formData.append("syllabus", file);

        setStatus("Analyzing syllabus...");
        setDone(false);

        try {
            await fetch("http://localhost:5000/upload-syllabus", {
                method: "POST",
                body: formData,
            });

            setStatus("Syllabus analyzed successfully ✅");
            setDone(true);
        } catch (err) {
            setStatus("Upload failed ❌");
        }
    };

    return (
        <div className="upload-layout">
            <div className="video-section">
                <video src="/bg1.mp4" autoPlay loop muted />
            </div>

            <div className="upload-section">
                <div className="upload-card">
                    <h1>Upload Your Syllabus</h1>
                    <p>Let AI personalize your learning journey</p>

                    <label className="file-box">
                        <input
                            type="file"
                            hidden
                            onChange={(e) => setFile(e.target.files[0])}
                        />
                        {file ? file.name : "Click to choose syllabus file"}
                    </label>

                    <button onClick={uploadSyllabus}>
                        Upload & Analyze
                    </button>

                    {status && <span className="status">{status}</span>}

                    {done && (
                        <button className="continue-btn" onClick={goNext}>
                            Continue →
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}
