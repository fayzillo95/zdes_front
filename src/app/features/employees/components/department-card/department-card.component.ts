import { Component, Input } from '@angular/core';

export interface Department {
  id: number;
  name: string;
  manager: string;
}

@Component({
  selector: 'app-department-card',
  templateUrl: './department-card.component.html',
  styleUrls: ['./department-card.component.scss']
})
export class DepartmentCardComponent {
  @Input() department!: Department;
}
