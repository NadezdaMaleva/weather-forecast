import { TestBed } from '@angular/core/testing';

import { ForecastFiveDaysService } from './forecast-five-days.service';

describe('ForecastFiveDaysService', () => {
  let service: ForecastFiveDaysService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ForecastFiveDaysService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
