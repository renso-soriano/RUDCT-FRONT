import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListadoFuenteComponent } from './listado-fuente.component';

describe('ListadoFuenteComponent', () => {
  let component: ListadoFuenteComponent;
  let fixture: ComponentFixture<ListadoFuenteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ListadoFuenteComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ListadoFuenteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
