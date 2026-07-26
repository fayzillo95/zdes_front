export interface SalaryAdjustment {
  id: string;
  companyId: string;
  employeeId: string;
  type: string;
  category: string;
  amount: number;
  date: string;
  month: string;
  reason?: string;
  createdById?: string;
  updatedById?: string;
  createdAt?: string;
  updatedAt?: string;
}
