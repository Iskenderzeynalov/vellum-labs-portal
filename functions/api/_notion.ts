/**
 * Notion Service Layer
 * ────────────────────
 * All Notion API calls happen here — server-side only.
 * The Notion token NEVER touches the browser.
 *
 * PROPERTY NAME MAPPING
 * ─────────────────────
 * Update the PROPERTY_MAP below to match your actual Notion database field names.
 * The left side (keys) are our internal names — do NOT change these.
 * The right side (values) are your Notion property names — update these to match.
 *
 * Example: if your Clients database has "Email Addresses" instead of "Authorized Emails",
 *   change: clients: { authorizedEmails: "Authorized Emails" }
 *   to:     clients: { authorizedEmails: "Email Addresses" }
 */

// ─── Property name mappings — update right side to match YOUR Notion field names ───
export const PROPERTY_MAP = {
  clients: {
    name: "Client Name",
    clientId: "Client ID",
    authorizedEmails: "Authorized Emails",
    portalActive: "Portal Active",
    currentPhase: "Current Phase",
    status: "Client Status",
    mainGoal: "Main Goal",
    healthStatus: "Health Status",
    latestSummary: "Client-facing Summary",
    nextSteps: "Next Steps",
    // NEVER expose: "Notes" / "Internal Notes"
  },
  projects: {
    client: "Client",
    name: "Project Name",
    status: "Project Status",
    phase: "Phase",
    startDate: "Start Date",
    deadline: "Deadline",
    summary: "Client-facing Summary",
    visibleToClient: "Visible to Client",
    // NEVER expose: "Internal Notes"
  },
  tasks: {
    client: "Client",
    name: "Task Name",
    status: "Status",
    priority: "Priority",
    assignedTo: "Assigned To",
    dueDate: "Due Date",
    taskType: "Task Type",
    description: "Client-facing Description",
    visibleToClient: "Visible to Client",
    // NEVER expose: "Internal Notes"
  },
  reports: {
    client: "Client",
    period: "Reporting Period",
    date: "Date",
    spend: "Spend",
    leads: "Leads",
    cpl: "Cost Per Lead",
    bookedCalls: "Booked Calls",
    conversionRate: "Conversion Rate",
    revenue: "Revenue",
    summary: "Summary",
    wins: "Wins",
    problems: "Problems",
    nextSteps: "Next Steps",
    reportLink: "Report Link",
    visibleToClient: "Visible to Client",
  },
  meetings: {
    client: "Client",
    date: "Date",
    title: "Meeting Title",
    summary: "Summary",
    decisions: "Decisions",
    actionItems: "Action Items",
    nextSteps: "Next Steps",
    recordingLink: "Recording/Transcript Link",
    visibleToClient: "Visible to Client",
    // NEVER expose: "Internal Notes"
  },
  links: {
    client: "Client",
    type: "Type",
    name: "Name",
    url: "URL",
    description: "Description",
    visibleToClient: "Visible to Client",
  },
  invoices: {
    client: "Client",
    invoiceNumber: "Invoice Number",
    amount: "Amount",
    currency: "Currency",
    status: "Status",
    dueDate: "Due Date",
    pdfLink: "PDF Link",
    visibleToClient: "Visible to Client",
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

// ─── Visible-to-client guard ──────────────────────────────────────────────────

function isVisible(page: any, propName: string): boolean {
  // If the property doesn't exist, default to NOT visible (safe default)
  const prop = page.properties?.[propName];
  if (!prop) return false;
  return prop.checkbox === true;
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
 * Find a client by email address.
 * The "Authorized Emails" field should be a multi-select or rich_text with email(s).
 * We search for pages where the email appears in any text field.
 */
export async function getClientByEmail(
  token: string,
  clientsDbId: string,
  email: string
): Promise<{ id: string; notionPageId: string } & Record<string, any> | null> {
  const pm = PROPERTY_MAP.clients;

  // Try multi_select first (recommended), fallback filter approach
  const results = await queryDatabase(token, clientsDbId, {
    and: [
      {
        property: pm.authorizedEmails,
        multi_select: { contains: email },
      },
      {
        property: pm.portalActive,
        checkbox: { equals: true },
      },
    ],
  });

  if (results.length === 0) {
    // Fallback: try rich_text email field
    const fallback = await queryDatabase(token, clientsDbId, {
      and: [
        {
          property: pm.authorizedEmails,
          rich_text: { contains: email },
        },
        {
          property: pm.portalActive,
          checkbox: { equals: true },
        },
      ],
    });
    if (fallback.length === 0) return null;
    return extractClient(fallback[0]);
  }

  return extractClient(results[0]);
}

function extractClient(page: any) {
  const pm = PROPERTY_MAP.clients;
  return {
    notionPageId: page.id,
    id: getProp(page, pm.clientId, "rich_text") ?? page.id,
    name: getProp(page, pm.name, "title") ?? "Client",
    currentPhase: getProp(page, pm.currentPhase, "select") ?? "",
    status: getProp(page, pm.status, "select") ?? "Active",
    healthStatus: getProp(page, pm.healthStatus, "select") ?? "",
    mainGoal: getProp(page, pm.mainGoal, "rich_text") ?? "",
    latestSummary: getProp(page, pm.latestSummary, "rich_text") ?? "",
    nextSteps: getProp(page, pm.nextSteps, "rich_text") ?? "",
    // ⚠️  Internal Notes intentionally NOT extracted
  };
}

// ─── Tasks ────────────────────────────────────────────────────────────────────

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
    status: getProp(page, pm.status, "select") ?? "",
    priority: getProp(page, pm.priority, "select") ?? "",
    taskType: getProp(page, pm.taskType, "select") ?? "",
    dueDate: getProp(page, pm.dueDate, "date"),
    description: getProp(page, pm.description, "rich_text") ?? "",
    // ⚠️  Internal Notes intentionally NOT extracted
  }));
}

