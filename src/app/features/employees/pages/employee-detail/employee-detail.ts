import { Component, OnInit, inject, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute } from '@angular/router';
import { EmployeeService } from '../../services/employee';
import { Observable } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { Employee } from '../../../../core/models/employee';

@Component({
  selector: 'app-employee-detail',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './employee-detail.html',
  styleUrls: ['./employee-detail.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class EmployeeDetail implements OnInit {
  private route = inject(ActivatedRoute);
  private employeeService = inject(EmployeeService);
  
  employee$: Observable<Employee> | null = null;

  ngOnInit() {
    this.employee$ = this.route.paramMap.pipe(
      switchMap(params => this.employeeService.getById(params.get('id')!))
    );
  }
}
