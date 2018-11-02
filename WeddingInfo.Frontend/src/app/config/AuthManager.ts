import { Injectable } from '@angular/core';
import { BehaviorSubject, Subscription } from 'rxjs';
import { CookieService } from 'ngx-cookie';
import { IUser } from 'app/models/interfaces/IUser';

@Injectable()
export class AuthManager {
    public readonly HEADER_AUTH_KEY: string = "authorization";
    private readonly COOKIE_TOKEN_KEY: string = "jsauthtoken";
    private readonly COOKIE_USER_KEY: string = "jsauthuser";
    private _activeUser: IUser;
    private _activity: BehaviorSubject<boolean>;
    private _cookieService: CookieService;
    private _authToken: string;

    constructor(
        cookieService: CookieService
    ) {
        this._activity = new BehaviorSubject<boolean>(false);
        this._cookieService = cookieService;
        this.restoreAuth();
    }

    /**
     * The currently logged in user.
     */
    public get activeUser(): IUser {
        return this._activeUser;
    }

    public set activeUser(v: IUser) {
        this._activeUser = v;
    }

    /**
     * Determines whether or not the active user is logged in.
     */
    public get authenticated(): boolean {
        if (this._activeUser) {
            return true;
        }
        else {
            return false;
        }
    }

    /**
     * The active user's authorization token.
     */
    public get authToken(): string {
        return this._authToken;
    }

    /**
     * Destroys the active user and auth token and removes their persisted values.
     */
    public destroyAuth(): void {
        this._activeUser = null;
        this._authToken = null;
        this._cookieService.remove(this.COOKIE_USER_KEY);
        this._cookieService.remove(this.COOKIE_TOKEN_KEY);
        this._activity.next(false);
    }

    public getCookie(key: string): string {
        return this._cookieService.get(key);
      }

    /**
     * Sets the active user and auth token and persists the values to browser storage or a cookie.
     * @param user The active user to persist.
     * @param token The user's authorization token to persist.
     */
    public persistAuth(user: IUser, token: string) {
        if (user && token) {
            this._activeUser = user;
            this._authToken = token;
            this._cookieService.put(this.COOKIE_USER_KEY, JSON.stringify(this._activeUser));
            this._cookieService.put(this.COOKIE_TOKEN_KEY, this._authToken);
            if (this.authenticated) {
                this._activity.next(true);
            }
        }
    }

    /**
     * Subscribe to login and logout activity.
     * @param next Next handler for the subecription.
     * @param error Error handler for the subscription.
     * @param complete Complete handler for the subscription.
     */
    public subscribe(next: (value: boolean) => void, error?: (error: any) => void, complete?: () => void): Subscription {
        return this._activity.subscribe(next, error, complete);
    }

    /**
     * Restores active user and auth token if they have been persisted.
     */
    private restoreAuth(): void {
        let activeUser: IUser = null;
        let authToken: string = null;

        let activeUserString: string = this._cookieService.get(this.COOKIE_USER_KEY);
        if (activeUserString) {
            activeUser = JSON.parse(activeUserString);
        }
        let authTokenString: string = this._cookieService.get(this.COOKIE_TOKEN_KEY);
        if (authTokenString) {
            authToken = authTokenString;
        }

        this._activeUser = activeUser;
        this._authToken = authToken;

        if (this.authenticated) {
            this._activity.next(true);
        }
    }
}