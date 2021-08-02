import { TestBed } from '@angular/core/testing';

import { NGXToastrService } from './ngxtoastr.service';

describe('NGXToastrService', () => {
  let service: NGXToastrService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(NGXToastrService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
