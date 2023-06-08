import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegionChartComponent } from './region-chart.component';

describe('RegionChartComponent', () => {
  let component: RegionChartComponent;
  let fixture: ComponentFixture<RegionChartComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RegionChartComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RegionChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
