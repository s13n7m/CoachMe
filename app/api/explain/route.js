const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

const ALLOWED_MODELS = {
    "sonnet": "claude-sonnet-5",
    "haiku": "claude-haiku-4-5-20251001",
};
const DEFAULT_MODEL = "sonnet";

const TRACKS = ["sql", "python", "ml"];
const MODES = ["trainer", "quiz"];
const KINDS = ["solution", "attempt", "grade"];
const RATE_LIMIT_PER_HOUR = 30;
const MAX_TOKENS = 1500;

const SYSTEM_PROMPT =
    "You are coaching an experienced candidate one-on-one, preparing them for " +
    "interviews for a Senior/Staff Data Scientist role on PayPal's Consumer " +
    "Portfolio Growth team - a live SQL/Python technical exercise and a separate " +
    "Machine Learning Fundamentals discussion (5+ years of data science/analytics " +
    "experience, fluent in SQL and Python, comfortable with causal inference, " +
    "segmentation, and funnel analysis). They are not a student, and this is not " +
    "a lecture - talk to them directly, one person to another, the way a mentor " +
    "would sitting next to them. Address them in the second person throughout: " +
    "say things like 'your query does X', 'here you're using Y because...', " +
    "'you should call out Z when you say this out loud', 'the way you can answer " +
    "this is...'. Never slip into third-person or passive descriptions like " +
    "'this query does X' or 'the candidate should note...'. They want two things " +
    "together, clearly separated:\n" +
    "1. The mechanics, explained at undergrad level of clarity - walk them " +
    "through the query clause by clause (SQL) or the code line by line (Python/" +
    "pandas), naming what each step produces and why it's the right approach for " +
    "the business question, assuming no gaps in their understanding.\n" +
    "2. How to frame that same explanation out loud in the interview itself - " +
    "how they, as a strong senior candidate, should structure and narrate the " +
    "answer verbally: what to say first, how to signal their reasoning behind " +
    "the approach as they go, and what to proactively call out (edge cases, why " +
    "this approach over an alternative, performance/scale considerations) to " +
    "demonstrate seniority.\n" +
    "Present these as two clearly separated parts, each starting with a bolded " +
    "lead-in (e.g. **The mechanics** and **How to say this in the interview**) - " +
    "do not use markdown headers. Within each part use a numbered list for the " +
    "steps, fenced code blocks with the language tag for any SQL/Python snippets, " +
    "and backticks around column names, table names, and identifiers. Keep the " +
    "combined response under 500 words.";

const GRADE_SYSTEM_PROMPT =
    "You are coaching an experienced candidate one-on-one, preparing them for " +
    "PayPal's Consumer Portfolio Growth Machine Learning Fundamentals interview - " +
    "a 30-minute live discussion, not a coding exercise. They are not a student - " +
    "talk to them directly, one person to another, the way a mentor would. " +
    "Address them in the second person throughout (e.g. 'you're missing...', " +
    "'you correctly note...', 'you should also mention...'). You'll be given an " +
    "interview question, a model answer covering the key points a strong answer " +
    "should hit, and the candidate's own typed answer. Grade their answer: start " +
    "with a one-line verdict in bold - **Strong**, **Needs work**, or **Off " +
    "track** - then in a short paragraph or a few numbered points, tell them " +
    "specifically what they got right and what's missing, vague, or incorrect " +
    "compared to the model answer. Engage with what they actually wrote rather " +
    "than reciting the model answer back at them - if they used different but " +
    "equally valid terminology or examples, say so rather than marking it wrong. " +
    "Keep it honest but encouraging. Format as clean Markdown (no headers), " +
    "under 300 words.";

