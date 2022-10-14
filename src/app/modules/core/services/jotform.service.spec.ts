import { TestBed } from '@angular/core/testing';

import { JotformService } from './jotform.service';

describe('JotformService', () => {
  let service: JotformService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(JotformService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
