import {Component, Input, OnInit} from '@angular/core';
import {DailyForecast, ForecastFiveDays} from "../services/forecast-five-days.service";
import {CurrentWeather, CurrentWeatherService} from "../services/current-weather.service";
import {ForecastPreviewComponent} from "../forecast-preview/forecast-preview.component";
import {Subscription} from "rxjs";

@Component({
  selector: 'app-daily-forecast',
  templateUrl: './daily-forecast.component.html',
  styleUrls: ['./daily-forecast.component.css']
})
export class DailyForecastComponent implements OnInit {

  @Input() dailyForecast: DailyForecast | null = null;
  @Input() bgColorClass: string | null = null;

  constructor( public currentWeather: CurrentWeatherService) {}
  forecastPreview : ForecastFiveDays | null = null;
  weather: CurrentWeather| null = null;

  subscription: Subscription = undefined;
  subscriptionForecast: Subscription = undefined;



  ngOnInit(): void {
    this.subscriptionForecast = this.currentWeather.weatherForecast$
      .subscribe(res => this.forecastPreview = res);
    this.subscription = this.currentWeather.currentWeather$
      .subscribe(res => this.weather = res);
  }

}
