import { Component, OnInit, ViewChildren, ViewChild } from '@angular/core';
import { ILocation } from 'app/models/interfaces/ILocation';
import { Location } from 'app/models/Location';
import { LocationsService } from 'app/services/LocationsService';
import { ILocationsService } from 'app/services/interfaces/ILocationsService';
import { NotificationsService } from 'angular2-notifications';
import { finalize, catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { SwiperConfigInterface, SwiperComponent } from 'ngx-swiper-wrapper';
import { AuthManager } from 'app/config/AuthManager';
import { Router } from '@angular/router';
import { MzModalComponent } from 'ngx-materialize';

@Component({
    selector: 'app-view-location',
    templateUrl: './view-location.component.html',
    styleUrls: ['./view-location.component.scss'],
    providers: [LocationsService]
})
export class ViewLocationComponent implements OnInit {
    @ViewChildren(SwiperComponent) private _componentRef?: SwiperComponent[];
    @ViewChildren('imageSwiper') private _imageSwiperRef?: SwiperComponent[];
    @ViewChildren('basicModal') private _basicModals?: MzModalComponent[];
    @ViewChild('imageModal') private _imageModal?: MzModalComponent;

    private readonly _authManager: AuthManager;
    private readonly _locationService: ILocationsService;
    private readonly _notificationService: NotificationsService;
    private readonly _router: Router;

    private _swiperConfig: SwiperConfigInterface;
    private _locations: ILocation[];
    private _loading: boolean;
    private _modalImageSrc: string;

    private _players: any[];
    private _ytEvents: any[];

    constructor(
        authManager: AuthManager,
        locationService: LocationsService,
        notificationService: NotificationsService,
        router: Router
    ) {
        this._authManager = authManager;
        this._locationService = locationService;
        this._notificationService = notificationService;
        this._router = router;

        this._modalImageSrc = '';
        this._locations = [];
        this._ytEvents = [];
        this._players = [];

        this._swiperConfig = {
            navigation: true,
            slidesPerView: 'auto',
            centeredSlides: true,
            spaceBetween: 30
        };

        this._loading = true;
    }

    public get swiperConfig(): SwiperConfigInterface {
        return this._swiperConfig;
    }

    public ngOnInit(): void {
        this._loading = true;
        this._locationService.getAll().pipe(finalize(() => {
            this._loading = false;
            this.updateSwipers();
        }), catchError(err => {
            this._notificationService.error('Could not get RSVPs.');
            return throwError(err);
        })).subscribe((locations: ILocation[]) => {
            if (locations) {
                this._locations = locations.map(l => {
                    return new Location(l);
                });
                setTimeout(() => {
                    $('.collapsible-header').click(() => {
                        this.updateSwipers();
                    });
                }, 500);
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

    public get locations(): ILocation[] {
        return this._locations;
    }

    public get modalImageSrc(): string {
        return this._modalImageSrc;
    }

    public onStateChange(event): void {
        if (this._ytEvents.findIndex(y => y === event) === -1) {
            this._ytEvents.push(event.data);
        }
    }
    public savePlayer(player): void {
        if (this._players.findIndex(p => p === player) === -1) {
            this._players.push(player);
        }
    }

    public onEdit(id: number): void {
        this._router.navigate(['editLocation/' + id]);
    }

    public onIndexChange(): void {
        this._players.forEach(p => p.pauseVideo());
    }

    public onSwiperClick(index: number): void {
        let swiper: SwiperComponent = null;
        this._imageSwiperRef.forEach((s: SwiperComponent, sIndex: number) => {
            if (index === sIndex) {
                swiper = s;
                return;
            }
        });

        if (swiper) {
            this._modalImageSrc = this._locations[index].images[swiper.directiveRef.getIndex()].path;
            this._imageModal.openModal();
        }
    }

    public onDeleteConfirm(index: number): void {
        this._basicModals.forEach((m: MzModalComponent, mIndex: number) => {
            if (index === mIndex) {
                m.openModal();
                return;
            }
        });
    }

    public onDelete(id: number): void {
        const locationIndex = this._locations.findIndex(loc => loc.id === id);
        if (locationIndex < 0) {
            this._notificationService.error('Could not Delete Location.');
            return;
        }
        this._loading = true;
        this._locationService.delete(id).pipe(finalize(() => {
            this._loading = false;
            this.updateSwipers();
        }), catchError(err => {
            this._notificationService.error('Could not Delete Location.');
            return throwError(err);
        })).subscribe((success: boolean) => {
            if (success) {
                this._locations.splice(locationIndex, 1);
                this.updateSwipers();
                this._notificationService.success('Location Deleted!');
            } else {
                this._notificationService.warn('Could not successfully delete Location.');
            }
        });
    }

    public updateSwipers(): void {
        console.log('update swiper');
        setTimeout(() => {
            this._componentRef.forEach((scomp) => {
                scomp.directiveRef.update();
            });
            this._imageSwiperRef.forEach((scomp) => {
                scomp.directiveRef.update();
            });
        }, 500);
    }

}
