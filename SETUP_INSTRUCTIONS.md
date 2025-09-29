# Staff Management System Setup Instructions

## Features Implemented

✅ **Authentication System**

- Sign up with email and password
- Sign in functionality
- Forgot password with email reset
- Password reset via email link
- Role-based access (Admin/Employee)

✅ **Employee Management**

- Add new employees with Zod form validation
- Edit existing employees
- Delete employees
- Employee information includes: name, email, phone, address, birth date, gender

✅ **Role-Based Dashboards**

- Admin dashboard with employee management
- Employee dashboard with personal information
- Automatic role-based routing

✅ **Database Schema**

- User model with authentication
- Employee model with all required fields
- Proper relationships between models

## Setup Instructions

### 1. Install Dependencies

```bash
npm install
```

### 2. Environment Variables

Create a `.env.local` file in the root directory with the following variables:

```env
# Database
DATABASE_URL="postgresql://username:password@localhost:5432/staff_management"

# JWT Secret
JWT_SECRET="your-super-secret-jwt-key-here"

# Email Configuration (for password reset)
SMTP_HOST="smtp.gmail.com"
SMTP_PORT="587"
SMTP_USER="your-email@gmail.com"
SMTP_PASS="your-app-password"

# NextAuth
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-nextauth-secret-here"
```

### 3. Database Setup

```bash
# Generate Prisma client
npm run db:generate

# Push schema to database
npm run db:push

# (Optional) Seed the database
npm run db:seed
```

### 4. Run the Application

```bash
npm run dev
```

## Usage

### Admin Features

1. Sign up as an admin (first user will be admin by default)
2. Access admin dashboard at `/admin`
3. Add, edit, and delete employees
4. View employee statistics

### Employee Features

1. Sign up as an employee
2. Access employee dashboard at `/dashboard`
3. View personal information
4. Update profile (coming soon)

### Authentication Flow

1. Visit `/` - redirects to sign in if not authenticated
2. Sign up at `/auth/signup`
3. Sign in at `/auth/signin`
4. Forgot password at `/auth/forgot-password`
5. Reset password at `/auth/reset-password?token=...`

## Technical Details

- **Frontend**: Next.js 15, React 19, TypeScript, Tailwind CSS
- **Backend**: GraphQL with Apollo Server
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: Custom JWT-based auth with bcrypt password hashing
- **Forms**: React Hook Form with Zod validation
- **UI Components**: Radix UI with custom styling

## File Structure

```
src/
├── app/
│   ├── auth/
│   │   ├── signin/page.tsx
│   │   ├── signup/page.tsx
│   │   ├── forgot-password/page.tsx
│   │   └── reset-password/page.tsx
│   ├── admin/page.tsx
│   ├── dashboard/page.tsx
│   └── api/graphql/route.ts
├── components/
│   ├── ui/ (Radix UI components)
│   ├── employee-form.tsx
│   ├── employee-list.tsx
│   └── providers/apollo-provider.tsx
└── lib/
    ├── graphql/
    │   ├── schema.ts
    │   ├── resolvers.ts
    │   ├── mutations.ts
    │   └── queries.ts
    ├── prisma.ts
    └── apollo-client.ts
```

## Next Steps

To extend the system, you could add:

- Clock in/out functionality
- Leave management
- Department management
- Advanced reporting
- File uploads for employee photos
- Real-time notifications
- Advanced role permissions
