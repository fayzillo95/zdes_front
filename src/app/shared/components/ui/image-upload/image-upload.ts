import { Component, EventEmitter, Output, signal, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'app-image-upload',
  standalone: true,
  imports: [],
  templateUrl: './image-upload.html',
  styleUrl: './image-upload.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ImageUpload {
  @Output() fileSelected = new EventEmitter<File>();

  previewUrl = signal<string | null>(null);
  errorMessage = signal<string | null>(null);

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (!input.files || input.files.length === 0) {
      return;
    }

    const file = input.files[0];
    
    // Validatsiya: Faqat rasm (image/*)
    if (!file.type.startsWith('image/')) {
      this.errorMessage.set('Faqat rasm yuklash mumkin (image/*).');
      this.previewUrl.set(null);
      return;
    }

    // Validatsiya: Hajm < 5MB
    const maxSizeInBytes = 5 * 1024 * 1024;
    if (file.size > maxSizeInBytes) {
      this.errorMessage.set('Rasm hajmi 5MB dan oshmasligi kerak.');
      this.previewUrl.set(null);
      return;
    }

    this.errorMessage.set(null);

    // FileReader orqali data URL (preview) hosil qilish
    const reader = new FileReader();
    reader.onload = () => {
      this.previewUrl.set(reader.result as string);
      // Validatsiyadan o'tgandagina emit qilish
      this.fileSelected.emit(file);
    };
    reader.readAsDataURL(file);
  }
}
