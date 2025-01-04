import { TestBed } from '@angular/core/testing';

import { EmployeeRequestService } from './employee-request.service';

describe('EmployeeRequestService', () => {
  let service: EmployeeRequestService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EmployeeRequestService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
