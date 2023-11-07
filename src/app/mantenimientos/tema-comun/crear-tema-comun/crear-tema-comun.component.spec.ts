import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CrearTemaComunComponent } from './crear-tema-comun.component';

describe('CrearTemaComunComponent', () => {
  let component: CrearTemaComunComponent;
  let fixture: ComponentFixture<CrearTemaComunComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CrearTemaComunComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CrearTemaComunComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
