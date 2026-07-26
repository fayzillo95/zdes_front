import { Component, OnInit, ChangeDetectionStrategy, DestroyRef, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { SalaryAdjustmentService } from '../../services/salary-adjustment';

@Component({
  selector: 'app-adjustment-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './adjustment-form.html',
  styleUrls: ['./adjustment-form.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AdjustmentForm implements OnInit {
  private destroyRef = inject(DestroyRef);
  form: FormGroup;
  id: string | null = null;
  isEdit = false;

  constructor(
    private fb: FormBuilder,
    private service: SalaryAdjustmentService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.form = this.fb.group({
      employeeId: [null, Validators.required],
      amount: [null, [Validators.required, Validators.min(0)]],
      type: ['bonus', Validators.required],
      reason: [''],
      date: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('id');
    if (idParam) {
      this.id = idParam;
      this.isEdit = true;
      this.service.getById(this.id).pipe(takeUntilDestroyed(this.destroyRef)).subscribe(data => {
        this.form.patchValue(data);
      });
    }
  }

  onSubmit(): void {
    if (this.form.valid) {
      if (this.isEdit && this.id) {
        this.service.update(this.id, this.form.value).pipe(takeUntilDestroyed(this.destroyRef)).subscribe(() => {
          this.router.navigate(['/salary-adjustments']);
        });
      } else {
        this.service.create(this.form.value).pipe(takeUntilDestroyed(this.destroyRef)).subscribe(() => {
          this.router.navigate(['/salary-adjustments']);
        });
      }
    }
  }
}
