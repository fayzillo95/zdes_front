import { Component, OnInit, inject, ChangeDetectionStrategy, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute } from '@angular/router';
import { EmployeeService } from '../../services/employee';
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
  
  item = signal<Employee | null>(null);
  loading = signal<boolean>(true);
  loadError = signal<boolean>(false);

  ngOnInit() {
    this.loadData();
  }

  loadData() {
    this.loading.set(true);
    this.loadError.set(false);
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.employeeService.getById(id).subscribe({
        next: (res) => {
          this.item.set(res);
          this.loading.set(false);
        },
        error: (err) => {
          console.error(err);
          this.loadError.set(true);
          this.loading.set(false);
        }
      });
    } else {
      this.loading.set(false);
    }
  }
}
