import { TestBed } from '@angular/core/testing';

import { EmpRequestService } from './emp-request.service';

describe('EmpRequestService', () => {
  let service: EmpRequestService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EmpRequestService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
