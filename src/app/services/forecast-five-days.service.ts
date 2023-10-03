import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import moment, {Moment} from 'moment';

export interface ForecastFiveDays{
  city: City,
  dailyForecast: DailyForecast [],
  list: List []
}
export interface City{
  sunrise: number,
  sunset: number,
  timezone: number
}
export interface List {
  dt: number,
  weather: Weather[],
  main: Main,
  wind: Wind,
  dt_txt: string,
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
export interface DailyForecast {
  date: Moment,
  forecastMorning?: List,
  forecastDay?: List,
  forecastEvening?: List,
  forecastNight?: List,
  condition: boolean
}

@Injectable({
  providedIn: 'root'
})
export class ForecastFiveDaysService {

  dailyForecastArr = Array();
  constructor(private http: HttpClient) { }

  calcTemp (value: ForecastFiveDays, date: Moment, periodStart: number, periodEnd: number) {
    const timezoneInMinutes = value.city.timezone/60;
    const hourPeriodStart = moment(date).add(periodStart, 'hours');
    const hourPeriodEnd = moment(date).add(periodEnd, 'hours');

    const filtered = value.list?.filter(item => {
      const placeDate = moment.unix(item.dt).utcOffset(timezoneInMinutes);
      return moment(placeDate).isSameOrAfter(hourPeriodStart) && moment(placeDate).isSameOrBefore(hourPeriodEnd);
    });

    const result = filtered?.sort((a, b) =>
        periodEnd < 24 ? a.main?.temp - b.main?.temp : b.main?.temp - a.main?.temp);
    return result?.pop();
  }
  getDailyForecast(value: ForecastFiveDays) {
    const timezoneInMinutes = value.city.timezone/60;
    const dtArr = value.list.map(val => val.dt);
    const dtMin = Math.min(...dtArr);
    const minMoment = moment.unix(dtMin).utcOffset(timezoneInMinutes).startOf('day');
    const {
      morningStart,
      morningEnd,
      afternoonStart,
      afternoonEnd,
      eveningStart,
      eveningEnd,
      nightStart,
      nightEnd
    } = this.extracted(value, timezoneInMinutes);

    this.dailyForecastArr = [];

    for (let i = 0; i<5; i++) {
      const currDate = moment(minMoment).add(i, 'days');
      const dailyForecast  =
        {
          date : currDate,
          forecastMorning: this.calcTemp(value, currDate, morningStart, morningEnd ),
          forecastDay: this.calcTemp(value, currDate, afternoonStart, afternoonEnd ),
          forecastEvening: this.calcTemp(value, currDate, eveningStart ,eveningEnd ),
          forecastNight: this.calcTemp(value, currDate, nightStart,nightEnd )
        }
      this.dailyForecastArr.push(dailyForecast)
    }
    return this.dailyForecastArr
}
  private extracted(value: ForecastFiveDays, timezoneInMinutes: number) {
    const sunrise = moment.unix(value.city.sunrise).utcOffset(timezoneInMinutes);
    const dayStart = moment(sunrise).startOf('day');
    const sunset = moment.unix(value.city.sunset).utcOffset(timezoneInMinutes);
    const dayDuration = sunset.diff(sunrise, 'minute');
    const periodDuration = dayDuration / 5;
    // const morningStartMoment = moment(sunrise).startOf('hour');
    const morningStartMoment = moment(sunrise);
    const morningEndMoment = moment(sunrise).add(periodDuration, 'minute');
    const afternoonStartMoment = moment(morningEndMoment);
    const afternoonEndMoment = moment(sunset).subtract(periodDuration, 'minute');
    const eveningStartMoment = moment(afternoonEndMoment);
    const eveningEndMoment = moment(sunset);
    const nightStartMoment = moment(eveningEndMoment);
    const ceil = (value) => Math.ceil(value.diff(dayStart, 'minute') / 60);
    const floor = (value) => Math.floor(value.diff(dayStart, 'minute') / 60);
    const morningStart = ceil(morningStartMoment);
    const morningStartFloor = floor(morningStartMoment);
    console.log('morning start', morningStart);
    const morningEnd = ceil(morningEndMoment);
    const afternoonStart = ceil(afternoonStartMoment);
    const afternoonEnd = ceil(afternoonEndMoment);
    const eveningStart = floor(eveningStartMoment);
    console.log('Evening start', eveningStart);
    const eveningEnd = floor(eveningEndMoment);
    console.log('Evening end', eveningEnd);
    const nightStart = ceil(nightStartMoment);
    // const nightEnd = 24 + morningStart;
    const nightEnd = 24 + morningStartFloor;
    return {morningStart, morningEnd, afternoonStart, afternoonEnd, eveningStart, eveningEnd, nightStart, nightEnd};
  }

  apiKey = '6d02aee820fee27c92db6b1ed7070b9d';
  getForecastFiveDays (place){
    const apiUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${place?.userLatitude}&lon=${place?.userLongitude}&appid=${this.apiKey}&units=metric`;
    return this.http.get<ForecastFiveDays>(apiUrl)
  }
}
