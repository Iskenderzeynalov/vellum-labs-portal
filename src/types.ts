// API response types — must match what functions/api/*.ts returns.

export interface ApiClient {
  id: string;
  notionPageId: string;
  name: string;
  status: string;              // Notion Status field (e.g. "In progress", "Active")
  services: string[];          // multi-select, e.g. ["Meta Ads", "SEO"]
  googleDrive: string | null;
  analyticsDashboard: string | null;
  bookACall: string | null;
  newDeliverable: string | null;
}

export interface ApiTask {
  id: string;
  name: string;
  status: string;
  priority: string;
  taskType: string; // from "Deliverable Type" field — e.g. "Client" | "Vellum"
  dueDate: string | null;
  description: string;
}

export interface ApiReport {
  id: string;
  title: string;       // "Description" field in Docs DB
  url: string | null;  // "URL" field in Docs DB
  date: string | null; // page created_time
}

export interface ApiMeeting {
  id: string;
  date: string | null;
  title: string;
  summary: string;     // from "Notes" field
  decisions: string;   // always "" — no separate field in Meetings DB
  actionItems: string; // always "" — no separate field in Meetings DB
  nextSteps: string;   // always "" — no separate field in Meetings DB
  recordingLink: string | null;
}

export interface ApiLink {
  id: string;
  type: string;        // "Google Drive" 