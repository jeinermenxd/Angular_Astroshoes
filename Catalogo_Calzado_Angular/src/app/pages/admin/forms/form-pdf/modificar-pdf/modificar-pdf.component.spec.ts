import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModificarPdfComponent } from './modificar-pdf.component';

describe('ModificarPdfComponent', () => {
  let component: ModificarPdfComponent;
  let fixture: ComponentFixture<ModificarPdfComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ModificarPdfComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ModificarPdfComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
