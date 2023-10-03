import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ForecastFiveDaysComponent } from './forecast-five-days.component';

describe('ForecastFiveDaysComponent', () => {
  let component: ForecastFiveDaysComponent;
  let fixture: ComponentFixture<ForecastFiveDaysComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ForecastFiveDaysComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ForecastFiveDaysComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
