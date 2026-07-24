import { Component, inject, OnInit, ChangeDetectionStrategy, DestroyRef } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { EmployeeService } from '../../services/employee';

@Component({
  selector: 'app-employee-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './employee-form.html',
  styleUrls: ['./employee-form.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class EmployeeForm implements OnInit {
  private destroyRef = inject(DestroyRef);
  private fb = inject(FormBuilder);
  private employeeService = inject(EmployeeService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  form: FormGroup;
  isEditMode = false;
  employeeId: string | null = null;

  constructor() {
    this.form = this.fb.group({
      fullName: ['', Validators.required],
      phone: [''],
      status: ['active', Validators.required],
      branchId: [''],
      departmentId: [''],
      positionId: ['']
    });
  }

  ngOnInit(): void {
    this.employeeId = this.route.snapshot.paramMap.get('id');
    if (this.employeeId) {
      this.isEditMode = true;
      this.employeeService.getById(this.employeeId).pipe(takeUntilDestroyed(this.destroyRef)).subscribe(emp => {
        this.form.patchValue(emp);
      });
    }
  }

  onSubmit(): void {
    if (this.form.valid) {
      const data = this.form.value;
      if (this.isEditMode && this.employeeId) {
        this.employeeService.update(this.employeeId, data).pipe(takeUntilDestroyed(this.destroyRef)).subscribe(() => {
          this.router.navigate(['/employees']);
        });
      } else {
        this.employeeService.create(data).pipe(takeUntilDestroyed(this.destroyRef)).subscribe(() => {
          this.router.navigate(['/employees']);
        });
      }
    }
  }
}
