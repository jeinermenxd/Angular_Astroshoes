import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormResenasComponent } from './form-resenas.component';

describe('FormResenasComponent', () => {
  let component: FormResenasComponent;
  let fixture: ComponentFixture<FormResenasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FormResenasComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FormResenasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
