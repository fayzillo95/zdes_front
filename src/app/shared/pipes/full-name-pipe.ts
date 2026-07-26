import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'fullName',
  standalone: true
})
export class FullNamePipe implements PipeTransform {
  transform(firstName: string | null | undefined, lastName: string | null | undefined): string {
    if (!firstName && !lastName) {
      return '';
    }
    
    const parts = [];
    if (firstName) {
      parts.push(firstName);
    }
    if (lastName) {
      parts.push(lastName);
    }
    
    return parts.join(' ');
  }
}
