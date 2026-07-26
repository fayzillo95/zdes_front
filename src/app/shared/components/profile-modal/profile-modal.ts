import { Component, EventEmitter, Input, Output, ChangeDetectionStrategy, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { User } from '../../../core/models/user';
import { Auth } from '../../../core/services/auth';
import { Http } from '../../../core/services/http';

@Component({
  selector: 'app-profile-modal',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './profile-modal.html',
  styleUrl: './profile-modal.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProfileModal {
  @Input() user: User | null = null;
  @Output() close = new EventEmitter<void>();

  private readonly fb = inject(FormBuilder);
  private readonly auth = inject(Auth);
  private readonly http = inject(Http);

  isEditing = signal(false);
  isSaving = signal(false);
  successMessage = signal<string | null>(null);
  errorMessage = signal<string | null>(null);

  editForm: FormGroup = this.fb.group({
    firstName: [''],
    lastName: [''],
    email: ['', [Validators.email]],
    phone: [''],
  });

  openEditMode() {
    if (this.user) {
      this.editForm.patchValue({
        firstName: this.user.firstName || '',
        lastName: this.user.lastName || '',
        email: this.user.email || '',
        phone: (this.user as { phone?: string }).phone || '',
      });
    }
    this.isEditing.set(true);
  }

  cancelEdit() {
    this.isEditing.set(false);
    this.errorMessage.set(null);
  }

  saveProfile() {
    if (this.editForm.invalid) return;

    this.isSaving.set(true);
    this.errorMessage.set(null);
    const dto = this.editForm.value;

    this.http.patch<User>('/users/me', dto).subscribe({
      next: (updatedUser) => {
        this.isSaving.set(false);
        this.isEditing.set(false);
        this.successMessage.set('Profil ma\'lumotlari muvaffaqiyatli saqlandi!');
        // Update local state
        const current = this.auth.currentUser();
        if (current) {
          this.auth.currentUser.set({ ...current, ...updatedUser });
        }
        setTimeout(() => this.successMessage.set(null), 3000);
      },
      error: (err: any) => {
        this.isSaving.set(false);
        this.errorMessage.set(err?.error?.message || 'Profilni yangilashda xatolik yuz berdi');
      },
    });
  }

  onClose() {
    this.close.emit();
  }
}
