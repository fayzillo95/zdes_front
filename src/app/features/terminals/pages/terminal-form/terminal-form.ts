import { Component, inject, OnInit, ChangeDetectionStrategy, DestroyRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { TerminalService } from '../../services/terminal';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-terminal-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './terminal-form.html',
  styleUrl: './terminal-form.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TerminalForm implements OnInit {
  terminalForm: FormGroup;
  isEditMode = false;
  terminalId: string | null = null;
  
  private readonly fb = inject(FormBuilder);
  private readonly terminalService = inject(TerminalService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly destroyRef = inject(DestroyRef);

  constructor() {
    this.terminalForm = this.fb.group({
      name: ['', Validators.required],
      branchId: [''],
      ipAddress: ['']
    });
  }

  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('id');
    if (idParam && idParam !== 'new') {
      this.isEditMode = true;
      this.terminalId = idParam;
      this.loadTerminal();
    }
  }

  loadTerminal(): void {
    if (this.terminalId) {
      this.terminalService.getById(this.terminalId).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
        next: (terminal) => {
          this.terminalForm.patchValue({
            name: terminal.name,
            branchId: terminal.branchId,
            ipAddress: terminal.ipAddress
          });
        },
        error: (err) => {
          console.error('Error loading terminal', err);
        }
      });
    }
  }

  onSubmit(): void {
    if (this.terminalForm.invalid) {
      return;
    }

    const formValue = this.terminalForm.value;
    
    if (this.isEditMode && this.terminalId) {
      this.terminalService.update(this.terminalId, formValue).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
        next: () => {
          this.router.navigate(['/terminals']);
        },
        error: (err) => {
          console.error('Error updating terminal', err);
        }
      });
    } else {
      this.terminalService.create(formValue).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
        next: () => {
          this.router.navigate(['/terminals']);
        },
        error: (err) => {
          console.error('Error creating terminal', err);
        }
      });
    }
  }
}
