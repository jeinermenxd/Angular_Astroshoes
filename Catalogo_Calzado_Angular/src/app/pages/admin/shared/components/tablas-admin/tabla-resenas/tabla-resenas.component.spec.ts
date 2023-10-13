import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TablaResenasComponent } from './tabla-resenas.component';

describe('TablaResenasComponent', () => {
  let component: TablaResenasComponent;
  let fixture: ComponentFixture<TablaResenasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TablaResenasComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TablaResenasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
