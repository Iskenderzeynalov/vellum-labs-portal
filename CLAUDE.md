# CLAUDE.md — Vellum Labs Client Portal

## Project Rules (Read before touching any code)

### 🔴 NEVER DO
- Never expose NOTION_TOKEN in any frontend/browser code
- Never read secrets from process.env in files inside src/ (frontend)
- Never skip the `visible_to_client` checkbox filter when querying Notion
- Never extract or return Internal Notes fields from any Notion query
- Never hardcode real tokens, database IDs, or emails in source files
- Never introduce paid services or paid SaaS dependencies
- Never delete or overwrite files without explaining the change first
- Never trust the frontend for security decisions

### ✅ ALWAYS DO
- All Notion API calls go through `functions/api/` only (server-side)
- Always filter by authenticated email from Cloudflare Access header
- Always filter tasks/reports/meetings by `visibleToClient: true`
- Use environment variables for all secrets (see .env.example)
- Provide friendly error messages when Notion data is missing or incomplete
- Keep mock data in `src/mock/data.ts` during development
- Update CHANGELOG.md after each significant change

---

## Architecture

```
Browser (React/Vite)
    │
    │  fetch("/api/...")
    ▼
Cloudflare Pages Functions  (/functions/api/)
    │  reads CF-Access-JWT-Assertion header
    │  resolves email → clientId via Notion
    │  filters only visible_to_client data
    ▼
Notion API  (server-side only)
```

### Key files
| File | Purpose |
|------|---------|
| `functions/api/_middleware.ts` | Auth guard — reads Cloudflare Access JWT |
| `functions/api/_notion.ts` | All Notion queries + property mapping |
| `functions/api/*.ts` | One file per API endpoint |
| `src/mock/data.ts` | Static mock data for Phase 2 development |
| `src/pages/*.tsx` | UI pages |
| `src/components/` | Shared UI components |
| `.env.example` | Secret placeholders (safe to commit) |

---

## Development Phases

- [x] Phase 1 — Project scaffold (Vite + React + TS + Tailwind)
- [x] Phase 2 — Static mock UI (all pages, mock data)
- [x] Phase 3 — Cloudflare Pages Functions + Notion service layer
- [ ] Phase 4 — Wire frontend to real API (replace mock data)
- [ ] Phase 5 — Cloudflare Pages deployment
- [ ] Phase 6 — Testing & security checks

---

## Notion Property Mapping

Update the `PROPERTY_MAP` object in `functions/api/_notion.ts` to match your actual Notion field names. The left side (keys) are internal — do not change. The right side (values) are Notion field names — update to match your databases.

---

## Security Notes

### Cloudflare Access JWT
In production, `CF-Access-JWT-Assertion` is set by Cloudflare's edge network. Clients cannot forge this header. The middleware extracts the email claim from the JWT payload.

For full JWT signature verification (recommended before going to production with sensitive data), add verification using Cloudflare's public keys:
- Endpoint: `https://<your-team>.cloudflareaccess.com/cdn-cgi/access/certs`
- Use the `jose` library or Web Crypto API to verify the RS256 signature

### DEV_AUTH_EMAIL
This env var is only used when the CF-Access-JWT-Assertion header is absent. In production, Cloudflare Access always injects this header, so DEV_AUTH_EMAIL has no effect on the live site.

---

## Environment Variables

See `.env.example` for all required variables and where to find them.

For local dev: copy `.env.example` to `.env.local` and fill in values.
For production: add as Cloudflare Pages environment variables (never in files).

---

## Stack
- **Frontend**: React + Vite + TypeScript + Tailwind CSS v4
- **Backend**: Cloudflare Pages Functions (TypeScript)
- **Auth**: Cloudflare Access (free tier)
- **Database**: Notion (source of truth)
- **Hosting**: Cloudflare Pages (free tier)
- **Repo**: GitHub
