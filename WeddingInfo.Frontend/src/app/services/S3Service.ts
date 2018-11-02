import { IS3Service } from './interfaces/IS3Service';
import { Injectable } from '@angular/core';
import { ApiTools } from './data-access/ApiTools';
import { AuthManager } from 'app/config/AuthManager';
import { Http } from '@angular/http';
import { Router } from '@angular/router';
import { NotificationsService } from 'angular2-notifications';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable()
export class S3Service implements IS3Service {
    private _apiTools: ApiTools;

    public constructor(
        authManager: AuthManager,
        http: Http,
        router: Router,
        notificationService: NotificationsService
    ) {
        this._apiTools = new ApiTools('api/uploads', authManager, http, notificationService, router);
    }

    public getImages(lastPull: string, limit: number): Observable<string[]> {
        const route: string = `${limit}/${lastPull}`;
        return this._apiTools.get(route).pipe(map((body: any) => {
            return body || false;
        }));
    }

    public postImages(files: File[]): Observable<string[]> {
        const route: string = ``;
        return this._apiTools.postFiles(route, files).pipe(map((body: any) => {
            return body || false;
        }));
    }
}
