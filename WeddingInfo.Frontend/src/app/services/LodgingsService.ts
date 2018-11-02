import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiTools } from './data-access/ApiTools';
import { AuthManager } from 'app/config/AuthManager';
import { Http } from '@angular/http';
import { Router } from '@angular/router';
import { NotificationsService } from 'angular2-notifications';
import { map } from 'rxjs/operators';
import { ILodgingsService } from './interfaces/ILodgingsService';
import { ILodging } from 'app/models/interfaces/ILodging';

@Injectable()
export class LodgingsService implements ILodgingsService {

    private _apiTools: ApiTools;

    public constructor(
        authManager: AuthManager,
        http: Http,
        router: Router,
        notificationService: NotificationsService
    ) {
        this._apiTools = new ApiTools('api/lodgings', authManager, http, notificationService, router);
    }

    public create(lodging: ILodging): Observable<ILodging> {
        const route: string = ``;
        return this._apiTools.post(route, lodging).pipe(map((body: any) => {
            return body || false;
        }));
    }
    public delete(id: number): Observable<boolean> {
        const route: string = `${id}`;
        return this._apiTools.delete(route).pipe(map((body: any) => {
            return body || false;
        }));
    }
    public getAll(): Observable<ILodging[]> {
        const route: string = ``;
        return this._apiTools.get(route).pipe(map((body: any) => {
            return body || false;
        }));
    }
    public getById(id: number): Observable<ILodging> {
        const route: string = `${id}`;
        return this._apiTools.get(route).pipe(map((body: any) => {
            return body || false;
        }));
    }
    public update(lodging: ILodging): Observable<ILodging> {
        const route: string = ``;
        return this._apiTools.put(route, lodging).pipe(map((body: any) => {
            return body || false;
        }));
    }


}