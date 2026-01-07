import { useState } from "react";

export default function SyllabusUpload() {
 const [file, setFile] = useState(null);
 const [status, setStatus] = useState("");

 const uploadSyllabus = async () => {
  if (!file) {
   alert("Please upload a syllabus file");
   return;
  }

  const formData = new FormData();
  formData.append("syllabus", file);

  setStatus("Uploading & analyzing syllabus...");

  try {
   const res = await fetch("http://localhost:5000/upload-syllabus", {
    method: "POST",
    body: formData,
   });

   const data = await res.json();
   setStatus("Syllabus analyzed successfully ✅");

   console.log("AI Summary:", data.summary);
   alert("Syllabus uploaded & analyzed!");

  } catch (err) {
   console.error(err);
   setStatus("Error uploading syllabus ❌");
  }
 };

 return (
  <div style={styles.page}>
   <div style={styles.card}>
    <h1>Upload Your Syllabus</h1>
    <p>AI will analyze the topic structure</p>

    <input
     type="file"
     onChange={(e) => setFile(e.target.files[0])}
    />

    <button onClick={uploadSyllabus}>Upload</button>

    <p>{status}</p>
   </div>
  </div>
 );
}

const styles = {
 page: {
  minHeight: "100vh",
  background: "#111",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  color: "white",
 },
 card: {
  background: "#1c1c1c",
  padding: "30px",
  borderRadius: "12px",
  width: "350px",
  textAlign: "center",
 },
};
