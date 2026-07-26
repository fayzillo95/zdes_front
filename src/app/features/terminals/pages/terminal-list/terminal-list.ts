import { Component, inject, OnInit, ChangeDetectionStrategy, DestroyRef, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { TerminalService } from '../../services/terminal';
import { Terminal } from '../../../../core/models/terminal';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { SkeletonLoaderComponent } from '../../../../shared/components/ui/skeleton-loader/skeleton-loader';

@Component({
  selector: 'app-terminal-list',
  standalone: true,
  imports: [CommonModule, RouterModule, SkeletonLoaderComponent, FormsModule],
  templateUrl: './terminal-list.html',
  styleUrl: './terminal-list.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TerminalList implements OnInit {
  terminals: Terminal[] = [];
  loading = true;
  private readonly terminalService = inject(TerminalService);
  private readonly destroyRef = inject(DestroyRef);
  private readonly router = inject(Router);

  nameFilter = signal<string>('');
  branchIdFilter = signal<string>('');
  ipFilter = signal<string>('');

  filteredTerminals(): Terminal[] {
     const name = this.nameFilter().trim().toLowerCase();
     const branchId = this.branchIdFilter().trim().toLowerCase();
     const ip = this.ipFilter().trim().toLowerCase();

     return this.terminals.filter(t => {
       if (name && !t.name?.toLowerCase().includes(name)) return false;
       if (branchId && !t.branchId?.toLowerCase().includes(branchId)) return false;
       if (ip && !t.ipAddress?.toLowerCase().includes(ip)) return false;
       return true;
     });
  }

  ngOnInit(): void {
    this.loadTerminals();
  }

  onRowClick(id: string): void {
    this.router.navigate(['/terminals', id]);
  }

  loadTerminals(): void {
    this.loading = true;
    this.terminalService.getAll().pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: (data) => {
        this.terminals = data;
        this.loading = false;
      },
      error: (err) => {
        console.error('Error loading terminals', err);
        this.loading = false;
      }
    });
  }

  deleteTerminal(id: string): void {
    if (confirm('Are you sure you want to delete this terminal?')) {
      this.terminalService.delete(id).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
        next: () => {
          this.loadTerminals();
        },
        error: (err) => {
          console.error('Error deleting terminal', err);
        }
      });
    }
  }
}
