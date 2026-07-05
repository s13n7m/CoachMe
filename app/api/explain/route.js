const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

const ALLOWED_MODELS = {
  "sonnet": "claude-sonnet-5",
  "haiku": "claude-haiku-4-5-20251001",
};
const DEFAULT_MODEL = "sonnet";

const TRACKS = ["sql", "python"];
const MODES = ["trainer", "quiz"];
const KINDS = ["solution", "attempt"];
const RATE_LIMIT_PER_HOUR = 30;
const MAX_TOKENS = 1500;

const SYSTEM_PROMPT =
  "You are a patient SQL and Python tutor inside an interview-prep app. " +
  "The student is preparing for a data science interview. Explain schematically, " +
  "step by step, at the level of a bright undergraduate. Walk through the code " +
  "clause by clause (SQL) or line by line (Python/pandas), describing what the " +
  "intermediate result looks like after each step and why the approach fits the " +
  "question. Format the response as clean Markdown: use a numbered list for the " +
  "steps, put any SQL/Python snippets in fenced code blocks with the language " +
  "tag, and wrap column names, table names, and identifiers in backticks. Do not " +
  "use headers. Keep it under 400 words.";

function json(body, status) {
  return new Response(JSON.stringify(body), {
    status: status || 200,
    headers: { "content-type": "application/json" },
  });
}

function capped(v, max) {
  return typeof v === "string" && v.length > 0 && v.length <= max ? v : null;
}

async function supaFetch(path, token, opts) {
  return fetch(SUPABASE_URL + "/rest/v1/" + path, {
    ...opts,
    headers: {
      apikey: SUPABASE_ANON_KEY,
      authorization: "Bearer " + token,
      "content-type": "application/json",
      ...((opts && opts.headers) || {}),
    },
  });
}

export async function POST(req) {
  if (!process.env.ANTHROPIC_API_KEY) {
    return json({ error: "Explanation service is not configured yet." }, 503);
  }

  // 1. Auth: verify the Supabase session JWT server-side.
  const authHeader = req.headers.get("authorization") || "";
  const token = authHeader.startsWith("Bearer ") ? authHeader.slice(7) : null;
  if (!token) return json({ error: "Sign in to use explanations." }, 401);

  const userRes = await fetch(SUPABASE_URL + "/auth/v1/user", {
    headers: { apikey: SUPABASE_ANON_KEY, authorization: "Bearer " + token },
  });
  if (!userRes.ok) return json({ error: "Sign in to use explanations." }, 401);
  const user = await userRes.json();
  if (!user || !user.id) return json({ error: "Sign in to use explanations." }, 401);

  // 2. Validate input against strict caps and allowlists.
  const body = await req.json().catch(() => null);
  if (!body) return json({ error: "Bad request." }, 400);

  const track = TRACKS.includes(body.track) ? body.track : null;
  const mode = MODES.includes(body.mode) ? body.mode : null;
  const kind = KINDS.includes(body.kind) ? body.kind : null;
  const modelKey = Object.prototype.hasOwnProperty.call(ALLOWED_MODELS, body.model)
    ? body.model
    : DEFAULT_MODEL;
  const model = ALLOWED_MODELS[modelKey];
  const questionId = Number.isInteger(body.questionId) && body.questionId >= 0 && body.questionId < 1000
    ? body.questionId
    : null;
  const ask = capped(body.ask, 1000);
  const prompt = typeof body.prompt === "string" && body.prompt.length <= 1000 ? body.prompt : "";
  const solution = capped(body.solution, 4000);
  const userCode = kind === "attempt" ? capped(body.userCode, 4000) : null;

  if (!track || !mode || !kind || questionId === null || !ask || !solution) {
    return json({ error: "Bad request." }, 400);
  }
  if (kind === "attempt" && !userCode) {
    return json({ error: "Run some code first, then ask what's wrong." }, 400);
  }

  // 3. Cache: solution explanations are generated once per question+model, ever.
  if (kind === "solution") {
    const cacheRes = await supaFetch(
      `explanations?track=eq.${track}&mode=eq.${mode}&question_id=eq.${questionId}&model=eq.${model}&select=content&limit=1`,
      token
    );
    if (cacheRes.ok) {
      const rows = await cacheRes.json();
      if (rows.length) return json({ content: rows[0].content, cached: true });
    }
  }

  // 4. Rate limit: cap fresh generations per user per hour.
  const since = new Date(Date.now() - 3600 * 1000).toISOString();
  const countRes = await supaFetch(
    `explain_requests?user_id=eq.${user.id}&created_at=gte.${since}&select=id`,
    token,
    { headers: { Prefer: "count=exact", Range: "0-0" } }
  );
  const contentRange = countRes.headers.get("content-range") || "";
  const total = parseInt(contentRange.split("/")[1], 10) || 0;
  if (total >= RATE_LIMIT_PER_HOUR) {
    return json({ error: "Rate limit reached - try again in a bit." }, 429);
  }
  await supaFetch("explain_requests", token, {
    method: "POST",
    body: JSON.stringify({ user_id: user.id }),
  });

  // 5. Build the fixed prompt and call Anthropic.
  const env = track === "sql"
    ? "Dialect: SQLite (running in-browser via sql.js)."
    : "Environment: Python with pandas, numpy and scipy (running in-browser via Pyodide). Answers are assigned to a variable named result.";

  let userMessage =
    env +
    "\n\nInterview question: " + ask +
    (prompt ? "\nTask spec: " + prompt : "") +
    "\n\nOfficial solution:\n" + solution;

  if (kind === "attempt") {
    userMessage +=
      "\n\nThe student's attempt (which did NOT pass):\n" + userCode +
      "\n\nIdentify specifically where the attempt diverges from a correct approach and how to fix it, then briefly walk through the corrected reasoning.";
  } else {
    userMessage += "\n\nExplain this solution schematically, step by step.";
  }

  const anthropicRes = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "x-api-key": process.env.ANTHROPIC_API_KEY,
      "anthropic-version": "2023-06-01",
      "content-type": "application/json",
    },
    body: JSON.stringify({
      model,
      max_tokens: MAX_TOKENS,
      system: SYSTEM_PROMPT,
      messages: [{ role: "user", content: userMessage }],
    }),
  });

  if (!anthropicRes.ok) {
    const errText = await anthropicRes.text().catch(() => "");
    console.error("Anthropic API error", anthropicRes.status, errText.slice(0, 500));
    return json({ error: "Explanation failed - try again." }, 502);
  }

  const data = await anthropicRes.json();
  const content = (data.content || [])
    .filter((b) => b.type === "text")
    .map((b) => b.text)
    .join("")
    .trim();
  if (!content) return json({ error: "Explanation failed - try again." }, 502);

  // 6. Cache the solution explanation (ignore races on the unique key).
  if (kind === "solution") {
    await supaFetch("explanations?on_conflict=track,mode,question_id,model", token, {
      method: "POST",
      headers: { Prefer: "resolution=ignore-duplicates" },
      body: JSON.stringify({ track, mode, question_id: questionId, model, content }),
    }).catch(() => {});
  }

  return json({ content, cached: false, model: modelKey });
}
