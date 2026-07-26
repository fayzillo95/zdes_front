export interface Holiday {
  id?: string;
  companyId?: string;
  branchId?: string | null;
  name: string;
  startDate: string;
  endDate: string;
  affectsSalary?: boolean;
  note?: string | null;
  createdById?: string | null;
  updatedById?: string | null;
  createdAt?: string;
  updatedAt?: string;
}
