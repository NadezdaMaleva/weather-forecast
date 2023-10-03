import { Component } from '@angular/core';
import {Subscription} from 'rxjs';
import {CurrentWeather, CurrentWeatherService} from './services/current-weather.service';
import {LocationService, UserLocation} from "./services/location.service";
import {ForecastFiveDays, ForecastFiveDaysService} from "./services/forecast-five-days.service";

export interface UserPlace{
  userAddress: string,
  userLatitude: string,
  userLongitude: string,
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent {
  title = 'angular-weather-forecast';

  userPlace: UserPlace = {
    userAddress: '',
    userLongitude: '',
    userLatitude: ''
  }

  inputModel: any;
  constructor(public service: CurrentWeatherService,
              private locationService: LocationService) {}

  currentWeather: CurrentWeather | null = null;
  forecast : ForecastFiveDays | null = null;

  userLocation: UserLocation | null = null;

  subscription: Subscription = undefined;
  subscriptionForecast: Subscription = undefined;
  subscriptionLocation: Subscription = undefined;

  ngOnInit() {
    this.subscription = this.service.currentWeather$
      .subscribe(res => this.currentWeather = res);

    this.subscriptionForecast = this.service.weatherForecast$
      .subscribe(res =>this.forecast = res);

    this.subscriptionLocation = this.locationService.getUserLocation()
      .subscribe(res=> {
        this.userPlace.userAddress = res.city;
        this.userPlace.userLatitude = res.latitude;
        this.userPlace.userLongitude = res.longitude;
        console.log("UserLocation", this.userPlace)
        this.service.setCurrentPlace(this.userPlace);
      })

  }
  ngOnDestroy() {
    this.subscription?.unsubscribe();
    this.subscriptionLocation?.unsubscribe();
  }
  handleAddressChange (address?:any) {
    this.userPlace.userAddress = address.formatted_address;
    this.userPlace.userLongitude = address.geometry.location.lng()
    this.userPlace.userLatitude = address.geometry.location.lat()
    console.log('Place:', this.userPlace);
    this.service.setCurrentPlace(this.userPlace);
    this.inputModel = '';
  }

}
