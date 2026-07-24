import { Component, OnInit, ChangeDetectionStrategy, DestroyRef } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CompanyService } from '../../services/company';
import { Company } from '../../../../core/models/company';

@Component({
  selector: 'app-company-detail',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './company-detail.html',
  styleUrls: ['./company-detail.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CompanyDetail implements OnInit {
  companyForm: FormGroup;
  message: string = '';

  constructor(private fb: FormBuilder, private companyService: CompanyService, private destroyRef: DestroyRef) {
    this.companyForm = this.fb.group({
      name: ['', Validators.required],
      address: [''],
      phone: [''],
      currency: ['', Validators.required],
      workDayStart: ['', Validators.required],
      workDayEnd: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.companyService.get().pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: (company: Company) => {
        if (company) {
          this.companyForm.patchValue(company);
        }
      },
      error: (err) => console.error(err)
    });
  }

  onSubmit(): void {
    if (this.companyForm.valid) {
      this.companyService.update(this.companyForm.value).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
        next: (updatedCompany) => {
          this.message = 'Kompaniya ma\'lumotlari muvaffaqiyatli saqlandi!';
          if (updatedCompany) {
            this.companyForm.patchValue(updatedCompany);
          }
          setTimeout(() => this.message = '', 3000);
        },
        error: () => {
          this.message = 'Xatolik yuz berdi.';
          setTimeout(() => this.message = '', 3000);
        }
      });
    }
  }
}
