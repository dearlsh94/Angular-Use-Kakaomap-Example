import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  // templateUrl: './app.component.html',
  template: `
    <h1>{{title}}</h1>
    <ul>
      <li><a routerLink="/">Home</a></li>
      <li><a routerLink="/datepicker">DatePicker</a></li>
      <li><a routerLink="/kakaomap">KakaoMap</a></li>
    </ul>
    <router-outlet></router-outlet>
    <app-datepicker></app-datepicker>
  `,
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'helloAngular';
}
