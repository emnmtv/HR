import { TestBed } from '@angular/core/testing';

import { EmployeeRecordServiceService } from './employee-record.service.service';

describe('EmployeeRecordServiceService', () => {
  let service: EmployeeRecordServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EmployeeRecordServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
