import { TestBed } from '@angular/core/testing';

import { ConexComprobantesService } from './conex-comprobantes.service';

describe('ConexComprobantesService', () => {
  let service: ConexComprobantesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ConexComprobantesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
