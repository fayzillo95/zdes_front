import { Component, ChangeDetectionStrategy, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, ActivatedRouteSnapshot, NavigationEnd, Router, RouterLink } from '@angular/router';
import { filter, startWith } from 'rxjs';

export interface BreadcrumbItem {
  label: string;
  url: string;
}

@Component({
  selector: 'app-breadcrumb',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './breadcrumb.html',
  styleUrl: './breadcrumb.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Breadcrumb {
  private readonly router = inject(Router);
  private readonly activatedRoute = inject(ActivatedRoute);

  readonly items = signal<BreadcrumbItem[]>([]);

  constructor() {
    this.router.events
      .pipe(
        filter((event) => event instanceof NavigationEnd),
        startWith(null),
      )
      .subscribe(() => {
        this.items.set(this.buildBreadcrumbs(this.activatedRoute.root.snapshot));
      });
  }

  private buildBreadcrumbs(root: ActivatedRouteSnapshot | null): BreadcrumbItem[] {
    const home: BreadcrumbItem = { label: 'Bosh sahifa', url: '/dashboard' };
    const items: BreadcrumbItem[] = [];

    let route = root;
    let url = '';

    while (route) {
      const routeUrl = route.url.map((segment) => segment.path).join('/');
      if (routeUrl) {
        url += `/${routeUrl}`;
      }

      const label = route.data?.['breadcrumb'];
      const previous = items[items.length - 1];
      if (label && previous?.url !== url) {
        items.push({ label, url });
      }

      route = route.firstChild;
    }

    return [home, ...items];
  }
}
