import { ActivatedRoute } from '@angular/router';
import { Address } from 'ngx-google-places-autocomplete/objects/address';
import { AuthManager } from 'app/config/AuthManager';
import { Component, OnInit, ViewChildren, OnDestroy } from '@angular/core';
import { Event } from 'app/models/Event';
import { EventDifficulty } from 'app/models/enums/EventDifficulty';
import { EventsService } from 'app/services/EventsService';
import { EventType } from 'app/models/enums/EventType';
import { finalize, catchError } from 'rxjs/operators';
import { IEvent } from 'app/models/interfaces/IEvent';
import { IEventsService } from 'app/services/interfaces/IEventsService';
import { IMedia } from 'app/models/interfaces/IMedia';
import { ISwiperMedia } from 'app/models/clientModels/interfaces/ISwiperMedia';
import { Media } from 'app/models/Media';
import { MediaType } from 'app/models/enums/MediaType';
import { NotificationsService } from 'angular2-notifications';
import { SwiperConfigInterface, SwiperComponent } from 'ngx-swiper-wrapper';
import { throwError, Subscription } from 'rxjs';

@Component({
    selector: 'app-edit-event',
    templateUrl: './edit-event.component.html',
    styleUrls: ['./edit-event.component.scss'],
    providers: [EventsService]
})
export class EditEventComponent implements OnInit, OnDestroy {

    @ViewChildren(SwiperComponent) private _componentRef?: SwiperComponent[];

    private readonly _authManager: AuthManager;
    private readonly _eventService: IEventsService;
    private readonly _notificationService: NotificationsService;
    private readonly _routeSubscription: Subscription;

    private _swiperConfig: SwiperConfigInterface;
    private _swiperMedia: ISwiperMedia[];
    private _event: IEvent;
    private _loading: boolean;
    private _loadingMap: boolean;
    private _players: any[];
    private _ytEvents: any[];
    private _dateOptions: Pickadate.DateOptions;
    private _isEdit: boolean;
    private _timeConfig: Pickadate.TimeOptions;
    private _pickedTime: string;

