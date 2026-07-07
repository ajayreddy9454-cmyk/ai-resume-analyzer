// ==========================================
// AI RESUME ANALYZER
// OFFICIAL SCRIPT.JS
// PART 1
// ==========================================

// ==========================================
// Elements
// ==========================================

const resumeFile = document.getElementById("resumeFile");
const fileName = document.getElementById("fileName");
const analyzeBtn = document.getElementById("analyzeBtn");
const jobDescription = document.getElementById("jobDescription");
const loading = document.getElementById("loading");
const results = document.getElementById("results");

// Result Elements
const atsScore = document.getElementById("atsScore");
const skillsFound = document.getElementById("skillsFound");
const missingSkills = document.getElementById("missingSkills");
const suggestions = document.getElementById("suggestions");

// Notification Elements
const notification = document.getElementById("notification");
const notificationTitle = document.getElementById("notificationTitle");
const notificationText = document.getElementById("notificationText");
const closeNotification = document.getElementById("closeNotification");


// ==========================================
// Notification
// ==========================================

function showNotification(title, message) {

    notificationTitle.textContent = title;
    notificationText.textContent = message;

    notification.classList.remove("hidden");

}

closeNotification.addEventListener("click", function () {

    notification.classList.add("hidden");

});


// ==========================================
// Initial State
// ==========================================

analyzeBtn.disabled = true;
analyzeBtn.style.opacity = "0.5";
analyzeBtn.style.cursor = "not-allowed";


// ==========================================
// Resume Upload
// ==========================================

resumeFile.addEventListener("change", function () {

    const file = this.files[0];

    if (!file) {

        fileName.textContent = "No file selected";

        analyzeBtn.disabled = true;
        analyzeBtn.style.opacity = "0.5";
        analyzeBtn.style.cursor = "not-allowed";

        return;

    }

    // Allow PDF only
    if (file.type !== "application/pdf") {

        showNotification(
            "Invalid File",
            "Please upload a PDF file only."
        );

        resumeFile.value = "";

        fileName.textContent = "No file selected";

        analyzeBtn.disabled = true;
        analyzeBtn.style.opacity = "0.5";
        analyzeBtn.style.cursor = "not-allowed";

        return;

    }

    fileName.textContent = "📄 " + file.name;

    analyzeBtn.disabled = false;
    analyzeBtn.style.opacity = "1";
    analyzeBtn.style.cursor = "pointer";

});
// ==========================================
// PART 2
// ANALYZE RESUME
// ==========================================

analyzeBtn.addEventListener("click", async function () {

    // Check file selected
    if (resumeFile.files.length === 0) {

        showNotification(
            "Upload Required",
            "Please upload your resume first."
        );

        return;
    }

    // Disable button
    analyzeBtn.disabled = true;
    analyzeBtn.style.opacity = "0.5";
    analyzeBtn.style.cursor = "not-allowed";

    // Show loading
    loading.classList.remove("hidden");

    // Hide previous results
    results.classList.add("hidden");

    // Create FormData
  const formData = new FormData();

formData.append(
    "resume",
    resumeFile.files[0]
);

formData.append(
    "job_description",
    jobDescription.value
);
    try {

        const response = await fetch(
            "https://ai-resume-analyzer-1pjt.onrender.com/analyze",
            {
                method: "POST",
                body: formData
            }
        );

        const data = await response.json();

        // Hide loading
        loading.classList.add("hidden");

        // Enable button
        analyzeBtn.disabled = false;
        analyzeBtn.style.opacity = "1";
        analyzeBtn.style.cursor = "pointer";

        // Backend Error
        if (data.error) {

            showNotification(
                "Error",
                data.error
            );

            return;

        }

        // Invalid Resume
        if (!data.is_resume) {

            showNotification(
                "Invalid Resume",
                data.message
            );

            return;

        }

        // Go to Part 3
        updateResults(data);
        // ======================================
// Job Match Score
// ======================================

const matchScore = document.getElementById("matchScore");

matchScore.textContent = data.match_score + "%";

if (data.match_score >= 80) {

    matchScore.style.color = "#22c55e";

}
else if (data.match_score >= 60) {

    matchScore.style.color = "#f59e0b";

}
else {

    matchScore.style.color = "#ef4444";

}

    }

    catch (error) {

        loading.classList.add("hidden");

        analyzeBtn.disabled = false;
        analyzeBtn.style.opacity = "1";
        analyzeBtn.style.cursor = "pointer";

        showNotification(
            "Connection Error",
            "Unable to connect to backend."
        );

        console.error(error);

    }

});
// ==========================================
// PART 3
// UPDATE ANALYSIS REPORT
// ==========================================

function updateResults(data) {

    // ATS Score
atsScore.textContent = data.ats_score + " / 100";

// Progress Bar
document.getElementById("progressBar").style.width =
    data.ats_score + "%";

// Rating
const atsRating = document.getElementById("atsRating");

if (data.ats_score >= 80) {

    atsScore.style.color = "#22c55e";
    atsRating.textContent = "Excellent Resume ⭐⭐⭐⭐⭐";
    atsRating.style.color = "#22c55e";
    document.getElementById("progressBar").style.background = "#22c55e";

}
else if (data.ats_score >= 60) {

    atsScore.style.color = "#f59e0b";
    atsRating.textContent = "Good Resume ⭐⭐⭐⭐";
    atsRating.style.color = "#f59e0b";
    document.getElementById("progressBar").style.background = "#f59e0b";

}
else {

    atsScore.style.color = "#ef4444";
    atsRating.textContent = "Needs Improvement ⭐⭐";
    atsRating.style.color = "#ef4444";
    document.getElementById("progressBar").style.background = "#ef4444";

}

    // -----------------------------
    // Skills Found
    // -----------------------------

    skillsFound.innerHTML = "";

    data.skills_found.forEach(function(skill){

        skillsFound.innerHTML += `
            <li>${skill}</li>
        `;

    });
    // ======================================
// Matching Skills
// ======================================

const matchingSkills = document.getElementById("matchingSkills");

matchingSkills.innerHTML = "";

if (data.matching_skills.length === 0) {

    matchingSkills.innerHTML = `
        <li>No Job Description Provided</li>
    `;

}
else {

    data.matching_skills.forEach(function(skill){

        matchingSkills.innerHTML += `
            <li>${skill}</li>
        `;

    });

}

    // -----------------------------
    // Missing Skills
    // -----------------------------

    missingSkills.innerHTML = "";

    data.missing_skills.forEach(function(skill){

        missingSkills.innerHTML += `
            <li>${skill}</li>
        `;

    });

    // -----------------------------
    // Suggestions
    // -----------------------------

    suggestions.innerHTML = "";

    data.suggestions.forEach(function(item){

        suggestions.innerHTML += `
            <li>${item}</li>
        `;

    });

    // -----------------------------
    // Show Results
    // -----------------------------

    results.classList.remove("hidden");

    results.scrollIntoView({

        behavior: "smooth"

    });

}