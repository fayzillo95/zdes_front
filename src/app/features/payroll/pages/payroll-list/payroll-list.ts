import { Component, inject, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { PayrollService } from '../../services/payroll';
import { Observable } from 'rxjs';
import { Payroll } from '../../../../core/models/payroll';

@Component({
  selector: 'app-payroll-list',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './payroll-list.html',
  styleUrl: './payroll-list.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PayrollList {
  private payrollService = inject(PayrollService);
  private readonly router = inject(Router);
  payrolls$: Observable<Payroll[]> = this.payrollService.getAll();

  onRowClick(id: string): void {
    this.router.navigate(['/payroll', id]);
  }
}
