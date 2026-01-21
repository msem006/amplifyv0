# Amplify V2: Attribution Engine Prototype

Welcome to the **Amplify V2** prototype repository. This is a data-driven attribution engine designed to replace traditional key distribution with transparent ROI tracking for game studios and creators.

## 🚀 Key Features

### 1. Data-Driven Attribution (Loot Links)
Creators no longer just "get a key." They generate unique **Loot Links** (Tracking Links) that track:
- **Clicks**: Real-time traffic from the creator's audience.
- **Installs**: Verified game conversions (simulated for the prototype).
- **ROI**: Transparent performance metrics for both creators and admins.

### 2. Multi-Role Dashboard System
- **Creator View**: Performance stats, active drops, and an "Offer Wall" to discover and apply for campaigns.
- **Admin ROI Dashboard**: Platform-wide metrics, campaign conversion rates, and a reliability-ranked creator roster.

### 3. Reliability Scoring
Creators are ranked by a **Reliability Score** (0-100) based on their historical conversion rates and "Key Debt" status, helping studios identify top-tier talent.

---

## 🛠️ Tech Stack
- **Framework**: [Next.js 15 (App Router)](https://nextjs.org/)
- **Auth**: [NextAuth.js v5](https://authjs.dev/)
- **Database**: [Prisma ORM](https://www.prisma.io/) with PostgreSQL (configured for Vercel)
- **Styling**: Vanilla CSS with a "Premium-Dark" aesthetic.

---

## 🏁 Getting Started

### 1. Setup Environment
Copy the example environment file and fill in your credentials:
```bash
cp .env.example .env
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Initialize Database
For local development, ensure you have a Postgres connection string or toggle the provider back to `sqlite` in `schema.prisma`.
```bash
npx prisma db push
```

### 4. Seed Mock Data
Populate the system with 12 campaigns and 20+ diverse creators:
```bash
node scripts/seed-v2.js
```

### 5. Run Development Server
```bash
npm run dev
```

---

## 🏎️ Prototype Shortcuts
To streamline the demo experience, we've implemented a **Prototype Switcher** in the top navigation bar. You can instantly switch between:
- **Top Creator**: Login as a high-tier talent profile.
- **Admin**: Access the global ROI and roster metrics.
- **Newbie**: View the "Waiting" state for unverified creators.

---

## ☁️ Deployment
This project is configured for one-click deployment to **Vercel**. 
1. Push to GitHub.
2. Link to Vercel.
3. Add **Vercel Postgres** integration.
4. Set `NEXTAUTH_SECRET` in environment variables.

---

*Built with ❤️ for the future of game distribution.*
