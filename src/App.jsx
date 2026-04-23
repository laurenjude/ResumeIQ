import { useState, useRef, useEffect } from "react";

const WEBHOOK_URL = "https://lauren002.app.n8n.cloud/webhook/resume-review";

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Sans:wght@300;400;500&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  :root {
    --bg: #040d1a;
    --bg2: #071428;
    --surface: #0c1f3d;
    --surface2: #102448;
    --accent: #00c2ff;
    --accent2: #0077ff;
    --accent3: #00ff94;
    --text: #e8f4ff;
    --text2: #7a9bbf;
    --border: rgba(0, 194, 255, 0.15);
    --green: #00ff94;
    --orange: #ff9500;
    --red: #ff4444;
  }

  body {
    background: var(--bg);
    color: var(--text);
    font-family: 'DM Sans', sans-serif;
    min-height: 100vh;
    overflow-x: hidden;
  }

  .grid-bg {
    position: fixed;
    inset: 0;
    background-image:
      linear-gradient(rgba(0, 194, 255, 0.03) 1px, transparent 1px),
      linear-gradient(90deg, rgba(0, 194, 255, 0.03) 1px, transparent 1px);
    background-size: 60px 60px;
    pointer-events: none;
    z-index: 0;
  }

  .glow {
    position: fixed;
    width: 600px;
    height: 600px;
    border-radius: 50%;
    background: radial-gradient(circle, rgba(0, 119, 255, 0.08) 0%, transparent 70%);
    top: -200px;
    right: -200px;
    pointer-events: none;
    z-index: 0;
  }

  .glow2 {
    position: fixed;
    width: 400px;
    height: 400px;
    border-radius: 50%;
    background: radial-gradient(circle, rgba(0, 255, 148, 0.05) 0%, transparent 70%);
    bottom: -100px;
    left: -100px;
    pointer-events: none;
    z-index: 0;
  }

  .app { position: relative; z-index: 1; }

  /* NAV */
  nav {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 1.5rem 2rem;
    border-bottom: 1px solid var(--border);
    backdrop-filter: blur(10px);
    position: sticky;
    top: 0;
    z-index: 100;
    background: rgba(4, 13, 26, 0.8);
  }

  .logo {
    font-family: 'Syne', sans-serif;
    font-size: 1.4rem;
    font-weight: 800;
    letter-spacing: -0.5px;
    background: none;
    border: none;
    color: var(--text);
    cursor: pointer;
    padding: 0;
  }

  .logo span { color: var(--accent); }

  .stepper {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    font-size: 0.75rem;
    color: var(--text2);
  }

  .step {
    padding: 0.25rem 0.75rem;
    border-radius: 20px;
    letter-spacing: 0.5px;
    transition: all 0.2s;
  }

  .step.active {
    background: rgba(0, 194, 255, 0.1);
    border: 1px solid rgba(0, 194, 255, 0.3);
    color: var(--accent);
  }

  .step.done {
    color: var(--accent3);
  }

  .step-sep {
    opacity: 0.3;
  }

  .back-btn {
    display: inline-flex;
    align-items: center;
    gap: 0.4rem;
    background: none;
    border: 1px solid var(--border);
    border-radius: 8px;
    color: var(--text2);
    font-family: 'DM Sans', sans-serif;
    font-size: 0.85rem;
    padding: 0.4rem 0.9rem;
    cursor: pointer;
    transition: all 0.2s;
    margin-bottom: 1.5rem;
  }

  .back-btn:hover {
    border-color: var(--accent);
    color: var(--accent);
  }

  .badge {
    font-size: 0.7rem;
    background: rgba(0, 194, 255, 0.1);
    border: 1px solid rgba(0, 194, 255, 0.3);
    color: var(--accent);
    padding: 0.3rem 0.8rem;
    border-radius: 20px;
    letter-spacing: 1px;
    text-transform: uppercase;
  }

  /* HERO */
  .hero {
    max-width: 800px;
    margin: 0 auto;
    padding: 5rem 2rem 3rem;
    text-align: center;
  }

  .hero-tag {
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    font-size: 0.75rem;
    letter-spacing: 2px;
    text-transform: uppercase;
    color: var(--accent);
    margin-bottom: 1.5rem;
    padding: 0.4rem 1rem;
    border: 1px solid var(--border);
    border-radius: 20px;
  }

  .hero-tag::before {
    content: '';
    width: 6px;
    height: 6px;
    background: var(--accent3);
    border-radius: 50%;
    animation: pulse 2s infinite;
  }

  @keyframes pulse {
    0%, 100% { opacity: 1; transform: scale(1); }
    50% { opacity: 0.5; transform: scale(0.8); }
  }

  h1 {
    font-family: 'Syne', sans-serif;
    font-size: clamp(2.5rem, 6vw, 4rem);
    font-weight: 800;
    line-height: 1.1;
    letter-spacing: -1px;
    margin-bottom: 1.5rem;
  }

  h1 .highlight {
    background: linear-gradient(135deg, var(--accent), var(--accent2));
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }

  .hero-sub {
    font-size: 1.1rem;
    color: var(--text2);
    line-height: 1.7;
    max-width: 520px;
    margin: 0 auto 1rem;
  }

  .stats-row {
    display: flex;
    justify-content: center;
    gap: 2rem;
    margin: 2rem 0;
    flex-wrap: wrap;
  }

  .stat {
    text-align: center;
  }

  .stat-num {
    font-family: 'Syne', sans-serif;
    font-size: 1.8rem;
    font-weight: 700;
    color: var(--accent);
    display: block;
  }

  .stat-label {
    font-size: 0.75rem;
    color: var(--text2);
    letter-spacing: 1px;
    text-transform: uppercase;
  }

  /* FORM CARD */
  .form-card {
    max-width: 640px;
    margin: 0 auto 5rem;
    padding: 0 2rem;
  }

  .card {
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: 20px;
    padding: 2.5rem;
    position: relative;
    overflow: hidden;
  }

  .card::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 2px;
    background: linear-gradient(90deg, transparent, var(--accent), var(--accent2), transparent);
  }

  .card-title {
    font-family: 'Syne', sans-serif;
    font-size: 1.2rem;
    font-weight: 700;
    margin-bottom: 0.4rem;
  }

  .card-sub {
    font-size: 0.85rem;
    color: var(--text2);
    margin-bottom: 2rem;
  }

  .form-row {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 1rem;
    margin-bottom: 1rem;
  }

  .form-group {
    display: flex;
    flex-direction: column;
    gap: 0.4rem;
    margin-bottom: 1rem;
  }

  label {
    font-size: 0.8rem;
    color: var(--text2);
    letter-spacing: 0.5px;
    text-transform: uppercase;
  }

  .optional {
    color: var(--text2);
    font-size: 0.7rem;
    opacity: 0.6;
  }

  input[type="text"],
  input[type="email"] {
    background: var(--surface2);
    border: 1px solid var(--border);
    border-radius: 10px;
    padding: 0.75rem 1rem;
    color: var(--text);
    font-family: 'DM Sans', sans-serif;
    font-size: 0.9rem;
    transition: border-color 0.2s, box-shadow 0.2s;
    outline: none;
  }

  input[type="text"]:focus,
  input[type="email"]:focus {
    border-color: var(--accent);
    box-shadow: 0 0 0 3px rgba(0, 194, 255, 0.1);
  }

  input::placeholder { color: var(--text2); opacity: 0.5; }

  textarea {
    background: var(--surface2);
    border: 1px solid var(--border);
    border-radius: 10px;
    padding: 0.75rem 1rem;
    color: var(--text);
    font-family: 'DM Sans', sans-serif;
    font-size: 0.9rem;
    transition: border-color 0.2s, box-shadow 0.2s;
    outline: none;
    resize: vertical;
    min-height: 110px;
    width: 100%;
    line-height: 1.6;
  }

  textarea:focus {
    border-color: var(--accent);
    box-shadow: 0 0 0 3px rgba(0, 194, 255, 0.1);
  }

  textarea::placeholder { color: var(--text2); opacity: 0.5; }

  .jd-tip {
    font-size: 0.75rem;
    color: var(--accent3);
    opacity: 0.8;
    margin-top: 0.3rem;
  }

  /* UPLOAD ZONE */
  .upload-zone {
    border: 2px dashed var(--border);
    border-radius: 12px;
    padding: 2rem;
    text-align: center;
    cursor: pointer;
    transition: all 0.2s;
    background: var(--surface2);
    position: relative;
    margin-bottom: 1.5rem;
  }

  .upload-zone:hover, .upload-zone.drag-over {
    border-color: var(--accent);
    background: rgba(0, 194, 255, 0.05);
  }

  .upload-zone.has-file {
    border-color: var(--accent3);
    border-style: solid;
    background: rgba(0, 255, 148, 0.05);
  }

  .upload-icon {
    font-size: 2rem;
    margin-bottom: 0.75rem;
    display: block;
  }

  .upload-text {
    font-size: 0.9rem;
    color: var(--text2);
    margin-bottom: 0.25rem;
  }

  .upload-hint {
    font-size: 0.75rem;
    color: var(--text2);
    opacity: 0.6;
  }

  .file-name {
    font-size: 0.85rem;
    color: var(--accent3);
    font-weight: 500;
    margin-top: 0.5rem;
  }

  input[type="file"] {
    position: absolute;
    inset: 0;
    opacity: 0;
    cursor: pointer;
    width: 100%;
    height: 100%;
  }

  /* SUBMIT BUTTON */
  .btn-submit {
    width: 100%;
    padding: 1rem;
    background: linear-gradient(135deg, var(--accent2), var(--accent));
    border: none;
    border-radius: 12px;
    color: #fff;
    font-family: 'Syne', sans-serif;
    font-size: 1rem;
    font-weight: 700;
    letter-spacing: 0.5px;
    cursor: pointer;
    transition: all 0.2s;
    position: relative;
    overflow: hidden;
  }

  .btn-submit:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 0 8px 30px rgba(0, 119, 255, 0.4);
  }

  .btn-submit:disabled {
    opacity: 0.7;
    cursor: not-allowed;
    transform: none;
  }

  .btn-submit.loading::after {
    content: '';
    position: absolute;
    inset: 0;
    background: linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.15) 50%, transparent 100%);
    animation: shimmer 1.5s infinite;
  }

  @keyframes shimmer {
    from { transform: translateX(-100%); }
    to { transform: translateX(100%); }
  }

  /* ERROR */
  .error-msg {
    background: rgba(255, 68, 68, 0.1);
    border: 1px solid rgba(255, 68, 68, 0.3);
    border-radius: 10px;
    padding: 0.75rem 1rem;
    font-size: 0.85rem;
    color: #ff8888;
    margin-bottom: 1rem;
  }

  /* RESULTS */
  .results {
    max-width: 800px;
    margin: 0 auto;
    padding: 2rem;
    animation: fadeIn 0.5s ease;
  }

  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(20px); }
    to { opacity: 1; transform: translateY(0); }
  }

  .results-header {
    text-align: center;
    margin-bottom: 3rem;
  }

  .overall-score {
    display: inline-flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    width: 160px;
    height: 160px;
    border-radius: 50%;
    border: 3px solid var(--accent);
    background: var(--surface);
    margin: 1.5rem auto;
    position: relative;
    box-shadow: 0 0 40px rgba(0, 194, 255, 0.2);
  }

  .score-num {
    font-family: 'Syne', sans-serif;
    font-size: 3rem;
    font-weight: 800;
    line-height: 1;
    color: var(--accent);
  }

  .score-label {
    font-size: 0.7rem;
    color: var(--text2);
    letter-spacing: 2px;
    text-transform: uppercase;
    margin-top: 0.2rem;
  }

  .score-grade {
    font-size: 0.85rem;
    font-weight: 500;
    margin-top: 0.75rem;
    padding: 0.3rem 1rem;
    border-radius: 20px;
    display: inline-block;
  }

  .grade-excellent { background: rgba(0, 255, 148, 0.1); color: var(--green); border: 1px solid rgba(0, 255, 148, 0.3); }
  .grade-good { background: rgba(0, 194, 255, 0.1); color: var(--accent); border: 1px solid rgba(0, 194, 255, 0.3); }
  .grade-fair { background: rgba(255, 149, 0, 0.1); color: var(--orange); border: 1px solid rgba(255, 149, 0, 0.3); }
  .grade-poor { background: rgba(255, 68, 68, 0.1); color: var(--red); border: 1px solid rgba(255, 68, 68, 0.3); }

  /* SCORE BARS */
  .scores-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 1rem;
    margin-bottom: 2rem;
  }

  .score-bar-card {
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: 14px;
    padding: 1.25rem;
  }

  .score-bar-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 0.75rem;
  }

  .score-bar-label {
    font-size: 0.8rem;
    color: var(--text2);
    letter-spacing: 0.5px;
    text-transform: uppercase;
  }

  .score-bar-value {
    font-family: 'Syne', sans-serif;
    font-size: 1.1rem;
    font-weight: 700;
  }

  .bar-track {
    height: 6px;
    background: var(--surface2);
    border-radius: 3px;
    overflow: hidden;
  }

  .bar-fill {
    height: 100%;
    border-radius: 3px;
    transition: width 1s ease;
  }

  /* FEEDBACK SECTIONS */
  .section-title {
    font-family: 'Syne', sans-serif;
    font-size: 1rem;
    font-weight: 700;
    letter-spacing: 1px;
    text-transform: uppercase;
    margin-bottom: 1rem;
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }

  .section-title::after {
    content: '';
    flex: 1;
    height: 1px;
    background: var(--border);
  }

  .feedback-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 1rem;
    margin-bottom: 2rem;
  }

  .feedback-card {
    border-radius: 14px;
    padding: 1.25rem;
    border: 1px solid;
  }

  .feedback-card.strength {
    background: rgba(0, 255, 148, 0.05);
    border-color: rgba(0, 255, 148, 0.2);
  }

  .feedback-card.improvement {
    background: rgba(255, 149, 0, 0.05);
    border-color: rgba(255, 149, 0, 0.2);
  }

  .feedback-icon {
    font-size: 1.2rem;
    margin-bottom: 0.5rem;
    display: block;
  }

  .feedback-text {
    font-size: 0.88rem;
    line-height: 1.6;
    color: var(--text);
  }

  /* REWRITTEN BULLET */
  .bullet-section {
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: 14px;
    padding: 1.5rem;
    margin-bottom: 2rem;
    position: relative;
    overflow: hidden;
  }

  .bullet-section::before {
    content: '';
    position: absolute;
    left: 0;
    top: 0;
    bottom: 0;
    width: 3px;
    background: linear-gradient(180deg, var(--accent), var(--accent2));
  }

  .bullet-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 0.75rem;
  }

  .bullet-label {
    font-size: 0.75rem;
    color: var(--accent);
    letter-spacing: 1px;
    text-transform: uppercase;
  }

  .copy-btn {
    background: rgba(0, 194, 255, 0.1);
    border: 1px solid rgba(0, 194, 255, 0.3);
    border-radius: 6px;
    color: var(--accent);
    font-family: 'DM Sans', sans-serif;
    font-size: 0.75rem;
    padding: 0.25rem 0.65rem;
    cursor: pointer;
    transition: all 0.2s;
  }

  .copy-btn:hover { background: rgba(0, 194, 255, 0.2); }

  .copy-btn.copied {
    background: rgba(0, 255, 148, 0.1);
    border-color: rgba(0, 255, 148, 0.3);
    color: var(--accent3);
  }

  .bullet-text {
    font-size: 0.9rem;
    line-height: 1.7;
    color: var(--text);
  }

  /* SUMMARY */
  .summary-section {
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: 14px;
    padding: 1.5rem;
    margin-bottom: 2rem;
    text-align: center;
  }

  .summary-text {
    font-size: 0.95rem;
    line-height: 1.8;
    color: var(--text2);
    font-style: italic;
  }

  /* ACTIONS */
  .actions-row {
    display: flex;
    gap: 1rem;
    justify-content: center;
    margin-bottom: 3rem;
    flex-wrap: wrap;
  }

  .btn-secondary {
    padding: 0.75rem 2rem;
    background: transparent;
    border: 1px solid var(--border);
    border-radius: 10px;
    color: var(--text2);
    font-family: 'DM Sans', sans-serif;
    font-size: 0.9rem;
    cursor: pointer;
    transition: all 0.2s;
  }

  .btn-secondary:hover {
    border-color: var(--accent);
    color: var(--accent);
  }

  .btn-secondary.confirmed {
    border-color: rgba(0, 255, 148, 0.4);
    color: var(--accent3);
  }

  .btn-primary {
    padding: 0.75rem 2rem;
    background: linear-gradient(135deg, var(--accent2), var(--accent));
    border: none;
    border-radius: 10px;
    color: #fff;
    font-family: 'Syne', sans-serif;
    font-size: 0.9rem;
    font-weight: 700;
    cursor: pointer;
    transition: all 0.2s;
  }

  .btn-primary:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 20px rgba(0, 119, 255, 0.3);
  }

  /* LOADING */
  .loading-screen {
    min-height: 60vh;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 2rem;
    padding: 4rem 2rem;
  }

  .loader {
    width: 80px;
    height: 80px;
    border-radius: 50%;
    border: 3px solid var(--surface2);
    border-top-color: var(--accent);
    animation: spin 1s linear infinite;
  }

  @keyframes spin {
    to { transform: rotate(360deg); }
  }

  .loading-text {
    font-family: 'Syne', sans-serif;
    font-size: 1.2rem;
    color: var(--text2);
    text-align: center;
  }

  .loading-steps {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    text-align: center;
  }

  .loading-step {
    font-size: 0.85rem;
    color: var(--text2);
    opacity: 0.6;
    transition: all 0.3s;
  }

  .loading-step.active {
    color: var(--accent);
    opacity: 1;
  }

  /* FOOTER */
  footer {
    border-top: 1px solid var(--border);
    padding: 2rem;
    text-align: center;
    color: var(--text2);
    font-size: 0.8rem;
  }

  footer a { color: var(--accent); text-decoration: none; }

  @media (max-width: 600px) {
    .form-row { grid-template-columns: 1fr; }
    .scores-grid { grid-template-columns: 1fr; }
    .feedback-grid { grid-template-columns: 1fr; }
    h1 { font-size: 2rem; }
  }
