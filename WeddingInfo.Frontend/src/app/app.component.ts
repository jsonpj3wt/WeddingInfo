import { Component } from '@angular/core';
import { Options } from 'angular2-notifications';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  
  private _notificationOptions: Options;

  public constructor() {
    this._notificationOptions = {
      position: ['top', 'right'],
      timeOut: 5000
    };
  }
  
  public get notificationOptions(): Options {
        return this._notificationOptions;
  }
}
