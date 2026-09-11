import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  DestroyRef,
  OnInit,
  computed,
  inject,
  signal,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

import { PayrollService } from '../../services/payroll';
import { ConfirmDialog } from '../../../../shared/components/ui/confirm-dialog/confirm-dialog';
import { PAYROLL_STATUS_LABELS, Payroll, PayrollStatus } from '../../../../core/models/payroll';

@Component({
  selector: 'app-payroll-detail',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, ConfirmDialog],
  templateUrl: './payroll-detail.html',
  styleUrl: './payroll-detail.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PayrollDetail implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private payrollService = inject(PayrollService);
  private destroyRef = inject(DestroyRef);
  private cdr = inject(ChangeDetectorRef);

  readonly statusLabels = PAYROLL_STATUS_LABELS;

  item = signal<Payroll | null>(null);
  loading = signal<boolean>(true);
  loadError = signal<boolean>(false);

  readonly busy = signal(false);
  readonly actionError = signal<string | null>(null);
  readonly payAmount = signal<number | null>(null);
  readonly showDeleteDialog = signal(false);

  /** To'lanishi kerak bo'lgan qoldiq — to'lov maydonining boshlang'ich qiymati. */
  readonly remaining = computed(() => {
    const value = this.item();
    if (!value) return 0;
    return Math.max(0, Number(value.netSalary ?? 0) - Number(value.paidAmount ?? 0));
  });

  readonly isSettled = computed(() => {
    const status = this.item()?.status;
    return status === 'paid' || status === 'cancelled';
  });

  ngOnInit() {
    this.loadData();
  }

  loadData() {
    this.loading.set(true);
    this.loadError.set(false);
    const id = this.route.snapshot.paramMap.get('id');
    if (!id) {
      this.loading.set(false);
      return;
    }

    this.payrollService.getById(id).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: (res) => {
        this.item.set(res);
        this.payAmount.set(this.remaining() || null);
        this.loading.set(false);
        this.cdr.markForCheck();
      },
      error: (err) => {
        console.error(err);
        this.loadError.set(true);
        this.loading.set(false);
        this.cdr.markForCheck();
      }
    });
  }

  statusLabel(status?: PayrollStatus): string {
    return status ? this.statusLabels[status] : '—';
  }

  // ─── To'lov ────────────────────────────────────────────────────────────

  pay(): void {
    const value = this.item();
    const amount = Number(this.payAmount());

    if (!value) return;
    if (!amount || amount <= 0) {
      this.actionError.set("To'lov summasi noldan katta bo'lishi kerak");
      return;
    }

    this.busy.set(true);
    this.actionError.set(null);

    this.payrollService.pay(value.id, amount).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: (updated) => {
        this.busy.set(false);
        this.item.set(updated);
        this.payAmount.set(this.remaining() || null);
        this.cdr.markForCheck();
      },
      error: (err) => {
        this.busy.set(false);
        this.actionError.set(this.errorText(err));
        this.cdr.markForCheck();
      }
    });
  }

  payFull(): void {
    this.payAmount.set(this.remaining());
    this.pay();
  }

  // ─── O'chirish ─────────────────────────────────────────────────────────

  askDelete(): void {
    this.actionError.set(null);
    this.showDeleteDialog.set(true);
  }

  cancelDelete(): void {
    this.showDeleteDialog.set(false);
  }

  confirmDelete(): void {
    const value = this.item();
    this.showDeleteDialog.set(false);
    if (!value) return;

    this.busy.set(true);
    this.payrollService.delete(value.id).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: () => this.router.navigate(['/payroll']),
      error: (err) => {
        this.busy.set(false);
        this.actionError.set(this.errorText(err));
        this.cdr.markForCheck();
      }
    });
  }

  private errorText(err: any): string {
    const message = err?.response?.data?.message ?? err?.message;
    if (Array.isArray(message)) return message.join(', ');
    return typeof message === 'string' ? message : 'Amalni bajarib bo\'lmadi';
  }
}