const CONCEPT_GRADE_SYSTEM_PROMPT =
    "You are grading an experienced candidate's typed answer against a specific " +
    "checklist of key concepts for a PayPal Consumer Portfolio Growth Machine " +
    "Learning Fundamentals interview question. You'll be given the interview " +
    "question, a numbered checklist of key concepts a strong answer should " +
    "cover, and the candidate's own typed answer. For each concept, decide " +
    "whether the answer clearly demonstrates it - give credit for correct " +
    "understanding even if they use different wording, phrasing, or examples " +
    "than the checklist; do not require a verbatim match, and do not give " +
    "credit for a concept that is not genuinely present just because related " +
    "words appear nearby. " +
    "Respond in EXACTLY this structure and nothing before it:\n" +
    "Line 1, alone, in exactly this form with no other text on it: " +
    "COVERED: <n>/<total> (where <n> is how many concepts were covered and " +
    "<total> is the total number of concepts given).\n" +
    "Then a blank line, then a markdown bullet list with exactly one line per " +
    "concept, in the same order given, each starting with the literal " +
    "character ✓ if covered or ✗ if not covered, then a space, then the " +
    "concept in bold, then a short dash-separated clause (no more than one " +
    "sentence) grounded in what the candidate actually wrote, or 'not " +
    "mentioned' if it's genuinely absent.\n" +
    "Then a blank line, then a short closing paragraph (2-3 sentences) of " +
    "honest, encouraging overall feedback, speaking directly to the candidate " +
    "in the second person.\n" +
    "Do not use markdown headers. Do not add any text, preamble, or verdict " +
    "before the COVERED line.";

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
    const modelKey = Object.prototype.hasOwnProperty.call(ALLOWED_MODELS, body.model) ?
        body.model :
        DEFAULT_MODEL;
    const model = ALLOWED_MODELS[modelKey];
    const questionId = Number.isInteger(body.questionId) && body.questionId >= 0 && body.questionId < 1000 ?
        body.questionId :
        null;
    const ask = capped(body.ask, 1000);
    const prompt = typeof body.prompt === "string" && body.prompt.length <= 1000 ? body.prompt : "";
    const solution = capped(body.solution, 4000);
    const userCode = kind === "attempt" ? capped(body.userCode, 4000) : null;
    const studentAnswer = kind === "grade" ? capped(body.studentAnswer, 3000) : null;
    const keyConcepts = kind === "grade" && Array.isArray(body.keyConcepts) ?
        body.keyConcepts.filter((c) => typeof c === "string" && c.length > 0 && c.length <= 200).slice(0, 10) :
        null;

    if (!track || !mode || !kind || questionId === null || !ask || !solution) {
        return json({ error: "Bad request." }, 400);
    }
    if (kind === "attempt" && !userCode) {
        return json({ error: "Run some code first, then ask what's wrong." }, 400);
    }
    if (kind === "grade" && !studentAnswer) {
        return json({ error: "Write an answer first, then check it." }, 400);
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
        token, { headers: { Prefer: "count=exact", Range: "0-0" } }
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
    const env = track === "sql" ?
        "Dialect: SQLite (running in-browser via sql.js)." :
        track === "python" ?
        "Environment: Python with pandas, numpy and scipy (running in-browser via Pyodide). Answers are assigned to a variable named result." :
        "This is a conceptual Machine Learning Fundamentals discussion question, not a coding exercise.";

    let userMessage =
        env +
        "\n\nInterview question: " + ask +
        (prompt ? "\nTask spec: " + prompt : "") +
        "\n\n" + (kind === "grade" ? "Model answer" : "Official solution") + ":\n" + solution;

    if (kind === "attempt") {
        userMessage +=
            "\n\nYour attempt (which did NOT pass):\n" + userCode +
            "\n\nTell them specifically where their attempt diverges from a correct approach and how to fix it, then briefly walk them through the corrected reasoning - speaking directly to them the whole time (e.g. 'your query misses...', 'you need to add...').";
    } else if (kind === "grade" && keyConcepts && keyConcepts.length) {
        userMessage +=
            "\n\nYour answer:\n" + studentAnswer +
            "\n\nKey concepts a strong answer should cover:\n" +
            keyConcepts.map((c, i) => (i + 1) + ". " + c).join("\n") +
            "\n\nGrade this answer against the key concepts checklist above, following the exact output format specified.";
    } else if (kind === "grade") {
        userMessage +=
            "\n\nYour answer:\n" + studentAnswer +
            "\n\nGrade this answer against the model answer above.";
    } else {
        userMessage += "\n\nExplain this solution to them schematically, step by step. Be concise but keep all relevant information clear.";
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
            system: kind === "grade" ?
                (keyConcepts && keyConcepts.length ? CONCEPT_GRADE_SYSTEM_PROMPT : GRADE_SYSTEM_PROMPT) :
                SYSTEM_PROMPT,
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