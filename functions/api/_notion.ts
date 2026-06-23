/**
 * Notion Service Layer
 * ────────────────────
 * All Notion API calls happen here — server-side only.
 * The Notion token NEVER touches the browser.
 *
 * PROPERTY NAME MAPPING
 * ─────────────────────
 * The PROPERTY_MAP below uses exact Notion field names (including any
 * leading/trailing spaces that exist in the actual database).
 * Do NOT "clean up" the field names — they must match Notion verbatim.
 */

// ─── Property name mappings — matched to actual Notion field names ─────────────

export const PROPERTY_MAP = {
  clients: {
    // Clients database
    name: "Customer Name",        // title type
    email: "Email",               // email type  ← used for auth lookup
    status: "Status",             // status type
    services: "Services",         // multi_select type
    googleDrive: "Google Drive",  // url type
    analyticsDashboard: "Analytics Dashboard", // url type
    bookACall: "Book a Call",     // url type
    newDeliverable: "New Deliverable", // url type
    // ⚠️  Internal Notes, financial fields intentionally NOT listed
  },
  tasks: {
    // Tasks & Deliverables database
    client: "Client",                    // relation type
    name: "Name of Deliverable",        // title type
    status: "Status",                   // status type
    priority: "Priority Level",         // select type
    taskType: "Deliverable Type",       // select type
    dueDate: "Due Date",                // date type
    description: "Notes",               // rich_text type
    visibleToClient: "Share to Client", // checkbox type
    // ⚠️  Internal Notes intentionally NOT listed
  },
  reports: {
    // Docs database — filtered to Category = "📃Report"
    client: " Client",              // relation type (leading space — exact field name)
    name: "Description",            // title type
    category: "Category",           // select type
    url: "URL",                     // url type
    visibleToClient: "Share to Client", // checkbox type
  },
  meetings: {
    // Meetings database — note trailing spaces on some field names
    client: "Client ",              // relation type (trailing space — exact field name)
    date: "Date & Time",            // date type
    title: "Meeting Title ",        // title type (trailing space — exact field name)
    notes: "Notes",                 // rich_text type
    recordingLink: "Recording Link", // url type
    visibleToClient: "Share to Client", // checkbox type
    // ⚠️  Internal Notes intentionally NOT listed
  },
  invoices: {
    // Finances [Client-Facing] database
    client: "Client",                    // relation type
    name: "Name of Transaction",        // title type
    amount: "Amount",                   // number type (EUR)
    date: "Date",                       // date type
    status: "Status",                   // status type (Sent / Processing / Payed)
    type: "Type",                       // select type
    invoiceUrl: "Invoices",             // url type
    visibleToClient: "Share to Client", // checkbox type
  },
};

// ─── Base Notion API helper ───────────────────────────────────────────────────

const NOTION_VERSION = "2022-06-28";

async function notionFetch(
  token: string,
  path: string,
  body: object
): Promise<any> {
  const res = await fetch(`https://api.notion.com/v1${path}`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Notion-Version": NOTION_VERSION,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Notion API error ${res.status}: ${err}`);
  }

  return res.json();
}

// ─── Property extractors ──────────────────────────────────────────────────────

function getProp(page: any, propName: string, type: string): any {
  const prop = page.properties?.[propName];
  if (!prop) return null;

  switch (type) {
    case "title":
      return prop.title?.[0]?.plain_text ?? null;
    case "rich_text":
      return prop.rich_text?.[0]?.plain_text ?? null;
    case "select":
      return prop.select?.name ?? null;
    case "status":
      // Notion "Status" property type (different from select)
      return prop.status?.name ?? null;
    case "multi_select":
      return prop.multi_select?.map((s: any) => s.name) ?? [];
    case "checkbox":
      return prop.checkbox ?? false;
    case "number":
      return prop.number ?? null;
    case "date":
      return prop.date?.start ?? null;
    case "url":
      return prop.url ?? null;
    case "email":
      return prop.email ?? null;
    case "relation":
      return prop.relation?.map((r: any) => r.id) ?? [];
    case "formula":
      return prop.formula?.string ?? prop.formula?.number ?? null;
    default:
      return null;
  }
}

