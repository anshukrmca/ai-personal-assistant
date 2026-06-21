# Anshu AI Personal Assistant

Anshu AI is a beautiful, premium, responsive personal AI assistant dashboard. It features a stunning dark-themed glassmorphic landing page, a secure phone + OTP authentication flow, an Integrations hub to connect your entire workspace stack, a daily AI-generated briefing dashboard powered by Recharts, and an AI chat assistant.

---

## 🚀 Key Features

1. **High-Fidelity Landing Page**: Fully responsive dark-themed landing page with smooth micro-interactions, symmetric feature grids, visual workflow pipelines, a mockup actions panel, integration tiles, togglable monthly/yearly pricing plans, FAQ accordions, and a complete links footer with newsletter subscription.
2. **Unified Dashboard (Briefing)**: Visualized daily dashboard with interactive Recharts activity graphs, productivity insight charts, upcoming schedule calendars, and an aggregated recent activity feed.
3. **App Integrations**: Simulations for connecting **Gmail, Google Calendar, Slack, Notion, Microsoft Outlook, Microsoft Teams, Trello, and Asana** via OAuth 2.0 simulations, seeding realistic mock notifications, emails, and tasks instantly.
4. **Interactive Autopilot (Human-in-the-Loop)**: AI reasoning executes commands and creates dynamic Action Cards (Daily Schedules, Reminders, Draft Emails) requiring one-click human approval or editing before dispatch.
5. **AI Chat (Ask Anshu)**: A responsive workspace chat terminal allowing you to query, search, and manage your connected accounts. Uses local keyword search in mock mode and unlocks full context reasoning when Anthropic API keys are set.

---

## 🛠️ Stack

- **Framework**: Next.js 16 (App Router, Turbopack)
- **Styling**: Tailwind CSS & Vanilla CSS (supporting dark/light transitions)
- **Data Visualization**: Recharts (with responsive responsive chart containers)
- **Icons**: Lucide Icons & Custom optimized inline SVGs
- **Database**: File-based local JSON store at `/data` (`src/lib/db/jsonStore.ts`) — easily swappable for Postgres or databases without touching layout layers
- **Auth**: Phone + OTP session cookie validation (supporting mock sent.dm verification codes)

---

## 💻 Getting Started (Windows / Local)

1. **Clone the repository & install dependencies**:
   ```powershell
   npm install
   ```

2. **Configure environment variables**:
   Create a `.env.local` file by copying the template:
   ```powershell
   copy .env.example .env.local
   ```

3. **Start the development server**:
   ```powershell
   npm run dev
   ```
   Open **[http://localhost:3000](http://localhost:3000)** in your browser to experience the application.

---

## 📂 Project Structure

```
src/
├── app/
│   ├── (auth)/login/          # Phone entry authentication screen
│   ├── (auth)/verify/         # OTP verification screen
│   ├── dashboard/             # Daily briefing charts & dashboard
│   ├── integrations/          # Integrations connection dashboard
│   ├── chat/                  # AI assistant workspace chat
│   └── api/
│       ├── auth/              # request-otp, verify-otp, session handlers
│       ├── integrations/      # list, connect, disconnect API routes
│       ├── briefing/          # today summaries and feed refresh
│       └── chat/              # chat query history
├── components/
│   ├── landing/               # Header, Hero, Features, Workflow, Integrations, Pricing, FAQ, Footer
│   ├── LandingPage.tsx        # Main landing page wrapper component
│   └── AppShell.tsx           # Authenticated sidebar navigation wrapper
├── lib/
│   ├── db/                    # Local JSON database schemas & repositories
│   ├── auth.ts                # JWT cookie verification helpers
│   ├── aiService.ts           # Mock reasoning engine + real Claude API gateway
│   ├── platformMeta.ts        # App logos, metadata, and seeded mock fields
│   └── types.ts               # Shared domain TypeScript interfaces
└── middleware.ts               # Next.js router guard checking session states
```

---

## 🔒 Security & Extensibility

The workspace is designed for decoupling mock utilities from live providers:

| Integration Goal | File Target | Implementation Path |
|---|---|---|
| **Live AI Summary / Chat** | Just set `ANTHROPIC_API_KEY` in `.env.local` | `aiService.ts` automatically switches from keyword search to Claude |
| **Real SMS/WhatsApp OTP** | `src/app/api/auth/request-otp/route.ts` | Integrate SMS gateways (e.g. Sent.dm or Twilio) |
| **Live Syncing App Channels** | `src/app/api/integrations/connect/route.ts` | Swap mock seeding with real OAuth flow and MCP tool feeds |
| **Enterprise Databases** | `src/lib/db/*.ts` | Replace local JSON-store with InsForge/Postgres repository clients |

---

## 📝 Notes

- **Clean Slate**: Delete the generated `/data` directory (git-ignored) at any time to purge local credentials and reset to a clean state.
- **Responsive Layouts**: Designed for high accessibility across mobile (collapsing to a bottom navigation tab bar), tablets, and ultrawide screens.
