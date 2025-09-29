import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  // Create sample Employees matching new schema
  const hashedPassword = await bcrypt.hash('password123', 12);

  const employees = [
    {
      name: 'John Smith',
      email: 'john.smith@example.com',
      password: hashedPassword,
      phoneNumber: '+1-555-0101',
      role: 'ADMIN',
    },
    {
      name: 'Sarah Johnson',
      email: 'sarah.johnson@example.com',
      password: hashedPassword,
      phoneNumber: '+1-555-0102',
      role: 'EMPLOYEE',
    },
    {
      name: 'Michael Brown',
      email: 'michael.brown@example.com',
      password: hashedPassword,
      role: 'EMPLOYEE',
    },
    {
      name: 'Emily Davis',
      email: 'emily.davis@example.com',
      password: hashedPassword,
      role: 'EMPLOYEE',
    },
    {
      name: 'David Wilson',
      email: 'david.wilson@example.com',
      password: hashedPassword,
      role: 'EMPLOYEE',
    },
    {
      name: 'Lisa Garcia',
      email: 'lisa.garcia@example.com',
      password: hashedPassword,
      role: 'EMPLOYEE',
    },
  ];

  for (const e of employees) {
    await prisma.employee.upsert({
      where: { email: e.email },
      update: {},
      create: e,
    });
  }

  console.log('✅ Employees created');

  console.log('🎉 Database seeded successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
