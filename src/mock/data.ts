// ============================================================
// MOCK DATA — used during Phase 2 (static prototype)
// Replace with real Notion API calls in Phase 3
// ============================================================

export const MOCK_CLIENT = {
  id: "client_acme",
  name: "Acme Corp",
  currentPhase: "Phase 2 — Lead Generation",
  status: "Active",
  healthStatus: "On Track",
  mainGoal: "Generate 50 qualified leads per month via Google Ads + Meta",
  latestSummary:
    "Campaign performance is strong this week. CPL dropped by 18% and booking rate improved. We're testing two new ad creatives next week.",
  nextSteps:
    "Review new ad creatives by Friday. Confirm budget increase approval for Q3.",
};

export const MOCK_TASKS = [
  {
    id: "t1",
    name: "Set up Google Ads conversion tracking",
    status: "In Progress",
    priority: "High",
    type: "Vellum",
    dueDate: "2026-06-28",
    description: "Installing and verifying conversion tags on the landing page.",
  },
  {
    id: "t2",
    name: "Review and approve new ad creatives",
    status: "Awaiting Client",
    priority: "High",
    type: "Client",
    dueDate: "2026-06-27",
    description:
      "Please review the 3 creatives shared in your Google Drive folder and approve or leave comments.",
  },
  {
    id: "t3",
    name: "Confirm Q3 budget allocation",
    status: "Awaiting Client",
    priority: "Medium",
    type: "Client",
    dueDate: "2026-06-30",
    description:
      "We need your confirmed Q3 ad spend budget to plan the next campaign phase.",
  },
  {
    id: "t4",
    name: "A/B test landing page headlines",
    status: "Pending",
    priority: "Medium",
    type: "Vellum",
    dueDate: "2026-07-05",
    description: "Testing 3 headline variants to improve conversion rate.",
  },
  {
    id: "t5",
    name: "Monthly reporting setup in Notion",
    status: "Completed",
    priority: "Low",
    type: "Vellum",
    dueDate: "2026-06-15",
    description: "Reporting dashboard configured and linked.",
  },
  {
    id: "t6",
    name: "Send over brand guidelines PDF",
    status: "Completed",
    priority: "Low",
    type: "Client",
    dueDate: "2026-06-10",
    description: "Brand guidelines received and filed.",
  },
];

export const MOCK_REPORTS = [
  {
    id: "r1",
    period: "Week of June 16–22, 2026",
    date: "2026-06-22",
    spend: 1840,
    leads: 42,
    cpl: 43.81,
    bookedCalls: 9,
    conversionRate: 21.4,
    revenue: null,
    summary:
      "Best performing week so far. CPL dropped 18% week-over-week. The new Facebook creative outperformed the control by 2.3x.",
    wins: "New creative drove strong results. Google Search CTR improved to 4.2%.",
    problems: "Meta campaign #3 underperforming — paused for review.",
    nextSteps: "Scale winning Meta creative. Test new Google responsive ads.",
    reportLink: "https://drive.google.com/example-report-june-22",
  },
  {
    id: "r2",
    period: "Week of June 9–15, 2026",
    date: "2026-06-15",
    spend: 1750,
    leads: 35,
    cpl: 50.0,
    bookedCalls: 7,
    conversionRate: 20.0,
    revenue: null,
    summary:
      "Stable week. Testing phase for new ad copy variants. Early signals look positive.",
    wins: "Landing page bounce rate improved after CTA copy update.",
    problems: "Budget pacing slightly off — corrected mid-week.",
    nextSteps: "Let new creatives run through full cycle before optimization.",
    reportLink: "https://drive.google.com/example-report-june-15",
  },
];

export const MOCK_MEETINGS = [
  {
    id: "m1",
    date: "2026-06-20",
    title: "Weekly Strategy Check-in",
    summary:
      "Reviewed campaign performance. Discussed scaling the winning Meta creative and budget reallocation for Q3. Client confirmed they're happy with current lead quality.",
    decisions:
      "Scale Meta creative by 40%. Hold Google budget steady. Review Q3 plan by June 30.",
    actionItems:
      "Vellum: Scale creative by Monday. Client: Confirm Q3 budget by June 30.",
    nextSteps:
      "Next check-in June 27. Client to send brand refresh assets by June 25.",
    recordingLink: null,
  },
  {
    id: "m2",
    date: "2026-06-06",
    title: "Campaign Kickoff",
    summary:
      "Aligned on campaign goals, target audience, and initial ad creative direction. Set 90-day targets.",
    decisions:
      "Run Google Search + Meta as primary channels. Monthly reporting cadence. Weekly 30-min check-ins.",
    actionItems:
      "Vellum: Campaign setup by June 10. Client: Send brand guidelines + landing page access.",
    nextSteps: "Campaigns live by June 12. First report June 15.",
    recordingLink: "https://drive.google.com/example-recording",
  },
];

export const MOCK_LINKS = [
  {
    id: "l1",
    type: "Google Drive",
    name: "Client Assets Folder",
    url: "https://drive.google.com/example-folder",
    description: "Brand assets, logos, ad creatives, and brand guidelines.",
  },
  {
    id: "l2",
    type: "Landing Page",
    name: "Main Landing Page",
    url: "https://acme.com/campaign",
    description: "Primary campaign landing page — currently live.",
  },
  {
    id: "l3",
    type: "Ad Creative",
    name: "Ad Creative Library (June)",
    url: "https://drive.google.com/example-creatives",
    description: "All ad creatives for June campaigns, organized by channel.",
  },
  {
    id: "l4",
    type: "Report",
    name: "Monthly Report — May 2026",
    url: "https://drive.google.com/example-may-report",
    description: "Full monthly performance report for May.",
  },
  {
    id: "l5",
    type: "Tool",
    name: "Ads Manager Access",
    url: "https://business.facebook.com",
    description: "Meta Business Manager — shared access granted.",
  },
];

export const MOCK_INVOICES = [
  {
    id: "inv1",
    invoiceNumber: "VL-2026-003",
    amount: 2500,
    currency: "USD",
    status: "Paid",
    dueDate: "2026-06-01",
    pdfLink: "https://drive.google.com/example-invoice-003",
  },
  {
    id: "inv2",
    invoiceNumber: "VL-2026-004",
    amount: 2500,
    currency: "USD",
    status: "Due",
    dueDate: "2026-07-01",
    pdfLink: null,
  },
  {
    id: "inv3",
    invoiceNumber: "VL-2026-002",
    amount: 2500,
    currency: "USD",
    status: "Paid",
    dueDate: "2026-05-01",
    pdfLink: "https://drive.google.com/example-invoice-002",
  },
];
