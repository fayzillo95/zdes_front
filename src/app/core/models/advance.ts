export interface Advance {
  id: string;
  companyId: string;
  employeeId: string;
  amount: number;
  date: string;
  month?: string;
  note?: string;
  createdById?: string | null;
  updatedById?: string | null;
  createdAt?: string;
  updatedAt?: string;
}
