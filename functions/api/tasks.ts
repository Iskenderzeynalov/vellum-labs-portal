/**
 * GET /api/tasks
 * Returns tasks for the authenticated client only.
 */

import { getClientByEmail, getClientTasks } from "./_notion";

interface Env {
  NOTION_TOKEN: string;
  NOTION_CLIENTS_DB_ID: string;
  NOTION_TASKS_DB_ID: string;
}

export const onRequestGet: PagesFunction<Env> = async (ctx) => {
  try {
    const email = (ctx.data as any).email as string;

    const client = await getClientByEmail(
      ctx.env.NOTION_TOKEN,
      ctx.env.NOTION_CLIENTS_DB_ID,
      email
    );
    if (!client) return json({ error: "Client not found." }, 404);

    const tasks = await getClientTasks(
      ctx.env.NOTION_TOKEN,
      ctx.env.NOTION_TASKS_DB_ID,
      client.notionPageId
    );

    return json(tasks);
  } catch (err) {
    console.error("[/api/tasks]", err);
    return json({ error: "Failed to load tasks." }, 500);
  }
};

function json(data: unknown, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}