`;

function getScoreColor(score, max = 10) {
  const pct = (score / max) * 100;
  if (pct >= 80) return "#00ff94";
  if (pct >= 60) return "#00c2ff";
  if (pct >= 40) return "#ff9500";
  return "#ff4444";
}

function getGrade(score) {
  if (score >= 85) return { label: "Excellent", cls: "grade-excellent" };
  if (score >= 70) return { label: "Good", cls: "grade-good" };
  if (score >= 50) return { label: "Fair", cls: "grade-fair" };
  return { label: "Needs Work", cls: "grade-poor" };
}

const SCORE_LABELS = {
  relevance_score: "Relevance",
  impact_score: "Impact",
  clarity_score: "Clarity",
  keywords_score: "Keywords",
  structure_score: "Structure",
};

const LOADING_STEPS = [
  "Uploading your resume...",
  "Extracting document content...",
  "Analysing against job requirements...",
  "Scoring 5 key categories...",
  "Generating personalised feedback...",
];

export default function App() {
  const [page, setPage] = useState("upload");
  const [loading, setLoading] = useState(false);
  const [loadingStep, setLoadingStep] = useState(0);
  const [results, setResults] = useState(null);
  const [error, setError] = useState("");
  const [file, setFile] = useState(null);
  const [dragOver, setDragOver] = useState(false);
  const [form, setForm] = useState({
    name: "",
    email: "",
    jobTitle: "",
    jobDesc: "",
  });
  const [copied, setCopied] = useState(false);
  const [shared, setShared] = useState(false);
  const fileRef = useRef();

  useEffect(() => {
    const hash = window.location.hash;
    if (hash.startsWith("#r=")) {
      try {
        const decoded = JSON.parse(decodeURIComponent(hash.slice(3)));
        setResults(decoded);
        setPage("results");
      } catch {}
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) {
      setError("Please upload your resume PDF.");
      return;
    }
    if (!form.jobTitle.trim()) {
      setError("Please enter the job title you are applying for.");
      return;
    }

    setError("");
    setLoading(true);
    setPage("loading");

    const stepInterval = setInterval(() => {
      setLoadingStep((s) => Math.min(s + 1, LOADING_STEPS.length - 1));
    }, 2500);

    try {
      const fd = new FormData();
      fd.append("data", file, file.name);
      fd.append("jobTitle", form.jobTitle.trim());
      fd.append("name", form.name.trim());
      fd.append("email", form.email.trim());

      const res = await fetch(WEBHOOK_URL, {
        method: "POST",
        body: fd,
      });

      const json = await res.json();
      clearInterval(stepInterval);

      if (json.success && json.data) {
        setResults(json.data);
        setPage("results");
      } else {
        throw new Error("Invalid response");
      }
    } catch (err) {
      clearInterval(stepInterval);
      setError("Something went wrong. Please try again.");
      setPage("upload");
    } finally {
      setLoading(false);
      setLoadingStep(0);
    }
  };

  const reset = () => {
    window.location.hash = "";
    setPage("upload");
    setResults(null);
    setError("");
    setFile(null);
    setForm({ name: "", email: "", jobTitle: "", jobDesc: "" });
    setCopied(false);
    setShared(false);
  };

  const copyBullet = () => {
    navigator.clipboard.writeText(results.rewritten_bullet);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const shareResults = () => {
    navigator.clipboard.writeText(window.location.href);
    setShared(true);
    setTimeout(() => setShared(false), 2000);
  };

  return (
    <>
      <style>{styles}</style>
      <div className="grid-bg" />
      <div className="glow" />
      <div className="glow2" />
      <div className="app">
        <nav>
          <button
            className="logo"
            onClick={reset}>
            Resume<span>IQ</span>
          </button>
          <div className="stepper">
            <span className={`step ${page === "upload" ? "active" : "done"}`}>
              Upload
            </span>
            <span className="step-sep">›</span>
            <span
              className={`step ${page === "loading" ? "active" : page === "results" ? "done" : ""}`}>
              Analysing
            </span>
            <span className="step-sep">›</span>
            <span className={`step ${page === "results" ? "active" : ""}`}>
              Results
            </span>
          </div>
          <div className="badge">AI Powered · Free</div>
        </nav>

        {page === "upload" && (
          <>
            <div className="hero">
              <div className="hero-tag">Powered by Groq LLaMA 3.3 70B</div>
              <h1>
                Get Your Resume
                <br />
                <span className="highlight">Reviewed by AI</span>
                <br />
                in Seconds
              </h1>
              <p className="hero-sub">
                Upload your resume, tell us the role you want — our AI analyses
                it across 5 key dimensions and gives you actionable feedback
                instantly. Free. No signup required.
              </p>
              <div className="stats-row">
                <div className="stat">
                  <span className="stat-num">5</span>
                  <span className="stat-label">Categories Scored</span>
                </div>
                <div className="stat">
                  <span className="stat-num">~10s</span>
                  <span className="stat-label">Analysis Time</span>
                </div>
                <div className="stat">
                  <span className="stat-num">100%</span>
                  <span className="stat-label">Free Forever</span>
                </div>
              </div>
            </div>

            <div className="form-card">
              <div className="card">
                <div className="card-title">Upload Your Resume</div>
                <div className="card-sub">
                  PDF format only · Max 10MB · Your data is never shared
                </div>

                {error && <div className="error-msg">{error}</div>}

                <form onSubmit={handleSubmit}>
                  <div className="form-row">
                    <div className="form-group">
                      <label>
                        Your Name <span className="optional">(optional)</span>
                      </label>
                      <input
                        type="text"
                        placeholder="Lauren Jude"
                        value={form.name}
                        onChange={(e) =>
                          setForm((f) => ({ ...f, name: e.target.value }))
                        }
                      />
                    </div>
                    <div className="form-group">
                      <label>
                        Email <span className="optional">(optional)</span>
                      </label>
                      <input
                        type="email"
                        placeholder="you@email.com"
                        value={form.email}
                        onChange={(e) =>
                          setForm((f) => ({ ...f, email: e.target.value }))
                        }
                      />
                    </div>
                  </div>

                  <div className="form-group">
                    <label>Job Title Applying For *</label>
                    <input
                      type="text"
                      placeholder="e.g. AI Automation Specialist, Product Manager..."
                      value={form.jobTitle}
                      onChange={(e) =>
                        setForm((f) => ({ ...f, jobTitle: e.target.value }))
                      }
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label>
                      Job Description{" "}
                      <span className="optional">
                        (optional — improves accuracy)
                      </span>
                    </label>
                    <textarea
                      placeholder="Paste the job description here for a more targeted analysis..."
                      value={form.jobDesc}
                      onChange={(e) =>
                        setForm((f) => ({ ...f, jobDesc: e.target.value }))
                      }
                    />
                    {form.jobDesc.trim() && (
                      <span className="jd-tip">
                        ✓ AI will match your resume against this specific role
                      </span>
                    )}
                  </div>

                  <div
                    className={`upload-zone ${dragOver ? "drag-over" : ""} ${file ? "has-file" : ""}`}
                    onDragOver={(e) => {
                      e.preventDefault();
                      setDragOver(true);
                    }}
                    onDragLeave={() => setDragOver(false)}
                    onDrop={(e) => {
                      e.preventDefault();
                      setDragOver(false);
                      const f = e.dataTransfer.files[0];
                      if (f?.type === "application/pdf") setFile(f);
                      else setError("Please upload a PDF file.");
                    }}>
                    <input
                      type="file"
                      accept=".pdf"
                      onChange={(e) => {
                        const f = e.target.files[0];
                        if (f) setFile(f);
                      }}
                    />
                    {file ? (
                      <>
                        <span className="upload-icon">✅</span>
                        <div className="upload-text">Resume uploaded</div>
                        <div className="file-name">{file.name}</div>
                      </>
                    ) : (
                      <>
                        <span className="upload-icon">📄</span>
                        <div className="upload-text">
                          Drop your PDF here or click to browse
                        </div>
                        <div className="upload-hint">PDF only · Max 10MB</div>
                      </>
                    )}
                  </div>

                  <button
                    type="submit"
                    className={`btn-submit ${loading ? "loading" : ""}`}
                    disabled={loading}>
                    {loading ? "Analysing..." : "Analyse My Resume →"}
                  </button>
                </form>
              </div>
            </div>
          </>
        )}

        {page === "loading" && (
          <div className="loading-screen">
            <div className="loader" />
            <div className="loading-text">Analysing your resume...</div>
            <div className="loading-steps">
              {LOADING_STEPS.map((step, i) => (
                <div
                  key={i}
                  className={`loading-step ${i === loadingStep ? "active" : ""}`}>
                  {i < loadingStep ? "✓ " : i === loadingStep ? "→ " : "  "}
                  {step}
                </div>
              ))}
            </div>
          </div>
        )}

        {page === "results" && results && (
          <div className="results">
            <button
              className="back-btn"
              onClick={reset}>
              ← Review Another Resume
            </button>
            <div className="results-header">
              <div className="hero-tag">Analysis Complete</div>
              <h1 style={{ fontSize: "2rem", marginBottom: "0.5rem" }}>
                Your Resume for{" "}
                <span className="highlight">{results.jobTitle}</span>
              </h1>
              <div className="overall-score">
                <span className="score-num">{results.overall_score}</span>
                <span className="score-label">/ 100</span>
              </div>
              <div>
                <span
                  className={`score-grade ${getGrade(results.overall_score).cls}`}>
                  {getGrade(results.overall_score).label}
                </span>
              </div>
            </div>

            <div className="scores-grid">
              {Object.entries(SCORE_LABELS).map(([key, label]) => (
                <div
                  key={key}
                  className="score-bar-card">
                  <div className="score-bar-header">
                    <span className="score-bar-label">{label}</span>
                    <span
                      className="score-bar-value"
                      style={{ color: getScoreColor(results[key]) }}>
                      {results[key]}/10
                    </span>
                  </div>
                  <div className="bar-track">
                    <div
                      className="bar-fill"
                      style={{
                        width: `${(results[key] / 10) * 100}%`,
                        background: getScoreColor(results[key]),
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>

            <div className="section-title">💪 Strengths</div>
            <div
              className="feedback-grid"
              style={{ marginBottom: "2rem" }}>
              {(Array.isArray(results.strengths)
                ? results.strengths
                : results.strengths.split(",").map((s) => s.trim())
              ).map((s, i) => (
                <div
                  key={i}
                  className="feedback-card strength">
                  <span className="feedback-icon">✅</span>
                  <div className="feedback-text">{s}</div>
                </div>
              ))}
            </div>

            <div className="section-title">🎯 Improvements</div>
            <div
              className="feedback-grid"
              style={{ marginBottom: "2rem" }}>
              {(Array.isArray(results.improvements)
                ? results.improvements
                : results.improvements.split(",").map((s) => s.trim())
              ).map((s, i) => (
                <div
                  key={i}
                  className="feedback-card improvement">
                  <span className="feedback-icon">💡</span>
                  <div className="feedback-text">{s}</div>
                </div>
              ))}
            </div>

            <div className="section-title">✍️ Rewritten Bullet Point</div>
            <div className="bullet-section">
              <div className="bullet-header">
                <div className="bullet-label">AI Suggested Improvement</div>
                <button
                  className={`copy-btn ${copied ? "copied" : ""}`}
                  onClick={copyBullet}>
                  {copied ? "✓ Copied!" : "Copy"}
                </button>
              </div>
              <div className="bullet-text">{results.rewritten_bullet}</div>
            </div>

            <div className="section-title">📋 AI Summary</div>
            <div className="summary-section">
              <div className="summary-text">"{results.summary}"</div>
            </div>

            <div className="actions-row">
              <button
                className="btn-secondary"
                onClick={reset}>
                Review Another Resume
              </button>
              <button
                className={`btn-secondary ${shared ? "confirmed" : ""}`}
                onClick={shareResults}>
                {shared ? "✓ Link Copied!" : "Share Results"}
              </button>
              <button
                className="btn-primary"
                onClick={() => window.print()}>
                Save Results
              </button>
            </div>
          </div>
        )}

        <footer>
          Built by{" "}
          <a
            href="https://laurens-potfolio.vercel.app"
            target="_blank"
            rel="noreferrer">
            Lauren Jude
          </a>{" "}
          · AI Automation Specialist · Powered by n8n + Groq LLaMA 3.3 70B
        </footer>
      </div>
    </>
  );
}
