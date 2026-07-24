import { Component, Input, Output, EventEmitter, OnChanges, SimpleChanges, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';

export interface Column {
  key: string;
  label: string;
  sortable?: boolean;
}

@Component({
  selector: 'app-data-table',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './data-table.html',
  styleUrls: ['./data-table.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DataTableComponent<T> implements OnChanges {
  @Input() columns: Column[] = [];
  @Input() data: T[] = [];
  @Input() loading: boolean = false;
  @Input() pageSize: number = 10;
  @Input() emptyMessage: string = 'Ma\'lumot topilmadi';

  @Output() rowClick = new EventEmitter<T>();
  @Output() sortChange = new EventEmitter<{ key: string, direction: 'asc' | 'desc' }>();

  currentPage: number = 1;
  sortKey: string | null = null;
  sortDirection: 'asc' | 'desc' = 'asc';
  
  processedData: T[] = [];
  paginatedData: T[] = [];
  totalPages: number = 1;

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['data'] || changes['pageSize']) {
      this.currentPage = 1;
      this.processData();
    }
  }

  handleSort(column: Column): void {
    if (!column.sortable) return;

    if (this.sortKey === column.key) {
      this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortKey = column.key;
      this.sortDirection = 'asc';
    }

    this.sortChange.emit({ key: this.sortKey, direction: this.sortDirection });
    this.processData();
  }

  processData(): void {
    if (!this.data) return;

    let result = [...this.data];

    // Sorting
    if (this.sortKey) {
      result.sort((a: any, b: any) => {
        const valA = a[this.sortKey!];
        const valB = b[this.sortKey!];
        
        if (valA < valB) return this.sortDirection === 'asc' ? -1 : 1;
        if (valA > valB) return this.sortDirection === 'asc' ? 1 : -1;
        return 0;
      });
    }

    this.processedData = result;
    this.totalPages = Math.ceil(this.processedData.length / this.pageSize) || 1;
    this.updatePagination();
  }

  updatePagination(): void {
    const startIndex = (this.currentPage - 1) * this.pageSize;
    const endIndex = startIndex + this.pageSize;
    this.paginatedData = this.processedData.slice(startIndex, endIndex);
  }

  goToPage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      this.updatePagination();
    }
  }

  onRowClick(row: T): void {
    this.rowClick.emit(row);
  }

  getCellValue(row: T, key: string): unknown {
    return (row as Record<string, unknown>)[key];
  }
}
