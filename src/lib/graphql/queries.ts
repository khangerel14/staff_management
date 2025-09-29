import { gql } from '@apollo/client';

// Employee Queries
export const GET_EMPLOYEES = gql`
  query GetEmployees {
    employees {
      id
      name
      email
      phoneNumber
      address
      birthDate
      gender
      role
      createdAt
      updatedAt
    }
  }
`;

export const GET_EMPLOYEE = gql`
  query GetEmployee($id: ID!) {
    employee(id: $id) {
      id
      name
      email
      phoneNumber
      address
      birthDate
      gender
      role
      createdAt
      updatedAt
    }
  }
`;

// Leave Request Queries
export const GET_LEAVE_REQUESTS = gql`
  query GetLeaveRequests {
    leaveRequests {
      id
      employeeId
      employee {
        id
        name
        email
      }
      startDate
      endDate
      description
      status
      createdAt
      updatedAt
    }
  }
`;

export const GET_LEAVE_REQUEST = gql`
  query GetLeaveRequest($id: ID!) {
    leaveRequest(id: $id) {
      id
      employeeId
      employee {
        id
        name
        email
      }
      startDate
      endDate
      description
      status
      createdAt
      updatedAt
    }
  }
`;

export const GET_EMPLOYEE_LEAVE_REQUESTS = gql`
  query GetEmployeeLeaveRequests($employeeId: ID!) {
    employeeLeaveRequests(employeeId: $employeeId) {
      id
      employeeId
      startDate
      endDate
      description
      status
      createdAt
      updatedAt
    }
  }
`;

export const GET_EMPLOYEE_COUNT = gql`
  query GetEmployeeCount {
    employeeCount
  }
`;

export const GET_LEAVE_REQUEST_COUNT = gql`
  query GetLeaveRequestCount {
    leaveRequestCount
  }
`;
