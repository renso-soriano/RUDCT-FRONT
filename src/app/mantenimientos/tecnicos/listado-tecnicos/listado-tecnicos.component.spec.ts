import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListadoTecnicosComponent } from './listado-tecnicos.component';

describe('ListadoTecnicosComponent', () => {
  let component: ListadoTecnicosComponent;
  let fixture: ComponentFixture<ListadoTecnicosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ListadoTecnicosComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ListadoTecnicosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
