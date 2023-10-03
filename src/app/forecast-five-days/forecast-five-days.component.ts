import { Component, OnInit } from '@angular/core';
import {CurrentWeather, CurrentWeatherService} from "../services/current-weather.service";
import {Subscription} from "rxjs";
import {ForecastFiveDays} from "../services/forecast-five-days.service";

@Component({
  selector: 'app-forecast-five-days',
  templateUrl: './forecast-five-days.component.html',
  styleUrls: ['./forecast-five-days.component.css']
})
export class ForecastFiveDaysComponent implements OnInit {

  constructor(private currentWeatherService: CurrentWeatherService) { }

  forecastFiveDays: ForecastFiveDays | null = null;

  subscription: Subscription = undefined;

  ngOnInit() {
    this.subscription = this.currentWeatherService.weatherForecast$
      .subscribe(res => this.forecastFiveDays = res);

  }

  ngOnDestroy() {
    this.subscription?.unsubscribe();
  }
  getIconSvg(icon: string | undefined) {
    return this.currentWeatherService.getIconSvg(icon);

  }

}
