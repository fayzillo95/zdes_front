export interface EmployeeLeave {
  id: number;
  employeeId: number;
  startDate: string;
  endDate: string;
  type: 'vacation' | 'sick' | 'unpaid';
  status: 'pending' | 'approved' | 'rejected';
}
