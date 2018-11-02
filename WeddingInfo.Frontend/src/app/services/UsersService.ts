import { IUsersService } from './interfaces/IUsersService';
import { Observable } from 'rxjs';
import { IUser } from 'app/models/interfaces/IUser';
import { Injectable } from '@angular/core';
import { ApiTools } from './data-access/ApiTools';
import { AuthManager } from 'app/config/AuthManager';
import { Router } from '@angular/router';
import { Http } from '@angular/http';
import { NotificationsService } from 'angular2-notifications';
import { map } from 'rxjs/operators';

@Injectable()
export class UsersService implements IUsersService {

    private _apiTools: ApiTools;

    public constructor(
        authManager: AuthManager,
        http: Http,
        router: Router,
        notificationService: NotificationsService
    ) {
        this._apiTools = new ApiTools('api/users', authManager, http, notificationService, router);
    }

    public createUser(usr: IUser): Observable<IUser> {
        const route: string = ``;
        return this._apiTools.post(route, usr).pipe(map((body: any) => {
            return body || false;
        }));
    }

    public delete(id: number): Observable<boolean> {
        const route: string = `${id}`;
        return this._apiTools.delete(route).pipe(map((body: any) => {
            return body || false;
        }));
    }

    public getAll(): Observable<IUser[]> {
        const route: string = ``;
        return this._apiTools.get(route).pipe(map((body: any) => {
            return body || false;
        }));
    }

    public getAttending(): Observable<IUser[]> {
        const route: string = `attending`;
        return this._apiTools.get(route).pipe(map((body: any) => {
            return body || false;
        }));
    }

    public getById(id: number): Observable<IUser> {
        const route: string = `${id}`;
        return this._apiTools.get(route).pipe(map((body: any) => {
            return body || false;
        }));
    }

    getByName(firstName: string, lastName: string): Observable<IUser[]> {
        const route: string = `name/${firstName}/${lastName}`;
        return this._apiTools.get(route).pipe(map((body: any) => {
            return body || false;
        }));
    }

    public updateBulkUsers(users: IUser[]): Observable<IUser[]> {
        const route: string = `bulk`;
        const data = {
            bulkUpdateUserData: users
        }
        return this._apiTools.put(route, data).pipe(map((body: any) => {
            return body || false;
        }));
    }

    public updateUser(usr: IUser): Observable<IUser> {
        const route: string = ``;
        return this._apiTools.put(route, usr).pipe(map((body: any) => {
            return body || false;
        }));
    }


}