// ─── Query helpers ────────────────────────────────────────────────────────────

async function queryDatabase(
  token: string,
  dbId: string,
  filter: object,
  sorts?: object[]
): Promise<any[]> {
  const body: any = { filter };
  if (sorts) body.sorts = sorts;

  const data = await notionFetch(token, `/databases/${dbId}/query`, body);
  return data.results ?? [];
}

// ─── Client lookup ────────────────────────────────────────────────────────────

/**
 * Find a client by their email address.
 * Uses the "Email" field (Notion email type) on the Clients database.
 */
export async function getClientByEmail(
  token: string,
  clientsDbId: string,
  email: string
): Promise<ReturnType<typeof extractClient> | null> {
  const pm = PROPERTY_MAP.clients;

  const results = await queryDatabase(token, clientsDbId, {
    property: pm.email,
    email: { equals: email },
  });

  if (results.length === 0) return null;
  return extractClient(results[0]);
}

function extractClient(page: any) {
  const pm = PROPERTY_MAP.clients;
  return {
    notionPageId: page.id,
    id: page.id,
    name: getProp(page, pm.name, "title") ?? "Client",
    status: getProp(page, pm.status, "status") ?? "In progress",
    services: getProp(page, pm.services, "multi_select") as string[] ?? [],
    googleDrive: getProp(page, pm.googleDrive, "url") as string | null,
    analyticsDashboard: getProp(page, pm.analyticsDashboard, "url") as string | null,
    bookACall: getProp(page, pm.bookACall, "url") as string | null,
    newDeliverable: getProp(page, pm.newDeliverable, "url") as string | null,
    // ⚠️  Internal Notes, financial fields intentionally NOT extracted
  };
}

// ─── Tasks & Deliverables ─────────────────────────────────────────────────────

export async function getClientTasks(
  token: string,
  tasksDbId: string,
  clientNotionPageId: string
): Promise<any[]> {
  const pm = PROPERTY_MAP.tasks;

  const results = await queryDatabase(
    token,
    tasksDbId,
    {
      and: [
        { property: pm.client, relation: { contains: clientNotionPageId } },
        { property: pm.visibleToClient, checkbox: { equals: true } },
      ],
    },
    [{ property: pm.dueDate, direction: "ascending" }]
  );

  return results.map((page: any) => ({
    id: page.id,
    name: getProp(page, pm.name, "title") ?? "",
    status: getProp(page, pm.status, "status") ?? "",
    priority: getProp(page, pm.priority, "select") ?? "",
    taskType: getProp(page, pm.taskType, "select") ?? "",
    dueDate: getProp(page, pm.dueDate, "date"),
    description: getProp(page, pm.description, "rich_text") ?? "",
    // ⚠️  Internal Notes intentionally NOT extracted
  }));
}

// ─── Reports (Docs database filtered to Category = "📃Report") ───────────────

export async function getClientReports(
  token: string,
  docsDbId: string,
  clientNotionPageId: string
): Promise<any[]> {
  const pm = PROPERTY_MAP.reports;

  const results = await queryDatabase(
    token,
    docsDbId,
    {
      and: [
        { property: pm.client, relation: { contains: clientNotionPageId } },
        { property: pm.visibleToClient, checkbox: { equals: true } },
        { property: pm.category, select: { equals: "📃Report" } },
      ],
    },
    [{ timestamp: "created_time", direction: "descending" }]
  );

  return results.map((page: any) => ({
    id: page.id,
    title: getProp(page, pm.name, "title") ?? "",
    url: getProp(page, pm.url, "url"),
    date: page.created_time ?? null,
  }));
}

// ─── Meetings ─────────────────────────────────────────────────────────────────

