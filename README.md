# Artsyl - Art Auction Platform

Artsyl is a premium, full-stack marketplace designed for the modern art world. It connects artists with a global community of collectors through a secure, high-performance auction engine featuring a unique virtual wallet system and real-time bidding states.

[Live Demo](https://art-auction--hosting-72ffb.us-east4.hosted.app)

---

## 🌟 Key Features

- **Custom Auction Engine**: Real-time bidding logic with automated winner determination and timer synchronization.
- **Virtual Wallet System**: A secure deposit and payment system allows collectors to manage funds, reserve bids, and process seamless transactions.
- **Role-Based Access Control (RBAC)**: Distinct, tailored experiences for **Artists** (artwork management, sales tracking) and **Collectors** (marketplace, bidding, watchlists).
- **Personalized Dashboards**: Data-rich views for managing art collections, activity history, and wallet balances.
- **Real-time Marketplace**: Dynamic filtering and search for discovering artworks by medium, price, or artist.
- **Secure Authentication**: Built with custom JWT implementation and Next.js Middleware for robust session management.

## 🛠️ Tech Stack

- **Framework**: [Next.js 15](https://nextjs.org/) (App Router, Turbopack)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Database**: [PostgreSQL](https://www.postgresql.org/) (hosted on [Neon](https://neon.tech/))
- **ORM**: [Drizzle ORM](https://orm.drizzle.team/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Storage**: [Firebase Cloud Storage](https://firebase.google.com/products/storage)
- **Deployment**: [Firebase App Hosting](https://firebase.google.com/docs/app-hosting)
- **Auth**: Custom JWT-based Authentication

---

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- npm / yarn / pnpm
- A Neon PostgreSQL instance
- A Firebase project with Storage enabled

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/xml300/art-auction.git
   cd art-auction
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   Create a `.env` file in the root and configure the following:
   ```env
   DATABASE_URL="your_neon_connection_string"
   JWT_SECRET_KEY="your_secret_key"
   SITE_BASE_URL="http://localhost:3000"
   ```

4. **Initialize Database**
   ```bash
   npm run db:push
   ```

5. **Run Development Server**
   ```bash
   npm run dev
   ```

---

## 📁 Project Structure

```text
src/
├── app/                  # Next.js App Router (Auth, Admin, Artist, Collector groups)
├── components/           # UI Components (Marketplace, Bidding, Shared)
├── data/                 # Data access layer (Drizzle queries)
├── db/                   # Database schema and client configuration
├── lib/                  # Utilities (Auth, File System, Firebase)
└── types.ts              # Global TypeScript definitions
```

---

## 🚢 Deployment

The project is optimized for **Firebase App Hosting**. 

1. Connect your GitHub repository in the Firebase Console.
2. Configure environment secrets (`DATABASE_URL`, `JWT_SECRET_KEY`) in the App Hosting settings.
3. Deployments are automatically triggered on push to `main`.

---

## 📄 License

This project is private and intended for portfolio demonstration purposes only.

---

## 🤝 Contact

For any inquiries or support, please contact us at [support@artsyl.com](mailto:support@artsyl.com) or connect with us on social media.
