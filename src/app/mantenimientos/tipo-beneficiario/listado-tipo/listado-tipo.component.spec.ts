import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListadoTipoComponent } from './listado-tipo.component';

describe('ListadoTipoComponent', () => {
  let component: ListadoTipoComponent;
  let fixture: ComponentFixture<ListadoTipoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ListadoTipoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ListadoTipoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
