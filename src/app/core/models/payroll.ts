export interface Payroll {
  id: string | number;
  employeeId: string | number;
  period: string;
  baseSalary: number;
  deductions: number;
  totalAmount: number;
}
