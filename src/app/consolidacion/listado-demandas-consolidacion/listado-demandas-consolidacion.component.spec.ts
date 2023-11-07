import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListadoDemandasConsolidacionComponent } from './listado-demandas-consolidacion.component';

describe('ListadoDemandasConsolidacionComponent', () => {
  let component: ListadoDemandasConsolidacionComponent;
  let fixture: ComponentFixture<ListadoDemandasConsolidacionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ListadoDemandasConsolidacionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ListadoDemandasConsolidacionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
