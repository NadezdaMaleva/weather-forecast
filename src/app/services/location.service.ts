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
  public getUserLocation() {
    const apiUrl= '/api/v1/ipgeo';
    return this.http.get<UserLocation>(apiUrl)
  }


}
