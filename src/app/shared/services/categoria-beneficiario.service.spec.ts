import { TestBed } from '@angular/core/testing';

import { CategoriaBeneficiarioService } from './categoria-beneficiario.service';

describe('CategoriaBeneficiarioService', () => {
  let service: CategoriaBeneficiarioService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CategoriaBeneficiarioService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
