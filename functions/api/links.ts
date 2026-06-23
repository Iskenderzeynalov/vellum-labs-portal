/**
 * GET /api/links
 * Links come from URL fields on the Client record (Google Drive, Analytics
 * Dashboard, Book a Call, Latest Deliverable) — no separate database needed.
 */
import { getClientByEmail, extractClientLinks } from "./_notion";

interface Env {
  NOTION_TOKEN: string;
  NOTION_CLIENTS_DB_ID: string;
}

export const onRequestGet: PagesFunction<Env> = async (ctx) => {
  try {
    const email = (ctx.data as any).email as string;
    const client = await getClientByEmail(ctx.env.NOTION_TOKEN, ctx.env.NOTION_CLIENTS_DB_ID, email);
    if (!client) return json({ error: "Client not found." }, 404);

    const links = extractClientLinks(client);
    return json(links);
  } catch (err) {
    console.error("[/api/links]", err);
    return json({ error: "Failed to load links." }, 500);
  }
};

function json(data: unknown, status = 200) {
  return new Resp