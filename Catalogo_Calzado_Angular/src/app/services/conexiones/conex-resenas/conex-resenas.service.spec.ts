import { TestBed } from '@angular/core/testing';

import { ConexResenasService } from './conex-resenas.service';

describe('ConexResenasService', () => {
  let service: ConexResenasService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ConexResenasService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
