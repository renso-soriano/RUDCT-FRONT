import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetalleContactoComponent } from './detalle-contacto.component';

describe('DetalleContactoComponent', () => {
  let component: DetalleContactoComponent;
  let fixture: ComponentFixture<DetalleContactoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DetalleContactoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DetalleContactoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
