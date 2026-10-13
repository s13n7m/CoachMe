export const LOGO_HTML = `<span class="logo" role="img" aria-label="CoachMe"><svg class="logo-mark" viewBox="0 0 100 100" fill="none" aria-hidden="true"><path class="cm-ring" d="M74 26 A32 32 0 1 0 74 74" stroke-width="13" stroke-linecap="round"/><polyline class="cm-tick" points="36,52 47,63 65,38" stroke-width="11" stroke-linecap="round" stroke-linejoin="round"/></svg><span class="logo-word"><span class="cm-coach">Coach</span><span class="cm-me">Me</span></span></span>`;

function makeHeader({ tick, subtitle, quizHref, quizLabel, quizLocked, activeTrack }) {
  const sqlSelected = activeTrack === "sql" ? " selected" : "";
  const pySelected = activeTrack === "python" ? " selected" : "";
  const mlSelected = activeTrack === "ml" ? " selected" : "";
  const finalPrepSelected = activeTrack === "finalprep" ? " selected" : "";
  const tradingSelected = activeTrack === "trading" ? " selected" : "";
  return `
  <div class="brand">
    ${LOGO_HTML}
    <select id="trainerSelect" class="trainer-select">
      <option value="/"${sqlSelected}>SQL Trainer</option>
      <option value="/python"${pySelected}>Python Trainer</option>
      <option value="/ml"${mlSelected}>ML Fundamentals</option>
      <option value="/final-prep"${finalPrepSelected}>Final Prep</option>
      <option value="/trading"${tradingSelected}>Trading</option>
    </select>
    <span class="tick" id="qtick">${tick}</span>
    <small>${subtitle}</small>
  </div>
  <div class="header-actions">
    <button class="theme-toggle" id="themeToggle" type="button" aria-label="Toggle dark mode"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path></svg></button>
    <a class="quiz-link${quizLocked ? " locked" : ""}" id="${quizLocked !== undefined ? "quizBtn" : "backBtn"}" href="${quizHref}">${quizLabel}</a>
  </div>
  <div class="progress" id="progressLine">
    <span class="pdone"><b id="doneCount">0</b></span>
    <span class="pmid"> of </span>
    <span class="bar"><i id="progBar"></i></span>
    <span class="ptotal"><span id="totalCount">0</span></span>
    <span class="pend"> cleared</span>
    <span class="qtimer qtimer-scrolled" id="qtimerScrolled">00:00</span>
  </div>
  <button class="sidebar-toggle" id="sidebarToggle" type="button" aria-label="Hide topic list">&#8249;</button>
`;
}

export const HEADER_HTML = makeHeader({
  tick: "Q1",
  subtitle: "Consumer Portfolio Growth &middot; live grading on a payments dataset",
  quizHref: "/quiz",
  quizLabel: "Quiz &rarr;",
  quizLocked: true,
  activeTrack: "sql",
});

export const QUIZ_HEADER_HTML = makeHeader({
  tick: "Quiz",
  subtitle: "Certification quiz &middot; one question per topic",
  quizHref: "/",
  quizLabel: "&larr; Back to Trainer",
  quizLocked: undefined,
  activeTrack: "sql",
});

export const PYTHON_HEADER_HTML = makeHeader({
  tick: "Q1",
  subtitle: "Consumer Portfolio Growth &middot; pandas data wrangling and analysis",
  quizHref: "/python-quiz",
  quizLabel: "Quiz &rarr;",
  quizLocked: true,
  activeTrack: "python",
});

export const PYTHON_QUIZ_HEADER_HTML = makeHeader({
  tick: "Quiz",
  subtitle: "Certification quiz &middot; one question per topic",
  quizHref: "/python",
  quizLabel: "&larr; Back to Trainer",
  quizLocked: undefined,
  activeTrack: "python",
});

export const ML_HEADER_HTML = makeHeader({
  tick: "Q1",
  subtitle: "Consumer Portfolio Growth &middot; Machine Learning Fundamentals discussion",
  quizHref: "#",
  quizLabel: "Quiz (soon)",
  quizLocked: true,
  activeTrack: "ml",
});

export const FINAL_PREP_HEADER_HTML = makeHeader({
  tick: "Q1",
  subtitle: "Final interview prep &middot; mixed SQL + Python drills, timed mock included",
  quizHref: "#",
  quizLabel: "Quiz (soon)",
  quizLocked: true,
  activeTrack: "finalprep",
});

export const TRADING_HEADER_HTML = makeHeader({
  tick: "Q1",
  subtitle: "FX Trading Basics &middot; market structure, risk, FVG &amp; IFVG",
  quizHref: "#",
  quizLabel: "Quiz (soon)",
  quizLocked: true,
  activeTrack: "trading",
});
