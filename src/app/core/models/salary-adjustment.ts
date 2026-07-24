export interface SalaryAdjustment {
  id: number;
  employeeId: number;
  amount: number;
  type: 'bonus' | 'penalty';
  reason?: string;
  date: string;
}
