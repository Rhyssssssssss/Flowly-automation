# Flowly live demo

https://flowly-automation.vercel.app/

**Connect your apps and automate repetitive work with a simple drag-and-drop builder.**

## Overview

Flowly is a no-code automation platform (think Zapier) that lets users connect apps like Google Drive, Discord, Slack, and Notion and automate the work between them. Instead of manually copying files, sending notifications, or logging updates, users build a workflow once on a visual canvas and Flowly runs it automatically — turning a chain of repetitive manual steps into a single set-it-and-forget-it automation.

## Features

- **Drag-and-drop builder** — create automations visually by connecting trigger and action nodes, no code needed.
- **Automatic triggers** — workflows run on their own when an event happens (e.g. a new Google Drive file), so there's nothing to start manually.
- **Multi-app integrations** — link Google Drive, Discord, Slack, and Notion, and pass data between them in one flow.
- **One-to-many automation** — a single trigger can fan out to several actions at once (e.g. notify Discord *and* Slack *and* log to Notion).
- **Scheduled delays** — add a wait step to run later actions on a timer instead of all at once.
- **Accounts & sign-in** — secure authentication and user management out of the box.
- **Subscription plans** — tiered pricing with usage limits, handling billing and per-user run quotas automatically.

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js (App Router) |
| Language | TypeScript |
| Database ORM | Prisma |
| Authentication | Clerk |
| Payments | Stripe |
| Workflow Canvas | React Flow |
| Styling | Tailwind CSS + shadcn/ui |
| Scheduling | cron-job.org |

## Getting Started

### Prerequisites

- Node.js 18+
- pnpm (recommended)
- Accounts for the external services (Clerk, Stripe, etc.)

### Installation

\`\`\`bash
# Clone the repo
git clone https://github.com/Rhysssssssss/Flowly-automation.git
cd Flowly-automation

# Install dependencies
pnpm install

# Set up environment variables
cp .env.example .env

# Apply the database schema
npx prisma db push

# Start the dev server
pnpm dev
\`\`\`

Google drive webhook refresh 
https://flowly-automation.vercel.app/api/drive-activity

### Environment Variables

Create a \`.env\` file based on \`.env.example\` and fill in your own keys (database, Clerk, Stripe, integrations, and scheduling).
