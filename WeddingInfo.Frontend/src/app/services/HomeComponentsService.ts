import { IHomeComponentsService } from './interfaces/IHomeComponentsService';
import { Injectable } from '@angular/core';
import { IHomeComponent } from 'app/models/interfaces/IHomeComponent';
import { Observable } from 'rxjs';
import { ApiTools } from './data-access/ApiTools';
import { AuthManager } from 'app/config/AuthManager';
import { Http } from '@angular/http';
import { Router } from '@angular/router';
import { NotificationsService } from 'angular2-notifications';
import { map } from 'rxjs/operators';

@Injectable()
export class HomeComponentsService implements IHomeComponentsService {

    private _apiTools: ApiTools;

    public constructor(
        authManager: AuthManager,
        http: Http,
        router: Router,
        notificationService: NotificationsService
    ) {
        this._apiTools = new ApiTools('api/homeComponents', authManager, http, notificationService, router);
    }

    public create(home: IHomeComponent): Observable<IHomeComponent> {
        const route: string = ``;
        return this._apiTools.post(route, home).pipe(map((body: any) => {
            return body || false;
        }));
    }
    public getAll(): Observable<IHomeComponent[]> {
        const route: string = ``;
        return this._apiTools.get(route).pipe(map((body: any) => {
            return body || false;
        }));
    }
    public getById(id: number): Observable<IHomeComponent> {
        const route: string = `${id}`;
        return this._apiTools.get(route).pipe(map((body: any) => {
            return body || false;
        }));
    }
    public update(home: IHomeComponent): Observable<IHomeComponent> {
        const route: string = ``;
        return this._apiTools.put(route, home).pipe(map((body: any) => {
            return body || false;
        }));
    }


}