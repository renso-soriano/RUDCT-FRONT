import { TestBed } from '@angular/core/testing';

import { DropDownServiceService } from './drop-down-service.service';

describe('DropDownServiceService', () => {
  let service: DropDownServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DropDownServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
