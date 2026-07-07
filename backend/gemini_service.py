import google.generativeai as genai
import json

from config import GEMINI_API_KEY


# ==========================================
# Configure Gemini
# ==========================================

genai.configure(api_key=GEMINI_API_KEY)

model = genai.GenerativeModel("gemini-2.5-flash")


# ==========================================
# Analyze Resume
# ==========================================

def analyze_resume(resume_text, job_description):

    prompt = f"""
You are an expert ATS Resume Analyzer and Career Consultant.

Your job is to:

1. Determine whether the uploaded document is actually a professional resume.

Examples of documents that are NOT resumes:
- Certificates
- Aadhaar / PAN Cards
- Mark Sheets
- Invoices
- Bills
- Notes
- Books
- Question Papers
- Random PDFs

----------------------------------------------------

If the uploaded document is NOT a resume, return ONLY this JSON:

{{
    "is_resume": false,
    "message": "The uploaded PDF does not appear to be a resume. Please upload a valid resume."
}}

----------------------------------------------------

If the uploaded document IS a resume:

• Analyze the resume.

• Calculate a realistic ATS Score (0-100).

• Detect all technical and soft skills.

• Suggest important missing skills.

• Give practical improvement suggestions.

----------------------------------------------------

If a Job Description is provided:

Compare the resume with the Job Description.

Calculate a realistic Job Match Score.

Identify:

- Matching Skills
- Missing Skills
- Resume Improvements

----------------------------------------------------

Return ONLY valid JSON in this format:

{{
    "is_resume": true,
    "ats_score": 85,
    "match_score": 78,
    "skills_found": [
        "Python",
        "Flask",
        "HTML"
    ],
    "matching_skills": [
        "Python",
        "Flask"
    ],
    "missing_skills": [
        "Docker",
        "AWS",
        "React"
    ],
    "suggestions": [
        "Add Docker experience.",
        "Mention AWS projects.",
        "Improve project descriptions."
    ]
}}

----------------------------------------------------

Resume:

{resume_text}

----------------------------------------------------

Job Description:

{job_description}

----------------------------------------------------

Rules:

1. Return ONLY JSON.

2. Do NOT explain anything.

3. Do NOT use markdown.

4. Do NOT write ```json.

5. If the Job Description is empty:

- Analyze the resume normally.
- Set "match_score" to 0.
- Set "matching_skills" to an empty list.
- Do NOT invent a job description.

6. ATS Score should be realistic.

7. Job Match Score should reflect how well the resume matches the Job Description.

8. Suggestions should be concise and actionable.

9. Return valid JSON only.
"""

    response = model.generate_content(prompt)

    text = response.text.strip()

    # Remove markdown if Gemini accidentally returns it
    text = text.replace("```json", "")
    text = text.replace("```", "").strip()

    return json.loads(text)