import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminSalaryComponent } from './admin-salary.component';

describe('AdminSalaryComponent', () => {
  let component: AdminSalaryComponent;
  let fixture: ComponentFixture<AdminSalaryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AdminSalaryComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminSalaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
