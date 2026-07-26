import { Component, inject, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { PayrollService } from '../../services/payroll';
import { Observable, switchMap } from 'rxjs';
import { Payroll } from '../../../../core/models/payroll';

@Component({
  selector: 'app-payroll-detail',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './payroll-detail.html',
  styleUrl: './payroll-detail.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PayrollDetail {
  private route = inject(ActivatedRoute);
  private payrollService = inject(PayrollService);

  payroll$: Observable<Payroll> = this.route.paramMap.pipe(
    switchMap(params => this.payrollService.getById(params.get('id')!))
  );
}
