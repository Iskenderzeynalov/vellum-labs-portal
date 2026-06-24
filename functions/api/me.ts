/**
 * GET /api/me
 * Returns the authenticated client's profile data.
 * Uses the email from Cloudflare Access (set by middleware).
 */

import { getClientByEmail } from "./_notion";

interface Env {
  NOTION_TOKEN: string;
  NOTION_CLIENTS_DB_ID: string;
}

export const onRequestGet: PagesFunction<Env> = async (ctx) => {
  try {
    const email = (ctx.data as any).email as string;

    const client = await getClientByEmail(
      ctx.env.NOTION_TOKEN,
      ctx.env.NOTION_CLIENTS_DB_ID,
      email
    );

    if (!client) {
      return json({ error: "Client not found for this email address." }, 404);
    }

    return json(client);
  } catch (err: any) {
    console.error("[/api/me]", err);
    return json({ error: "Failed to load client data.", debug: err?.message }, 500);
  }
};

function json(data: unknown, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}
