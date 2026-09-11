import { Component, Input, inject, ChangeDetectionStrategy, DestroyRef, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { CommonModule } from '@angular/common';
import { CameraCaptureComponent } from '../../../../shared/components/ui/camera-capture/camera-capture';
import { EmployeeService } from '../../services/employee';

@Component({
  selector: 'app-face-register',
  standalone: true,
  imports: [CommonModule, CameraCaptureComponent],
  templateUrl: './face-register.html',
  styleUrls: ['./face-register.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FaceRegister {
  @Input() employeeId!: string;

  private destroyRef = inject(DestroyRef);
  private employeeService = inject(EmployeeService);

  readonly saving = signal(false);
  readonly message = signal<string | null>(null);
  readonly isError = signal(false);

  onPhotoCaptured(dataUrl: string) {
    if (!this.employeeId) return;

    this.saving.set(true);
    this.message.set(null);

    this.employeeService.uploadFaceImage(this.employeeId, dataUrl).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: () => {
        this.saving.set(false);
        this.isError.set(false);
        this.message.set('Yuz namunasi saqlandi');
      },
      error: (err) => {
        this.saving.set(false);
        this.isError.set(true);
        const detail = err?.response?.data?.message;
        this.message.set(Array.isArray(detail) ? detail.join(', ') : (detail ?? 'Yuzni saqlashda xatolik'));
      }
    });
  }
}
