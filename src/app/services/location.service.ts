import {BehaviorSubject, filter, from, Observable} from 'rxjs';
import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {CurrentWeather} from "./current-weather.service";

export interface UserLocation {
  city: string,
  county_name?: string,
  latitude: any,
  longitude: any
}

@Injectable({
  providedIn: 'root'
})
export class LocationService {

  constructor(private http: HttpClient) {}

  apiKey = 'f0172f259da14fe4b9a3763ce0c57304';

  public getUserLocation() {
    const apiUrl = `https://api.ipgeolocation.io/ipgeo?apiKey=${this.apiKey}&fields=geo`;
    return this.http.get<UserLocation>(apiUrl)
  }


}
