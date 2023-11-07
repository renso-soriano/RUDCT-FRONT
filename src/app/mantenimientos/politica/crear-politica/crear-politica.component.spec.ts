import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CrearPoliticaComponent } from './crear-politica.component';

describe('CrearPoliticaComponent', () => {
  let component: CrearPoliticaComponent;
  let fixture: ComponentFixture<CrearPoliticaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CrearPoliticaComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CrearPoliticaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
