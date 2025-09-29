# Quick Setup Guide

## 1. Environment Setup

Create a `.env` file in the root directory with the following content:

```env
# Database
DATABASE_URL="postgresql://username:password@localhost:5432/staff_management?schema=public"

# Next.js
NEXTAUTH_SECRET="your-secret-key-here"
NEXTAUTH_URL="http://localhost:3000"
```

**Important**: Replace `username`, `password`, `localhost`, `5432`, and `staff_management` with your actual PostgreSQL database credentials.

## 2. Database Setup

### Option A: Using Docker (Recommended)

```bash
# Start PostgreSQL with Docker
docker run --name staff-management-db \
  -e POSTGRES_USER=admin \
  -e POSTGRES_PASSWORD=password \
  -e POSTGRES_DB=staff_management \
  -p 5432:5432 \
  -d postgres:15

# Update your .env file:
DATABASE_URL="postgresql://admin:password@localhost:5432/staff_management?schema=public"
```

### Option B: Local PostgreSQL Installation

1. Install PostgreSQL on your system
2. Create a database named `staff_management`
3. Update your `.env` file with the correct connection string

## 3. Run Setup Commands

```bash
# Generate Prisma client
npm run db:generate

# Push schema to database
npm run db:push

# Seed with sample data
npm run db:seed

# Start development server
npm run dev
```

## 4. Access the Application

- **Dashboard**: http://localhost:3000
- **GraphQL Playground**: http://localhost:3000/api/graphql
- **Prisma Studio** (optional): Run `npm run db:studio`

## Sample Data

The seed script creates:

- 4 departments (HR, IT, Finance, Marketing)
- 6 job positions
- 6 sample employees
- 7 days of attendance records per employee
- 3 pending leave requests

## Troubleshooting

### Database Connection Issues

- Ensure PostgreSQL is running
- Check your connection string in `.env`
- Verify database exists and user has permissions

### GraphQL Errors

- Check browser console for errors
- Verify all dependencies are installed
- Ensure database is properly seeded

### Build Issues

- Clear node_modules and reinstall: `rm -rf node_modules && npm install`
- Regenerate Prisma client: `npm run db:generate`
