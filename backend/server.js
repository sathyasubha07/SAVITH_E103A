require("dotenv").config();

const express = require("express");
const cors = require("cors");
const multer = require("multer");
const fs = require("fs");

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

// confirm backend is running
app.get("/", (req, res) => {
    res.send("Backend is running ✅");
});

// file upload setup
const upload = multer({ dest: "uploads/" });

const teachContent = require("./ai/teachContent");

// lesson generation route
app.post("/teach", async (req, res) => {
    const { level } = req.body;
    try {
        const lesson = await teachContent(level);
        res.json(lesson);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: err.message });
    }
});

// syllabus upload route
const pdf = require("pdf-parse");

app.post("/upload-syllabus", upload.single("syllabus"), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: "No file uploaded" });
        }

        const filePath = req.file.path;
        let content = "";

        // Check if file is PDF
        if (req.file.mimetype === "application/pdf") {
            const dataBuffer = fs.readFileSync(filePath);
            const data = await pdf(dataBuffer);
            content = data.text;
        } else {
            // Default to text
            content = fs.readFileSync(filePath, "utf-8");
        }

        // store syllabus (mini-RAG base)
        fs.writeFileSync("syllabus.txt", content);

        res.json({
            message: "Syllabus received successfully",
            summary: content.slice(0, 500) // preview only
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Failed to process syllabus" });
    }
});

const generateMock = require("./ai/generateMock");

// mock test generation route
app.get("/generate-mock", async (req, res) => {
    try {
        const questions = await generateMock();
        res.json(questions);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: err.message });
    }
});



app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});

console.log("Groq key loaded:", !!process.env.GROQ_API_KEY);
