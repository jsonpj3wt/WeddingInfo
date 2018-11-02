import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription, throwError } from 'rxjs';
import { NotificationsService } from 'angular2-notifications';
import { ActivatedRoute } from '@angular/router';
import { finalize, catchError } from 'rxjs/operators';
import { IRegistriesService } from 'app/services/interfaces/IRegistriesService';
import { RegistriesService } from 'app/services/RegistriesService';
import { IRegistry } from 'app/models/interfaces/IRegistry';
import { Registry } from 'app/models/Registry';

@Component({
    selector: 'app-registry-lodging',
    templateUrl: './edit-registry.component.html',
    styleUrls: ['./edit-registry.component.scss'],
    providers: [RegistriesService]
})
export class EditRegistryComponent implements OnInit, OnDestroy {

    private readonly _lodgingService: IRegistriesService;
    private readonly _notificationService: NotificationsService;
    private readonly _routeSubscription: Subscription;

    private _loading: boolean;
    private _registry: IRegistry;
    private _isEdit: boolean;

    constructor(
        lodgingService: RegistriesService,
        notificationService: NotificationsService,
        route: ActivatedRoute
    ) {
        this._lodgingService = lodgingService;
        this._notificationService = notificationService;

        this._registry = new Registry();
        this._loading = true;
        this._isEdit = true;

        this._routeSubscription = route.params.subscribe(params => {
            const registryIdParam: string = params['id'];
            const registryId: number = parseInt(registryIdParam);

            if (!(registryId > 0)) {
                this._isEdit = false;
                this._loading = false;
                return;
            }

            this.getRegistryData(registryId);
        });
    }

    public ngOnInit(): void {
    }

    public ngOnDestroy(): void {
        this._routeSubscription.unsubscribe();
    }

    public get loading(): boolean {
        return this._loading;
    }

    public get registry(): IRegistry {
        return this._registry;
    }
    
    public handleEnterKeyPress(event) {
        const tagName = event.target.tagName.toLowerCase();
        if (tagName !== 'textarea') {
            return false;
        }
    }

    public onEdit(): void {
        this._loading = true;
        if (this._isEdit) {
            this.callEdit();
        } else {
            this.callCreate();
        }
    }

    private callEdit(): void {
        this._lodgingService.update(this._registry).pipe(finalize(() => {
            this._loading = false;
        }), catchError(err => {
            this._notificationService.error('An error occurred!');
            return throwError(err);
        })).subscribe((registry: IRegistry) => {
            if (registry) {
                this._registry = new Registry(registry);
                this._notificationService.success('Successfully Updated Registry!');
            } else {
                this._notificationService.error('Unable to update Registry.');
            }
        });
    }

    private callCreate(): void {
        this._lodgingService.create(this._registry).pipe(finalize(() => {
            this._loading = false;
        }), catchError(err => {
            this._notificationService.error('An error occurred!');
            return throwError(err);
        })).subscribe((registry: IRegistry) => {
            if (registry) {
                this._registry = new Registry(registry);
                this._isEdit = true;
                this._notificationService.success('Successfully Created Registry!');
            } else {
                this._notificationService.error('Unable to create Registry.');
            }
        });
    }

    private getRegistryData(lodgingId: number): void {
        this._loading = true;
        this._lodgingService.getById(lodgingId).pipe(finalize(() => {
            this._loading = false;
        }), catchError(err => {
            this._notificationService.error('Could not get Registry.');
            return throwError(err);
        })).subscribe((registry: IRegistry) => {
            if (registry) {
                this._registry = new Registry(registry);
            } else {
                this._notificationService.warn('Could not successfully get Registry.');
            }
        });
    }

}
