import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { Http } from '../../../core/services/http';
import { PaginatedResult } from '../../../core/models/api-response';
import {
  CreateTaskPayload,
  ReorderTaskItem,
  Task,
  TaskProject,
  TaskQuery,
  TaskScope,
  TaskStatus,
  TaskSummary,
  UpdateTaskPayload,
} from '../../../core/models/task';

/**
 * Tasklar API'si — `zdes_backend/src/modules/task`.
 *
 * Backend javobni `{ success, statusCode, message, data, ... }` konvertiga
 * o'raydi, shuning uchun har bir metod `data` ni ochib beradi — loyihadagi
 * boshqa servislar ham shunday qiladi.
 */
@Injectable({
  providedIn: 'root',
})
export class TaskService {
  private readonly http = inject(Http);
  private readonly path = '/tasks';

  // ─── O'qish ────────────────────────────────────────────────────────────

  /** Butun kompaniya bo'yicha (superadmin, admin, manager). */
  getAll(query: TaskQuery = {}): Observable<PaginatedResult<Task>> {
    return this.http
      .get<any>(this.path, { params: this.toParams(query) })
      .pipe(map((res: any) => this.toPage(res)));
  }

  /** Men yaratgan yoki menga biriktirilgan tasklar. Har rol uchun ishlaydi. */
  getMy(query: TaskQuery = {}): Observable<PaginatedResult<Task>> {
    return this.http
      .get<any>(`${this.path}/my`, { params: this.toParams(query) })
      .pipe(map((res: any) => this.toPage(res)));
  }

  /** Bir kunlik yig'ma: jami, bajarilgan, kechikkan, sarflangan vaqt. */
  getSummary(date?: string, scope: TaskScope = 'all'): Observable<TaskSummary> {
    const params: Record<string, string> = { scope };
    if (date) params['date'] = date;

    return this.http
      .get<any>(`${this.path}/my/summary`, { params })
      .pipe(map((res: any) => res?.data ?? res));
  }

  getById(id: string): Observable<Task> {
    return this.http.get<any>(`${this.path}/${id}`).pipe(map((res: any) => res?.data ?? res));
  }

  // ─── Yaratish va tahrirlash ────────────────────────────────────────────

  create(payload: CreateTaskPayload): Observable<Task> {
    return this.http.post<any>(this.path, payload).pipe(map((res: any) => res?.data ?? res));
  }

  /** O'ziga task — faqat sarlavha va izoh, qolganini backend to'ldiradi. */
  createSelf(title: string, description?: string, companyId?: string): Observable<Task> {
    const body: Record<string, unknown> = { title };
    if (description) body['description'] = description;
    if (companyId) body['companyId'] = companyId;

    return this.http.post<any>(`${this.path}/self`, body).pipe(map((res: any) => res?.data ?? res));
  }

  update(id: string, payload: UpdateTaskPayload): Observable<Task> {
    return this.http
      .patch<any>(`${this.path}/${id}`, payload)
      .pipe(map((res: any) => res?.data ?? res));
  }

  /**
   * Holatni almashtirish.
   *
   * Backend faqat ruxsat etilgan o'tishlarni qabul qiladi
   * (`TASK_STATUS_TRANSITIONS`), aks holda 400 qaytadi.
   */
  changeStatus(id: string, status: TaskStatus): Observable<Task> {
    return this.http
      .patch<any>(`${this.path}/${id}/status`, { status })
      .pipe(map((res: any) => res?.data ?? res));
  }

  setAssignees(id: string, assigneeIds: string[]): Observable<Task> {
    return this.http
      .patch<any>(`${this.path}/${id}/assignees`, { assigneeIds })
      .pipe(map((res: any) => res?.data ?? res));
  }

  /** Drag-and-drop tartibi. Bitta so'rovda bir nechta task yangilanadi. */
  reorder(items: ReorderTaskItem[]): Observable<number> {
    return this.http
      .patch<any>(`${this.path}/reorder`, { items })
      .pipe(map((res: any) => (res?.data ?? res)?.updatedCount ?? 0));
  }

  /** Nusxa: media ham ko'chadi, holat `not_started` bo'ladi. */
  duplicate(id: string, startDate?: string, assigneeIds?: string[]): Observable<Task> {
    const body: Record<string, unknown> = {};
    if (startDate) body['startDate'] = startDate;
    if (assigneeIds) body['assigneeIds'] = assigneeIds;

    return this.http
      .post<any>(`${this.path}/${id}/duplicate`, body)
      .pipe(map((res: any) => res?.data ?? res));
  }

  delete(id: string): Observable<void> {
    return this.http.delete<any>(`${this.path}/${id}`).pipe(map(() => void 0));
  }

  // ─── Media ─────────────────────────────────────────────────────────────

  /** Fayl yoki rasm (25 MB gacha). */
  addAttachment(id: string, file: File): Observable<Task> {
    const form = new FormData();
    form.append('file', file);

    return this.http
      .post<any>(`${this.path}/${id}/attachments`, form)
      .pipe(map((res: any) => res?.data ?? res));
  }

