import { TestBed } from '@angular/core/testing';

import { ConexFiltroService } from './conex-filtro.service';

describe('ConexFiltroService', () => {
  let service: ConexFiltroService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ConexFiltroService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
