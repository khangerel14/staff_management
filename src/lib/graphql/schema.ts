import { gql } from 'graphql-tag';

export const typeDefs = gql`
  # Scalars
  scalar Date
  scalar DateTime

  # Enums
  enum UserRole {
    ADMIN
    EMPLOYEE
  }

  enum Gender {
    MALE
    FEMALE
    OTHER
  }

  enum LeaveRequestStatus {
    PENDING
    APPROVED
    CANCELLED
  }

  # Types
  type User {
    id: ID!
    email: String!
    role: UserRole!
    createdAt: DateTime!
    updatedAt: DateTime!
  }

  type AuthPayload {
    token: String
    user: User
    success: Boolean!
    message: String!
  }

  type Employee {
    id: ID!
    name: String!
    email: String!
    phoneNumber: String
    address: String
    birthDate: Date
    gender: Gender
    createdAt: DateTime!
    updatedAt: DateTime!
    role: UserRole!
    leaveRequests: [LeaveRequest!]!
  }

  type LeaveRequest {
    id: ID!
    employeeId: ID!
    employee: Employee!
    startDate: DateTime!
    endDate: DateTime!
    description: String!
    status: LeaveRequestStatus!
    createdAt: DateTime!
    updatedAt: DateTime!
  }

  # Input Types
  input SignUpInput {
    name: String!
    email: String!
    password: String!
    phoneNumber: String
    address: String
    birthDate: Date
    gender: Gender
  }

  input SignInInput {
    email: String!
    password: String!
  }

  input ForgotPasswordInput {
    email: String!
  }

  input ResetPasswordInput {
    token: String!
    password: String!
  }

  input CreateEmployeeInput {
    name: String!
    email: String!
    password: String!
    phoneNumber: String
    address: String
    birthDate: Date
    gender: Gender
    role: UserRole
  }

  input UpdateEmployeeInput {
    id: ID!
    name: String
    email: String
    phoneNumber: String
    address: String
    birthDate: Date
    gender: Gender
    role: UserRole
  }

  input CreateLeaveRequestInput {
    employeeId: ID!
    startDate: DateTime!
    endDate: DateTime!
    description: String!
  }

  input UpdateLeaveRequestStatusInput {
    id: ID!
    status: LeaveRequestStatus!
  }

  # Queries
  type Query {
    # Employee queries
    employees: [Employee!]!
    employee(id: ID!): Employee
    employeeCount: Int!

    # Leave request queries
    leaveRequests: [LeaveRequest!]!
    leaveRequest(id: ID!): LeaveRequest
    employeeLeaveRequests(employeeId: ID!): [LeaveRequest!]!
    leaveRequestCount: Int!
  }

  # Mutations
  type Mutation {
    # Authentication mutations
    signUp(input: SignUpInput!): AuthPayload!
    signIn(input: SignInInput!): AuthPayload!
    forgotPassword(input: ForgotPasswordInput!): Boolean!
    resetPassword(input: ResetPasswordInput!): Boolean!

    # Employee mutations
    createEmployee(input: CreateEmployeeInput!): Employee!
    updateEmployee(input: UpdateEmployeeInput!): Employee!
    deleteEmployee(id: ID!): Boolean!

    # Leave request mutations
    createLeaveRequest(input: CreateLeaveRequestInput!): LeaveRequest!
    updateLeaveRequestStatus(
      input: UpdateLeaveRequestStatusInput!
    ): LeaveRequest!
  }
`;
