import { Component, ViewChild, OnInit } from '@angular/core';
import { UsersService } from 'app/services/UsersService';
import { IUsersService } from 'app/services/interfaces/IUsersService';
import { AuthManager } from 'app/config/AuthManager';
import { NotificationsService } from 'angular2-notifications';
import { IUser } from 'app/models/interfaces/IUser';
import { User } from 'app/models/User';
import { finalize, catchError } from 'rxjs/operators';
import { Observable, throwError } from 'rxjs';
import { GooglePlaceDirective } from 'ngx-google-places-autocomplete';
import { Address } from 'ngx-google-places-autocomplete/objects/address';

@Component({
    selector: 'app-rsvp',
    templateUrl: './rsvp.component.html',
    styleUrls: ['./rsvp.component.scss'],
    providers: [UsersService]
})
export class RsvpComponent implements OnInit {
    @ViewChild('placesRef') private _placesRef: GooglePlaceDirective;
    private readonly _authManager: AuthManager;
    private readonly _notificationService: NotificationsService;
    private readonly _userService: IUsersService;

    private _loading: boolean;
    private _loadingMap: boolean;
    private _user: IUser;
    private _isLoggedIn: boolean;
    private _confirmPassword: string;

    public constructor(
        authManager: AuthManager,
        notificationService: NotificationsService,
        userService: UsersService
    ) {
        this._authManager = authManager;
        this._notificationService = notificationService;
        this._userService = userService;

        this._user = new User();
        this._user.isAttending = true;
        this._loading = true;
        this._loadingMap = true;
        this._confirmPassword = '';
    }

    public ngOnInit(): void {
        if (this._authManager.activeUser) {
            this._isLoggedIn = true;
            this._user = this._authManager.activeUser;
        }
        this._loading = false;
        setTimeout(() => {
        this._loadingMap = false;
        }, 500);
    }

    public get user(): IUser {
        return this._user;
    }

    public get loading(): boolean {
        return this._loading;
    }

    public get loadingMap(): boolean {
        return this._loadingMap;
    }

    public get confirmPassword(): string {
        return this._confirmPassword;
    }

    public set confirmPassword(v: string) {
        this._confirmPassword = v;
    }

    public handleAddressChange(address: Address): void {
        this._user.address = address.formatted_address;
    }

    public handleEnterKeyPress(event) {
        const tagName = event.target.tagName.toLowerCase();
        if (tagName !== 'textarea') {
            return false;
        }
    }

    public onRsvp() {
        if (this._user.password !== this._confirmPassword) {
            this._notificationService.error('Passwords do not match!');
        } else if (!this._user.password.match(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,15}$/g)) {
            this._notificationService.error('Password not valid.  Must be 8-15 characters, contain lowercase, uppercase and numbers.');
            return;
        }
        this._loading = true;
        if (!this._isLoggedIn) {
            this._userService.createUser(this._user).pipe(finalize(() => {
                this._loading = false;
            }), catchError(err => {
                this._notificationService.error('An error occurred!');
                return throwError(err);
            })).subscribe((user: IUser) => {
                if (user) {
                    this._notificationService.success('Successful RSVP!');
                } else {
                    this._notificationService.error('Unable to RSVP.');
                }
            });
        } else {
            this._userService.updateUser(this._user).pipe(finalize(() => {
                this._loading = false;
            }), catchError(err => {
                this._notificationService.error('An error occurred!');
                return throwError(err);
            })).subscribe((user: IUser) => {
                if (user) {
                    this._notificationService.success('Successfully Updated RSVP!');
                } else {
                    this._notificationService.error('Unable to update RSVP.');
                }
            });
        }
    }
}
