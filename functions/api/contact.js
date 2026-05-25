// functions/api/contact.js
//
// Cloudflare Pages Function — POST /api/contact
//
// Security layers:
//   1. Origin check (CORS) — only your own site can submit
//   2. Content-Type check
//   3. Field validation: required, length caps, email regex, CR/LF blocked (header-injection defense)
//   4. Honeypot field (`website`) — bots fill every field; humans don't see it
//   5. Time check — submissions <2s after page load are bots
//   6. Per-IP rate limit (in-memory) — 5 requests per 10 minutes
//   7. Generic client errors (real errors only in server logs)

const ALLOWED_ORIGINS = [
    "https://cosmosnextgen.com",
    "https://www.cosmosnextgen.com",
    "https://cosmos-test2.pages.dev",
    "https://cosmos-test-finally.pages.dev",
];

// In-memory rate-limit store. Resets per worker instance (good enough as a basic abuse brake;
// not a substitute for Cloudflare's edge rate-limit rules if you need stronger guarantees).
const rateBuckets = new Map();
const RATE_LIMIT = 5;
const RATE_WINDOW_MS = 10 * 60 * 1000; // 10 minutes

const LIMITS = {
    name: 200,
    email: 200,
    phone: 50,
    message: 5000,
};

// RFC-5322 light: good enough to block 99% of garbage without rejecting valid addresses.
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function jsonResponse(payload, status, extraHeaders = {}) {
    return new Response(JSON.stringify(payload), {
        status,
        headers: { "Content-Type": "application/json", ...extraHeaders },
    });
}

function isAllowedOrigin(request) {
    const origin = request.headers.get("Origin");
    if (!origin) return true; // same-origin requests don't send Origin
    return ALLOWED_ORIGINS.includes(origin);
}

function getClientIP(request) {
    return (
        request.headers.get("CF-Connecting-IP") ||
        request.headers.get("X-Forwarded-For") ||
        "unknown"
    );
}

function checkRateLimit(ip) {
    const now = Date.now();
    const hits = (rateBuckets.get(ip) || []).filter((t) => now - t < RATE_WINDOW_MS);
    if (hits.length >= RATE_LIMIT) return false;
    hits.push(now);
    rateBuckets.set(ip, hits);

    // Opportunistic cleanup to keep the map small.
    if (rateBuckets.size > 5000) {
        for (const [k, v] of rateBuckets) {
            const fresh = v.filter((t) => now - t < RATE_WINDOW_MS);
            if (fresh.length === 0) rateBuckets.delete(k);
            else rateBuckets.set(k, fresh);
        }
    }
    return true;
}

// Block CR/LF characters in single-line fields. Defends against email-header injection
// when these values flow into a `reply_to` or subject line.
function hasControlChars(s) {
    return /[\r\n]/.test(s);
}

export async function onRequestPost(context) {
    const { request, env } = context;

    try {
        if (!isAllowedOrigin(request)) {
            return jsonResponse({ error: "Forbidden" }, 403);
        }

        if (!(request.headers.get("Content-Type") || "").includes("application/json")) {
            return jsonResponse({ error: "Unsupported Media Type" }, 415);
        }

        const ip = getClientIP(request);
        if (!checkRateLimit(ip)) {
            return jsonResponse(
                { error: "Too many requests. Please try again later." },
                429
            );
        }

        let body;
        try {
            body = await request.json();
        } catch {
            return jsonResponse({ error: "Invalid request body." }, 400);
        }

        // Honeypot: a bot fills every input it finds. The form has a hidden `website`
        // input that real users never see. If it's populated, pretend success and bail.
        if (body?.website) {
            return jsonResponse({ ok: true }, 200);
        }

        // Time check: humans take more than 2 seconds to fill a form.
        const startedAt = Number(body?.startedAt);
        if (Number.isFinite(startedAt) && Date.now() - startedAt < 2000) {
            return jsonResponse({ ok: true }, 200);
        }

        const name = String(body?.name || "").trim();
        const email = String(body?.email || "").trim();
        const phone = String(body?.phone || "").trim();
        const message = String(body?.message || "").trim();

        // Required check
        if (!name || !email || !phone || !message) {
            return jsonResponse({ error: "All fields are required." }, 400);
        }

        // Length caps
        if (
            name.length > LIMITS.name ||
            email.length > LIMITS.email ||
            phone.length > LIMITS.phone ||
            message.length > LIMITS.message
        ) {
            return jsonResponse({ error: "One or more fields are too long." }, 400);
        }

        // Header-injection defense for single-line fields
        if (hasControlChars(name) || hasControlChars(email) || hasControlChars(phone)) {
            return jsonResponse({ error: "Invalid characters in submission." }, 400);
        }

        // Email format
        if (!EMAIL_RE.test(email)) {
            return jsonResponse({ error: "Please enter a valid email." }, 400);
        }

        const apiKey = env.RESEND_API_KEY;
        if (!apiKey) {
            console.error("contact: RESEND_API_KEY is not set");
            return jsonResponse({ error: "Service temporarily unavailable." }, 500);
        }

        const fromEmail = "no-reply@cosmosnextgen.com";
        const subject = `New message from COSMOS website: ${name}`;

        const text =
            `New contact form submission:\n\n` +
            `Name: ${name}\n` +
            `Email: ${email}\n` +
            `Phone: ${phone}\n\n` +
            `Message:\n${message}\n`;

        const res = await fetch("https://api.resend.com/emails", {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${apiKey}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                from: `COSMOS Website <${fromEmail}>`,
                to: ["hr@cosmosnextgen.com"],
                reply_to: email,
                subject,
                text,
            }),
        });

        if (!res.ok) {
            const detail = await res.text().catch(() => "");
            console.error("contact: Resend send failed", res.status, detail);
            return jsonResponse({ error: "Failed to send. Please try again." }, 502);
        }

        return jsonResponse({ ok: true }, 200);
    } catch (e) {
        console.error("contact: unhandled error", e);
        return jsonResponse({ error: "Service temporarily unavailable." }, 500);
    }
}