  removeAttachment(id: string, attachmentId: string): Observable<Task> {
    return this.http
      .delete<any>(`${this.path}/${id}/attachments/${attachmentId}`)
      .pipe(map((res: any) => res?.data ?? res));
  }

  /** Ovozli xabar (5 MB gacha) + davomiylik va to'lqin shakli. */
  setVoice(
    id: string,
    file: File,
    durationSeconds?: number,
    waveform?: number[],
  ): Observable<Task> {
    const form = new FormData();
    form.append('file', file);
    if (durationSeconds != null) form.append('durationSeconds', String(durationSeconds));
    if (waveform?.length) {
      for (const value of waveform) {
        form.append('waveform', String(value));
      }
    }

    return this.http
      .post<any>(`${this.path}/${id}/voice`, form)
      .pipe(map((res: any) => res?.data ?? res));
  }

  removeVoice(id: string): Observable<Task> {
    return this.http
      .delete<any>(`${this.path}/${id}/voice`)
      .pipe(map((res: any) => res?.data ?? res));
  }

  /** Doiraviy video. `thumbnail` ixtiyoriy — bo'lmasa ro'yxatda oq quti chiqadi. */
  setVideoNote(
    id: string,
    file: File,
    thumbnail?: File,
    durationSeconds?: number,
  ): Observable<Task> {
    const form = new FormData();
    form.append('file', file);
    if (thumbnail) form.append('thumbnail', thumbnail);
    if (durationSeconds != null) form.append('durationSeconds', String(durationSeconds));

    return this.http
      .post<any>(`${this.path}/${id}/video-note`, form)
      .pipe(map((res: any) => res?.data ?? res));
  }

  removeVideoNote(id: string): Observable<Task> {
    return this.http
      .delete<any>(`${this.path}/${id}/video-note`)
      .pipe(map((res: any) => res?.data ?? res));
  }

  /**
   * Bajarilganlik isboti — matn va 5 tagacha fayl.
   *
   * `requireProof` yoqilgan taskni isbotsiz `done` qilib bo'lmaydi.
   */
  submitProof(
    id: string,
    text?: string,
    files: File[] = [],
    removeFileIds: string[] = [],
  ): Observable<Task> {
    const form = new FormData();
    if (text) form.append('text', text);
    for (const file of files) {
      form.append('files', file);
    }
    for (const fileId of removeFileIds) {
      form.append('removeFileIds', fileId);
    }

    return this.http
      .post<any>(`${this.path}/${id}/proof`, form)
      .pipe(map((res: any) => res?.data ?? res));
  }

  // ─── Loyihalar ─────────────────────────────────────────────────────────

  getProjects(companyId?: string, isActive?: boolean): Observable<TaskProject[]> {
    const params: Record<string, string | boolean> = {};
    if (companyId) params['companyId'] = companyId;
    if (isActive != null) params['isActive'] = isActive;

    return this.http.get<any>(`${this.path}/projects`, { params }).pipe(
      map((res: any) => {
        const body = res?.data ?? res;
        if (Array.isArray(body)) return body;
        if (Array.isArray(body?.items)) return body.items;
        return [];
      }),
    );
  }

  getProjectById(id: string): Observable<TaskProject> {
    return this.http
      .get<any>(`${this.path}/projects/${id}`)
      .pipe(map((res: any) => res?.data ?? res));
  }

  createProject(payload: Partial<TaskProject>): Observable<TaskProject> {
    return this.http
      .post<any>(`${this.path}/projects`, payload)
      .pipe(map((res: any) => res?.data ?? res));
  }

  updateProject(id: string, payload: Partial<TaskProject>): Observable<TaskProject> {
    return this.http
      .patch<any>(`${this.path}/projects/${id}`, payload)
      .pipe(map((res: any) => res?.data ?? res));
  }

  deleteProject(id: string): Observable<void> {
    return this.http.delete<any>(`${this.path}/projects/${id}`).pipe(map(() => void 0));
  }

  // ─── Yordamchilar ──────────────────────────────────────────────────────

  /**
   * Bo'sh maydonlarni olib tashlaydi.
   *
   * Backendda `forbidNonWhitelisted` yoqilgan va `undefined` qiymat
   * `?status=` ko'rinishida ketsa enum tekshiruvi yiqiladi.
   */
  private toParams(query: TaskQuery): Record<string, string | number | boolean> {
    const params: Record<string, string | number | boolean> = {};

    for (const [key, value] of Object.entries(query)) {
      if (value === undefined || value === null || value === '') continue;
      params[key] = value as string | number | boolean;
    }

    return params;
  }

  /** Backend sahifali javobni bir xil shaklga keltiradi. */
  private toPage(res: any): PaginatedResult<Task> {
    const body = res?.data ?? res;

    if (Array.isArray(body)) {
      return { items: body, total: body.length, page: 1, limit: body.length, totalPages: 1 };
    }

    return {
      items: Array.isArray(body?.items) ? body.items : [],
      total: body?.total ?? 0,
      page: body?.page ?? 1,
      limit: body?.limit ?? 0,
      totalPages: body?.totalPages ?? 1,
    };
  }
}
