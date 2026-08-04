import { Component, OnInit, inject, ChangeDetectionStrategy, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { PayrollService } from '../../services/payroll';
import { Payroll } from '../../../../core/models/payroll';

@Component({
  selector: 'app-payroll-detail',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './payroll-detail.html',
  styleUrl: './payroll-detail.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PayrollDetail implements OnInit {
  private route = inject(ActivatedRoute);
  private payrollService = inject(PayrollService);

  item = signal<Payroll | null>(null);
  loading = signal<boolean>(true);
  loadError = signal<boolean>(false);

  ngOnInit() {
    this.loadData();
  }

  loadData() {
    this.loading.set(true);
    this.loadError.set(false);
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.payrollService.getById(id).subscribe({
        next: (res) => {
          this.item.set(res);
          this.loading.set(false);
        },
        error: (err) => {
          console.error(err);
          this.loadError.set(true);
          this.loading.set(false);
        }
      });
    } else {
      this.loading.set(false);
    }
  }
}
