export interface Employee {
  id: string;
  fullName: string;
  phone?: string;
  branchId?: string;
  departmentId?: string;
  positionId?: string;
  status: 'active' | 'inactive';
  hiredAt?: string;
}
