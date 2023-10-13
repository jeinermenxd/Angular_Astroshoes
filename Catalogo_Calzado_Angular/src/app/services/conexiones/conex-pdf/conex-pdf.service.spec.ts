import { TestBed } from '@angular/core/testing';

import { ConexPdfService } from './conex-pdf.service';

describe('ConexPdfService', () => {
  let service: ConexPdfService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ConexPdfService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

