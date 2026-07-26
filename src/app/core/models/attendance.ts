export interface Attendance {
  id: string;
  companyId: string;
  branchId: string;
  employeeId: string;
  terminalId?: string;
  date: string;
  checkIn?: string;
  checkOut?: string;
  status: string;
  source: string;
  workStartTime?: string;
  workEndTime?: string;
  workedMinutes?: number;
  lateMinutes?: number;
  earlyLeaveMinutes?: number;
  overtimeMinutes?: number;
  checkInImageUrl?: string;
  checkOutImageUrl?: string;
  notes?: string;
  faceSimilarity?: number;
  appliedAdjustments?: any[];
  createdAt: string;
  updatedAt: string;
}
