import { TestBed } from '@angular/core/testing';

import { B24Service } from './b24.service';

describe('B24Service', () => {
  let service: B24Service;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(B24Service);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
