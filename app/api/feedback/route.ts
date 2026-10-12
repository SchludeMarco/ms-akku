import { randomBytes } from "node:crypto";

import { FEEDBACK_CATEGORIES, feedbackSchema } from "@/lib/feedback";

// Nimmt Feedback aus der App entgegen. Zwei Kanäle, beide optional:
// - E-Mail an den Betreiber über Resend (RESEND_API_KEY + FEEDBACK_TO_EMAIL)
// - Eintrag in feedback.md im Repository (FEEDBACK_GITHUB_TOKEN)
// Ohne Konfiguration antwortet der Endpunkt mit "not_configured".
//
// Datenschutz: Es wird nur gespeichert, was die Person selbst eingetippt hat.
// Keine IP-Adresse, kein User-Agent, keine Einträge aus der App. Die
// Kontaktadresse steht nur in der Mail, nie im Repository.
//
// Ein Eintrag in feedback.md ist ein Commit. Damit nicht jedes Feedback die
// App neu baut, überspringt vercel.json Commits, die nur feedback.md ändern.

const REPO = process.env.FEEDBACK_GITHUB_REPO || "SchludeMarco/ms-akku";
const BRANCH = process.env.FEEDBACK_GITHUB_BRANCH || "main";
const FEEDBACK_PATH = "feedback.md";

const FEEDBACK_HEADER = `# Feedback

Feedback aus der App (Mehr → „Feedback geben“), neueste oben. Kontaktadressen
werden hier nie gespeichert, sie stehen nur in der Mail an den Betreiber.
`;

// Feedback-Text kommt von beliebigen Personen: Markdown nicht zerbrechen lassen.
const sanitize = (text: string) =>
  text.replace(/\r\n?/g, "\n").replace(/</g, "&lt;").replace(/>/g, "&gt;");

function addEntry(content: string | null, heading: string, id: string, text: string) {
  const base = content && content.trim() ? content : FEEDBACK_HEADER;
  const quoted = sanitize(text)
    .split("\n")
    .map((line) => `> ${line}`.trimEnd())
    .join("\n");
  const entry = `## ${heading}\n\n<!-- id: ${id} -->\n\n${quoted}\n`;
  const marker = base.indexOf("\n## ");
  if (marker === -1) return `${base.trimEnd()}\n\n${entry}`;
  return `${base.slice(0, marker).trimEnd()}\n\n${entry}\n${base.slice(marker + 1)}`;
}

async function github(token: string, query: string, init: RequestInit = {}) {
  return fetch(`https://api.github.com/repos/${REPO}/contents/${FEEDBACK_PATH}${query}`, {
    ...init,
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: "application/vnd.github+json",
      "X-GitHub-Api-Version": "2022-11-28",
      "User-Agent": "ms-akku-feedback",
      ...(init.body ? { "Content-Type": "application/json" } : {}),
    },
    cache: "no-store",
  });
}

// Lesen, ändern, schreiben – mit Wiederholung, falls gleichzeitig jemand schrieb.
async function storeInRepository(token: string, heading: string, id: string, text: string) {
  for (let attempt = 0; attempt < 3; attempt++) {
    const read = await github(token, `?ref=${encodeURIComponent(BRANCH)}`);
    let content: string | null = null;
    let sha: string | undefined;
    if (read.ok) {
      const data = (await read.json()) as { content: string; sha: string };
      content = Buffer.from(data.content, "base64").toString("utf8");
      sha = data.sha;
    } else if (read.status !== 404) {
      throw new Error(`github read ${read.status}`);
    }
    const write = await github(token, "", {
      method: "PUT",
      body: JSON.stringify({
        message: `Feedback: ${heading}`,
        content: Buffer.from(addEntry(content, heading, id, text), "utf8").toString("base64"),
        branch: BRANCH,
        ...(sha ? { sha } : {}),
      }),
    });
    if (write.ok) return;
    if (write.status !== 409 && write.status !== 422) {
      throw new Error(`github write ${write.status}`);
    }
  }
  throw new Error("github write conflict");
}

async function sendMail(
  apiKey: string,
  toEmail: string,
  subject: string,
  lines: string[],
  contact: string,
) {
  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      from: process.env.FEEDBACK_FROM_EMAIL || "MS Akku Feedback <onboarding@resend.dev>",
      to: [toEmail],
      subject,
      text: lines.join("\n"),
      ...(contact ? { reply_to: contact } : {}),
    }),
    cache: "no-store",
  });
  if (!response.ok) throw new Error(`resend ${response.status}`);
}

export async function POST(request: Request) {
  const apiKey = process.env.RESEND_API_KEY;
  const toEmail = process.env.FEEDBACK_TO_EMAIL;
  const githubToken = process.env.FEEDBACK_GITHUB_TOKEN;
  const mailConfigured = Boolean(apiKey && toEmail);
  if (!mailConfigured && !githubToken) {
    return Response.json({ error: "not_configured" }, { status: 503 });
  }

  const parsed = feedbackSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) {
    return Response.json({ error: "invalid" }, { status: 400 });
  }
  const { category, message, area, contactEmail } = parsed.data;

  const label = FEEDBACK_CATEGORIES.find((item) => item.key === category)?.label ?? "Feedback";
  const now = new Date();
  // Berliner Zeit, lesbar in feedback.md: "2026-10-12 14:05"
  const date = now.toLocaleString("sv-SE", { timeZone: "Europe/Berlin", hour12: false }).slice(0, 16);
  const id = `fb-${now.toISOString().slice(0, 10).replace(/-/g, "")}-${randomBytes(3).toString("hex")}`;
  const heading = `${date} · ${label}${area ? ` · ${area}` : ""}`;

  let stored = false;
  if (githubToken) {
    try {
      await storeInRepository(githubToken, heading, id, message);
      stored = true;
    } catch (error) {
      console.error("feedback store error:", error instanceof Error ? error.message : error);
    }
  }

  let mailed = false;
  if (apiKey && toEmail) {
    try {
      await sendMail(
        apiKey,
        toEmail,
        `MS Akku Feedback: ${label}`,
        [
          `Kategorie: ${label}`,
          `Bereich: ${area ?? "(keine Angabe)"}`,
          `Kontakt: ${contactEmail || "(keine Angabe)"}`,
          "",
          message,
        ],
        contactEmail ?? "",
      );
      mailed = true;
    } catch (error) {
      console.error("feedback mail error:", error instanceof Error ? error.message : error);
    }
  }

  if (!stored && !mailed) {
    return Response.json({ error: "upstream" }, { status: 502 });
  }
  return Response.json({ ok: true });
}
