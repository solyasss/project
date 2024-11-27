import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TradingChartComponent } from './trading-chart.component';

describe('TradingChartComponent', () => {
  let component: TradingChartComponent;
  let fixture: ComponentFixture<TradingChartComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TradingChartComponent]
    })
      .compileComponents();

    fixture = TestBed.createComponent(TradingChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
