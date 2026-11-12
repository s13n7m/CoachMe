const svg = (body) =>
  `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${body}</svg>`;

const ICON_USER = svg(`<path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle>`);
const ICON_SETTINGS = svg(`<circle cx="12" cy="12" r="3"></circle><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 1 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 1 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 1 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 1 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"></path>`);
const ICON_LEARNING = svg(`<path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"></path><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"></path>`);
const ICON_PREFERENCES = svg(`<line x1="4" y1="21" x2="4" y2="14"></line><line x1="4" y1="10" x2="4" y2="3"></line><line x1="12" y1="21" x2="12" y2="12"></line><line x1="12" y1="8" x2="12" y2="3"></line><line x1="20" y1="21" x2="20" y2="16"></line><line x1="20" y1="12" x2="20" y2="3"></line><line x1="1" y1="14" x2="7" y2="14"></line><line x1="9" y1="8" x2="15" y2="8"></line><line x1="17" y1="16" x2="23" y2="16"></line>`);
const ICON_UPGRADE = svg(`<polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon>`);
const ICON_SIGN_OUT = svg(`<path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path><polyline points="16 17 21 12 16 7"></polyline><line x1="21" y1="12" x2="9" y2="12"></line>`);

// Account icon + dropdown, shown once the user is signed in (see showAccountMenu() in each
// trainer). Open/close behaviour lives in public/account-menu.js. Each item carries a
// data-action so later stages can attach the real screens; only Sign Out is wired today.
const ACCOUNT_MENU_HTML = `
    <div class="account-menu" id="accountMenu">
      <button class="account-btn" id="accountBtn" type="button" aria-label="Account menu" aria-haspopup="menu" aria-expanded="false" aria-controls="accountDropdown">${ICON_USER}</button>
      <div class="account-dropdown" id="accountDropdown" role="menu" aria-labelledby="accountBtn" hidden>
        <button class="account-item" type="button" role="menuitem" data-action="account-settings">${ICON_SETTINGS}<span>Account Settings</span></button>
        <button class="account-item" type="button" role="menuitem" data-action="my-learning">${ICON_LEARNING}<span>My Learning</span></button>
        <button class="account-item" type="button" role="menuitem" data-action="preferences">${ICON_PREFERENCES}<span>Preferences</span></button>
        <button class="account-item account-item-upgrade" type="button" role="menuitem" data-action="upgrade">${ICON_UPGRADE}<span>Upgrade</span></button>
        <div class="account-sep" role="separator"></div>
        <button class="account-item" id="signOutBtn" type="button" role="menuitem" data-action="sign-out">${ICON_SIGN_OUT}<span>Sign Out</span></button>
      </div>
    </div>`;

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
    <a class="quiz-link${quizLocked ? " locked" : ""}" id="${quizLocked !== undefined ? "quizBtn" : "backBtn"}" href="${quizHref}">${quizLabel}</a>${ACCOUNT_MENU_HTML}
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
