<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# AI Integration Guide

This document outlines the current AI model setup and roadmap for **Anshu AI Personal Assistant**.

---

## 🤖 Current setup

By default, the assistant is decoupled into a mock service layer and a live API gateway:

### 1. Mock Mode (Zero Keys Required)
- **What it does**: Runs simple regex parsing, keyword search across synced database items, and template generators for briefs.
- **Why**: Allows instant development, visual testing, and setup verification with zero API cost.

### 2. Anthropic Claude (Live Integration)
- **Active Model**: `claude-3-5-sonnet` (or similar configured endpoint in `src/lib/aiService.ts`).
- **Activation**: Automatically enabled once `ANTHROPIC_API_KEY` is added to your `.env.local` file.
- **Tasks**: Generates highly context-aware daily summaries, aggregates notifications, reasonings, and coordinates chat terminal context.

---

## 🔮 Future AI Integrations

To make the assistant more cost-effective, private, and flexible, we plan to support the following integrations:

### 1. OpenRouter Integration
- **Purpose**: Query models like **DeepSeek-V3/R1, Llama-3, Qwen-2.5**, or other leading LLMs via a single unified API.
- **Benefits**: Easily swap providers to optimize token cost, speed, and capability.

### 2. Google Gemini (Flash / Pro)
- **Purpose**: Low-latency, cost-effective context window reasoning.
- **Benefits**: Large context inputs (up to 2M tokens) for processing extensive emails, Slack histories, and calendar sheets in a single call.

### 3. Local / Free LLMs (Ollama)
- **Purpose**: 100% data privacy and offline execution.
- **Benefits**: Integrate with locally running Ollama containers (e.g. `llama3.1`, `mistral`, `phi-3`) so user briefs and emails never leave the local environment, with zero API billing.

---

## 🛠️ Codebase AI Architecture (For Developers)

The AI engine logic is modularized inside the `src/lib/ai/` directory:

- **[config.ts](file:///e:/OWN%20Project/Ai%20personal%20assistant/ai-personal-assistant/src/lib/ai/config.ts)**: Setup for providers (currently `anthropic` and `openrouter`). Detects keys and returns active labels.
- **[core.ts](file:///e:/OWN%20Project/Ai%20personal%20assistant/ai-personal-assistant/src/lib/ai/core.ts)**: House of core execution functions (`callAnthropic`, `callOpenAICompatible`).
- **[briefing.ts](file:///e:/OWN%20Project/Ai%20personal%20assistant/ai-personal-assistant/src/lib/ai/briefing.ts)**: Daily summary generator.
- **[chat.ts](file:///e:/OWN%20Project/Ai%20personal%20assistant/ai-personal-assistant/src/lib/ai/chat.ts)**: Chat reasoning loop and text enhancers.

### How to extend or add a new LLM provider:
1. Open [config.ts](file:///e:/OWN%20Project/Ai%20personal%20assistant/ai-personal-assistant/src/lib/ai/config.ts) and add the type name to `Provider` (e.g., `| "gemini" | "ollama"`).
2. Update `detectProvider()` logic to check for the new environment variable (`process.env.GEMINI_API_KEY` or `process.env.OLLAMA_HOST`).
3. Open [core.ts](file:///e:/OWN%20Project/Ai%20personal%20assistant/ai-personal-assistant/src/lib/ai/core.ts) and add the fetch wrapper for the new provider inside the `callAI()` switch router.
