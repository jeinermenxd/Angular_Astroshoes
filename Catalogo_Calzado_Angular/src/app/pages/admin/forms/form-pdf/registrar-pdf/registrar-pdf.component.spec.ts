import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegistrarPdfComponent } from './registrar-pdf.component';

describe('RegistrarPdfComponent', () => {
  let component: RegistrarPdfComponent;
  let fixture: ComponentFixture<RegistrarPdfComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RegistrarPdfComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RegistrarPdfComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
