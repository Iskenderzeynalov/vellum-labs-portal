# Changelog

## [Unreleased]

### Fixed
- `/api/invoices` now returns real Notion data — corrected `NOTION_INVOICES_DB_ID` to the
  "Finances [Client-Facing]" database (`2e95ea95-c3c8-804e-9001-c4a5ea00b469`) and shared
  that database with the Notion integration
- Removed temporary debug field from invoices error response

### Changed
- Updated `.env.example` with correct DB IDs for all 5 Notion databases (confirmed working)

---

## All API Endpoints — Status as of 2026-06-24

| Endpoint | Status | Notes |
|----------|--------|-------|
| `/api/me` | ✅ Working | Returns client name, status, services |
| `/api/tasks` | ✅ Working | Returns tasks filtered by client + Share to Client |
| `/api/meetings` | ✅ Working | Returns meetings filtered by client |
| `/api/reports` | ✅ Working | Returns docs filtered by Category=Report |
| `/api/invoices` | ✅ Working | Returns invoices filtered by client + Share to Client |

---

## Previous Sessions

### Phase 3 — Cloudflare Pages Functions + Notion service layer
- Built all API endpoint handlers in `functions/api/`
- Built full Notion service layer in `functions/api/_notion.ts`
- Added auth middleware reading Cloudflare Access JWT

### Phase 4 — Wire frontend to real API
- Replaced all mock data with real API calls
- Added `ClientContext` for shared client profile across pages
- Rewrote `_notion.ts` with exact Notion field names (including trailing/leading spaces)
- Corrected all 5 Notion DB IDs in Cloudflare Pages environment variables
