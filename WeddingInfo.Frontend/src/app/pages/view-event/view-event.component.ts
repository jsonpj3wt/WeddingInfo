import { AuthManager } from 'app/config/AuthManager';
import { Component, OnInit, ViewChildren, ViewChild } from '@angular/core';
import { Event } from 'app/models/Event';
import { EventDifficulty } from 'app/models/enums/EventDifficulty';
import { EventsService } from 'app/services/EventsService';
import { EventType } from 'app/models/enums/EventType';
import { finalize, catchError } from 'rxjs/operators';
import { IEvent } from 'app/models/interfaces/IEvent';
import { IEventsService } from 'app/services/interfaces/IEventsService';
import { IUser } from 'app/models/interfaces/IUser';
import { MzModalComponent } from 'ngx-materialize';
import { NotificationsService } from 'angular2-notifications';
import { Router } from '@angular/router';
import { SwiperConfigInterface, SwiperComponent } from 'ngx-swiper-wrapper';
import { throwError } from 'rxjs';

@Component({
    selector: 'app-view-event',
    templateUrl: './view-event.component.html',
    styleUrls: ['./view-event.component.scss'],
    providers: [EventsService]
})
export class ViewEventComponent implements OnInit {
    @ViewChildren(SwiperComponent) private _componentRef?: SwiperComponent[];
    @ViewChildren('imageSwiper') private _imageSwiperRef?: SwiperComponent[];
    @ViewChildren('basicModal') private _basicModals?: MzModalComponent[];
    @ViewChild('imageModal') private _imageModal?: MzModalComponent;

    private readonly _authManager: AuthManager;
    private readonly _eventService: IEventsService;
    private readonly _notificationService: NotificationsService;
    private readonly _router: Router;

    private _filteredEventType: EventType;
    private _filteredEventDifficulty: EventDifficulty;
    private _filteredWeddingType: string;

    private _swiperConfig: SwiperConfigInterface;
    private _events: IEvent[];
    private _loading: boolean;
    private _loadingRegister: boolean;
    private _modalImageSrc: string;

    private _players: any[];
    private _ytEvents: any[];

    constructor(
        authManager: AuthManager,
        eventService: EventsService,
        notificationService: NotificationsService,
        router: Router
    ) {
        this._authManager = authManager;
        this._eventService = eventService;
        this._notificationService = notificationService;
        this._router = router;

        this._filteredEventType = null;
        this._filteredEventDifficulty = null;
        this._filteredWeddingType = 'Neither';

        this._modalImageSrc = '';
        this._events = [];
        this._ytEvents = [];
        this._players = [];

        this._swiperConfig = {
            navigation: true,
            slidesPerView: 'auto',
            centeredSlides: true,
            spaceBetween: 30
        };

        this._loading = true;
        this._loadingRegister = false;
    }

    public get swiperConfig(): SwiperConfigInterface {
        return this._swiperConfig;
    }

    public ngOnInit(): void {
        this.getAll();
    }

    public get admin(): boolean {
        return this._authManager.activeUser && this._authManager.activeUser.isAdmin || false;
    }

    public get canRegister(): boolean {
        let isRegistered: boolean = false;
        const currentUserId = this._authManager.activeUser && this._authManager.activeUser.id || -1;
        this._events.forEach((evt) => {
            isRegistered = evt.guests.findIndex(u => u.id === currentUserId) >= 0 || isRegistered;
        });
        return !isRegistered;
    }

    public get loading(): boolean {
        return this._loading;
    }

    public get loadingRegister(): boolean {
        return this._loadingRegister;
    }

    public get events(): IEvent[] {
        return this._events;
    }

    public get eventTypes(): string[] {
        let eventTypes: string[] = [];
        for (const enumMember in EventType) {
            if (parseInt(enumMember, 10) >= 0) {
                eventTypes.push(EventType[enumMember]);
            }
        }
        eventTypes.unshift('None');
        return eventTypes;
    }

    public get eventDifficulties(): string[] {
        let eventDifficulties: string[] = [];
        for (const enumMember in EventDifficulty) {
            if (parseInt(enumMember, 10) >= 0) {
                eventDifficulties.push(EventDifficulty[enumMember]);
            }
        }
        eventDifficulties.unshift('None');
        return eventDifficulties;
    }

    public get filteredEventType(): EventType {
        return this._filteredEventType;
    }

    public set filteredEventType(v: EventType) {
        this._filteredEventType = v;
        this._filteredEventDifficulty = null;
        this._filteredWeddingType = 'Neither';
    }

    public get filteredEventDifficulty(): EventDifficulty {
        return this._filteredEventDifficulty;
    }

    public set filteredEventDifficulty(v: EventDifficulty) {
        this._filteredEventDifficulty = v;
        this._filteredEventType = null;
        this._filteredWeddingType = 'Neither';
    }

    public get filteredWeddingType(): string {
        return this._filteredWeddingType;
    }
    
    public set filteredWeddingType(v: string) {
        this._filteredWeddingType = v;
        this._filteredEventType = null;
        this._filteredEventDifficulty = null;
    }

    public get weddingOptions(): string[] {
        return ['Neither', 'Wedding Only'];
    }
    
    public get modalImageSrc(): string {
        return this._modalImageSrc;
    }

    public eventType(eventIndex: number): string {
        return EventType[this._events[eventIndex].eventType];
    }

    public eventDifficulty(eventIndex: number): string {
        return EventDifficulty[this._events[eventIndex].eventDifficulty];
    }

