import { Component, inject, signal, OnInit, ChangeDetectionStrategy, DestroyRef, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

import { CompanyService } from '../../services/company';
import { Company } from '../../../../core/models/company';
import { ScopeFilterService, ScopeFilterState } from '../../../../core/services/scope-filter';

@Component({
  selector: 'app-company-list',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './company-list.html',
  styleUrl: './company-list.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CompanyList implements OnInit {
  private readonly companyService = inject(CompanyService);
  private readonly scopeFilterService = inject(ScopeFilterService);
  private readonly destroyRef = inject(DestroyRef);
  private readonly router = inject(Router);

  companies = signal<Company[]>([]);
  successMessage = signal<string | null>(null);
  errorMessage = signal<string | null>(null);

  constructor() {
    effect(() => {
      const filterState = this.scopeFilterService.filter();
      this.loadCompanies(filterState);
    });
  }

  ngOnInit(): void {
    const navStateMessage = history.state?.message;
    if (navStateMessage) {
      this.showSuccess(navStateMessage);
    }
  }

  loadCompanies(filterState?: ScopeFilterState): void {
    const currentFilter = filterState ?? this.scopeFilterService.filter();
    const params: Record<string, any> = {};

    if (currentFilter.searchQuery?.trim()) params['search'] = currentFilter.searchQuery.trim();

    this.companyService.getAll(params).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: (data) => {
        let list = data;
        if (currentFilter.searchQuery?.trim()) {
          const q = currentFilter.searchQuery.trim().toLowerCase();
          list = list.filter(c => c.name?.toLowerCase().includes(q) || c.legalName?.toLowerCase().includes(q));
        }
        this.companies.set(list);
      },
      error: (err: any) => {
        console.error('Company list load error:', err);
        this.companies.set([]);
      },
    });
  }

  onRowClick(id?: string | number): void {
    if (!id) return;
    this.router.navigate(['/companies', id, 'edit']);
  }

  deleteCompany(id?: string | number): void {
    if (!id) return;
    if (confirm("Rostdan ham ushbu kompaniyani o'chirmoqchimisiz?")) {
      this.companyService.delete(String(id)).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
        next: () => {
          this.showSuccess("Kompaniya muvaffaqiyatli o'chirildi!");
          this.loadCompanies();
        },
        error: (err: any) => {
          const msg = Array.isArray(err?.error?.message) ? err.error.message.join(', ') : (err?.error?.message || "O'chirishda xatolik yuz berdi");
          this.errorMessage.set(msg);
          setTimeout(() => this.errorMessage.set(null), 5000);
        },
      });
    }
  }

  private showSuccess(msg: string): void {
    this.successMessage.set(msg);
    setTimeout(() => this.successMessage.set(null), 5000);
  }
}