// ─── Reports ──────────────────────────────────────────────────────────────────

export async function getClientReports(
  token: string,
  reportsDbId: string,
  clientNotionPageId: string
): Promise<any[]> {
  const pm = PROPERTY_MAP.reports;

  const results = await queryDatabase(
    token,
    reportsDbId,
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
    period: getProp(page, pm.period, "rich_text") ?? "",
    date: getProp(page, pm.date, "date"),
    spend: getProp(page, pm.spend, "number"),
    leads: getProp(page, pm.leads, "number"),
    cpl: getProp(page, pm.cpl, "number"),
    bookedCalls: getProp(page, pm.bookedCalls, "number"),
    conversionRate: getProp(page, pm.conversionRate, "number"),
    revenue: getProp(page, pm.revenue, "number"),
    summary: getProp(page, pm.summary, "rich_text") ?? "",
    wins: getProp(page, pm.wins, "rich_text") ?? "",
    problems: getProp(page, pm.problems, "rich_text") ?? "",
    nextSteps: getProp(page, pm.nextSteps, "rich_text") ?? "",
    reportLink: getProp(page, pm.reportLink, "url"),
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
        { property: pm.client, relation: { contains: clientNotionPageId } },
        { property: pm.visibleToClient, checkbox: { equals: true } },
      ],
    },
    [{ property: pm.date, direction: "descending" }]
  );

  return results.map((page: any) => ({
    id: page.id,
    date: getProp(page, pm.date, "date"),
    title: getProp(page, pm.title, "title") ?? "",
    summary: getProp(page, pm.summary, "rich_text") ?? "",
    decisions: getProp(page, pm.decisions, "rich_text") ?? "",
    actionItems: getProp(page, pm.actionItems, "rich_text") ?? "",
    nextSteps: getProp(page, pm.nextSteps, "rich_text") ?? "",
    recordingLink: getProp(page, pm.recordingLink, "url"),
    // ⚠️  Internal Notes intentionally NOT extracted
  }));
}

// ─── Links ────────────────────────────────────────────────────────────────────

export async function getClientLinks(
  token: string,
  linksDbId: string,
  clientNotionPageId: string
): Promise<any[]> {
  const pm = PROPERTY_MAP.links;

  const results = await queryDatabase(token, linksDbId, {
    and: [
      { property: pm.client, relation: { contains: clientNotionPageId } },
      { property: pm.visibleToClient, checkbox: { equals: true } },
    ],
  });

  return results.map((page: any) => ({
    id: page.id,
    type: getProp(page, pm.type, "select") ?? "",
    name: getProp(page, pm.name, "title") ?? "",
    url: getProp(page, pm.url, "url") ?? "",
    description: getProp(page, pm.description, "rich_text") ?? "",
  }));
}

// ─── Invoices ─────────────────────────────────────────────────────────────────

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
    [{ property: pm.dueDate, direction: "descending" }]
  );

  return results.map((page: any) => ({
    id: page.id,
    invoiceNumber: getProp(page, pm.invoiceNumber, "rich_text") ?? "",
    amount: getProp(page, pm.amount, "number"),
    currency: getProp(page, pm.currency, "select") ?? "USD",
    status: getProp(page, pm.status, "select") ?? "",
    dueDate: getProp(page, pm.dueDate, "date"),
    pdfLink: getProp(page, pm.pdfLink, "url"),
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
        // Title = subject or a default
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
