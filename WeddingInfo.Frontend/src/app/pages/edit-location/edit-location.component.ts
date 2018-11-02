import { Component, OnDestroy, OnInit, ViewChildren } from '@angular/core';
import { Subscription, throwError } from 'rxjs';
import { LocationsService } from 'app/services/LocationsService';
import { ILocationsService } from 'app/services/interfaces/ILocationsService';
import { NotificationsService } from 'angular2-notifications';
import { ILocation } from 'app/models/interfaces/ILocation';
import { ActivatedRoute } from '@angular/router';
import { finalize, catchError } from 'rxjs/operators';
import { Location } from 'app/models/Location';
import { Address } from 'ngx-google-places-autocomplete/objects/address';
import { IMedia } from 'app/models/interfaces/IMedia';
import { MediaType } from 'app/models/enums/MediaType';
import { Media } from 'app/models/Media';
import { SwiperConfigInterface, SwiperComponent } from 'ngx-swiper-wrapper';

@Component({
    selector: 'app-edit-location',
    templateUrl: './edit-location.component.html',
    styleUrls: ['./edit-location.component.scss'],
    providers: [LocationsService]
})
export class EditLocationComponent implements OnInit, OnDestroy {
    @ViewChildren(SwiperComponent) private _componentRef?: SwiperComponent[];

    private readonly _locationService: ILocationsService;
    private readonly _notificationService: NotificationsService;
    private readonly _routeSubscription: Subscription;

    private _loading: boolean;
    private _loadingMap: boolean;
    private _location: ILocation;
    private _swiperConfig: SwiperConfigInterface;
    private _players: any[];
    private _ytEvents: any[];
    private _isEdit: boolean;

    constructor(
        locationService: LocationsService,
        notificationService: NotificationsService,
        route: ActivatedRoute
    ) {
        this._locationService = locationService;
        this._notificationService = notificationService;

        this._location = new Location();
        this._players = [];
        this._ytEvents = [];
        this._loading = true;
        this._loadingMap = true;
        this._isEdit = true;

        this._swiperConfig = {
            navigation: true,
            slidesPerView: 'auto',
            centeredSlides: true
        };

        this._routeSubscription = route.params.subscribe(params => {
            const locationIdParam: string = params['id'];
            const locationId: number = parseInt(locationIdParam);

            if (!(locationId > 0)) {
                this._isEdit = false;
                this._loading = false;
                return;
            }

            this.getLocationData(locationId);
        });
    }

    public ngOnInit(): void {
        setTimeout(() => {
            this._loadingMap = false;
        }, 500);
    }

    public ngOnDestroy(): void {
        this._routeSubscription.unsubscribe();
    }

    public get loading(): boolean {
        return this._loading;
    }

    public get loadingMap(): boolean {
        return this._loadingMap;
    }

    public get location(): ILocation {
        return this._location;
    }

    public get swiperConfig(): SwiperConfigInterface {
        return this._swiperConfig;
    }
    
    public handleEnterKeyPress(event) {
        const tagName = event.target.tagName.toLowerCase();
        if (tagName !== 'textarea') {
            return false;
        }
    }

    public onAddImage(): void {
        const media: IMedia = new Media();
        this._location.images.push(media);
    }

    public onDeleteImage(index: number): void {
        this._location.images.splice(index, 1);
        this.updateSwipers();
    }

    public onAddVideo(): void {
        let media: IMedia = new Media();
        media.mediaType = MediaType.Video;
        this._location.videos.push(media);
    }

    public onDeleteVideo(index: number): void {
        this._location.videos.splice(index, 1);
        this.updateSwipers();
    }

    public updateSwipers(): void {
        this._componentRef.forEach((scomp) => {
            scomp.directiveRef.update();
        });
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

    public onIndexChange(index: number): void {
        this._players.forEach(p => p.pauseVideo());
    }

    public handleAddressChange(address: Address): void {
        this._location.address = address.formatted_address;
    }

    public onEdit(): void {
        this._loading = true;
        this._location.videos.forEach(v => {
            v.path = v.path.replace('https://youtu.be/', '');
        });
        if (this._isEdit) {
            this.callEdit();
        } else {
            this.callCreate();
        }
    }

    private callEdit(): void {
        this._locationService.updateLocation(this._location).pipe(finalize(() => {
            this._loading = false;
        }), catchError(err => {
            this._notificationService.error('An error occurred!');
            return throwError(err);
        })).subscribe((location: ILocation) => {
            if (location) {
                this._location = new Location(location);
                this._notificationService.success('Successfully Updated Location!');
            } else {
                this._notificationService.error('Unable to update Location.');
            }
        });
    }

    private callCreate(): void {
        this._locationService.createLocation(this._location).pipe(finalize(() => {
            this._loading = false;
        }), catchError(err => {
            this._notificationService.error('An error occurred!');
            return throwError(err);
        })).subscribe((location: ILocation) => {
            if (location) {
                this._location = new Location(location);
                this._isEdit = true;
                this._notificationService.success('Successfully Created Location!');
            } else {
                this._notificationService.error('Unable to create Location.');
            }
        });
    }

    private getLocationData(locationId: number): void {
        this._loading = true;
        this._locationService.getById(locationId).pipe(finalize(() => {
            this._loading = false;
        }), catchError(err => {
            this._notificationService.error('Could not get Location.');
            return throwError(err);
        })).subscribe((location: ILocation) => {
            if (location) {
                this._location = new Location(location);
            } else {
                this._notificationService.warn('Could not successfully get Location.');
            }
        });
    }

}
