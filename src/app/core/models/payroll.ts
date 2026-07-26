export interface Payroll {
  id: string;
  companyId?: string;
  employeeId: string;
  month: string;
  baseSalary?: number;
  totalBonus?: number;
  totalPenalty?: number;
  totalAdvance?: number;
  netSalary?: number;
  status?: string;
  paidAt?: string | null;
  paidById?: string | null;
  createdById?: string | null;
  updatedById?: string | null;
  createdAt?: string;
  updatedAt?: string;
}
