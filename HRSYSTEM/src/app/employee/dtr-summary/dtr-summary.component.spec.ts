import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DtrSummaryComponent } from './dtr-summary.component';

describe('DtrSummaryComponent', () => {
  let component: DtrSummaryComponent;
  let fixture: ComponentFixture<DtrSummaryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DtrSummaryComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DtrSummaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
