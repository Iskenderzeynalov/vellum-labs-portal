import { getClientByEmail, getClientInvoices } from "./_notion";

interface Env {
  NOTION_TOKEN: string;
  NOTION_CLIENTS_DB_ID: string;
  NOTION_INVOICES_DB_ID: string;
}

export const onRequestGet: PagesFunction<Env> = async (ctx) => {
  try {
    const email = (ctx.data as any).email as string;
    const client = await getClientByEmail(ctx.env.NOTION_TOKEN, ctx.env.NOTION_CLIENTS_DB_ID, email);
    if (!client) return json({ error: "Client not found." }, 404);

    const invoices = await getClientInvoices(ctx.env.NOTION_TOKEN, ctx.env.NOTION_INVOICES_DB_ID, client.notionPageId);
    return json(invoices);
  } catch (err) {
    console.error("[/api/invoices]", err);
    return json({ error: "Failed to load invoices." }, 500);
  }
};

function json(data: unknown, status = 200) {
  return new Response(JSON.stringify(data), { status, headers: { "Content-Type": "application/json" } });
}
