import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import {HttpClientModule} from "@angular/common/http";
import { GooglePlaceModule } from 'ngx-google-places-autocomplete';

import { AppComponent } from './app.component';
import { CurrentWeatherComponent } from './current-weather/current-weather.component';
import { ForecastFiveDaysComponent } from './forecast-five-days/forecast-five-days.component';
import { ForecastPreviewComponent } from './forecast-preview/forecast-preview.component';
import {FormsModule} from "@angular/forms";
import { DailyForecastComponent } from './daily-forecast/daily-forecast.component';
import { FillerPipe } from './filler.pipe';
import { FooterComponent } from './footer/footer.component';


@NgModule({
  declarations: [
    AppComponent,
    CurrentWeatherComponent,
    ForecastFiveDaysComponent,
    ForecastPreviewComponent,
    DailyForecastComponent,
    FillerPipe,
    FooterComponent
  ],
    imports: [
        BrowserModule,
        HttpClientModule,
        GooglePlaceModule,
        FormsModule
    ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
