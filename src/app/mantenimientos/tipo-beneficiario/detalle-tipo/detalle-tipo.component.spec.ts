import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetalleTipoComponent } from './detalle-tipo.component';

describe('DetalleTipoComponent', () => {
  let component: DetalleTipoComponent;
  let fixture: ComponentFixture<DetalleTipoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DetalleTipoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DetalleTipoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
