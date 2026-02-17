const SKILL_LIBRARY = [
  "python", "java", "c++", "javascript", "typescript", "react", "node.js",
  "express", "html", "css", "sql", "mysql", "postgresql", "mongodb",
  "machine learning", "deep learning", "nlp", "data analysis", "pandas",
  "numpy", "scikit-learn", "tensorflow", "pytorch", "power bi", "tableau",
  "git", "github", "docker", "kubernetes", "aws", "azure", "gcp", "linux",
  "rest api", "flask", "django", "communication", "problem solving", "oop",
  "data structures", "algorithms", "system design", "figma", "excel"
];

const LEARNING_RESOURCES = {
  "machine learning": "Take Andrew Ng's ML specialization and build one end-to-end ML project.",
  "nlp": "Learn tokenization, embeddings, transformers, and deploy one NLP mini-app.",
  "data structures": "Practice arrays, trees, graphs on LeetCode/GFG (5 problems/week).",
  "algorithms": "Focus on sorting, searching, DP, and greedy approaches with timed practice.",
  "react": "Build two React projects using API integration and state management.",
  "node.js": "Create REST APIs with authentication and deploy them using Render or Railway.",
  "sql": "Master joins, subqueries, CTEs, and design normalized schemas.",
  "communication": "Practice mock interviews and concise project storytelling weekly."
};

const resumeFileInput = document.getElementById("resumeFile");
const resumeTextInput = document.getElementById("resumeText");
const linkedinTextInput = document.getElementById("linkedinText");
const jdInput = document.getElementById("jobDescription");
const analyzeBtn = document.getElementById("analyzeBtn");

const probabilityOutput = document.getElementById("probability");
const probBar = document.getElementById("probBar");
const matchedSkillsList = document.getElementById("matchedSkills");
const skillGapList = document.getElementById("skillGaps");
const roadmapList = document.getElementById("roadmap");
const recommendationsList = document.getElementById("recommendations");

function normalize(text) {
  return (text || "").toLowerCase();
}

function extractSkills(text) {
  const t = normalize(text);
  return SKILL_LIBRARY.filter((skill) => t.includes(skill));
}

function unique(arr) {
  return [...new Set(arr)];
}

function scoreProbability(matched, required, hasProjects, hasInternship) {
  const skillMatchRatio = required.length ? matched.length / required.length : 0;
  const projectBoost = hasProjects ? 0.15 : 0;
  const internshipBoost = hasInternship ? 0.1 : 0;
  const baseline = 0.25;
  const raw = baseline + 0.55 * skillMatchRatio + projectBoost + internshipBoost;
  return Math.max(0, Math.min(0.98, raw));
}

function setList(listNode, items, fallbackText) {
  listNode.innerHTML = "";
  if (!items.length) {
    const li = document.createElement("li");
    li.textContent = fallbackText;
    listNode.appendChild(li);
    return;
  }

  items.forEach((item) => {
    const li = document.createElement("li");
    li.textContent = item;
    listNode.appendChild(li);
  });
}

function buildRoadmap(skillGaps) {
  if (!skillGaps.length) {
    return ["You are skill-aligned. Focus on mock interviews and portfolio polish."];
  }

  return skillGaps.slice(0, 5).map((gap, index) => {
    const resource = LEARNING_RESOURCES[gap] || `Learn ${gap} via a short course and build one mini-project.`;
    return `Week ${index + 1}-${index + 2}: ${resource}`;
  });
}

async function readResumeFile(file) {
  if (!file) return "";
  if (file.type === "application/pdf" || file.name.toLowerCase().endsWith(".pdf")) {
    return "PDF uploaded. For accurate analysis, paste extracted PDF text manually.";
  }
  return file.text();
}

analyzeBtn.addEventListener("click", async () => {
  const fileText = await readResumeFile(resumeFileInput.files[0]);
  const resumeCombined = [resumeTextInput.value, linkedinTextInput.value, fileText].join("\n");
  const jdText = jdInput.value;

  if (!resumeCombined.trim() || !jdText.trim()) {
    alert("Please provide both resume content and job description.");
    return;
  }

  const resumeSkills = unique(extractSkills(resumeCombined));
  const requiredSkills = unique(extractSkills(jdText));

  const matchedSkills = requiredSkills.filter((skill) => resumeSkills.includes(skill));
  const skillGaps = requiredSkills.filter((skill) => !resumeSkills.includes(skill));

  const normalizedResume = normalize(resumeCombined);
  const hasProjects = normalizedResume.includes("project");
  const hasInternship = normalizedResume.includes("intern") || normalizedResume.includes("experience");

  const probability = scoreProbability(matchedSkills, requiredSkills, hasProjects, hasInternship);
  const percent = Math.round(probability * 100);

  probabilityOutput.textContent = `${percent}%`;
  probBar.style.width = `${percent}%`;
  probBar.style.background = percent >= 75 ? "var(--ok)" : percent >= 50 ? "var(--warn)" : "var(--danger)";

  setList(matchedSkillsList, matchedSkills, "No matched skills detected yet.");
  setList(skillGapList, skillGaps, "No major skill gaps detected.");

  const roadmap = buildRoadmap(skillGaps);
  setList(roadmapList, roadmap, "No roadmap needed.");

  const recs = [
    `${matchedSkills.length}/${requiredSkills.length || 0} key JD skills matched.`,
    hasProjects ? "Projects found in resume: highlight measurable impact in bullet points." : "Add at least 2 project case studies in resume.",
    hasInternship ? "Internship/experience signal detected: tailor it to job keywords." : "Add internship, freelance, or simulated experience section.",
    "Run one mock interview and optimize resume with role-specific keywords."
  ];
  setList(recommendationsList, recs, "No recommendations available.");
});
