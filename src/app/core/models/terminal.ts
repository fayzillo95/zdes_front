export interface Terminal {
  id: string;
  companyId: string;
  branchId: string | null;
  name: string;
  serialNumber: string;
  ipAddress: string | null;
  port: number | null;
  type: string;
  status: string;
  connectionConfig: Record<string, unknown> | null;
  lastSyncAt: string | null;
  createdAt: string;
  updatedAt: string;
}
