import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from 'app/services/AuthenticationService';
import { Router } from '@angular/router';
import { IAuthenticationService } from 'app/services/interfaces/IAuthenticationService';
import { IUser } from 'app/models/interfaces/IUser';
import { User } from 'app/models/User';
import { NotificationsService } from 'angular2-notifications';
import { finalize, catchError } from 'rxjs/operators';
import { Observable, throwError } from 'rxjs';
import { AuthManager } from 'app/config/AuthManager';

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss'],
    providers: [AuthenticationService]
})

export class LoginComponent implements OnInit {

    private readonly _router: Router;
    private readonly _authService: IAuthenticationService;
    private readonly _authManager: AuthManager;
    private readonly _notificationService: NotificationsService;

    private _loading: boolean;
    private _account: IUser;

    constructor(
        authManager: AuthManager,
        authService: AuthenticationService,
        notificationService: NotificationsService,
        router: Router
    ) {
        this._authManager = authManager;
        this._authService = authService;
        this._notificationService = notificationService;
        this._router = router;

        this._account = new User();
        this._loading = false;
    }

    public get account(): IUser {
        return this._account;
    }

    public get loading(): boolean {
        return this._loading;
    }

    ngOnInit() {
    }

    public onLogin(): void {
        if (this._account.email && this._account.password) {
            this._loading = true;
            this._authService.login(this._account.email, this._account.password).pipe(finalize(() => {
                this._loading = false;
            }), catchError(err => {
                this._notificationService.error('An error occurred!');
                return throwError(err);
            })).subscribe((loggedIn: boolean) => {
                if (loggedIn) {
                    $('select').material_select();
                    this._router.navigate(['']);
                } else {
                    this._notificationService.error('Unable to Login.  Check Credentials.');
                }
            });
        } else {
            this._notificationService.error('Please provide a valid email and password.');
        }
    }

}
