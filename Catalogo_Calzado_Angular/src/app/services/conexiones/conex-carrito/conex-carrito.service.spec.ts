import { TestBed } from '@angular/core/testing';

import { ConexCarritoService } from './conex-carrito.service';

describe('ConexCarritoService', () => {
  let service: ConexCarritoService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ConexCarritoService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
