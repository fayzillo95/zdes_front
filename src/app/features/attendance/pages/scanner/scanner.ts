import { Component, OnInit, inject, ChangeDetectionStrategy, DestroyRef } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { EmployeeService } from '../../../employees/services/employee';
import { AttendanceService } from '../../services/attendance';
import { Employee } from '../../../../core/models/employee';

@Component({
  selector: 'app-scanner',
  imports: [CommonModule, FormsModule],
  templateUrl: './scanner.html',
  styleUrl: './scanner.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class Scanner implements OnInit {
  private destroyRef = inject(DestroyRef);
  private employeeService = inject(EmployeeService);
  private attendanceService = inject(AttendanceService);

  employees: Employee[] = [];
  selectedEmployeeId: string = '';
  message: string = '';
  isError: boolean = false;

  ngOnInit(): void {
    this.employeeService.getAll().pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: (data) => {
        this.employees = data;
      },
      error: () => {
        this.showMessage('Xodimlarni yuklashda xatolik', true);
      }
    });
  }

  checkIn(): void {
    if (!this.selectedEmployeeId) {
      this.showMessage('Iltimos, xodimni tanlang', true);
      return;
    }
    this.attendanceService.checkIn(this.selectedEmployeeId).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: () => this.showMessage('Muvaffaqiyatli kelish qayd etildi', false),
      error: () => this.showMessage('Kelishni qayd etishda xatolik', true)
    });
  }

  checkOut(): void {
    if (!this.selectedEmployeeId) {
      this.showMessage('Iltimos, xodimni tanlang', true);
      return;
    }
    this.attendanceService.checkOut(this.selectedEmployeeId).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: () => this.showMessage('Muvaffaqiyatli ketish qayd etildi', false),
      error: () => this.showMessage('Ketishni qayd etishda xatolik', true)
    });
  }

  private showMessage(msg: string, error: boolean): void {
    this.message = msg;
    this.isError = error;
    setTimeout(() => this.message = '', 3000);
  }
}
