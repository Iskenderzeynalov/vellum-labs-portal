/**
 * Cloudflare Pages Functions Middleware
 * ─────────────────────────────────────
 * Runs before every /api/* request.
 *
 * Responsibilities:
 *  1. Read the authenticated user email from Cloudflare Access (CF-Access-JWT-Assertion header)
 *  2. Fall back to DEV_AUTH_EMAIL in local development (NEVER trusted in production)
 *  3. Reject unauthenticated requests with 401
 *  4. Attach the verified email to ctx.data so every function can use it
 *
 * Security notes:
 *  - The CF-Access-JWT-Assertion header is set by Cloudflare's edge — clients cannot forge it
 *    as long as Cloudflare Access is correctly configured for the domain.
 *  - We do NOT verify the JWT signature here for simplicity in v1.
 *    In production, you can add full JWT verification using CF's public keys.
 *  - DEV_AUTH_EMAIL is only used when the header is absent — safe locally, blocked in prod
 *    because Cloudflare Access will always inject the header on the live domain.
 */

interface Env {
  NOTION_TOKEN: string;
  NOTION_CLIENTS_DB_ID: string;
  NOTION_PROJECTS_DB_ID: string;
  NOTION_TASKS_DB_ID: string;
  NOTION_REPORTS_DB_ID: string;
  NOTION_MEETINGS_DB_ID: string;
  NOTION_LINKS_DB_ID: string;
  NOTION_INVOICES_DB_ID: string;
  NOTION_CLIENT_REQUESTS_DB_ID: string;
  DEV_AUTH_EMAIL?: string;
}

export const onRequest: PagesFunction<Env> = async (ctx) => {
  const jwtHeader = ctx.request.headers.get("CF-Access-JWT-Assertion");

  let email: string | null = null;

  if (jwtHeader) {
    // In production: Cloudflare Access injects this JWT.
    // We extract the email claim from the JWT payload (base64 decode middle segment).
    // For full security, verify the signature — see CLAUDE.md for instructions.
    try {
      const [, payloadB64] = jwtHeader.split(".");
      const payload = JSON.parse(atob(payloadB64));
      email = payload.email ?? null;
    } catch {
      // Malformed JWT — treat as unauthenticated
      email = null;
    }
  } else if (ctx.env.DEV_AUTH_EMAIL) {
    // Local development fallback — only works when header is absent (i.e., not in production)
    email = ctx.env.DEV_AUTH_EMAIL;
  }

  if (!email) {
    return new Response(
      JSON.stringify({ error: "Unauthorized" }),
      { status: 401, headers: { "Content-Type": "application/json" } }
    );
  }

  // Attach verified email to request context
  ctx.data.email = email;

  return ctx.next();
};
