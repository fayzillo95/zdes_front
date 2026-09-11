import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Http } from '../../../core/services/http';
import { Attendance } from '../../../core/models/attendance';
import { PaginatedResult } from '../../../core/models/api-response';

/** `GET /attendance/self/sessions` va `GET /attendance/sessions` qaytaradigan yozuv. */
export interface AttendanceSession {
  id: string;
  companyId: string;
  branchId?: string | null;
  employeeId: string;
  attendanceId?: string | null;
  date: string;
  checkIn: string;
  checkOut?: string | null;
  checkInImageUrl: string;
  checkOutImageUrl?: string | null;
  checkInSimilarity: number;
  checkOutSimilarity?: number | null;
  workedMinutes: number;
  notes?: string | null;
}

export interface AttendanceKpiTemplate {
  companyId?: string;
  latePenaltyPerMinute: number;
  earlyLeavePenaltyPerMinute: number;
  overtimeBonusPerMinute: number;
  faceSimilarityThreshold: number;
}

@Injectable({
  providedIn: 'root',
})
export class AttendanceService {
  private http = inject(Http);

  getAll(params?: Record<string, any>): Observable<Attendance[]> {
    return this.http.get<any>('/attendance', { params }).pipe(
      map((res: any) => {
        if (res?.data?.items && Array.isArray(res.data.items)) return res.data.items;
        if (res?.items && Array.isArray(res.items)) return res.items;
        if (res?.data && Array.isArray(res.data)) return res.data;
        if (Array.isArray(res)) return res;
        return [];
      })
    );
  }

  getById(id: string): Observable<Attendance> {
    return this.http.get<Attendance>(`/attendance/${id}`);
  }

  /**
   * Operator tomonidan kelishni qayd etish.
   *
   * Endpoint `multipart/form-data` kutadi: rasm `file` maydonida binary
   * bo'lib ketadi. Kamera `data:` URL beradi, shuning uchun uni shu yerda
   * `Blob` ga aylantiramiz — chaqiruvchilar avvalgidek matn uzataveradi.
   */
  checkIn(
    employeeId: string,
    imageDataUrl: string,
    terminalId?: string,
    eventTime?: string,
    notes?: string,
  ): Observable<Attendance> {
    return this.http
      .post<any>(
        '/attendance/check-in',
        this.buildEventForm(employeeId, imageDataUrl, terminalId, eventTime, notes),
      )
      .pipe(map((res: any) => res?.data ?? res));
  }

  checkOut(
    employeeId: string,
    imageDataUrl: string,
    terminalId?: string,
    eventTime?: string,
    notes?: string,
  ): Observable<Attendance> {
    return this.http
      .post<any>(
        '/attendance/check-out',
        this.buildEventForm(employeeId, imageDataUrl, terminalId, eventTime, notes),
      )
      .pipe(map((res: any) => res?.data ?? res));
  }

  /**
   * Bitta xodimning tashriflari.
   *
   * Kunlik `Attendance` qatori faqat birinchi kirish va oxirgi chiqishni
   * saqlaydi — kun ichida necha marta kirib-chiqilganini shu ko'rsatadi.
   */
  getEmployeeSessions(
    employeeId: string,
    params: { dateFrom?: string; dateTo?: string; page?: number; limit?: number } = {},
  ): Observable<PaginatedResult<AttendanceSession>> {
    const query: Record<string, string | number> = { employeeId };
    if (params.dateFrom) query['dateFrom'] = params.dateFrom;
    if (params.dateTo) query['dateTo'] = params.dateTo;
    if (params.page) query['page'] = params.page;
    query['limit'] = params.limit ?? 100;

    return this.http.get<any>('/attendance/sessions', { params: query }).pipe(
      map((res: any) => {
        const body = res?.data ?? res;
        return {
          items: Array.isArray(body?.items) ? body.items : [],
          total: body?.total ?? 0,
          page: body?.page ?? 1,
          limit: body?.limit ?? 0,
          totalPages: body?.totalPages ?? 1,
        };
      }),
    );
  }

  /** KPI shabloni — jarima va bonus stavkalari, yuz o'xshashligi chegarasi. */
  getKpiTemplate(companyId: string): Observable<AttendanceKpiTemplate> {
    return this.http
      .get<any>(`/attendance/kpi-template/${companyId}`)
      .pipe(map((res: any) => res?.data ?? res));
  }

  saveKpiTemplate(template: AttendanceKpiTemplate): Observable<AttendanceKpiTemplate> {
    return this.http
      .put<any>('/attendance/kpi-template', template)
      .pipe(map((res: any) => res?.data ?? res));
  }

  // ─── Yordamchilar ──────────────────────────────────────────────────────

  private buildEventForm(
    employeeId: string,
    imageDataUrl: string,
    terminalId?: string,
    eventTime?: string,
    notes?: string,
  ): FormData {
    const form = new FormData();
    form.append('employeeId', employeeId);
    form.append('file', this.dataUrlToBlob(imageDataUrl), 'attendance.jpg');
    if (terminalId) form.append('terminalId', terminalId);
    if (eventTime) form.append('eventTime', eventTime);
    if (notes) form.append('notes', notes);
    return form;
  }

  /** `data:image/jpeg;base64,...` ni yuborishga yaroqli `Blob` ga aylantiradi. */
  private dataUrlToBlob(dataUrl: string): Blob {
    const [header, payload] = dataUrl.split(',');
    const mime = /data:([^;]+)/.exec(header ?? '')?.[1] ?? 'image/jpeg';

    if (!payload || !header?.includes('base64')) {
      return new Blob([payload ?? ''], { type: mime });
    }

    try {
      const binary = atob(payload);
      const bytes = new Uint8Array(binary.length);
      for (let i = 0; i < binary.length; i++) {
        bytes[i] = binary.charCodeAt(i);
      }
      return new Blob([bytes], { type: mime });
    } catch {
      // Base64 buzuq bo'lsa `atob` istisno tashlaydi — bo'sh fayl yuborib,
      // xatoni serverga hal qildirgan ma'quli, oqim uzilib qolmasin.
      return new Blob([], { type: mime });
    }
  }
}
