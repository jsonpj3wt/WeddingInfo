import { ILocationsService } from './interfaces/ILocationsService';
import { Injectable } from '@angular/core';
import { ILocation } from 'app/models/interfaces/ILocation';
import { Observable } from 'rxjs';
import { ApiTools } from './data-access/ApiTools';
import { AuthManager } from 'app/config/AuthManager';
import { Http } from '@angular/http';
import { Router } from '@angular/router';
import { NotificationsService } from 'angular2-notifications';
import { map } from 'rxjs/operators';

@Injectable()
export class LocationsService implements ILocationsService {

    private _apiTools: ApiTools;

    public constructor(
        authManager: AuthManager,
        http: Http,
        router: Router,
        notificationService: NotificationsService
    ) {
        this._apiTools = new ApiTools('api/locations', authManager, http, notificationService, router);
    }

    public createLocation(loc: ILocation): Observable<ILocation> {
        const route: string = ``;
        return this._apiTools.post(route, loc).pipe(map((body: any) => {
            return body || false;
        }));
    }
    public delete(id: number): Observable<boolean> {
        const route: string = `${id}`;
        return this._apiTools.delete(route).pipe(map((body: any) => {
            return body || false;
        }));
    }
    public getAll(): Observable<ILocation[]> {
        const route: string = ``;
        return this._apiTools.get(route).pipe(map((body: any) => {
            return body || false;
        }));
    }
    public getById(id: number): Observable<ILocation> {
        const route: string = `${id}`;
        return this._apiTools.get(route).pipe(map((body: any) => {
            return body || false;
        }));
    }
    public updateLocation(loc: ILocation): Observable<ILocation> {
        const route: string = ``;
        return this._apiTools.put(route, loc).pipe(map((body: any) => {
            return body || false;
        }));
    }


}