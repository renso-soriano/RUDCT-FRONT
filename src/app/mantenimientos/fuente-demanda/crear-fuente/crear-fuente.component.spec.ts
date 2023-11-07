import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CrearFuenteComponent } from './crear-fuente.component';

describe('CrearFuenteComponent', () => {
  let component: CrearFuenteComponent;
  let fixture: ComponentFixture<CrearFuenteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CrearFuenteComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CrearFuenteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
