import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'attendanceStatus',
})
export class AttendanceStatusPipe implements PipeTransform {
  transform(value: unknown, ...args: unknown[]): unknown {
    return null;
  }
}
