import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListadoTemaComunComponent } from './listado-tema-comun.component';

describe('ListadoTemaComunComponent', () => {
  let component: ListadoTemaComunComponent;
  let fixture: ComponentFixture<ListadoTemaComunComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ListadoTemaComunComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ListadoTemaComunComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
