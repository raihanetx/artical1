# Article Hub

A modern article management platform built with Next.js, TypeScript, and Neon database.

## Features

- **Article Management**: Create, read, update, and delete articles
- **Admin Dashboard**: Comprehensive admin interface for managing articles
- **Markdown Support**: Write articles using Markdown syntax with syntax highlighting
- **Authentication**: Secure admin authentication using NextAuth.js
- **Responsive Design**: Works seamlessly on desktop and mobile devices
- **Neon Database**: Fast, serverless PostgreSQL database
- **Vercel Optimized**: Ready for deployment on Vercel

## Tech Stack

- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS with shadcn/ui components
- **Database**: Neon (PostgreSQL)
- **Authentication**: NextAuth.js
- **Markdown**: react-markdown with syntax highlighting

## Getting Started

### Prerequisites

- Node.js 18+ or Bun
- Neon database account

### Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   bun install
   ```

3. Set up environment variables:
   ```bash
   cp .env.example .env.local
   ```
   
   Update `.env.local` with your Neon database connection string:
   ```
   DATABASE_URL="postgresql://neondb_owner:your_password@ep-your-region.aws.neon.tech/neondb?sslmode=require&channel_binding=require"
   NEXTAUTH_SECRET="your-secret-key"
   NEXTAUTH_URL="http://localhost:3000"
   ```

4. Initialize the database:
   ```bash
   curl -X POST http://localhost:3000/api/init
   ```

5. Run the development server:
   ```bash
   bun run dev
   ```

6. Open [http://localhost:3000](http://localhost:3000) in your browser

### Admin Access

After initializing the database, you can log in to the admin dashboard:

- URL: [http://localhost:3000/admin](http://localhost:3000/admin)
- Email: `admin@example.com`
- Password: `admin123`

## Project Structure

```
src/
├── app/
│   ├── admin/                 # Admin routes
│   │   ├── dashboard/         # Admin dashboard
│   │   ├── login/            # Admin login
│   │   └── articles/         # Article management
│   ├── api/                  # API routes
│   │   ├── auth/             # NextAuth.js routes
│   │   ├── articles/         # Article CRUD API
│   │   └── init/             # Database initialization
│   ├── article/[slug]/       # Individual article pages
│   └── page.tsx              # Homepage
├── components/
│   ├── ui/                   # shadcn/ui components
│   └── providers.tsx         # Session provider
└── lib/
    ├── auth.ts               # NextAuth configuration
    └── db.ts                 # Database connection
```

## API Routes

- `GET /api/articles` - Get all articles
- `POST /api/articles` - Create new article (admin only)
- `POST /api/auth/[...nextauth]` - NextAuth.js authentication
- `POST /api/init` - Initialize database and create admin user

## Deployment

### Vercel

1. Push your code to GitHub
2. Connect your repository to Vercel
3. Set environment variables in Vercel dashboard:
   - `DATABASE_URL`: Your Neon database connection string
   - `NEXTAUTH_SECRET`: A random secret string
   - `NEXTAUTH_URL`: Your deployed URL (e.g., `https://your-app.vercel.app`)

4. Deploy!

The project includes `vercel.json` for optimal Vercel configuration.

### Environment Variables for Production

- `DATABASE_URL`: Your Neon PostgreSQL connection string
- `NEXTAUTH_SECRET`: A random secret for NextAuth.js
- `NEXTAUTH_URL`: Your production URL

## Database Schema

### Users Table
- `id`: Primary key
- `email`: Unique email address
- `name`: User display name
- `password`: Hashed password
- `role`: User role (USER/ADMIN)
- `created_at`: Creation timestamp
- `updated_at`: Last update timestamp

### Articles Table
- `id`: Primary key
- `title`: Article title
- `content`: Article content (Markdown)
- `excerpt`: Article excerpt
- `slug`: URL-friendly slug
- `published`: Publication status
- `author_id`: Foreign key to users table
- `created_at`: Creation timestamp
- `updated_at`: Last update timestamp

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is open source and available under the [MIT License](LICENSE).