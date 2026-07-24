export interface Company {
  id?: string | number;
  name: string;
  address?: string;
  phone?: string;
  currency: string;
  workDayStart: string;
  workDayEnd: string;
}
