import { Component, inject, signal, OnInit, AfterViewInit, ChangeDetectionStrategy, DestroyRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

import { BranchService } from '../../services/branch';
import { CompanyService } from '../../../company/services/company';
import { Company } from '../../../../core/models/company';
import { Auth } from '../../../../core/services/auth';

declare const L: any;

@Component({
  selector: 'app-branch-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './branch-form.html',
  styleUrl: './branch-form.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BranchForm implements OnInit, AfterViewInit {
  private readonly fb = inject(FormBuilder);
  private readonly branchService = inject(BranchService);
  private readonly companyService = inject(CompanyService);
  private readonly auth = inject(Auth);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly destroyRef = inject(DestroyRef);

  readonly currentUser = this.auth.currentUser;
  companies = signal<Company[]>([]);
  errorMessage = signal<string | null>(null);

  private map: any = null;
  private marker: any = null;

  readonly form = this.fb.group({
    companyId: [''],
    name: ['', [Validators.required, Validators.minLength(1), Validators.maxLength(255)]],
    address: [''],
    latitude: [41.2995],
    longitude: [69.2401],
    radius: [100],
  });

  isEditMode = false;
  branchId: string | null = null;

  ngOnInit(): void {
    this.companyService.getAll().pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: (c) => this.companies.set(c),
      error: (err) => console.error('Company load error in branch form:', err),
    });

    this.branchId = this.route.snapshot.paramMap.get('id');
    if (this.branchId) {
      this.isEditMode = true;
      this.branchService.getById(this.branchId).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
        next: (branch) => {
          if (branch) {
            this.form.patchValue({
              companyId: branch.companyId ?? '',
              name: branch.name ?? '',
              address: branch.address ?? '',
              latitude: branch.latitude ?? 41.2995,
              longitude: branch.longitude ?? 69.2401,
              radius: branch.radius ?? 100,
            });
            if (branch.latitude && branch.longitude && this.map) {
              this.updateMapMarker(branch.latitude, branch.longitude);
            }
          }
        },
        error: (err: any) => console.error(err),
      });
    }
  }

  ngAfterViewInit(): void {
    this.initMap();
  }

  private initMap(): void {
    if (typeof L === 'undefined') return;

    const lat = this.form.get('latitude')?.value || 41.2995;
    const lng = this.form.get('longitude')?.value || 69.2401;

    this.map = L.map('branch-map').setView([lat, lng], 13);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '© OpenStreetMap',
    }).addTo(this.map);

    this.marker = L.marker([lat, lng], { draggable: true }).addTo(this.map);

    this.marker.on('dragend', (event: any) => {
      const position = event.target.getLatLng();
      this.form.patchValue({ latitude: position.lat, longitude: position.lng });
      this.reverseGeocode(position.lat, position.lng);
    });

    this.map.on('click', (e: any) => {
      const { lat, lng } = e.latlng;
      this.updateMapMarker(lat, lng);
      this.form.patchValue({ latitude: lat, longitude: lng });
      this.reverseGeocode(lat, lng);
    });
  }

  private updateMapMarker(lat: number, lng: number): void {
    if (this.map && this.marker) {
      this.marker.setLatLng([lat, lng]);
      this.map.setView([lat, lng], 15);
    }
  }

  searchLocationOnMap(): void {
    const address = this.form.get('address')?.value;
    if (!address) return;

    fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address)}`)
      .then(res => res.json())
      .then(data => {
        if (data && data.length > 0) {
          const lat = parseFloat(data[0].lat);
          const lng = parseFloat(data[0].lon);
          this.form.patchValue({ latitude: lat, longitude: lng });
          this.updateMapMarker(lat, lng);
        }
      })
      .catch(() => {});
  }

  private reverseGeocode(lat: number, lng: number): void {
    fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`)
      .then(res => res.json())
      .then(data => {
        if (data && data.display_name) {
          this.form.patchValue({ address: data.display_name });
        }
      })
      .catch(() => {});
  }

  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.errorMessage.set(null);
    const raw = this.form.getRawValue();

    const nameValue = (raw.name ?? '').trim();
    if (!nameValue) {
      this.errorMessage.set('Filial nomi kiritilishi shart!');
      return;
    }

    if (this.currentUser()?.role === 'superadmin' && !raw.companyId?.trim()) {
      this.errorMessage.set('SuperAdmin roli uchun kompaniyani tanlash majburiy!');
      return;
    }

    // Build NestJS CreateBranchDto / UpdateBranchDto payload
    const payload: Record<string, any> = {
      name: nameValue,
    };

    if (raw.companyId?.trim()) payload['companyId'] = raw.companyId.trim();
    if (raw.address?.trim()) payload['address'] = raw.address.trim();
    if (raw.latitude != null && !isNaN(Number(raw.latitude))) payload['latitude'] = Number(raw.latitude);
    if (raw.longitude != null && !isNaN(Number(raw.longitude))) payload['longitude'] = Number(raw.longitude);
    if (raw.radius != null && !isNaN(Number(raw.radius))) payload['radius'] = Math.max(1, Math.round(Number(raw.radius)));

    if (this.isEditMode && this.branchId) {
      this.branchService.update(this.branchId, payload).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
        next: () => this.router.navigate(['/branches'], { state: { message: "Filial ma'lumotlari muvaffaqiyatli yangilandi!" } }),
        error: (err: any) => {
          const msg = Array.isArray(err?.error?.message) ? err.error.message.join(', ') : (err?.error?.message || 'Tahrirlashda xatolik yuz berdi');
          this.errorMessage.set(msg);
        },
      });
    } else {
      this.branchService.create(payload).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
        next: () => this.router.navigate(['/branches'], { state: { message: 'Yangi filial muvaffaqiyatli yaratildi!' } }),
        error: (err: any) => {
          const msg = Array.isArray(err?.error?.message) ? err.error.message.join(', ') : (err?.error?.message || 'Yaratishda xatolik yuz berdi');
          this.errorMessage.set(msg);
        },
      });
    }
  }
}
