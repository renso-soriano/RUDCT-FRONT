import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CrearVideosComponent } from './crear-videos.component';

describe('CrearVideosComponent', () => {
  let component: CrearVideosComponent;
  let fixture: ComponentFixture<CrearVideosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CrearVideosComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CrearVideosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
