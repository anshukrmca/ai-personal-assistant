# Aria — Personal AI Assistant (MVP)

A full-stack working prototype of the personal AI assistant described in the
architecture doc: phone/WhatsApp OTP login, an Integration Page to connect
apps, a daily AI-generated briefing, and a chat assistant — all running on
**mock data** so it works immediately with zero API keys, and upgrades to
real providers as you plug keys in.

## Stack

- **Framework:** Next.js 15 (App Router, TypeScript) — frontend + backend API routes in one app
- **Database:** File-based JSON store at `/data` (`src/lib/db/jsonStore.ts`) — swap for InsForge/Postgres later without touching application code
- **Auth:** Phone + OTP (mock Sent.dm), JWT session cookie
- **AI:** Mock summarizer/chat by default; calls the real Anthropic API automatically once `ANTHROPIC_API_KEY` is set

## Getting started (Windows)

```powershell
cd "E:\OWN Project\Ai personal assistant"
npm install
copy .env.example .env.local
npm run dev
```

Open **http://localhost:3000** — you'll land on the login screen.

### Logging in (mock mode)

1. Enter any phone number (e.g. `+91 98765 43210`) and pick SMS or WhatsApp.
2. On the next screen, the OTP is shown directly in a "Dev mode" box (since
   no real Sent.dm key is configured) — just copy it into the 6 boxes.
3. You're in. First-time numbers automatically create a new account.

### Using the app

1. **Integrations page** — click "Connect" on any app card (Gmail, Slack,
   WhatsApp, etc). This simulates an OAuth connect — no real login happens
   yet, but it stores a "connected" state and seeds realistic mock data
   (emails, meetings, mentions) for that platform.
2. **Briefing (dashboard)** — once at least one app is connected, an AI
   summary, stat cards (meetings / alerts / follow-ups / messages), and a
   full activity feed appear. Hit **Refresh** to regenerate.
3. **Ask Aria (chat)** — ask questions about your connected data. In mock
   mode this does simple keyword matching against synced items; with a real
   `ANTHROPIC_API_KEY` it calls Claude with your synced data as context.

## Project structure

```
src/
├── app/
│   ├── (auth)/login/          # phone entry screen
│   ├── (auth)/verify/         # OTP entry screen
│   ├── dashboard/             # daily briefing UI
│   ├── integrations/          # connect/disconnect apps UI
│   ├── chat/                  # AI chat assistant UI
│   └── api/
│       ├── auth/              # request-otp, verify-otp, logout, me
│       ├── integrations/      # list, connect, disconnect
│       ├── briefing/          # today, refresh
│       └── chat/              # ask + history
├── components/
│   └── AppShell.tsx           # sidebar nav shared across authenticated pages
├── lib/
│   ├── db/                    # repositories: users, otp, integrations, feed, briefings
│   │   └── jsonStore.ts       # the underlying file-based "database"
│   ├── auth.ts                # JWT session helpers
│   ├── aiService.ts           # mock + real Claude-backed summarization/chat
│   ├── apiClient.ts           # frontend fetch wrapper
│   ├── platformMeta.ts        # icons/colors/actions per platform
│   └── types.ts               # shared domain types (mirrors InsForge schema)
└── middleware.ts               # route protection (redirects unauthenticated users)
```

## Wiring up real providers later

Everything is structured so each mock piece has one clear file to replace:

| To enable | Edit | What changes |
|---|---|---|
| Real AI briefings/chat | nothing — just set `ANTHROPIC_API_KEY` in `.env.local` | `aiService.ts` automatically switches from mock to real Claude calls |
| Real SMS/WhatsApp OTP | `src/app/api/auth/request-otp/route.ts` | Call Sent.dm's API instead of generating a code locally |
| Real Gmail/Slack/etc data | `src/app/api/integrations/connect/route.ts` + new `mcp-server/` (see architecture doc §16–20) | Replace `seedFeedForUser` mock seeding with real OAuth + MCP tool calls |
| Real database | `src/lib/db/*.ts` | Swap the `jsonStore.ts` calls for InsForge/Postgres client calls — repository function signatures stay the same |

## Notes

- All data lives in `/data/*.json` (git-ignored) — delete that folder to reset the app to a clean state.
- This is a single-user-per-browser-session demo; session is a JWT in an httpOnly cookie.
- Mobile-responsive: sidebar collapses to a bottom tab bar under `md` breakpoint.
