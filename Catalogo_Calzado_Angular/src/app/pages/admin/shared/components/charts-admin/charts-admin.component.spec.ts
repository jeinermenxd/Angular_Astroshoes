import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChartsAdminComponent } from './charts-admin.component';

describe('ChartsAdminComponent', () => {
  let component: ChartsAdminComponent;
  let fixture: ComponentFixture<ChartsAdminComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ChartsAdminComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ChartsAdminComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
