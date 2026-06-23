# Deployment Guide — Vellum Labs Client Portal

Follow these steps IN ORDER. Do not skip any step.

---

## Step 1 — Push code to GitHub

1. Go to https://github.com and log in.
2. Click the **+** icon (top right) → **New repository**
3. Name it: `vellum-labs-portal`, set it to **Private**
4. Do NOT initialize with README (we already have one)
5. Click **Create repository**

Open a terminal inside this project folder and run:

```bash
git init
git add .
git commit -m "Initial commit — Vellum Labs Portal"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/vellum-labs-portal.git
git push -u origin main
```

Replace `YOUR_USERNAME` with your actual GitHub username.

---

## Step 2 — Get your Notion Integration Token

1. Go to https://www.notion.so/my-integrations
2. Click **+ New integration**
3. Name it: `Vellum Labs Portal`
4. Select your workspace → **Submit**
5. Copy the **Internal Integration Secret** — this is your `NOTION_TOKEN`

Then connect each database to the integration:
1. Open each Notion database
2. Click **...** (top right) → **Add connections** → select your integration
3. Copy the database ID from the URL:
   - URL looks like: `notion.so/workspace/`**`abc123def456...`**`?v=...`
   - The ID is the long hex string before `?v=`

You need IDs for: Clients, Projects, Tasks, Reports, Meetings, Links, Invoices, Client Requests.

---

## Step 3 — Connect GitHub to Cloudflare Pages

1. Go to https://dash.cloudflare.com → **Workers & Pages** → **Pages**
2. Click **Connect to Git** → **GitHub** → authorize Cloudflare
3. Select your `vellum-labs-portal` repository
4. Click **Begin setup**

**Build settings:**

| Setting | Value |
|---------|-------|
| Build command | `npm run build` |
| Build output directory | `dist` |
| Node.js version | `18` |

5. Click **Save and Deploy**

---

## Step 4 — Add Environment Variables to Cloudflare Pages

After the first deploy:

1. Click your project → **Settings** → **Environment variables**
2. Add each variable below (**Production** environment):

| Variable | Value |
|----------|-------|
| `NOTION_TOKEN` | Your Notion integration secret |
| `NOTION_CLIENTS_DB_ID` | Clients database ID |
| `NOTION_PROJECTS_DB_ID` | Projects database ID |
| `NOTION_TASKS_DB_ID` | Tasks database ID |
| `NOTION_REPORTS_DB_ID` | Reports database ID |
| `NOTION_MEETINGS_DB_ID` | Meetings database ID |
| `NOTION_LINKS_DB_ID` | Links database ID |
| `NOTION_INVOICES_DB_ID` | Invoices database ID |
| `NOTION_CLIENT_REQUESTS_DB_ID` | Client Requests database ID |

3. Click **Save** then trigger a new deploy from the **Deployments** tab.

---

## Step 5 — Set up Cloudflare Access (Login System)

1. Go to https://one.dash.cloudflare.com → **Access** → **Applications**
2. Click **Add an application** → **Self-hosted**
3. Fill in:
   - Application name: `Vellum Labs Client Portal`
   - Application domain: `portal` (subdomain)
   - Domain: select your domain (e.g. `vellumlabs.com`)
4. Click **Next** → set Policy:
   - Policy name: `Client Email Access`
   - Action: **Allow**
   - Include rule: **Emails** → add each client email (one per line), plus your own
5. Click **Next** → **Add application**

---

## Step 6 — Add a custom domain

1. In Cloudflare Pages, click your project → **Custom domains**
2. Click **Set up a custom domain** → enter `portal.vellumlabs.com`
3. Cloudflare auto-configures the DNS record — wait a few minutes

---

## Step 7 — Test

1. Open https://portal.vellumlabs.com in an incognito window
2. You should see a Cloudflare Access login screen
3. Enter your email → get a one-time code → log in
4. Verify you see YOUR data only

**Test client isolation:** log in with a test client email → confirm you see only that client's records.

**Test Notion connection:** in your Notion Clients database, create a row with:
- `Portal Active` checkbox: ✅
- `Authorized Emails`: the client's email
- Set `Visible to Client` to ✅ on tasks/reports you want visible

Reload the portal — real data should appear.

---

## Step 8 — Map your Notion field names

If your Notion databases use different column names than the defaults, edit:

```
functions/api/_notion.ts
```

Find `PROPERTY_MAP` near the top and update the right-hand values to match your exact Notion field names. After changes: commit → push → Cloudflare auto-deploys.

---

## Local Development (optional)

```bash
cp .env.example .env.local
# Fill in your real values in .env.local
npm run dev
# Open http://localhost:5173
```

Set `DEV_AUTH_EMAIL=your@email.com` in `.env.local` so the middleware authenticates you locally.

---

## Troubleshooting

| Problem | Fix |
|---------|-----|
| "Client not found" | Email not in Notion Clients `Authorized Emails` field, or `Portal Active` unchecked |
| No tasks/reports showing | `Visible to Client` checkbox not set on individual Notion records |
| 500 errors | Check that the Notion integration is added to each database (··· → Add connections) |
| Cloudflare Access not showing | Your domain must be managed by Cloudflare (NS records pointing to Cloudflare) |
| Wrong field names | Update `PROPERTY_MAP` in `functions/api/_notion.ts` |
