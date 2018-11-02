import { Component, OnInit } from '@angular/core';
import { AuthManager } from 'app/config/AuthManager';
import { HomeComponentsService } from 'app/services/HomeComponentsService';
import { IHomeComponentsService } from 'app/services/interfaces/IHomeComponentsService';
import { NotificationsService } from 'angular2-notifications';
import { IHomeComponent } from 'app/models/interfaces/IHomeComponent';
import { Home } from 'app/models/Home';
import { finalize, catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { Section } from 'app/models/Section';

@Component({
    selector: 'app-home',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.scss'],
    providers: [HomeComponentsService]
})
export class HomeComponent implements OnInit {

    private readonly _authManager: AuthManager;
    private readonly _homeComponentService: IHomeComponentsService;
    private readonly _notificationService: NotificationsService;

    private _homeData: IHomeComponent;
    private _loading: boolean;
    private _editView: boolean;

    constructor(
        authManager: AuthManager,
        homeComponentService: HomeComponentsService,
        notificationService: NotificationsService
    ) {
        this._authManager = authManager;
        this._homeComponentService = homeComponentService;
        this._notificationService = notificationService;
        this._homeData = new Home();
        this._editView = true;
    }

    public ngOnInit(): void {
        this._loading = true;
        this._homeComponentService.getById(1).pipe(finalize(() => {
            this._loading = false;
        }), catchError(err => {
            this._notificationService.error('Could not get Home.');
            return throwError(err);
        })).subscribe((home: IHomeComponent) => {
            if (home) {
                this._homeData = new Home(home);
            } else {
                this._notificationService.warn('Could not successfully get Home.');
            }
        });
    }

    public get loading(): boolean {
        return this._loading;
    }

    public get homeData(): IHomeComponent {
        return this._homeData;
    }

    public get canEdit(): boolean {
        return this._authManager.activeUser && this._authManager.activeUser.isAdmin && this._editView;
    }

    public get isAdmin(): boolean {
        return this._authManager.activeUser && this._authManager.activeUser.isAdmin;
    }

    public onAddSection(): void {
        this._homeData.sections.push(new Section());
    }

    public onDeleteSection(index: number) {
        this._homeData.sections.splice(index, 1);
    }

    public onUpdate(): void {
        this._loading = true;
        this._homeComponentService.update(this._homeData).pipe(finalize(() => {
            this._loading = false;
        }), catchError(err => {
            this._notificationService.error('Could not update Home.');
            return throwError(err);
        })).subscribe((home: IHomeComponent) => {
            if (home) {
                this._homeData = new Home(home);
            } else {
                this._notificationService.warn('Could not successfully update Home.');
            }
        });
    }

    public changeView(): void {
        this._editView = !this._editView;
    }

}
