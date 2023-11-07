import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListadoDemandasComponent } from './listado-demandas.component';

describe('ListadoDemandasComponent', () => {
  let component: ListadoDemandasComponent;
  let fixture: ComponentFixture<ListadoDemandasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ListadoDemandasComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ListadoDemandasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
