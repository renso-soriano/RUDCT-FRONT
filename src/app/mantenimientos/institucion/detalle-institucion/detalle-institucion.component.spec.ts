import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetalleInstitucionComponent } from './detalle-institucion.component';

describe('DetalleInstitucionComponent', () => {
  let component: DetalleInstitucionComponent;
  let fixture: ComponentFixture<DetalleInstitucionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DetalleInstitucionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DetalleInstitucionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
