import { Component, ChangeDetectionStrategy, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Header } from '../header/header';
import { Sidebar } from '../sidebar/sidebar';
import { MainFilterHeader } from '../main-filter-header/main-filter-header';
import { Breadcrumb } from '../breadcrumb/breadcrumb';
import { Auth } from '../../../../core/services/auth';

@Component({
  selector: 'app-main-layout',
  imports: [RouterOutlet, Header, Sidebar, MainFilterHeader, Breadcrumb],
  templateUrl: './main-layout.html',
  styleUrl: './main-layout.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MainLayout {
  readonly auth = inject(Auth);
  readonly currentUser = this.auth.currentUser;
}
