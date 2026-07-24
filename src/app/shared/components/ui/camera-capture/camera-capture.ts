import { Component, ElementRef, EventEmitter, OnDestroy, OnInit, Output, ViewChild, signal, AfterViewInit, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-camera-capture',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './camera-capture.html',
  styleUrls: ['./camera-capture.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CameraCaptureComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('videoElement') videoElement!: ElementRef<HTMLVideoElement>;
  @ViewChild('canvasElement') canvasElement!: ElementRef<HTMLCanvasElement>;
  
  @Output() photoCaptured = new EventEmitter<string>();

  errorMessage = signal<string | null>(null);
  private mediaStream: MediaStream | null = null;

  async ngOnInit(): Promise<void> {
    try {
      this.mediaStream = await navigator.mediaDevices.getUserMedia({ video: true });
      this.attachStreamToVideo();
    } catch (err) {
      console.error('Error accessing camera:', err);
      this.errorMessage.set('Kameraga ulanib bo\'lmadi yoki ruxsat rad etildi.');
    }
  }

  ngAfterViewInit(): void {
    this.attachStreamToVideo();
  }

  private attachStreamToVideo(): void {
    if (this.mediaStream && this.videoElement && this.videoElement.nativeElement) {
       this.videoElement.nativeElement.srcObject = this.mediaStream;
    }
  }

  capturePhoto(): void {
    if (this.videoElement && this.canvasElement) {
      const video = this.videoElement.nativeElement;
      const canvas = this.canvasElement.nativeElement;
      const context = canvas.getContext('2d');
      
      if (context && video.videoWidth && video.videoHeight) {
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        context.drawImage(video, 0, 0, canvas.width, canvas.height);
        
        const dataUrl = canvas.toDataURL('image/png');
        this.photoCaptured.emit(dataUrl);
      }
    }
  }

  ngOnDestroy(): void {
    if (this.mediaStream) {
      this.mediaStream.getTracks().forEach(track => track.stop());
      this.mediaStream = null;
    }
  }
}
