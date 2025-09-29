# Staff Management System

A comprehensive staff management system built with Next.js, GraphQL, Apollo Server, and Prisma ORM. This application provides a complete solution for managing employees, departments, positions, attendance, and leave requests.

## 🚀 Features

- **Employee Management**: Create, read, update, and delete employee records
- **Department Management**: Organize employees into departments with managers
- **Position Management**: Define job positions with salary ranges and levels
- **Attendance Tracking**: Clock in/out functionality with time tracking
- **Leave Management**: Request and approve employee leaves
- **GraphQL API**: Full GraphQL API with Apollo Server
- **Real-time Dashboard**: Modern dashboard with statistics and quick actions
- **Database Integration**: PostgreSQL with Prisma ORM

## 🛠️ Tech Stack

- **Frontend**: Next.js 15, React 19, TypeScript, Tailwind CSS
- **Backend**: GraphQL, Apollo Server, Prisma ORM
- **Database**: PostgreSQL
- **GraphQL Client**: Apollo Client
- **Styling**: Tailwind CSS

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

- Node.js (v18 or higher)
- PostgreSQL database
- npm or yarn

## 🚀 Getting Started

### 1. Clone the Repository

```bash
git clone <repository-url>
cd staff-management
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Environment Setup

Create a `.env` file in the root directory:

```env
# Database
DATABASE_URL="postgresql://username:password@localhost:5432/staff_management?schema=public"

# Next.js
NEXTAUTH_SECRET="your-secret-key-here"
NEXTAUTH_URL="http://localhost:3000"
```

Replace the database URL with your PostgreSQL connection string.

### 4. Database Setup

Generate Prisma client:

```bash
npm run db:generate
```

Push the schema to your database:

```bash
npm run db:push
```

Seed the database with sample data:

```bash
npm run db:seed
```

### 5. Start the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the application.

## 📊 Database Schema

The application includes the following main entities:

- **Department**: Organizational units with managers
- **Position**: Job titles with salary ranges and levels
- **Employee**: Staff members with personal and professional information
- **Attendance**: Time tracking and clock in/out records
- **Leave**: Employee leave requests and approvals

## 🔧 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run db:generate` - Generate Prisma client
- `npm run db:push` - Push schema changes to database
- `npm run db:migrate` - Create and run database migrations
- `npm run db:studio` - Open Prisma Studio
- `npm run db:seed` - Seed database with sample data

## 📡 GraphQL API

The GraphQL API is available at `/api/graphql` with the following capabilities:

### Queries

- `employees` - Get all employees
- `employee(id)` - Get employee by ID
- `departments` - Get all departments
- `department(id)` - Get department by ID
- `positions` - Get all positions
- `attendance` - Get attendance records
- `leaves` - Get leave requests

### Mutations

- `createEmployee` - Add new employee
- `updateEmployee` - Update employee information
- `deleteEmployee` - Remove employee
- `createDepartment` - Add new department
- `clockIn/clockOut` - Attendance tracking
- `createLeave` - Request leave
- `approveLeave/rejectLeave` - Manage leave approvals

## 🎨 UI Components

The application features a modern, responsive dashboard with:

- Statistics cards showing key metrics
- Employee listing with department and position information
- Quick action buttons for common tasks
- GraphQL playground integration

## 🗄️ Database Management

### Prisma Studio

Access the database GUI:

```bash
npm run db:studio
```

### Migrations

Create a new migration:

```bash
npm run db:migrate
```

### Seeding

Reset and seed the database:

```bash
npm run db:seed
```

## 🔍 GraphQL Playground

Access the GraphQL playground at [http://localhost:3000/api/graphql](http://localhost:3000/api/graphql) to:

- Explore the API schema
- Test queries and mutations
- View documentation
- Debug GraphQL operations

## 📝 Sample Data

The seed script creates:

- 4 departments (HR, IT, Finance, Marketing)
- 6 job positions with salary ranges
- 6 sample employees with complete profiles
- 7 days of attendance records per employee
- 3 pending leave requests

## 🚀 Deployment

### Environment Variables

Ensure all environment variables are set in your production environment:

- `DATABASE_URL` - PostgreSQL connection string
- `NEXTAUTH_SECRET` - Random secret key
- `NEXTAUTH_URL` - Your production URL

### Build and Deploy

```bash
npm run build
npm run start
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For support, please open an issue in the repository or contact the development team.

---

Built with ❤️ using Next.js, GraphQL, and Prisma
