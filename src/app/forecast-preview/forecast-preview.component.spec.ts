import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ForecastPreviewComponent } from './forecast-preview.component';

describe('ForecastPreviewComponent', () => {
  let component: ForecastPreviewComponent;
  let fixture: ComponentFixture<ForecastPreviewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ForecastPreviewComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ForecastPreviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
