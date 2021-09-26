import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetalleTemaComunComponent } from './detalle-tema-comun.component';

describe('DetalleTemaComunComponent', () => {
  let component: DetalleTemaComunComponent;
  let fixture: ComponentFixture<DetalleTemaComunComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DetalleTemaComunComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DetalleTemaComunComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
