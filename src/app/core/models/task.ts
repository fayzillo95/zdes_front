/**
 * Task modellari — backend `zdes_backend/src/modules/task` bilan bir xil.
 *
 * Maydon nomlari Prisma sxemasidan olingan, shuning uchun javobni qayta
 * nomlash shart emas. To'liq ma'lumotnoma: `zdes_backend/docs/tasks-api.md`.
 */

export type TaskStatus = 'not_started' | 'in_progress' | 'in_review' | 'done' | 'cancelled';

export type TaskPriority = 'lowest' | 'normal' | 'high' | 'urgent';

export type TaskType = 'feature' | 'bug' | 'review' | 'testing' | 'other';

export type TaskAttachmentKind = 'file' | 'image' | 'voice' | 'video_note' | 'proof';

/** `/tasks/my` va `/tasks/my/summary` uchun: kimning tasklari. */
export type TaskScope = 'all' | 'created' | 'assigned';

export const TASK_STATUSES: TaskStatus[] = [
  'not_started',
  'in_progress',
  'in_review',
  'done',
  'cancelled',
];

export const TASK_PRIORITIES: TaskPriority[] = ['lowest', 'normal', 'high', 'urgent'];

export const TASK_TYPES: TaskType[] = ['feature', 'bug', 'review', 'testing', 'other'];

export const TASK_STATUS_LABELS: Record<TaskStatus, string> = {
  not_started: 'Boshlanmagan',
  in_progress: 'Bajarilmoqda',
  in_review: 'Tekshiruvda',
  done: 'Bajarilgan',
  cancelled: 'Bekor qilingan',
};

export const TASK_PRIORITY_LABELS: Record<TaskPriority, string> = {
  lowest: 'Past',
  normal: 'Oddiy',
  high: 'Yuqori',
  urgent: 'Shoshilinch',
};

export const TASK_TYPE_LABELS: Record<TaskType, string> = {
  feature: 'Yangi ish',
  bug: 'Xatolik',
  review: "Ko'rib chiqish",
  testing: 'Sinov',
  other: 'Boshqa',
};

/**
 * Backend ruxsat beradigan holat o'tishlari (`ALLOWED_TRANSITIONS`).
 *
 * UI shu ro'yxatdan tashqari tugmani ko'rsatmasligi kerak — aks holda
 * server 400 qaytaradi.
 */
export const TASK_STATUS_TRANSITIONS: Record<TaskStatus, TaskStatus[]> = {
  not_started: ['in_progress', 'cancelled'],
  in_progress: ['in_review', 'done', 'not_started', 'cancelled'],
  in_review: ['done', 'in_progress', 'cancelled'],
  done: ['in_progress'],
  cancelled: ['not_started', 'in_progress'],
};

export interface TaskUserBrief {
  id: string;
  firstName?: string | null;
  lastName?: string | null;
  middleName?: string | null;
  avatarUrl?: string | null;
  role?: string | null;
}

export interface TaskAssignee {
  id: string;
  taskId: string;
  userId: string;
  assignedAt: string;
  user?: TaskUserBrief | null;
}

export interface TaskAttachment {
  id: string;
  taskId: string;
  kind: TaskAttachmentKind;
  url: string;
  thumbnailUrl?: string | null;
  name?: string | null;
  mimeType?: string | null;
  sizeBytes?: number | null;
  durationSeconds?: number | null;
  waveform: number[];
  uploadedById: string;
  createdAt: string;
}

export interface TaskProject {
  id: string;
  companyId: string;
  name: string;
  description?: string | null;
  color?: string | null;
  icon?: string | null;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Task {
  id: string;
  companyId: string;
  projectId?: string | null;
  departmentId?: string | null;
  title: string;
  description?: string | null;
  type: TaskType;
  status: TaskStatus;
  priority: TaskPriority;

  startDate?: string | null;
  /** Ko'chirilgunga qadar belgilangan dastlabki kun. */
  originalDate?: string | null;
  dueDate?: string | null;
  order: number;

  estimatedMinutes?: number | null;
  spentSeconds: number;
  /** `null` bo'lmasa — hisoblagich hozir ishlab turibdi. */
  startedAt?: string | null;
  completedAt?: string | null;

  requireProof: boolean;
  proofText?: string | null;
  proofSubmittedAt?: string | null;

  createdById: string;
  createdAt: string;
  updatedAt: string;

  project?: TaskProject | null;
  department?: { id: string; name: string } | null;
  createdBy?: TaskUserBrief | null;
  assignees?: TaskAssignee[];
  attachments?: TaskAttachment[];
}

export interface TaskSummary {
  date: string;
  total: number;
  notStarted: number;
  inProgress: number;
  inReview: number;
  done: number;
  cancelled: number;
  overdue: number;
  spentSeconds: number;
  estimatedMinutes: number;
  completionRate: number;
}

/** `GET /tasks` va `GET /tasks/my` qabul qiladigan filtrlar. */
export interface TaskQuery {
  companyId?: string;
  projectId?: string;
  departmentId?: string;
  assigneeId?: string;
  createdById?: string;
  status?: TaskStatus;
  priority?: TaskPriority;
  type?: TaskType;
  search?: string;
  date?: string;
  dateFrom?: string;
  dateTo?: string;
  startDate?: string;
  dueDate?: string;
  scope?: TaskScope;
  sortBy?: 'order' | 'createdAt' | 'dueDate' | 'priority' | 'title';
  sortOrder?: 'asc' | 'desc';
  page?: number;
  limit?: number;
}

export interface CreateTaskPayload {
  companyId?: string;
  projectId?: string;
  departmentId?: string;
  title: string;
  description?: string;
  type?: TaskType;
  status?: TaskStatus;
  priority?: TaskPriority;
  startDate?: string;
  dueDate?: string;
  order?: number;
  estimatedMinutes?: number;
  requireProof?: boolean;
  assigneeIds?: string[];
}

export type UpdateTaskPayload = Partial<CreateTaskPayload>;

export interface ReorderTaskItem {
  id: string;
  order: number;
  status?: TaskStatus;
}
