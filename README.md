# AI-Based Placement Readiness & Skill Gap Analyzer

A lightweight web tool that helps students evaluate placement readiness by:

- Analyzing resume content
- Matching extracted skills against a job description
- Identifying skill gaps
- Generating a learning roadmap
- Predicting placement probability with a heuristic score
- Bonus: supporting LinkedIn-like profile text parsing for richer analysis

## Features

1. **Resume Input**
   - Upload `.txt`, `.md`, or `.pdf` (PDF is acknowledged, with manual text-paste guidance).
   - Or directly paste resume text.
2. **Job Matching**
   - Paste a job description and analyze matching skills.
3. **Skill Gap Detection**
   - Displays missing skills in comparison to the target role.
4. **Learning Roadmap**
   - Creates a week-based roadmap for top missing skills.
5. **Placement Probability**
   - Generates a percentage score based on skill coverage + project/internship indicators.

## Tech Stack

- HTML
- CSS
- Vanilla JavaScript (NLP-style keyword extraction + scoring logic)

## Run Locally

```bash
python3 -m http.server 8000
```

Then open:

- `http://localhost:8000/index.html`

## Notes

- This version uses a keyword-based NLP approximation for simplicity and speed in the browser.
- You can extend it with real NLP pipelines (spaCy/BERT) and backend APIs for production use.
