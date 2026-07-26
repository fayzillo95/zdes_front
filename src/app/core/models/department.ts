export interface Department {
  id: string;
  name: string;
  branchId?: string | null;
  companyId?: string;
  isActive?: boolean;
  createdAt?: string;
  updatedAt?: string;
}
