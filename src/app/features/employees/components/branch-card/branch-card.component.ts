import { Component, Input } from '@angular/core';

export interface Branch {
  id: number;
  name: string;
  address: string;
}

@Component({
  selector: 'app-branch-card',
  templateUrl: './branch-card.component.html',
  styleUrls: ['./branch-card.component.scss']
})
export class BranchCardComponent {
  @Input() branch!: Branch;
}
