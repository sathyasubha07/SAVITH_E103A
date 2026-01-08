require("dotenv").config();

const express = require("express");
const cors = require("cors");
const multer = require("multer");
const fs = require("fs");
const pdf = require("pdf-parse");

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
const askDoubt = require("./ai/askDoubt");
const generateMock = require("./ai/generateMock");

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
app.post("/upload-syllabus", upload.single("syllabus"), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: "No file uploaded" });
        }

        const filePath = req.file.path;
        const extension = req.file.originalname.split(".").pop().toLowerCase();
        let content = "";

        console.log(`Processing file: ${req.file.originalname}, Mime: ${req.file.mimetype}, Ext: ${extension}`);

        if (req.file.mimetype === "application/pdf" || extension === "pdf") {
            const dataBuffer = fs.readFileSync(filePath);
            const data = await pdf(dataBuffer);
            content = data.text;
            console.log("PDF Extraction Success. chars:", content.length);
        } else {
            content = fs.readFileSync(filePath, "utf-8");
            console.log("Text Extraction Success. chars:", content.length);
        }

        if (!content || content.trim().length < 10) {
            throw new Error("Syllabus content is too short or empty.");
        }

        fs.writeFileSync("syllabus.txt", content);

        res.json({
            message: "Syllabus received successfully",
            summary: content.slice(0, 500)
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Failed to process syllabus: " + err.message });
    }
});

// doubt clearing route
app.post("/ask-doubt", async (req, res) => {
    const { question } = req.body;
    try {
        const answer = await askDoubt(question);
        res.json({ answer });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: err.message });
    }
});

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