    constructor(
        authManager: AuthManager,
        eventService: EventsService,
        notificationService: NotificationsService,
        route: ActivatedRoute
    ) {
        this._authManager = authManager;
        this._eventService = eventService;
        this._notificationService = notificationService;
        this._swiperMedia = [];
        this._event = new Event();

        this._swiperConfig = {
            navigation: true,
            slidesPerView: 'auto',
            centeredSlides: true
        };

        this._timeConfig = {
            default: 'now', // Set default time: 'now', '1:30AM', '16:30'
            fromnow: 0,       // set default time to * milliseconds from now (using with default = 'now')
            twelvehour: false, // Use AM/PM or 24-hour format
            donetext: 'OK', // text for done-button
            cleartext: 'Clear', // text for clear-button
            canceltext: 'Cancel', // Text for cancel-button
            autoclose: true, // automatic close timepicker
            ampmclickable: true, // make AM PM clickable
          };

        this._dateOptions = {
            format: 'dddd, dd mmm, yyyy',
            formatSubmit: 'yyyy-mm-dd',
        };

        this._loadingMap = true;
        this._loading = false;
        this._players = [];
        this._ytEvents = [];
        this._isEdit = true;

        this._routeSubscription = route.params.subscribe(params => {
            const eventIdParam: string = params['id'];
            const eventId: number = parseInt(eventIdParam);

            if (!(eventId > 0)) {
                this._isEdit = false;
                this._loading = false;
                return;
            }

            this.getEventData(eventId);
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

    public get admin(): boolean {
        return this._authManager.activeUser && this._authManager.activeUser.isAdmin || false;
    }

    public get dateOptions(): Pickadate.Options {
        return this._dateOptions;
    }

    public get swiperConfig(): SwiperConfigInterface {
        return this._swiperConfig;
    }

    public get loading(): boolean {
        return this._loading;
    }

    public get loadingMap(): boolean {
        return this._loadingMap;
    }

    public get theEvent(): IEvent {
        return this._event;
    }

    public get swiperMedia(): ISwiperMedia[] {
        return this._swiperMedia;
    }

    public get timeConfig(): Pickadate.TimeOptions {
        return this._timeConfig;
    }

    public get pickedTime(): string {
        return this._pickedTime;
    }

    public set pickedTime(v: string) {
        this._pickedTime = v;
        if (this._pickedTime) {
            const hours = parseInt(this._pickedTime.substr(0, 2));
            const minutes = parseInt(this._pickedTime.substr(3, 2));
            if (this._pickedTime.indexOf('PM') >= 0) {
                this._event.occurance.setHours(hours + 12);
            }
            else {
                this._event.occurance.setHours(hours);
            }
            this._event.occurance.setMinutes(minutes);

            this._event.occurance = new Date(
                Date.UTC(this._event.occurance.getFullYear(),
                this._event.occurance.getMonth(),
                this._event.occurance.getDate(),
                this._event.occurance.getHours(),
                this._event.occurance.getMinutes(),
                this._event.occurance.getSeconds())
            );
        }
        
    }

    public get eventTypes(): string[] {
        let eventTypes: string[] = [];
        for (const enumMember in EventType) {
            if (parseInt(enumMember, 10) >= 0) {
                eventTypes.push(EventType[enumMember]);
            }
        }
        return eventTypes;
    }

    public get eventDifficulties(): string[] {
        let eventDifficulties: string[] = [];
        for (const enumMember in EventDifficulty) {
            if (parseInt(enumMember, 10) >= 0) {
                eventDifficulties.push(EventDifficulty[enumMember]);
            }
        }
        return eventDifficulties;
    }

    public handleEnterKeyPress(event) {
        const tagName = event.target.tagName.toLowerCase();
        if (tagName !== 'textarea') {
            return false;
        }
    }

    public handleAddressChange(address: Address): void {
        this._event.address = address.formatted_address;
    }

    public onAddImage(): void {
        const media: IMedia = new Media();
        this._event.images.push(media);
    }

    public onDeleteImage(index: number): void {
        this._event.images.splice(index, 1);
        this.updateSwipers();
    }

    public onAddVideo(): void {
        let media: IMedia = new Media();
        media.mediaType = MediaType.Video;
        this._event.videos.push(media);
    }

    public onDeleteVideo(index: number): void {
        this._event.videos.splice(index, 1);
        this.updateSwipers();
    }


    public updateSwipers(): void {
        this._componentRef.forEach((scomp) => {
            scomp.directiveRef.update();
        });
    }

    public onEdit(): void {
        this._loading = true;
        this._event.videos.forEach(v => {
            v.path = v.path.replace('https://youtu.be/', '');
        });
        if (this._isEdit) {
            this.callEdit();
        } else {
            this.callCreate();
        }
    }

    private callEdit(): void {
        this._eventService.updateEvent(this._event).pipe(finalize(() => {
            this._loading = false;
        }), catchError(err => {
            this._notificationService.error('An error occurred!');
            return throwError(err);
        })).subscribe((evnt: IEvent) => {
            if (evnt) {
                this._event = new Event(evnt);
                this._notificationService.success('Successfully Updated Event!');
            } else {
                this._notificationService.error('Unable to update Event.');
            }
        });
    }

    private callCreate(): void {
        this._eventService.createEvent(this._event).pipe(finalize(() => {
            this._loading = false;
        }), catchError(err => {
            this._notificationService.error('An error occurred!');
            return throwError(err);
        })).subscribe((evnt: IEvent) => {
            if (evnt) {
                this._event = new Event(evnt);
                this._isEdit = true;
                this._notificationService.success('Successfully Created Event!');
            } else {
                this._notificationService.error('Unable to create Event.');
            }
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

    public onIndexChange(): void {
        this._players.forEach(p => p.pauseVideo());
    }

    private getEventData(eventId: number): void {
        this._loading = true;
        this._eventService.getById(eventId).pipe(finalize(() => {
            this._loading = false;
        }), catchError(err => {
            this._notificationService.error('Could not get Location.');
            return throwError(err);
        })).subscribe((evnt: IEvent) => {
            if (evnt) {
                this._event = new Event(evnt);
            } else {
                this._notificationService.warn('Could not successfully get Location.');
            }
        });
    }

}
