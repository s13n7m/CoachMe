"use client";

import Script from "next/script";
import { PYTHON_QUIZ_HEADER_HTML } from "../header-markup";

export default function PythonQuizPage() {
  return (
    <>
      <header dangerouslySetInnerHTML={{ __html: PYTHON_QUIZ_HEADER_HTML }} />

      <button id="signOutBtn" className="sign-out-btn">
        Sign out
      </button>

      <div
        id="authGate"
        style={{
          display: "none",
          position: "fixed",
          inset: 0,
          background: "rgba(2,10,26,0.72)",
          zIndex: 100,
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div
          style={{
            background: "#fff",
            borderRadius: 10,
            padding: "28px 32px",
            width: "calc(100% - 40px)",
            maxWidth: 340,
            boxSizing: "border-box",
            textAlign: "center",
            fontFamily:
              "-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif",
          }}
        >
          <h2 style={{ margin: "0 0 8px", color: "#003087", fontSize: 18 }}>
            Sign in to continue
          </h2>
          <p style={{ margin: "0 0 18px", color: "#54708e", fontSize: 13.5 }}>
            Sign in with the same account you used on the trainer.
          </p>
          <button
            id="googleSignInBtn"
            style={{
              background: "#0070ba",
              color: "#fff",
              border: "none",
              borderRadius: 99,
              padding: "10px 20px",
              fontSize: 14,
              fontWeight: 600,
              cursor: "pointer",
              touchAction: "manipulation",
            }}
          >
            Sign in with Google
          </button>
        </div>
      </div>

      <div id="app" className="loading">
        Loading the Python engine (pandas, numpy, scipy)...
      </div>

      <Script
        src="https://cdn.jsdelivr.net/pyodide/v0.26.4/full/pyodide.js"
        strategy="beforeInteractive"
      />
      <Script
        src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2"
        strategy="beforeInteractive"
      />
      <Script src="/python-shared.js" strategy="beforeInteractive" />
      <Script
        id="quiz-config"
        strategy="beforeInteractive"
        dangerouslySetInnerHTML={{
          __html: `window.__SUPABASE_URL__=${JSON.stringify(
            process.env.NEXT_PUBLIC_SUPABASE_URL || ""
          )};window.__SUPABASE_ANON_KEY__=${JSON.stringify(
            process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ""
          )};`,
        }}
      />
      <Script src="/python-quiz.js" strategy="afterInteractive" />
      <Script src="/email-auth.js" strategy="afterInteractive" />
    </>
  );
}