    public userName(usr: IUser): string {
        return `${usr.firstName} ${usr.lastName}`;
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

    public onFilter(): void {
        if (this._filteredEventType && this._filteredEventType.toString() !== 'None') {
            this.filterByEventType();
        } else if (this._filteredEventDifficulty && this._filteredEventDifficulty.toString() !== 'None') {
            this.filterByEventDifficulty();
        } else if(this._filteredWeddingType !== 'Neither') {
            this.filterByWeddingType();
        } else {
            this.getAll();
        }
    }

    public onEdit(id: number) {
        this._router.navigate(['editEvent/' + id]);
    }

    public onDeleteConfirm(index: number) {
        this._basicModals.forEach((m: MzModalComponent, mIndex: number) => {
            if (index === mIndex) {
                m.openModal();
                return;
            }
        });
    }

    public onDelete(id: number): void {
        const eventIndex = this._events.findIndex(evt => evt.id === id);
        if (eventIndex < 0) {
            this._notificationService.error('Could not Delete Event.');
            return;
        }
        this._loading = true;
        this._eventService.delete(id).pipe(finalize(() => {
            this._loading = false;
            this.updateSwipers();
        }), catchError(err => {
            this._notificationService.error('Could not Delete Event.');
            return throwError(err);
        })).subscribe((success: boolean) => {
            if (success) {
                this._events.splice(eventIndex, 1);
                this.updateSwipers();
                this._notificationService.success('Event Deleted!');
            } else {
                this._notificationService.warn('Could not successfully delete Event.');
            }
        });
    }

    public updateSwipers(): void {
        setTimeout(() => {
            this._componentRef.forEach((scomp) => {
                scomp.directiveRef.update();
            });
            this._imageSwiperRef.forEach((scomp) => {
                scomp.directiveRef.update();
            });
        }, 500);
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
            this._modalImageSrc = this._events[index].images[swiper.directiveRef.getIndex()].path;
            this._imageModal.openModal();
        }
    }

    public onIndexChange(): void {
        this._players.forEach(p => p.pauseVideo());
    }

    public onRegister(eventId: number, eventIndex: number): void {
        const user = this._authManager.activeUser;
        this._events[eventIndex].guests.push(user);
        this.registerUser(eventId, user.id);
    }

    public onUnregister(eventId: number, eventIndex: number): void {
        const user = this._authManager.activeUser;
        const guestIndex = this._events[eventIndex].guests.findIndex(g => g.id === user.id);
        this._events[eventIndex].guests.splice(guestIndex, 1);
        this.unregisterUser(eventId, user.id);
    }

    private registerUser(eventId: number, userId: number): void {
        this._loadingRegister = true;
        this._eventService.registerUser(eventId, userId).pipe(finalize(() => {
            this._loadingRegister = false;
            this.updateSwipers();
        }), catchError(err => {
            this._notificationService.error('Could not Register.');
            return throwError(err);
        })).subscribe((success: boolean) => {
            if (success) {
                this._notificationService.success('Registered with Event!');
            } else {
                this._notificationService.warn('Could not successfully Register.');
            }
        });
    }

    private unregisterUser(eventId: number, userId: number): void {
        this._loadingRegister = true;
        this._eventService.unregisterUser(eventId, userId).pipe(finalize(() => {
            this._loadingRegister = false;
            this.updateSwipers();
        }), catchError(err => {
            this._notificationService.error('Could not Unregister.');
            return throwError(err);
        })).subscribe((success: boolean) => {
            if (success) {
                this._notificationService.success('Unregistered with Event!');
            } else {
                this._notificationService.warn('Could not successfully Unregister.');
            }
        });
    }

    private filterByEventType(): void {
        this._loading = true;
        this._eventService.getByEventType(this._filteredEventType).pipe(finalize(() => {
            this._loading = false;
            this.updateSwipers();
        }), catchError(err => {
            this._notificationService.error('Could not get RSVPs.');
            return throwError(err);
        })).subscribe((events: IEvent[]) => {
            if (events) {
                this._events = events.map(l => {
                    return new Event(l);
                });
            } else {
                this._notificationService.warn('Could not successfully get RSVPs.');
            }
        });
    }

    private filterByEventDifficulty(): void {
        this._loading = true;
        this._eventService.getByDifficulty(this._filteredEventDifficulty).pipe(finalize(() => {
            this._loading = false;
            this.updateSwipers();
        }), catchError(err => {
            this._notificationService.error('Could not get RSVPs.');
            return throwError(err);
        })).subscribe((events: IEvent[]) => {
            if (events) {
                this._events = events.map(l => {
                    return new Event(l);
                });
            } else {
                this._notificationService.warn('Could not successfully get RSVPs.');
            }
        });
    }

    private filterByWeddingType(): void {
        this._loading = true;
        this._eventService.getWeddingEvents().pipe(finalize(() => {
            this._loading = false;
            this.updateSwipers();
        }), catchError(err => {
            this._notificationService.error('Could not get RSVPs.');
            return throwError(err);
        })).subscribe((events: IEvent[]) => {
            if (events) {
                this._events = events.map(l => {
                    return new Event(l);
                });
            } else {
                this._notificationService.warn('Could not successfully get RSVPs.');
            }
        });
    }

    private getAll(): void {
        this._loading = true;
        this._eventService.getAll().pipe(finalize(() => {
            this._loading = false;
            this.updateSwipers();
        }), catchError(err => {
            this._notificationService.error('Could not get RSVPs.');
            return throwError(err);
        })).subscribe((events: IEvent[]) => {
            if (events) {
                this._events = events.map(l => {
                    return new Event(l);
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

}
