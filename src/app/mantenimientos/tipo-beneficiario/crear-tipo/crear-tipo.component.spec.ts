import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CrearTipoComponent } from './crear-tipo.component';

describe('CrearTipoComponent', () => {
  let component: CrearTipoComponent;
  let fixture: ComponentFixture<CrearTipoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CrearTipoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CrearTipoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
