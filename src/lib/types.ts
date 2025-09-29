export interface CreateDepartmentInput {
  name: string;
  description?: string;
  managerId?: string;
}

export interface UpdateDepartmentInput {
  id: string;
  name?: string;
  description?: string;
  managerId?: string;
}

export interface CreatePositionInput {
  title: string;
  description?: string;
  level?: number;
  salaryMin?: number;
  salaryMax?: number;
  departmentId?: string;
}

export interface UpdatePositionInput {
  id: string;
  title?: string;
  description?: string;
  level?: number;
  salaryMin?: number;
  salaryMax?: number;
  departmentId?: string;
}

type Gender = 'MALE' | 'FEMALE' | 'OTHER';
type EmployeeStatus = 'ACTIVE' | 'INACTIVE' | 'TERMINATED' | 'ON_LEAVE';

export interface CreateEmployeeInput {
  name: string;
  email: string;
  password: string;
  phoneNumber?: string;
  address?: string;
  birthDate?: string;
  gender?: Gender;
  role?: 'ADMIN' | 'EMPLOYEE';
}

export interface UpdateEmployeeInput {
  id: string;
  name?: string;
  email?: string;
  phoneNumber?: string;
  address?: string;
  birthDate?: string;
  gender?: Gender;
}

export interface CreateAttendanceInput {
  employeeId: string;
  date: string;
  clockIn?: string;
  clockOut?: string;
  breakStart?: string;
  breakEnd?: string;
  status?: 'PRESENT' | 'ABSENT' | 'LATE' | 'HALF_DAY' | 'HOLIDAY';
  notes?: string;
}

export interface UpdateAttendanceInput {
  id: string;
  clockIn?: string;
  clockOut?: string;
  breakStart?: string;
  breakEnd?: string;
  status?: 'PRESENT' | 'ABSENT' | 'LATE' | 'HALF_DAY' | 'HOLIDAY';
  notes?: string;
}

export interface CreateLeaveInput {
  employeeId: string;
  type:
    | 'SICK'
    | 'VACATION'
    | 'PERSONAL'
    | 'MATERNITY'
    | 'PATERNITY'
    | 'EMERGENCY'
    | 'OTHER';
  startDate: string;
  endDate: string;
  reason?: string;
}

export interface UpdateLeaveInput {
  id: string;
  type?:
    | 'SICK'
    | 'VACATION'
    | 'PERSONAL'
    | 'MATERNITY'
    | 'PATERNITY'
    | 'EMERGENCY'
    | 'OTHER';
  startDate?: string;
  endDate?: string;
  reason?: string;
  status?: 'PENDING' | 'APPROVED' | 'REJECTED' | 'CANCELLED';
}

export interface SignUpInput {
  name: string;
  email: string;
  password: string;
  phoneNumber?: string;
  address?: string;
  birthDate?: string;
  gender?: Gender;
}

export interface SignInInput {
  email: string;
  password: string;
}

export interface ForgotPasswordInput {
  email: string;
}

export interface ResetPasswordInput {
  token: string;
  password: string;
}

export interface ChangePasswordInput {
  currentPassword: string;
  newPassword: string;
}

export interface CreateLeaveRequestInput {
  employeeId: string;
  startDate: string;
  endDate: string;
  description: string;
}

export interface UpdateLeaveRequestStatusInput {
  id: string;
  status: 'PENDING' | 'APPROVED' | 'CANCELLED';
}
