import { Component, OnInit, ChangeDetectionStrategy, DestroyRef, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { LeaveService } from '../../services/leave';

@Component({
  selector: 'app-leave-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './leave-form.html',
  styleUrls: ['./leave-form.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LeaveForm implements OnInit {
  private destroyRef = inject(DestroyRef);
  leaveForm: FormGroup;
  isEditMode = false;
  leaveId: number | null = null;

  constructor(
    private fb: FormBuilder,
    private leaveService: LeaveService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.leaveForm = this.fb.group({
      employeeId: ['', Validators.required],
      startDate: ['', Validators.required],
      endDate: ['', Validators.required],
      type: ['vacation', Validators.required],
      status: ['pending', Validators.required]
    });
  }

  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('id');
    if (idParam && idParam !== 'new') {
      this.isEditMode = true;
      this.leaveId = +idParam;
      this.loadLeave(this.leaveId);
    }
  }

  loadLeave(id: number): void {
    this.leaveService.getById(id).pipe(takeUntilDestroyed(this.destroyRef)).subscribe(data => {
      this.leaveForm.patchValue(data);
    });
  }

  onSubmit(): void {
    if (this.leaveForm.invalid) return;

    const leaveData = this.leaveForm.value;
    if (this.isEditMode && this.leaveId) {
      this.leaveService.update(this.leaveId, leaveData).pipe(takeUntilDestroyed(this.destroyRef)).subscribe(() => {
        this.router.navigate(['/leaves']);
      });
    } else {
      this.leaveService.create(leaveData).pipe(takeUntilDestroyed(this.destroyRef)).subscribe(() => {
        this.router.navigate(['/leaves']);
      });
    }
  }
}
