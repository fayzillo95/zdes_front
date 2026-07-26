import { Component, Input, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-skeleton-loader',
  imports: [CommonModule],
  standalone: true,
  templateUrl: './skeleton-loader.html',
  styleUrl: './skeleton-loader.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SkeletonLoaderComponent {
  @Input() rows: number = 5;
  @Input() columns: number = 4;
  
  get rowsArray() {
    return Array(this.rows).fill(0);
  }
  
  get columnsArray() {
    return Array(this.columns).fill(0);
  }
}
