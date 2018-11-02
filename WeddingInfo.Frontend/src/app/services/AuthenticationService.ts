import { Injectable } from '@angular/core';
import { Headers, Http } from '@angular/http';
import { Observable, pipe, throwError } from 'rxjs';

import { AuthManager } from '../config/AuthManager';
import { IAuthenticationService } from './interfaces/IAuthenticationService';
import { HttpConfig } from '../config/HttpConfig';
import { catchError, map } from 'rxjs/operators';

@Injectable()
export class AuthenticationService implements IAuthenticationService {
    private readonly _authManager: AuthManager;
    private readonly _http: Http;

    public constructor(
        authManager: AuthManager,
        http: Http
    ) {
        this._http = http;
        this._authManager = authManager;
    }

    public login(email: string, password: string): Observable<boolean> {
        const routePartial = `${HttpConfig.BASE_URL}/api/token`;

        const headers: Headers = new Headers();
        headers.set('Content-Type', 'application/x-www-form-urlencoded');

        const urlSearchParams = new URLSearchParams();
        urlSearchParams.append('email', email);
        urlSearchParams.append('password', password);
        let body = urlSearchParams.toString();

        return this._http.post(routePartial, body, { headers: headers }).pipe(catchError(err => {
            let message = err.text() || err.statusText;
            return throwError(message);
        }), map((token: any) => {
            if (token && token.json()) {
                let body = token.json();
                this._authManager.persistAuth(JSON.parse(body.user), body.access_token);
                return true;
            } else {
                return false;
            }
        }, (error: string) => {
            return error;
        }));
    }
}
