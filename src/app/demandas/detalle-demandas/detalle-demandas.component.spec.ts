import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetalleDemandasComponent } from './detalle-demandas.component';

describe('DetalleDemandasComponent', () => {
  let component: DetalleDemandasComponent;
  let fixture: ComponentFixture<DetalleDemandasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DetalleDemandasComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DetalleDemandasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
