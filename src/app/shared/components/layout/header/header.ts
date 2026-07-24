import { Component, inject, signal, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { Auth } from '../../../../core/services/auth';

@Component({
  selector: 'app-header',
  imports: [],
  templateUrl: './header.html',
  styleUrl: './header.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Header implements OnInit {
  private readonly auth = inject(Auth);

  readonly currentUser = this.auth.currentUser;
  readonly theme = signal<string>('light');

  ngOnInit() {
    const savedTheme = localStorage.getItem('theme') || 'light';
    this.theme.set(savedTheme);
    document.documentElement.setAttribute('data-theme', savedTheme);
  }

  toggleTheme() {
    const newTheme = this.theme() === 'light' ? 'dark' : 'light';
    this.theme.set(newTheme);
    localStorage.setItem('theme', newTheme);
    document.documentElement.setAttribute('data-theme', newTheme);
  }

  logout() {
    this.auth.logout();
  }
}
