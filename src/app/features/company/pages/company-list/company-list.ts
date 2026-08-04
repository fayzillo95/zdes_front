import { Component, inject, signal, computed, OnInit, ChangeDetectionStrategy, DestroyRef, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

import { CompanyService } from '../../services/company';
import { Company } from '../../../../core/models/company';
import { ScopeFilterService, ScopeFilterState } from '../../../../core/services/scope-filter';
import { SkeletonLoaderComponent } from '../../../../shared/components/ui/skeleton-loader/skeleton-loader';

@Component({
  selector: 'app-company-list',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, SkeletonLoaderComponent],
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
  loading = signal<boolean>(true);
  loadError = signal<boolean>(false);
  successMessage = signal<string | null>(null);
  errorMessage = signal<string | null>(null);

  nameFilter = signal<string>('');
  legalNameFilter = signal<string>('');
  phoneFilter = signal<string>('');
  emailFilter = signal<string>('');
  statusFilter = signal<'' | 'active' | 'inactive'>('');

  filteredCompanies = computed(() => {
    const name = this.nameFilter().trim().toLowerCase();
    const legalName = this.legalNameFilter().trim().toLowerCase();
    const phone = this.phoneFilter().trim().toLowerCase();
    const email = this.emailFilter().trim().toLowerCase();
    const status = this.statusFilter();

    return this.companies().filter(c => {
      if (name && !c.name?.toLowerCase().includes(name)) return false;
      if (legalName && !c.legalName?.toLowerCase().includes(legalName)) return false;
      if (phone && !c.phone?.toLowerCase().includes(phone)) return false;
      if (email && !c.email?.toLowerCase().includes(email)) return false;
      if (status === 'active' && c.isActive === false) return false;
      if (status === 'inactive' && c.isActive !== false) return false;
      return true;
    });
  });

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

    this.loading.set(true);
    this.loadError.set(false);
    this.companyService.getAll(params).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: (data) => {
        let list = data;
        if (currentFilter.searchQuery?.trim()) {
          const q = currentFilter.searchQuery.trim().toLowerCase();
          list = list.filter(c => c.name?.toLowerCase().includes(q) || c.legalName?.toLowerCase().includes(q));
        }
        this.companies.set(list);
        this.loading.set(false);
      },
      error: (err: any) => {
        console.error('Company list load error:', err);
        this.companies.set([]);
        this.loading.set(false);
        this.loadError.set(true);
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
