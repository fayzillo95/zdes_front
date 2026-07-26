export interface EmployeeLeave {
  id: string;
  employeeId: string;
  companyId?: string;
  branchId?: string | null;
  fromDate: string;
  toDate: string;
  days?: number;
  type: string;
  affectsSalary?: boolean;
  reason?: string | null;
  createdById?: string | null;
  updatedById?: string | null;
  createdAt?: string;
  updatedAt?: string;
}
