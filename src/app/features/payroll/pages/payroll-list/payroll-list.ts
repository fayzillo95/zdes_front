import { Component, inject, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
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
  payrolls$: Observable<Payroll[]> = this.payrollService.getAll();
}
