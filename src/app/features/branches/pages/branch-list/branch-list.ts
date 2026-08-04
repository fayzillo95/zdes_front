import { Component, inject, signal, computed, OnInit, ChangeDetectionStrategy, DestroyRef, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

import { BranchService } from '../../services/branch';
import { Branch } from '../../../../core/models/branch';
import { ScopeFilterService, ScopeFilterState } from '../../../../core/services/scope-filter';
import { SkeletonLoaderComponent } from '../../../../shared/components/ui/skeleton-loader/skeleton-loader';

@Component({
  selector: 'app-branch-list',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, SkeletonLoaderComponent],
  templateUrl: './branch-list.html',
  styleUrl: './branch-list.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BranchList implements OnInit {
  private readonly branchService = inject(BranchService);
  private readonly scopeFilterService = inject(ScopeFilterService);
  private readonly destroyRef = inject(DestroyRef);
  private readonly router = inject(Router);

  branches = signal<Branch[]>([]);
  loading = signal<boolean>(true);
  loadError = signal<boolean>(false);
  successMessage = signal<string | null>(null);
  errorMessage = signal<string | null>(null);

  // Column-level filters (jadval ustunlari bo'yicha, client-side)
  nameFilter = signal<string>('');
  addressFilter = signal<string>('');
  statusFilter = signal<'' | 'active' | 'inactive'>('');

  filteredBranches = computed(() => {
    const name = this.nameFilter().trim().toLowerCase();
    const address = this.addressFilter().trim().toLowerCase();
    const status = this.statusFilter();

    return this.branches().filter(b => {
      if (name && !b.name?.toLowerCase().includes(name)) return false;
      if (address && !b.address?.toLowerCase().includes(address)) return false;
      if (status === 'active' && b.isActive === false) return false;
      if (status === 'inactive' && b.isActive !== false) return false;
      return true;
    });
  });

  constructor() {
    effect(() => {
      const filterState = this.scopeFilterService.filter();
      this.loadBranches(filterState);
    });
  }

  ngOnInit(): void {
    const navStateMessage = history.state?.message;
    if (navStateMessage) {
      this.showSuccess(navStateMessage);
    }
  }

  loadBranches(filterState?: ScopeFilterState): void {
    const currentFilter = filterState ?? this.scopeFilterService.filter();
    const params: Record<string, any> = {};

    if (currentFilter.companyId) params['companyId'] = currentFilter.companyId;
    if (currentFilter.searchQuery?.trim()) params['search'] = currentFilter.searchQuery.trim();

    this.loading.set(true);
    this.loadError.set(false);
    this.branchService.getAll(params).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: (data) => {
        let list = data;
        if (currentFilter.companyId) {
          list = list.filter(b => b.companyId === currentFilter.companyId);
        }
        if (currentFilter.searchQuery?.trim()) {
          const q = currentFilter.searchQuery.trim().toLowerCase();
          list = list.filter(b => b.name?.toLowerCase().includes(q) || b.address?.toLowerCase().includes(q));
        }
        this.branches.set(list);
        this.loading.set(false);
      },
      error: (err: any) => {
        console.error('Branch list load error:', err);
        this.branches.set([]);
        this.loading.set(false);
        this.loadError.set(true);
      },
    });
  }

  onRowClick(id: string): void {
    this.router.navigate(['/branches', id, 'edit']);
  }

  deleteBranch(id: string): void {
    if (confirm("Rostdan ham ushbu filialni o'chirmoqchimisiz?")) {
      this.branchService.delete(id).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
        next: () => {
          this.showSuccess("Filial muvaffaqiyatli o'chirildi!");
          this.loadBranches();
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
