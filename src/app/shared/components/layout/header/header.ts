import { Component, inject, signal, computed, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { Auth } from '../../../../core/services/auth';
import { ProfileModal } from '../../profile-modal/profile-modal';
import { SidebarState } from '../../../services/sidebar-state';

@Component({
  selector: 'app-header',
  imports: [ProfileModal],
  templateUrl: './header.html',
  styleUrl: './header.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Header implements OnInit {
  private readonly auth = inject(Auth);
  protected readonly sidebarState = inject(SidebarState);

  readonly currentUser = this.auth.currentUser;
  readonly theme = signal<string>('dark');
  readonly showProfileModal = signal<boolean>(false);
  readonly showMobileMenu = signal<boolean>(false);

  readonly displayName = computed(() => {
    const user = this.currentUser();
    if (!user) return 'User';
    if (user.firstName) {
      return user.lastName ? `${user.firstName} ${user.lastName}` : user.firstName;
    }
    return user.login || 'User';
  });

  ngOnInit() {
    const savedTheme = localStorage.getItem('theme') || 'dark';
    this.theme.set(savedTheme);
    document.documentElement.setAttribute('data-theme', savedTheme);
  }

  toggleTheme() {
    const newTheme = this.theme() === 'light' ? 'dark' : 'light';
    this.theme.set(newTheme);
    localStorage.setItem('theme', newTheme);
    document.documentElement.setAttribute('data-theme', newTheme);
  }

  openProfileModal() {
    this.showProfileModal.set(true);
    this.showMobileMenu.set(false);
  }

  closeProfileModal() {
    this.showProfileModal.set(false);
  }

  toggleMobileMenu() {
    this.showMobileMenu.update((v) => !v);
  }

  closeMobileMenu() {
    this.showMobileMenu.set(false);
  }

  logout() {
    this.auth.logout();
  }
}
