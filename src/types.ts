// API response types — must match what functions/api/*.ts returns.

export interface ApiClient {
  id: string;
  notionPageId: string;
  name: string;
  currentPhase: string;
  status: string;
  healthStatus: string;
  mainGoal: string;
  latestSummary: string;
  nextSteps: string;
}

export interface ApiTask {
  id: string;
  name: string;
  status: string;
  priority: string;
  taskType: string; // "Client" | "Vellum"
  dueDate: string | null;
  description: string;
}

export interface ApiReport {
  id: string;
  period: string;
  date: string | null;
  spend: number | null;
  leads: number | null;
  cpl: number | null;
  bookedCalls: number | null;
  conversionRate: number | null;
  revenue: number | null;
  summary: string;
  wins: string;
  problems: string;
  nextSteps: string;
  reportLink: string | null;
}

export interface ApiMeeting {
  id: string;
  date: string | null;
  title: string;
  summary: string;
  decisions: string;
  actionItems: string;
  nextSteps: string;
  recordingLink: string | null;
}

export interface ApiLink {
  id: string;
  type: string;
  name: string;
  url: string;
  description: string;
}

export interface ApiInvoice {
  id: string;
  invoiceNumber: string;
  amount: number | null;
  currency: string;
  status: string;
  dueDate: string | null;
  pdfLink: string | null;
}
