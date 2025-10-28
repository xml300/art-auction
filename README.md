# Artsyl - Art Auction Platform

A modern, full-stack online platform for auctioning artwork, connecting artists with collectors through secure bidding and transactions.

## Vision and Goals

Artsyl aims to revolutionize the art auction experience by providing a seamless, secure, and engaging platform for artists and collectors. Our goals include:
- Empowering artists with tools to showcase and sell their work globally.
- Offering collectors a diverse range of authentic artworks through a transparent bidding process.
- Fostering a vibrant community around art appreciation and investment.
- Ensuring high security and reliability for all transactions and user data.

## Features

- **User Authentication & Roles**: Secure user registration with distinct roles for artists and collectors
- **Artwork Management**: Artists can list their artworks for auction with detailed descriptions and images
- **Real-time Bidding**: Collectors can browse and place bids on artworks in real-time
- **Auction System**: Time-based auctions with automatic bid tracking and winner determination
- **Secure Transactions**: Complete transaction processing for successful auctions
- **Role-based Access Control**: Granular permissions system for different user actions

## Tech Stack

- **Framework**: Next.js 15 with TypeScript
- **Styling**: Tailwind CSS
- **Database**: Neon PostgreSQL
- **ORM**: Drizzle ORM
- **Authentication**: Custom user management system

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn
- Neon database account
- Drizzle Kit (for database migrations)

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd art-auction
```

2. Install dependencies:
```bash
npm install
```

3. Install Drizzle Kit globally (if not already installed):
```bash
npm install -g drizzle-kit
```

4. Set up environment variables:
Create a `.env.local` file in the root directory with:
```env
DATABASE_URL=your_neon_database_url
NEXTAUTH_SECRET=your_nextauth_secret
NEXTAUTH_URL=http://localhost:3000
```

5. Run database migrations:
```bash
npm run db:generate
npm run db:migrate
```

6. Start the development server:
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Project Structure

```
src/
├── app/                 # Next.js app router pages
│   ├── auth/           # Authentication pages
│   ├── (admin)/        # Admin-only routes
│   ├── (artist)/       # Artist-only routes
│   └── (collector)/    # Collector-only routes
├── components/         # Reusable UI components
├── db/                # Database configuration and schema
└── lib/               # Utility functions and configurations
```

## Development

- `npm run dev` - Start development server with Turbopack
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

## Database Schema

The application uses the following main entities:
- **Users**: Artists and collectors with role-based access
- **Artworks**: Items listed for auction with descriptions and images
- **Bids**: Real-time bidding system
- **Transactions**: Completed auction purchases
- **Roles & Permissions**: Granular access control system

## Deployment

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is private and not licensed for public use.

## Contact

For any inquiries or support, please contact us at [support@artsyl.com](mailto:support@artsyl.com).
