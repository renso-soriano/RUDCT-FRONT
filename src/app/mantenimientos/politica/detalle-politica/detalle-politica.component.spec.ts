import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetallePoliticaComponent } from './detalle-politica.component';

describe('DetallePoliticaComponent', () => {
  let component: DetallePoliticaComponent;
  let fixture: ComponentFixture<DetallePoliticaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DetallePoliticaComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DetallePoliticaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
