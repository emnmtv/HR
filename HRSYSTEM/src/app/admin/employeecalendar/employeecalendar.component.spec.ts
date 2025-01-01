import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SidenavComponent } from '../../sidenav/sidenav.component';
import { EmployeecalendarComponent } from './employeecalendar.component';

describe('EmployeecalendarComponent', () => {
  let component: EmployeecalendarComponent;
  let fixture: ComponentFixture<EmployeecalendarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [EmployeecalendarComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EmployeecalendarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