export async function getClientMeetings(
  token: string,
  meetingsDbId: string,
  clientNotionPageId: string
): Promise<any[]> {
  const pm = PROPERTY_MAP.meetings;

  const results = await queryDatabase(
    token,
    meetingsDbId,
    {
      and: [
        // Note: "Client " has a trailing space — exact field name
        { property: pm.client, relation: { contains: clientNotionPageId } },
        { property: pm.visibleToClient, checkbox: { equals: true } },
      ],
    },
    [{ property: pm.date, direction: "descending" }]
  );

  return results.map((page: any) => ({
    id: page.id,
    date: getProp(page, pm.date, "date"),
    // Note: "Meeting Title " has a trailing space — exact field name
    title: getProp(page, pm.title, "title") ?? "",
    summary: getProp(page, pm.notes, "rich_text") ?? "",
    // Meetings DB has a single "Notes" field; decisions/actionItems/nextSteps are
    // always empty — the Meetings.tsx component renders them conditionally so
    // empty strings simply won't render.
    decisions: "",
    actionItems: "",
    nextSteps: "",
    recordingLink: getProp(page, pm.recordingLink, "url"),
    // ⚠️  Internal Notes intentionally NOT extracted
  }));
}

// ─── Links (derived from the Client record's URL fields) ─────────────────────

/**
 * Links are not a separate database — they come from URL fields stored
 * directly on the Client record (Google Drive, Analytics Dashboard, etc.).
 * This avoids a second DB query and uses data that's already been fetched.
 */
export function extractClientLinks(
  client: ReturnType<typeof extractClient>
): any[] {
  const links: Array<{
    id: string;
    type: string;
    name: string;
    url: string;
    description: string;
  }> = [];

  if (client.googleDrive) {
    links.push({
      id: "google-drive",
      type: "Google Drive",
      name: "Google Drive Folder",
      url: client.googleDrive,
      description: "Your project files, creatives, and assets",
    });
  }
  if (client.newDeliverable) {
    links.push({
      id: "deliverable",
      type: "Google Drive",
      name: "Latest Deliverable",
      url: client.newDeliverable,
      description: "Your most recent deliverable",
    });
  }
  if (client.analyticsDashboard) {
    links.push({
      id: "analytics",
      type: "Analytics Dashboard",
      name: "Analytics Dashboard",
      url: client.analyticsDashboard,
      description: "Live campaign performance overview",
    });
  }
  if (client.bookACall) {
    links.push({
      id: "book-call",
      type: "Tool",
      name: "Book a Call",
      url: client.bookACall,
      description: "Schedule a meeting with the Vellum Labs team",
    });
  }

  return links;
}

// ─── Invoices (Finances [Client-Facing] database) ─────────────────────────────

export async function getClientInvoices(
  token: string,
  invoicesDbId: string,
  clientNotionPageId: string
): Promise<any[]> {
  const pm = PROPERTY_MAP.invoices;

  const results = await queryDatabase(
    token,
    invoicesDbId,
    {
      and: [
        { property: pm.client, relation: { contains: clientNotionPageId } },
        { property: pm.visibleToClient, checkbox: { equals: true } },
      ],
    },
    [{ property: pm.date, direction: "descending" }]
  );

  return results.map((page: any) => ({
    id: page.id,
    invoiceNumber: getProp(page, pm.name, "title") ?? "",
    amount: getProp(page, pm.amount, "number"),
    currency: "EUR", // Finances DB is always EUR
    status: getProp(page, pm.status, "status") ?? "", // Sent / Processing / Payed
    dueDate: getProp(page, pm.date, "date"),
    pdfLink: getProp(page, pm.invoiceUrl, "url"),
  }));
}

// ─── Client Requests ──────────────────────────────────────────────────────────

export async function createClientRequest(
  token: string,
  requestsDbId: string,
  clientNotionPageId: string,
  clientName: string,
  subject: string,
  message: string
): Promise<void> {
  await fetch("https://api.notion.com/v1/pages", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Notion-Version": NOTION_VERSION,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      parent: { database_id: requestsDbId },
      properties: {
        Name: {
          title: [
            {
              text: { content: subject || `Update Request — ${clientName}` },
            },
          ],
        },
        Client: {
          relation: [{ id: clientNotionPageId }],
        },
        Message: {
          rich_text: [{ text: { content: message } }],
        },
        Status: {
          select: { name: "New" },
        },
        "Submitted At": {
          date: { start: new Date().toISOString() },
        },
      },
    }),
  });
}
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                         