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
        this.getAll();
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

    public onBringUp(id: number): void {
        const eventIndex: number = this._registries.findIndex(e => e.id === id);
        if (eventIndex >= 0) {
            this._registries[eventIndex].order--;
            this.saveOrder(this._registries[eventIndex]);
            if (eventIndex > 0) {
                this._registries[eventIndex - 1].order++;
                this.saveOrder(this._registries[eventIndex]);
            }
        }
        this._registries = this._registries.sort(e => e.order);
    }

    public onLower(id: number): void {
        const eventIndex: number = this._registries.findIndex(e => e.id === id);
        if (eventIndex >= 0) {
            this._registries[eventIndex].order++;
            this.saveOrder(this._registries[eventIndex]);
            if (eventIndex < this._registries.length) {
                this._registries[eventIndex + 1].order--;
                this.saveOrder(this._registries[eventIndex]);
            }
        }
        this._registries = this._registries.sort(e => e.order);
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

    private getAll(): void {
        this._loading = true;
        this._registryService.getAll().pipe(finalize(() => {
            this._loading = false;
        }), catchError(err => {
            this._notificationService.error('Could not get registries.');
            return throwError(err);
        })).subscribe((registries: IRegistry[]) => {
            if (registries) {
                this._registries = registries.map(l => {
                    return new Registry(l);
                }).sort(r => r.order);
            } else {
                this._notificationService.warn('Could not successfully get registries.');
            }
        });
    }

    private saveOrder(registry: IRegistry): void {
        this._loading = true;
        this._registryService.update(registry).pipe(finalize(() => {
            this._loading = false;
        }), catchError(err => {
            this._notificationService.error('Could not save ordering.');
            return throwError(err);
        })).subscribe((reg: IRegistry) => {
            if (!reg) {
                this._notificationService.warn('Could not successfully save ordering.');
            }
        });
    }

}
