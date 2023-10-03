import { Component, OnInit } from '@angular/core';
import {CurrentWeather, CurrentWeatherService} from "../services/current-weather.service";
import {DailyForecast, ForecastFiveDays, ForecastFiveDaysService} from "../services/forecast-five-days.service";
import {forkJoin, Subscription, tap} from "rxjs";
import moment, {Moment} from 'moment';

@Component({
  selector: 'app-forecast-preview',
  templateUrl: './forecast-preview.component.html',
  styleUrls: ['./forecast-preview.component.css']
})

export class ForecastPreviewComponent implements OnInit {
  constructor(public currentWeatherService: CurrentWeatherService) { }

  forecastPreview : ForecastFiveDays | null = null;
  currentWeather: CurrentWeather | null = null;

  subscriptionForecast: Subscription = undefined;
  subscriptionCurrWeather: Subscription = undefined;

  bgColorClass : string = null;
  localDate: Moment;

  ngOnInit(): void {
    this.subscriptionForecast = this.currentWeatherService.weatherForecast$
      .subscribe(res => this.forecastPreview = res);
    this.subscriptionCurrWeather = this.currentWeatherService.currentWeather$
      .pipe(
        tap(res =>{
          this.currentWeather = res;
          // this.bgColorClass = this.currentWeatherService.getBgColor(res?.timezone, res?.dt);
          this.localDate = this.currentWeatherService.getMomentDate(res?.timezone, res?.dt);
        })
      )
      .subscribe( );
  }
  ngOnDestroy() {
    this.subscriptionForecast?.unsubscribe();
    this.subscriptionCurrWeather?.unsubscribe()
  }
  extended(d) {
    d.condition = !d.condition;
  }
  formatDate(day: Moment, index) {
    const tomorrow = moment(this.localDate).add(1, 'day');
    if(moment(day).isSame(this.localDate, 'day') && index ===0){
      // console.log('GetFormatDay', tomorrow)
      return day.format('[Today], DD MMMM');
    } else if(moment(day).isSame(tomorrow, 'day')){
     return day.format('[Tomorrow], DD MMMM');
     }
    return day.format('dddd DD MMMM')
  }

  getArrIcon(day:DailyForecast , index) {
    if( !day.forecastDay?.weather?.[0]?.icon && index === 0 ){
      return this.currentWeatherService.getIconSvg(this.currentWeather?.weather?.[0]?.icon)
    }
    if(day.forecastDay?.weather?.[0]?.icon) {
      return this.currentWeatherService.getIconSvg(day.forecastDay?.weather?.[0]?.icon)
    }
    return undefined;
  }
  getArrBgIcon(day:DailyForecast , index) {
    if( !day.forecastDay?.weather?.[0]?.icon && index === 0 ){
      return this.currentWeatherService.getBgPrevForecast(this.currentWeather?.weather?.[0]?.icon);
    }
    return this.currentWeatherService.getBgPrevForecast(day.forecastDay?.weather?.[0]?.icon);
  }
}


