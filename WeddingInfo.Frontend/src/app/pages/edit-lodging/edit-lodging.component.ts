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
import { LodgingsService } from 'app/services/LodgingsService';
import { ILodgingsService } from 'app/services/interfaces/ILodgingsService';
import { ILodging } from 'app/models/interfaces/ILodging';
import { Lodging } from 'app/models/Lodging';

@Component({
    selector: 'app-edit-lodging',
    templateUrl: './edit-lodging.component.html',
    styleUrls: ['./edit-lodging.component.scss'],
    providers: [LodgingsService]
})
export class EditLodgingComponent implements OnInit, OnDestroy {
    @ViewChildren(SwiperComponent) private _componentRef?: SwiperComponent[];

    private readonly _lodgingService: ILodgingsService;
    private readonly _notificationService: NotificationsService;
    private readonly _routeSubscription: Subscription;

    private _loading: boolean;
    private _loadingMap: boolean;
    private _lodging: ILodging;
    private _swiperConfig: SwiperConfigInterface;
    private _players: any[];
    private _ytEvents: any[];
    private _isEdit: boolean;

    constructor(
        lodgingService: LodgingsService,
        notificationService: NotificationsService,
        route: ActivatedRoute
    ) {
        this._lodgingService = lodgingService;
        this._notificationService = notificationService;

        this._lodging = new Lodging();
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
            const lodgingIdParam: string = params['id'];
            const lodgingId: number = parseInt(lodgingIdParam);

            if (!(lodgingId > 0)) {
                this._isEdit = false;
                this._loading = false;
                return;
            }

            this.getLodgingData(lodgingId);
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

    public get lodging(): ILocation {
        return this._lodging;
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
        this._lodging.images.push(media);
    }

    public onDeleteImage(index: number): void {
        this._lodging.images.splice(index, 1);
        this.updateSwipers();
    }

    public onAddVideo(): void {
        let media: IMedia = new Media();
        media.mediaType = MediaType.Video;
        this._lodging.videos.push(media);
    }

    public onDeleteVideo(index: number): void {
        this._lodging.videos.splice(index, 1);
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
        this._lodging.address = address.formatted_address;
    }

    public onEdit(): void {
        this._loading = true;
        this._lodging.videos.forEach(v => {
            v.path = v.path.replace('https://youtu.be/', '');
        });
        if (this._isEdit) {
            this.callEdit();
        } else {
            this.callCreate();
        }
    }

    private callEdit(): void {
        this._lodgingService.update(this._lodging).pipe(finalize(() => {
            this._loading = false;
        }), catchError(err => {
            this._notificationService.error('An error occurred!');
            return throwError(err);
        })).subscribe((lodging: ILodging) => {
            if (lodging) {
                this._lodging = new Lodging(lodging);
                this._notificationService.success('Successfully Updated Location!');
            } else {
                this._notificationService.error('Unable to update Location.');
            }
        });
    }

    private callCreate(): void {
        this._lodgingService.create(this._lodging).pipe(finalize(() => {
            this._loading = false;
        }), catchError(err => {
            this._notificationService.error('An error occurred!');
            return throwError(err);
        })).subscribe((lodging: ILodging) => {
            if (lodging) {
                this._lodging = new Lodging(lodging);
                this._isEdit = true;
                this._notificationService.success('Successfully Created Location!');
            } else {
                this._notificationService.error('Unable to create Location.');
            }
        });
    }

    private getLodgingData(lodgingId: number): void {
        this._loading = true;
        this._lodgingService.getById(lodgingId).pipe(finalize(() => {
            this._loading = false;
        }), catchError(err => {
            this._notificationService.error('Could not get Location.');
            return throwError(err);
        })).subscribe((lodging: ILodging) => {
            if (lodging) {
                this._lodging = new Lodging(lodging);
            } else {
                this._notificationService.warn('Could not successfully get Location.');
            }
        });
    }

}
