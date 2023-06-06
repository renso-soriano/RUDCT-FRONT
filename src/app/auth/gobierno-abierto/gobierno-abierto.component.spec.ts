import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GobiernoAbiertoComponent } from './gobierno-abierto.component';

describe('GobiernoAbiertoComponent', () => {
  let component: GobiernoAbiertoComponent;
  let fixture: ComponentFixture<GobiernoAbiertoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GobiernoAbiertoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GobiernoAbiertoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
