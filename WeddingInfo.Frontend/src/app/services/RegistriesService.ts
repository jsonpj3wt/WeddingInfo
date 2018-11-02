import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiTools } from './data-access/ApiTools';
import { AuthManager } from 'app/config/AuthManager';
import { Http } from '@angular/http';
import { Router } from '@angular/router';
import { NotificationsService } from 'angular2-notifications';
import { map } from 'rxjs/operators';
import { IRegistriesService } from './interfaces/IRegistriesService';
import { IRegistry } from 'app/models/interfaces/IRegistry';

@Injectable()
export class RegistriesService implements IRegistriesService {

    private _apiTools: ApiTools;

    public constructor(
        authManager: AuthManager,
        http: Http,
        router: Router,
        notificationService: NotificationsService
    ) {
        this._apiTools = new ApiTools('api/registries', authManager, http, notificationService, router);
    }

    public create(registry: IRegistry): Observable<IRegistry> {
        const route: string = ``;
        return this._apiTools.post(route, registry).pipe(map((body: any) => {
            return body || false;
        }));
    }
    public delete(id: number): Observable<boolean> {
        const route: string = `${id}`;
        return this._apiTools.delete(route).pipe(map((body: any) => {
            return body || false;
        }));
    }
    public getAll(): Observable<IRegistry[]> {
        const route: string = ``;
        return this._apiTools.get(route).pipe(map((body: any) => {
            return body || false;
        }));
    }
    public getById(id: number): Observable<IRegistry> {
        const route: string = `${id}`;
        return this._apiTools.get(route).pipe(map((body: any) => {
            return body || false;
        }));
    }
    public update(registry: IRegistry): Observable<IRegistry> {
        const route: string = ``;
        return this._apiTools.put(route, registry).pipe(map((body: any) => {
            return body || false;
        }));
    }


}