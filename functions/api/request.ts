/**
 * POST /api/request
 * Creates a new entry in the Client Requests Notion database.
 */

import { getClientByEmail, createClientRequest } from "./_notion";

interface Env {
  NOTION_TOKEN: string;
  NOTION_CLIENTS_DB_ID: string;
  NOTION_CLIENT_REQUESTS_DB_ID: string;
}

export const onRequestPost: PagesFunction<Env> = async (ctx) => {
  try {
    const email = (ctx.data as any).email as string;

    const client = await getClientByEmail(
      ctx.env.NOTION_TOKEN,
      ctx.env.NOTION_CLIENTS_DB_ID,
      email
    );
    if (!client) return json({ error: "Client not found." }, 404);

    const body = await ctx.request.json<{ subject?: string; message: string }>();

    if (!body.message?.trim()) {
      return json({ error: "Message is required." }, 400);
    }

    await createClientRequest(
      ctx.env.NOTION_TOKEN,
      ctx.env.NOTION_CLIENT_REQUESTS_DB_ID,
      client.notionPageId,
      client.name,
      body.subject ?? "",
      body.message
    );

    return json({ ok: true });
  } catch (err) {
    console.error("[/api/request]", err);
    return json({ error: "Failed to send request." }, 500);
  }
};

function json(data: unknown, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}
