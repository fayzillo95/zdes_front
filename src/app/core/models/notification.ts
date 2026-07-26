export interface Notification {
  id: string;
  userId: string | null;
  title: string;
  message: string;
  icon: string | null;
  read: boolean;
  createdAt: string;
  updatedAt: string;
}
