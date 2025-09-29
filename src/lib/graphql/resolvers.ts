import { prisma } from '../prisma';
import { GraphQLScalarType, Kind } from 'graphql';
import {
  CreateEmployeeInput,
  UpdateEmployeeInput,
  SignUpInput,
  SignInInput,
  ForgotPasswordInput,
  ResetPasswordInput,
  CreateLeaveRequestInput,
  UpdateLeaveRequestStatusInput,
} from '../types';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import nodemailer from 'nodemailer';

// Custom scalar resolvers
const DateScalar = new GraphQLScalarType({
  name: 'Date',
  description: 'Date custom scalar type',
  serialize(value: unknown) {
    if (value instanceof Date) {
      return value.toISOString().split('T')[0]; // Convert Date to YYYY-MM-DD
    }
    return value as string;
  },
  parseValue(value: unknown) {
    if (typeof value === 'string') {
      return new Date(value); // Convert incoming string to Date
    }
    return value as Date;
  },
  parseLiteral(ast) {
    if (ast.kind === Kind.STRING) {
      return new Date(ast.value);
    }
    return null;
  },
});

const DateTimeScalar = new GraphQLScalarType({
  name: 'DateTime',
  description: 'DateTime custom scalar type',
  serialize(value: unknown) {
    if (value instanceof Date) {
      return value.toISOString();
    }
    return value as string;
  },
  parseValue(value: unknown) {
    if (typeof value === 'string') {
      return new Date(value);
    }
    return value as Date;
  },
  parseLiteral(ast) {
    if (ast.kind === Kind.STRING) {
      return new Date(ast.value);
    }
    return null;
  },
});

