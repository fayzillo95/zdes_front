import { Component, inject, OnInit, ChangeDetectionStrategy, DestroyRef } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { EmployeeService } from '../../services/employee';
import { Employee } from '../../../../core/models/employee';

@Component({
  selector: 'app-employee-list',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './employee-list.html',
  styleUrls: ['./employee-list.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class EmployeeList implements OnInit {
  private destroyRef = inject(DestroyRef);
  private employeeService = inject(EmployeeService);
  employees: Employee[] = [];

  ngOnInit(): void {
    this.loadEmployees();
  }

  loadEmployees(): void {
    this.employeeService.getAll().pipe(takeUntilDestroyed(this.destroyRef)).subscribe(data => {
      this.employees = data;
    });
  }

  deleteEmployee(id: string): void {
    if (confirm('Are you sure you want to delete this employee?')) {
      this.employeeService.delete(id).pipe(takeUntilDestroyed(this.destroyRef)).subscribe(() => {
        this.loadEmployees();
      });
    }
  }
}
