import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegistroDemandasFormComponent } from './registro-demandas-form.component';

describe('RegistroDemandasFormComponent', () => {
  let component: RegistroDemandasFormComponent;
  let fixture: ComponentFixture<RegistroDemandasFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RegistroDemandasFormComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RegistroDemandasFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
