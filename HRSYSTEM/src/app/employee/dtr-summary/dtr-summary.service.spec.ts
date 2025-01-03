import { TestBed } from '@angular/core/testing';

import { DtrSummaryService } from './dtr-summary.service';

describe('DtrSummaryService', () => {
  let service: DtrSummaryService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DtrSummaryService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
