import { TestBed } from '@angular/core/testing';

import { DemandasService } from './demandas.service';

describe('DemandasService', () => {
  let service: DemandasService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DemandasService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
