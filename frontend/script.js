// Initialize points
if (!localStorage.getItem("points")) localStorage.setItem("points", 0);

function login() {
 const username = document.getElementById("username").value;
 const mobile = document.getElementById("mobile").value;
 if (username || mobile) {
  localStorage.setItem("username", username || mobile);
  localStorage.setItem("points", parseInt(localStorage.getItem("points")) + 5);
  window.location.href = "upload.html";
 } else {
  alert("Enter username or mobile!");
 }
}

async function uploadFile() {
 const file = document.getElementById("syllabus").files[0];
 if (!file) return alert("Select a file!");

 const formData = new FormData();
 formData.append("file", file);

 const res = await fetch("http://localhost:5000/upload-syllabus", {
  method: "POST",
  body: formData
 });

 const data = await res.json();
 document.getElementById("summary").innerText = data.summary;
 localStorage.setItem("syllabusSummary", data.summary);
}

function goNext() {
 window.location.href = "levelselect.html";
}

function selectLevel(level) {
 localStorage.setItem("level", level);
 let points = parseInt(localStorage.getItem("points"));
 if (level === "Beginner") points += 5;
 if (level === "Intermediate") points += 10;
 if (level === "Advanced") points += 15;
 localStorage.setItem("points", points);
 window.location.href = "dashboard.html";
}

async function takeMockTest() {
 // simple mock answers for demo
 const answers = [1, 1, 1, 1, 1, 1, 1, 1, 1, 1];
 const res = await fetch("http://localhost:5000/mock-test", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ answers })
 });
 const data = await res.json();
 localStorage.setItem("level", data.level);
 alert(`Your level is ${data.level}`);
 window.location.href = "dashboard.html";
}

// Dashboard logic
if (window.location.pathname.includes("dashboard.html")) {
 const pointsDisplay = document.getElementById("points-display");
 const topicsContainer = document.getElementById("topics-container");
 pointsDisplay.innerText = `Points: ${localStorage.getItem("points")}`;

 const topics = ["Linear Equations 2 Variables", "Graphing", "Word Problems"];
 topics.forEach((topic) => {
  const div = document.createElement("div");
  div.className = "topic-card";

  const h2 = document.createElement("h2");
  h2.innerText = topic;

  const btn = document.createElement("button");
  btn.innerText = "Complete Topic (+5 pts)";
  btn.onclick = () => {
   let points = parseInt(localStorage.getItem("points"));
   points += 5;
   localStorage.setItem("points", points);
   pointsDisplay.innerText = `Points: ${localStorage.getItem("points")}`;
   alert(`You completed ${topic} and earned 5 points!`);
  };

  div.appendChild(h2);
  div.appendChild(btn);
  topicsContainer.appendChild(div);
 });
}
