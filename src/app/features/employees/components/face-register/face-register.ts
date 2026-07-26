import { Component, Input, inject, ChangeDetectionStrategy, DestroyRef } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { CommonModule } from '@angular/common';
import { CameraCaptureComponent } from '../../../../shared/components/ui/camera-capture/camera-capture';
import { Http } from '../../../../core/services/http';

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
  private http = inject(Http);

  onPhotoCaptured(dataUrl: string) {
    if (!this.employeeId) return;
    
    // Placeholder method for POST /employees/{id}/face
    this.http.post(`/employees/${this.employeeId}/face`, { photo: dataUrl }).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: () => console.log('Yuz muvaffaqiyatli saqlandi'),
      error: (err) => console.error('Yuzni saqlashda xatolik', err)
    });
  }
}
