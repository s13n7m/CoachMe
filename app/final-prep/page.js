"use client";

import Script from "next/script";
import { FINAL_PREP_HEADER_HTML } from "../header-markup";

export default function FinalPrepPage() {
  return (
    <>
      <header dangerouslySetInnerHTML={{ __html: FINAL_PREP_HEADER_HTML }} />

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
            Sign in to save progress
          </h2>
          <p style={{ margin: "0 0 18px", color: "#54708e", fontSize: 13.5 }}>
            Your solved questions and history sync across devices once you're
            signed in.
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
        Loading the SQL and Python engines... this can take a little longer
        since both are loading together.
      </div>

      <Script
        src="https://cdnjs.cloudflare.com/ajax/libs/sql.js/1.8.0/sql-wasm.js"
        strategy="beforeInteractive"
      />
      <Script
        src="https://cdn.jsdelivr.net/pyodide/v0.26.4/full/pyodide.js"
        strategy="beforeInteractive"
      />
      <Script
        src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2"
        strategy="beforeInteractive"
      />
      <Script src="/final-prep-shared.js" strategy="beforeInteractive" />
      <Script
        id="trainer-config"
        strategy="beforeInteractive"
        dangerouslySetInnerHTML={{
          __html: `window.__SUPABASE_URL__=${JSON.stringify(
            process.env.NEXT_PUBLIC_SUPABASE_URL || ""
          )};window.__SUPABASE_ANON_KEY__=${JSON.stringify(
            process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ""
          )};`,
        }}
      />
      <Script src="/final-prep-trainer.js" strategy="afterInteractive" />
      <Script src="/email-auth.js" strategy="afterInteractive" />
      <Script src="/account-menu.js" strategy="afterInteractive" />
    </>
  );
}
