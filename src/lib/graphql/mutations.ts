import { gql } from 'graphql-tag';

export const SIGN_UP = gql`
  mutation SignUp($input: SignUpInput!) {
    signUp(input: $input) {
      token
      user {
        id
        email
        role
        createdAt
        updatedAt
      }
      success
      message
    }
  }
`;

export const SIGN_IN = gql`
  mutation SignIn($input: SignInInput!) {
    signIn(input: $input) {
      token
      user {
        id
        email
        role
        createdAt
        updatedAt
      }
      success
      message
    }
  }
`;

export const FORGOT_PASSWORD = gql`
  mutation ForgotPassword($input: ForgotPasswordInput!) {
    forgotPassword(input: $input)
  }
`;

export const RESET_PASSWORD = gql`
  mutation ResetPassword($input: ResetPasswordInput!) {
    resetPassword(input: $input)
  }
`;

export const CREATE_EMPLOYEE = gql`
  mutation CreateEmployee($input: CreateEmployeeInput!) {
    createEmployee(input: $input) {
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

export const UPDATE_EMPLOYEE = gql`
  mutation UpdateEmployee($input: UpdateEmployeeInput!) {
    updateEmployee(input: $input) {
      id
      name
      email
      phoneNumber
      address
      birthDate
      gender
      createdAt
      updatedAt
    }
  }
`;

export const DELETE_EMPLOYEE = gql`
  mutation DeleteEmployee($id: ID!) {
    deleteEmployee(id: $id)
  }
`;

// Leave Request Mutations
export const CREATE_LEAVE_REQUEST = gql`
  mutation CreateLeaveRequest($input: CreateLeaveRequestInput!) {
    createLeaveRequest(input: $input) {
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

export const UPDATE_LEAVE_REQUEST_STATUS = gql`
  mutation UpdateLeaveRequestStatus($input: UpdateLeaveRequestStatusInput!) {
    updateLeaveRequestStatus(input: $input) {
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
