"use client";

import Script from "next/script";
import { HEADER_HTML } from "./header-markup";

export default function Page() {
  return (
    <>
      <div dangerouslySetInnerHTML={{ __html: HEADER_HTML }} />

      <button
        id="signOutBtn"
        style={{
          display: "none",
          position: "fixed",
          top: 14,
          right: 22,
          zIndex: 20,
          background: "#ffffff",
          color: "#54708e",
          border: "1px solid #d4dfec",
          borderRadius: 99,
          padding: "6px 14px",
          fontSize: 12.5,
          fontFamily:
            "-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif",
          cursor: "pointer",
        }}
      >
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
            maxWidth: 340,
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
            }}
          >
            Sign in with Google
          </button>
        </div>
      </div>

      <div id="app" className="loading">
        Loading the database engine...
      </div>

      <Script
        src="https://cdnjs.cloudflare.com/ajax/libs/sql.js/1.8.0/sql-wasm.js"
        strategy="beforeInteractive"
      />
      <Script
        src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2"
        strategy="beforeInteractive"
      />
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
      <Script src="/trainer.js" strategy="afterInteractive" />
    </>
  );
}
