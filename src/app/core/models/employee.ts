export interface Employee {
  id?: string;
  login?: string;
  firstName?: string;
  lastName?: string;
  middleName?: string;
  /** Frontend-only computed field (firstName + lastName). Not from backend. */
  fullName?: string;
  phone?: string | null;
  email?: string | null;
  role?: string;
  companyId?: string | null;
  branchId?: string | null;
  departmentId?: string | null;
  positionId?: string | null;
  managerId?: string | null;
  workScheduleId?: string | null;
  address?: string | null;
  passportSerial?: string | null;
  dateOfBirth?: string | null;
  avatarUrl?: string | null;
  faceImageUrl?: string | null;
  baseSalary?: string | number | null;
  isActive?: boolean;
  isBlocked?: boolean;
  employeeNo?: string | null;
  faceDeviceUserId?: string | null;
  createdAt?: string;
  updatedAt?: string;
}
