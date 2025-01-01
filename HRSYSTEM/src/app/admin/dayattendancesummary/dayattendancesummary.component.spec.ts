import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DayattendancesummaryComponent } from './dayattendancesummary.component';

describe('DayattendancesummaryComponent', () => {
  let component: DayattendancesummaryComponent;
  let fixture: ComponentFixture<DayattendancesummaryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DayattendancesummaryComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DayattendancesummaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
