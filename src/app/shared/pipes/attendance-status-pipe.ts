import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'attendanceStatus',
  standalone: true
})
export class AttendanceStatusPipe implements PipeTransform {
  transform(value: string | null | undefined): string {
    if (!value) {
      return '';
    }
    
    switch (value) {
      case 'present':
        return 'Kelgan';
      case 'absent':
        return 'Kelmagan';
      case 'late':
        return 'Kechikkan';
      case 'on_leave':
        return 'Ta\'tilda';
      default:
        return value;
    }
  }
}
