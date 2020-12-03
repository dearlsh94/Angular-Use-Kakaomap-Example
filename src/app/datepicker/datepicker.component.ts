import { Component, OnInit } from '@angular/core';
import {FormControl} from '@angular/forms';
import {MatDatepickerInputEvent} from '@angular/material/datepicker';
import { NativeDateAdapter, DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';

 export const PICK_FORMATS = {
   parse: {dateInput: {month: 'short', year: 'numeric', day: 'numeric'}},
   display: {
       dateInput: 'input',
       monthYearLabel: {year: 'numeric', month: 'short'},
       dateA11yLabel: {year: 'numeric', month: 'long', day: 'numeric'},
       monthYearA11yLabel: {year: 'numeric', month: 'long'}
   }
 };
 
 class PickDateAdapter extends NativeDateAdapter {
   format(date: Date, displayFormat: Object): string {
       if (displayFormat === 'input') {
           return getDateString(date);//formatDate(date,'yyyy.MM.dd', this.locale);;
       } else {
           return date.toDateString();
       }
   }
 }

@Component({
  selector: 'app-datepicker',
  templateUrl: './datepicker.component.html',
  styleUrls: ['./datepicker.component.scss'],
  providers: [
    {provide: DateAdapter, useClass: PickDateAdapter},
    {provide: MAT_DATE_LOCALE, useValue: 'ko-KR'},
    {provide: MAT_DATE_FORMATS, useValue: PICK_FORMATS},
  ]
})
export class DatepickerComponent implements OnInit {
  events: string[] = [];
  startDate = new Date();
  comment = '';

  //NOTE 오늘 날짜 자동 입력
  date = new FormControl(new Date());

  constructor() { }

  ngOnInit(): void {
  }

  clear() {
    this.events = [];
  }

  changeDate(event: MatDatepickerInputEvent<Date>) {
    const strDate = getDateString(event.value);
    if (!strDate || strDate === '') {
      this.comment = '올바르지 않은 날짜 형식입니다.';
      this.date = new FormControl();
      return 0;
    }
    this.comment = '';
    this.events.push(`change: ${strDate}`);
  }

  inputDate(event: MatDatepickerInputEvent<Date>) {
    const strDate = getDateString(event.value);
    this.events.push(`input: ${strDate}`);
  }

  // addEvent(type: string, event: MatDatepickerInputEvent<Date>) {
  //   if (type === 'input') {
  //     event.value.toString().replace(/[^0-9.]/g, '').replace(/(\..*)\./g, '$1');
  //   }
  //   const strDate = getDateString(event.value);
  //   this.events.push(`${type}: ${strDate}`);
  // }
}

function getDateString(date: Date) {
  return date ? date.getFullYear() + '.' + (date.getMonth()+1) + '.' + date.getDate() : '';
}