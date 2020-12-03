import { NgModule } from '@angular/core';
import { RouterModule }   from '@angular/router';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AppComponent } from './app.component';
import { DatepickerComponent } from './datepicker/datepicker.component';

import {FormsModule, ReactiveFormsModule} from '@angular/forms';
// import {MatNativeDateModule} from '@angular/material/core';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import { KakaomapComponent } from './kakaomap/kakaomap.component';

@NgModule({
  declarations: [
    AppComponent,
    DatepickerComponent,
    KakaomapComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    MatDatepickerModule,
    // MatNativeDateModule,
    MatFormFieldModule,
    MatInputModule,
    RouterModule.forRoot([
      {
        path: 'datepicker',
        component: DatepickerComponent
      },
      {
        path: 'kakaomap',
        component: KakaomapComponent
      }
    ]),
  ],
  bootstrap: [AppComponent, DatepickerComponent],
})
export class AppModule { }
