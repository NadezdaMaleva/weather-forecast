import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {CurrentWeather, CurrentWeatherService} from "../services/current-weather.service";
import {LocationService} from '../services/location.service';
import {Subscription} from "rxjs";
import moment from 'moment';
import {DailyForecast} from "../services/forecast-five-days.service";
import {UserPlace} from "../app.component";


@Component({
  selector: 'app-current-weather',
  templateUrl: './current-weather.component.html',
  styleUrls: ['./current-weather.component.css']
})
export class CurrentWeatherComponent implements OnInit, OnDestroy {

  @Input() userPlace: UserPlace | null = null;


  constructor(public currentWeatherService: CurrentWeatherService) { }

  date: Date = new Date();


  currentWeather: CurrentWeather | null = null;

  subscription: Subscription = undefined;

  ngOnInit() {
    this.subscription = this.currentWeatherService.currentWeather$
      .subscribe(res => this.currentWeather = res);
  }

  ngOnDestroy() {
    this.subscription?.unsubscribe();
  }

  // getTimezone(timezone: number | undefined) {
  //   // calculate hours from timezone
  //   const hours = Math.floor(Math.abs(timezone) / 3600)?.toString().padStart(2, "0");
  //   const minutes = (Math.abs(timezone) % 60)?.toString().padStart(2, "0");
  //   const sign = timezone >= 0 ? '+' : '-';
  //   return `${sign}${hours}:${minutes}`;
  // }

  // getMomentDate(timezone: number| undefined, dt: number| undefined) {
  //   const timezoneInMinutes = timezone / 60;
  //   const currTime = moment.unix(dt).utcOffset(timezoneInMinutes).format('DD MMMM YYYY H:mm ');
  //
  //   // const currHour: number | null = moment.unix(dt).utcOffset(timezoneInMinutes).hour();
  //   return currTime;
  // }

}
