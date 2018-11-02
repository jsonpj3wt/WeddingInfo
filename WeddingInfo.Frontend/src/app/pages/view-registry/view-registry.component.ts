import { Component, OnInit, ViewChildren, ViewChild } from '@angular/core';
import { NotificationsService } from 'angular2-notifications';
import { finalize, catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { AuthManager } from 'app/config/AuthManager';
import { Router } from '@angular/router';
import { MzModalComponent } from 'ngx-materialize';
import { RegistriesService } from 'app/services/RegistriesService';
import { IRegistriesService } from 'app/services/interfaces/IRegistriesService';
import { IRegistry } from 'app/models/interfaces/IRegistry';
import { Registry } from 'app/models/Registry';

@Component({
    selector: 'app-view-registry',
    templateUrl: './view-registry.component.html',
    styleUrls: ['./view-registry.component.scss'],
    providers: [RegistriesService]
})
export class ViewRegistryComponent implements OnInit {
    @ViewChildren('basicModal') private _basicModals?: MzModalComponent[];

    private readonly _authManager: AuthManager;
    private readonly _registryService: IRegistriesService;
    private readonly _notificationService: NotificationsService;
    private readonly _router: Router;

    private _registries: IRegistry[];
    private _loading: boolean;

    constructor(
        authManager: AuthManager,
        registryService: RegistriesService,
        notificationService: NotificationsService,
        router: Router
    ) {
        this._authManager = authManager;
        this._registryService = registryService;
        this._notificationService = notificationService;
        this._router = router;

        this._registries = [];

        this._loading = true;
    }

    public ngOnInit(): void {
        this._loading = true;
        this._registryService.getAll().pipe(finalize(() => {
            this._loading = false;
        }), catchError(err => {
            this._notificationService.error('Could not get RSVPs.');
            return throwError(err);
        })).subscribe((registries: IRegistry[]) => {
            if (registries) {
                this._registries = registries.map(l => {
                    return new Registry(l);
                });
            } else {
                this._notificationService.warn('Could not successfully get RSVPs.');
            }
        });
    }

    public get admin(): boolean {
        return this._authManager.activeUser && this._authManager.activeUser.isAdmin || false;
    }

    public get loading(): boolean {
        return this._loading;
    }

    public get registries(): IRegistry[] {
        return this._registries;
    }

    public onEdit(id: number) {
        this._router.navigate(['editRegistry/' + id]);
    }

    public onDeleteConfirm(index: number) {
        this._basicModals.forEach((m: MzModalComponent, mIndex: number) => {
            if (index === mIndex) {
                m.openModal();
                return;
            }
        });
    }

    public onDelete(id: number) {
        const registryIndex = this._registries.findIndex(loc => loc.id === id);
        if (registryIndex < 0) {
            this._notificationService.error('Could not Delete Registry.');
            return;
        }
        this._loading = true;
        this._registryService.delete(id).pipe(finalize(() => {
            this._loading = false;
        }), catchError(err => {
            this._notificationService.error('Could not Delete Registry.');
            return throwError(err);
        })).subscribe((success: boolean) => {
            if (success) {
                this._registries.splice(registryIndex, 1);
                this._notificationService.success('Registry Deleted!');
            } else {
                this._notificationService.warn('Could not successfully delete Registry.');
            }
        });
    }

}
