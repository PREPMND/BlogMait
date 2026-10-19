# PrepScrawl

A full-stack writing platform built for developers and prep enthusiasts. Write, share, and discover posts with AI-powered features, real-time reactions, and a polished reading experience.

**Live:** [prepscrawl.vercel.app](https://prepscrawl.vercel.app)

## Tech Stack

| Layer | Tech |
|-------|------|
| Framework | Next.js 16 (App Router, Turbopack) |
| Language | TypeScript |
| Database | PostgreSQL (Neon serverless) |
| ORM | Drizzle ORM |
| Auth | better-auth (email/password, session cookies) |
| Styling | Tailwind CSS 4, shadcn/ui |
| Animations | Framer Motion |
| Email | Nodemailer + Gmail SMTP |
| Images | Cloudinary |
| AI | Google Gemini, Groq, Hugging Face, fal.ai |
| Validation | Zod, @preplabs/validator |
| State | Zustand |
| Queue | BullMQ + Upstash Redis (serverless fallback for Vercel) |
| Deployment | Vercel |

## Features

- Markdown editor with live preview, reading time estimates, and tag system
- AI-assisted post generation and image creation
- Email/password auth with welcome emails and session caching
- Post reactions, bookmarks, and social sharing
- User profiles with post history and stats
- Dark mode support
- Skeleton loading states and animated loading bar for perceived performance
- Fully responsive — mobile-first layouts with overflow-safe code blocks and tables

## Architecture Decisions

**Auth on the edge:** better-auth with `trustedOrigins` for multi-domain Vercel deployments. Client auto-detects origin (no hardcoded `baseURL` on the client side — Next.js only exposes `NEXT_PUBLIC_*` env vars to the browser).

**Email without queues on Vercel:** BullMQ workers can't run on serverless. The welcome email endpoint calls Nodemailer directly. BullMQ + Redis config remains for self-hosted setups where persistent workers are available.

**Image delivery:** Cloudinary handles uploads and transformations. Large unoptimized images are the main FCP bottleneck — use Cloudinary's `f_auto,q_auto` transforms in production.

**Session strategy:** 7-day expiry, 24h refresh cycle, 2h cookie cache. `disableSessionRefresh` is on to reduce DB hits on every request.

## Performance (Production)

| Metric | Value |
|--------|-------|
| TTFB | ~103ms |
| DOM Content Loaded | ~411ms |
| CLS | 0.0 |
| JS Bundle | ~457KB |
| CSS | ~22KB |

FCP (~4.2s) is dominated by Cloudinary image weight. With `f_auto,q_auto` transforms applied, this drops significantly.

## Project Structure

```
app/
  api/
    auth/         # better-auth handler
    email/        # welcome email endpoint
    posts/        # CRUD + reactions + bookmarks
    ai/           # Gemini/Groq/HF/fal endpoints
  post/[slug]/    # post detail page
  profile/        # user profile + stats
  auth/           # login/register pages
components/
  auth/           # login/register forms
  post/           # post card, content renderer, share buttons, editor
  ui/             # shadcn components, loading bar
lib/
  auth.ts         # better-auth server config
  auth-client.ts  # better-auth client
  db/             # Drizzle schema + connection
  email.ts        # Nodemailer transporter
  queue.ts        # BullMQ setup (unused on Vercel)
```

## Setup

```bash
git clone <repo-url>
cd BlogMait
npm install
```

Create `.env.local`:

```env
DATABASE_URL=postgresql://...
BETTER_AUTH_SECRET=<random-256-bit-hex>
BASE_URL=http://localhost:3000
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=<cloud-name>
NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET=<preset>
CLOUDINARY_API_KEY=<key>
CLOUDINARY_API_SECRET=<secret>
GMAIL_USER=<your-gmail>
GMAIL_APP_PASSWORD=<app-password>
REDIS_URL=rediss://<upstash-url>
GEMINI_API_KEY=<key>
GROQ_API_KEY=<key>
HF_TOKEN=<token>
FAL_KEY=<key>
TRUSTED_ORIGINS=https://your-domain.vercel.app
```

Push the schema and start:

```bash
npx drizzle-kit push
npm run dev
```

## Known Tradeoffs

- FCP is image-bound — needs Cloudinary transform optimization on stored URLs
- BullMQ is a dead dependency on Vercel (no persistent workers) — email sends inline
- No email verification flow yet — `requireEmailVerification` is `false`
- Resend SDK is still in `package.json` but unused (switched to Nodemailer)

## License

MIT
