import { Component, inject, OnInit, ChangeDetectionStrategy, DestroyRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { TerminalService } from '../../services/terminal';
import { Terminal } from '../../../../core/models/terminal';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-terminal-list',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './terminal-list.html',
  styleUrl: './terminal-list.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TerminalList implements OnInit {
  terminals: Terminal[] = [];
  private readonly terminalService = inject(TerminalService);
  private readonly destroyRef = inject(DestroyRef);
  private readonly router = inject(Router);

  ngOnInit(): void {
    this.loadTerminals();
  }

  onRowClick(id: string): void {
    this.router.navigate(['/terminals', id]);
  }

  loadTerminals(): void {
    this.terminalService.getAll().pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: (data) => {
        this.terminals = data;
      },
      error: (err) => {
        console.error('Error loading terminals', err);
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
