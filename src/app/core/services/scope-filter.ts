import { Injectable, signal } from '@angular/core';

export interface ScopeFilterState {
  companyId: string | null;
  branchId: string | null;
  departmentId: string | null;
  searchQuery: string;
}

@Injectable({
  providedIn: 'root'
})
export class ScopeFilterService {
  readonly filter = signal<ScopeFilterState>({
    companyId: null,
    branchId: null,
    departmentId: null,
    searchQuery: '',
  });

  setCompany(companyId: string | null) {
    this.filter.update(state => ({ ...state, companyId }));
  }

  setBranch(branchId: string | null) {
    this.filter.update(state => ({ ...state, branchId }));
  }

  setDepartment(departmentId: string | null) {
    this.filter.update(state => ({ ...state, departmentId }));
  }

  setSearchQuery(searchQuery: string) {
    this.filter.update(state => ({ ...state, searchQuery }));
  }

  resetFilter() {
    this.filter.set({
      companyId: null,
      branchId: null,
      departmentId: null,
      searchQuery: '',
    });
  }
}
