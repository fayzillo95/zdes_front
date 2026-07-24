export interface RawAttendanceLog {
  id: string;
  employeeId: string;
  timestamp: string;
  type: 'check_in' | 'check_out';
}
