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

// syllabus upload route
app.post("/upload-syllabus", upload.single("syllabus"), (req, res) => {
 try {
  const content = fs.readFileSync(req.file.path, "utf-8");

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

app.listen(PORT, () => {
 console.log(`Server running on http://localhost:${PORT}`);
});
