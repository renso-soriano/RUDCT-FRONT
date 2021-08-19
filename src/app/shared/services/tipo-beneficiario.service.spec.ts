import { TestBed } from '@angular/core/testing';

import { TipoBeneficiarioService } from './tipo-beneficiario.service';

describe('TipoBeneficiarioService', () => {
  let service: TipoBeneficiarioService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TipoBeneficiarioService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
