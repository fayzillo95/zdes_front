import { Component, ChangeDetectionStrategy, inject, OnInit, ChangeDetectorRef } from '@angular/core';
import { combineLatest, of } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { EmployeeService } from '../../../employees/services/employee';
import { AttendanceService } from '../../../attendance/services/attendance';
import { LeaveService } from '../../../leaves/services/leave';
import { NotificationService } from '../../../notifications/services/notification';

interface DashboardStat {
  label: string;
  value: string;
}

@Component({
  selector: 'app-dashboard',
  imports: [],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Dashboard implements OnInit {
  private cdr = inject(ChangeDetectorRef);
  private employeeService = inject(EmployeeService);
  private attendanceService = inject(AttendanceService);
  private leaveService = inject(LeaveService);
  private notificationService = inject(NotificationService);

  protected stats: DashboardStat[] = [
    { label: 'Jami xodimlar', value: '0' },
    { label: 'Bugungi davomat', value: '0%' },
    { label: "Ochiq ta'til so'rovlari", value: '0' },
    { label: "O'qilmagan bildirishnomalar", value: '0' },
  ];

  ngOnInit(): void {
    combineLatest([
      this.employeeService.getAll().pipe(catchError(() => of([]))),
      this.attendanceService.getAll().pipe(catchError(() => of([]))),
      this.leaveService.getAll().pipe(catchError(() => of([]))),
      this.notificationService.getAll().pipe(catchError(() => of([])))
    ]).subscribe((results: any[]) => {
      const [employees, attendances, leaves, notifications] = results;
      
      const employeesArr = Array.isArray(employees) ? employees : [];
      const attendancesArr = Array.isArray(attendances) ? attendances : [];
      const leavesArr = Array.isArray(leaves) ? leaves : [];
      const notificationsArr = Array.isArray(notifications) ? notifications : [];

      const totalEmployees = employeesArr.length;
      
      const today = new Date().toISOString().split('T')[0];
      const todayAttendances = attendancesArr.filter((a: any) => {
         const t = a.date || a.eventTime || a.createdAt;
         return t ? t.toString().startsWith(today) : false;
      });
      const uniqueAttendedEmployees = new Set(
        todayAttendances.map((a: any) => a.employeeId || (a.employee && a.employee.id))
      ).size;
      const attendancePercent = totalEmployees > 0 
        ? Math.round((uniqueAttendedEmployees / totalEmployees) * 100) 
        : 0;
      
      // Ochiq ta'til so'rovlari: Backendda 'status' yo'qligi sababli
      // barcha kelgan leave'larni ochiq deb hisoblaymiz.
      const openLeaves = leavesArr.length;

      // O'qilmagan bildirishnomalar
      const unreadNotifications = notificationsArr.filter((n: any) => n.read === false).length;

      this.stats = [
        { label: 'Jami xodimlar', value: totalEmployees.toString() },
        { label: 'Bugungi davomat', value: `${attendancePercent}%` },
        { label: "Ochiq ta'til so'rovlari", value: openLeaves.toString() },
        { label: "O'qilmagan bildirishnomalar", value: unreadNotifications.toString() },
      ];
      this.cdr.markForCheck();
    });
  }
}
