import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListadoCategoriaComponent } from './listado-categoria.component';

describe('ListadoCategoriaComponent', () => {
  let component: ListadoCategoriaComponent;
  let fixture: ComponentFixture<ListadoCategoriaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ListadoCategoriaComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ListadoCategoriaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
