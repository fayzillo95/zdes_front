export interface Company {
  id?: string;
  name: string;
  legalName?: string | null;
  phone?: string | null;
  email?: string | null;
  address?: string | null;
  logoUrl?: string | null;

  isActive?: boolean;
  stoppedAt?: string | null;
  createdAt?: string;
  updatedAt?: string;
}
