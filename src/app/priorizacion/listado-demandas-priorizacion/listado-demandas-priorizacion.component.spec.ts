import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListadoDemandasPriorizacionComponent } from './listado-demandas-priorizacion.component';

describe('ListadoDemandasPriorizacionComponent', () => {
  let component: ListadoDemandasPriorizacionComponent;
  let fixture: ComponentFixture<ListadoDemandasPriorizacionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ListadoDemandasPriorizacionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ListadoDemandasPriorizacionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
