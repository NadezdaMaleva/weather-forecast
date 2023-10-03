import { Injectable, Component, Input } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {UserPlace} from '../app.component'
import {
  BehaviorSubject,
  catchError,
  concatMap,
  filter,
  forkJoin,
  map,
  of,
  tap,
  throwError
} from 'rxjs';
import {ForecastFiveDaysService} from "./forecast-five-days.service";
import moment, {Moment} from 'moment';

export interface CurrentWeather {
  weather: Weather[],
  dt: number,
  timezone: number,
  main: Main,
  name: string,
  wind: Wind,
  timestamp?: Date
}

export interface Weather {
  main: string,
  description: string,
  icon?: string
}

export interface Main {
  temp: number,
  pressure: number,
  humidity: number
}
export interface Wind {
  speed: number,
  deg: number
}

@Injectable({
  providedIn: 'root'
})
export class CurrentWeatherService {

  userPlace: UserPlace | null =null;

  private currentPlace = new BehaviorSubject<any>(undefined);
  readonly currentPlace$ = this.currentPlace.asObservable();

  private currentWeather = new BehaviorSubject<any>(undefined);
  readonly currentWeather$ = this.currentWeather.asObservable();

  private weatherForecast = new BehaviorSubject<any>(undefined);
  readonly weatherForecast$ = this.weatherForecast.asObservable();

  constructor( private http: HttpClient,
               readonly forecastFiveDaysService: ForecastFiveDaysService) {
    this.currentPlace$.pipe(
      filter(value => !!value),
      concatMap(place => this.fetchWeatherData(place)),
    ).subscribe(value => console.log('--> value =', value));
  }

  private fetchWeatherData(place) {
    const currentWeather = this.getCurrentWeather(place).pipe(
      catchError(err => {
        console.error(err);
        return of(undefined);
      }),
      filter(value => !!value),
      map(value => ({
        ...value,
        timestamp: new Date(value.dt*1000)
      })),
      tap(value => console.log('--> value =', value)),
      tap((weather: CurrentWeather) => this.currentWeather.next(weather))
    );

    const forecast = this.forecastFiveDaysService.getForecastFiveDays(place).pipe(
      filter(value => !!value),
      map( value => ({
        ...value,
        dailyForecast: this.forecastFiveDaysService.getDailyForecast(value)
      })),

      tap((ffd) => this.weatherForecast.next(ffd))
    );
    return forkJoin([ currentWeather, forecast ]);
  }

  apiKey = '6d02aee820fee27c92db6b1ed7070b9d';

  setCurrentPlace(place){
    this.currentPlace.next(place)
  }
  private getCurrentWeather(place) {
    const apiUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${place?.userLatitude}&lon=${place?.userLongitude}&appid=${this.apiKey}&units=metric&lang=en`;
    return this.http.get<CurrentWeather>(apiUrl)
  }
  getMomentDate(timezone: number| undefined, dt: number| undefined) {
    const timezoneInMinutes = timezone / 60;
    const currTime = moment.unix(dt).utcOffset(timezoneInMinutes);
    return currTime;
  }
  getBgColor(timezone: number| undefined, dt: number| undefined, sunset: number, sunrise: number) {
    const timezoneInMinutes = timezone / 60;
    const currTime = moment.unix(dt).utcOffset(timezoneInMinutes);
    const  sunsetValue = moment.unix(sunset).utcOffset(timezoneInMinutes);
    const sunriseValue = moment.unix(sunrise).utcOffset(timezoneInMinutes);

    if(moment(currTime).isSameOrAfter(sunriseValue) && moment(currTime).isSameOrBefore(sunsetValue)) {
      return 'content-day'
    } return 'content-night'
  }

  getWindDirection(deg: number) {
    if(deg === null) {
      return undefined
    } else if (deg >= 0 && deg<=25){
      return 'bi bi-arrow-down ps-2'
    } else if (deg >=26 && deg <=65) {
      return 'bi bi-arrow-down-left ps-2'
    } else if (deg >=66 && deg <=115){
      return 'bi bi-arrow-left ps-2'
    } else if (deg>=116 && deg <=155){
      return 'bi bi-arrow-up-left ps-2'
    } else if (deg>=156 && deg <=205){
      return 'bi bi-arrow-up ps-2'
    } else if (deg>=206 && deg <=245){
      return 'bi bi-arrow-up-right ps-2'
    } else if (deg>=246 && deg <=295){
      return 'bi bi-arrow-right ps-2'
    } else if(deg>=296 && deg<=335) {
      return 'bi bi-arrow-down-right ps-2'
    } else if(deg >=336 && deg <=360){
      return 'bi bi-arrow-down ps-2'
    } return undefined
  }

   getIconSvg(icon: string | undefined) :any {
    switch (icon){
      case '01d' :
        return `assets/clearSkyD.svg`
        break;
      case '01n':
        return `assets/clearSkyN2.svg`
        break;
      case '02d':
        return `assets/fewCloudsD.svg`
        break;
      case '02n':
        return `assets/fewCloudsN.png`
        break;
      case '03d':
        return `assets/scatteredCloudsD.svg`
        break;
      case '03n':
        return `assets/scatteredCloudsN.svg`
        break;
      case '04d':
      case '04n':
        return `assets/brokenClouds.svg`
        break;
      case '09d' :
      case '09n':
        return `assets/showerRain.svg`
        break;
      case '10d':
        return `assets/rainD.svg`
        break;
      case '10n':
        return `assets/rainN.svg`
        break;
      case '11d':
      case '11n':
        return `assets/thunderstorm.svg`
        break;
      case '13d' :
      case '13n' :
        return `assets/brokenClouds.svg`
      case '50d':
      case '50n':
        return `assets/brokenClouds.svg`
      break;
    }
  }
  getBgCurrWeather(icon: string | undefined){
    if (icon === '13d' || icon === '13n') {
      return 'bgSnow'
    } return 'imgCurrWeather';
  }
  getBgPrevForecast(icon: string | undefined) {
    if (icon === '13d' || icon === '13n') {
      return 'bgSnowPreview'
    } return 'imgPreviewWeather';
  }
  getBgDailyForecast(icon: string | undefined) {
    if (icon === '13d' || icon === '13n') {
      return 'bgSnowDailyForecast'
    } return 'imgDailyForecast';
  }
}
