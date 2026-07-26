export interface WorkSchedule {
  id?: string;
  companyId: string;
  branchId: string | null;
  name: string;
  startTime: string;
  endTime: string;
  workDays: number[];
  graceMinutes: number;
  isDefault: boolean;
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
}
