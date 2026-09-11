export type PayrollStatus = 'draft' | 'confirmed' | 'partially_paid' | 'paid' | 'cancelled';

export const PAYROLL_STATUSES: PayrollStatus[] = [
  'draft',
  'confirmed',
  'partially_paid',
  'paid',
  'cancelled',
];

export const PAYROLL_STATUS_LABELS: Record<PayrollStatus, string> = {
  draft: 'Qoralama',
  confirmed: 'Tasdiqlangan',
  partially_paid: "Qisman to'langan",
  paid: "To'langan",
  cancelled: 'Bekor qilingan',
};

export interface Payroll {
  id: string;
  companyId?: string;
  employeeId: string;
  month: string;
  baseSalary?: number;
  totalBonus?: number;
  totalPenalty?: number;
  totalAdvance?: number;
  netSalary?: number;
  /** Shu paytgacha to'langan summa — qisman to'lovlar yig'indisi. */
  paidAmount?: number;
  status?: PayrollStatus;
  paidAt?: string | null;
  paidById?: string | null;
  createdById?: string | null;
  updatedById?: string | null;
  createdAt?: string;
  updatedAt?: string;
}

/** `GET /payrolls/stats` javobi. */
export interface PayrollStats {
  month?: string;
  employeeCount: number;
  totalBaseSalary: number;
  totalBonus: number;
  totalPenalty: number;
  totalNetSalary: number;
  totalPaid: number;
  totalRemaining: number;
  totalAdvance: number;
  statusBreakdown: Record<PayrollStatus, number>;
}

export interface CreatePayrollPayload {
  companyId?: string;
  employeeId: string;
  /** `YYYY-MM` ko'rinishida. */
  month: string;
  baseSalary?: number;
  totalBonus?: number;
  totalPenalty?: number;
  totalAdvance?: number;
  netSalary?: number;
  status?: PayrollStatus;
}
