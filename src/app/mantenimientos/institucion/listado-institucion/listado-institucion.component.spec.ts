import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListadoInstitucionComponent } from './listado-institucion.component';

describe('ListadoInstitucionComponent', () => {
  let component: ListadoInstitucionComponent;
  let fixture: ComponentFixture<ListadoInstitucionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ListadoInstitucionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ListadoInstitucionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
