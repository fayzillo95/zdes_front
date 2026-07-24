import { Component, ChangeDetectionStrategy } from '@angular/core';

interface DashboardStat {
  label: string;
  value: string;
}

@Component({
  selector: 'app-dashboard',
  imports: [],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Dashboard {
  protected readonly stats: DashboardStat[] = [
    { label: 'Jami xodimlar', value: '0' },
    { label: 'Bugungi davomat', value: '0%' },
    { label: "Ochiq ta'til so'rovlari", value: '0' },
    { label: "O'qilmagan bildirishnomalar", value: '0' },
  ];
}
