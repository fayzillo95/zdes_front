export interface Branch {
  id: string;
  name: string;
  address?: string | null;
  companyId?: string;
  latitude?: number | null;
  longitude?: number | null;
  radius?: number;
  isActive?: boolean;
  createdAt?: string;
  updatedAt?: string;
}