export const resolvers = {
  Date: DateScalar,
  DateTime: DateTimeScalar,

  Query: {
    // Employee queries
    employees: async () => {
      return await prisma.employee.findMany({
        include: {
          leaveRequests: true,
        },
      });
    },

    employee: async (_: unknown, { id }: { id: string }) => {
      return await prisma.employee.findUnique({
        where: { id },
        include: {
          leaveRequests: true,
        },
      });
    },

    // Leave request queries
    leaveRequests: async () => {
      return await prisma.leaveRequest.findMany({
        include: {
          employee: true,
        },
        orderBy: {
          createdAt: 'desc',
        },
      });
    },

    leaveRequest: async (_: unknown, { id }: { id: string }) => {
      return await prisma.leaveRequest.findUnique({
        where: { id },
        include: {
          employee: true,
        },
      });
    },

    employeeLeaveRequests: async (
      _: unknown,
      { employeeId }: { employeeId: string }
    ) => {
      return await prisma.leaveRequest.findMany({
        where: { employeeId },
        orderBy: {
          createdAt: 'desc',
        },
      });
    },

    // Count queries
    employeeCount: async () => {
      return await prisma.employee.count();
    },

    leaveRequestCount: async () => {
      return await prisma.leaveRequest.count();
    },
  },

  Mutation: {
    // Authentication mutations
    signUp: async (_: unknown, { input }: { input: SignUpInput }) => {
      try {
        const { password, ...data } = input;
        const hashedPassword = await bcrypt.hash(password, 12);

        const employee = await prisma.employee.create({
          data: {
            ...data,
            password: hashedPassword,
          },
        });

        const token = jwt.sign(
          { userId: employee.id, email: employee.email, role: employee.role },
          process.env.JWT_SECRET || 'fallback-secret',
          { expiresIn: '7d' }
        );

        return {
          token,
          user: {
            id: employee.id,
            email: employee.email,
            role: employee.role,
            createdAt: employee.createdAt,
            updatedAt: employee.updatedAt,
          },
          success: true,
          message: 'Signup successful',
        };
      } catch (error) {
        return {
          token: null,
          user: null,
          success: false,
          message: error instanceof Error ? error.message : 'Signup failed',
        };
      }
    },

    signIn: async (_: unknown, { input }: { input: SignInInput }) => {
      try {
        const { email, password } = input;

        const employee = await prisma.employee.findUnique({
          where: { email },
        });

        if (!employee || !(await bcrypt.compare(password, employee.password))) {
          throw new Error('Invalid credentials');
        }

        const token = jwt.sign(
          { userId: employee.id, email: employee.email, role: employee.role },
          process.env.JWT_SECRET || 'fallback-secret',
          { expiresIn: '7d' }
        );

        return {
          token,
          user: {
            id: employee.id,
            email: employee.email,
            role: employee.role,
            createdAt: employee.createdAt,
            updatedAt: employee.updatedAt,
          },
          success: true,
          message: 'Sign in successful',
        };
      } catch (error) {
        return {
          token: null,
          user: null,
          success: false,
          message: error instanceof Error ? error.message : 'Sign in failed',
        };
      }
    },

    forgotPassword: async (
      _: unknown,
      { input }: { input: ForgotPasswordInput }
    ) => {
      const { email } = input;

      const employee = await prisma.employee.findUnique({
        where: { email },
      });

      if (!employee) {
        return true; // Don't reveal if email exists
      }

      const resetToken = crypto.randomBytes(32).toString('hex');
      const resetExpires = new Date(Date.now() + 3600000); // 1 hour

      await prisma.employee.update({
        where: { id: employee.id },
        data: {
          passwordResetToken: resetToken,
          passwordResetExpires: resetExpires,
        },
      });

      // Send email with reset token
      try {
        const transporter = nodemailer.createTransport({
          host: process.env.SMTP_HOST || 'smtp.gmail.com',
          port: parseInt(process.env.SMTP_PORT || '587'),
          secure: false,
          auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASS,
          },
        });

        await transporter.sendMail({
          from: process.env.SMTP_FROM || process.env.SMTP_USER,
          to: email,
          subject: 'Password Reset Request',
          html: `
            <h2>Password Reset Request</h2>
            <p>You requested a password reset. Click the link below to reset your password:</p>
            <a href="${
              process.env.NEXTAUTH_URL || 'http://localhost:3000'
            }/auth/reset-password?token=${resetToken}">
              Reset Password
            </a>
            <p>This link expires in 1 hour.</p>
            <p>If you didn't request this, please ignore this email.</p>
          `,
        });

        console.log(`Password reset email sent to ${email}`);
      } catch (emailError) {
        console.error('Failed to send email:', emailError);
        // Still return true to not reveal if email exists
      }

      return true;
    },

    resetPassword: async (
      _: unknown,
      { input }: { input: ResetPasswordInput }
    ) => {
      const { token, password } = input;

      const employee = await prisma.employee.findFirst({
        where: {
          passwordResetToken: token,
          passwordResetExpires: {
            gt: new Date(),
          },
        },
      });

      if (!employee) {
        throw new Error('Invalid or expired reset token');
      }

      const hashedPassword = await bcrypt.hash(password, 12);

      await prisma.employee.update({
        where: { id: employee.id },
        data: {
          password: hashedPassword,
          passwordResetToken: null,
          passwordResetExpires: null,
        },
      });

      return true;
    },

    // Employee mutations
    createEmployee: async (
      _: unknown,
      { input }: { input: CreateEmployeeInput }
    ) => {
      const { password, ...data } = input;
      const hashedPassword = await bcrypt.hash(password, 12);

      return await prisma.employee.create({
        data: {
          ...data,
          password: hashedPassword,
        },
      });
    },

    updateEmployee: async (
      _parent: unknown,
      { input }: { input: UpdateEmployeeInput },
      context: { user?: { userId: string; role: string } }
    ) => {
      const { id, ...data } = input;
      // Only allow if admin or the employee is updating themselves
      if (!context.user) {
        throw new Error('Not authenticated');
      }
      if (context.user.role !== 'ADMIN' && context.user.userId !== id) {
        throw new Error('Not authorized to update this employee');
      }
      return await prisma.employee.update({
        where: { id },
        data,
      });
    },

    deleteEmployee: async (_: unknown, { id }: { id: string }) => {
      await prisma.employee.delete({
        where: { id },
      });
      return true;
    },

    // Leave request mutations
    createLeaveRequest: async (
      _: unknown,
      { input }: { input: CreateLeaveRequestInput }
    ) => {
      const { employeeId, startDate, endDate, description } = input;

      // Validate that the employee exists
      const employee = await prisma.employee.findUnique({
        where: { id: employeeId },
      });

      if (!employee) {
        throw new Error('Employee not found');
      }

      // Validate date range
      const start = new Date(startDate);
      const end = new Date(endDate);

      if (end < start) {
        throw new Error('End date must be after start date');
      }

      return await prisma.leaveRequest.create({
        data: {
          employeeId,
          startDate: start,
          endDate: end,
          description,
        },
      });
    },

    updateLeaveRequestStatus: async (
      _: unknown,
      { input }: { input: UpdateLeaveRequestStatusInput },
      context: { user?: { userId: string; role: string } }
    ) => {
      const { id, status } = input;

      // Only admins can update leave request status
      if (!context.user || context.user.role !== 'ADMIN') {
        throw new Error('Not authorized to update leave request status');
      }

      const leaveRequest = await prisma.leaveRequest.findUnique({
        where: { id },
      });

      if (!leaveRequest) {
        throw new Error('Leave request not found');
      }

      return await prisma.leaveRequest.update({
        where: { id },
        data: { status },
        include: {
          employee: true,
        },
      });
    },
  },
};
