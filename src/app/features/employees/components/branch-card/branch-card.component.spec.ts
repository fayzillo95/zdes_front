import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BranchCardComponent } from './branch-card.component';

describe('BranchCardComponent', () => {
  let component: BranchCardComponent;
  let fixture: ComponentFixture<BranchCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [BranchCardComponent]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BranchCardComponent);
    component = fixture.componentInstance;
    component.branch = { id: 1, name: 'Test Branch', address: '123 Main St' };
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
