import { IEventsService } from './interfaces/IEventsService';
import { Injectable } from '@angular/core';
import { ApiTools } from './data-access/ApiTools';
import { AuthManager } from 'app/config/AuthManager';
import { Http } from '@angular/http';
import { Router } from '@angular/router';
import { NotificationsService } from 'angular2-notifications';
import { IEvent } from 'app/models/interfaces/IEvent';
import { Observable } from 'rxjs';
import { EventDifficulty } from 'app/models/enums/EventDifficulty';
import { EventType } from 'app/models/enums/EventType';
import { map } from 'rxjs/operators';
@Injectable()
export class EventsService implements IEventsService {
    private _apiTools: ApiTools;

    public constructor(
        authManager: AuthManager,
        http: Http,
        router: Router,
        notificationService: NotificationsService
    ) {
        this._apiTools = new ApiTools('api/events', authManager, http, notificationService, router);
    }

    public delete(id: number): Observable<boolean> {
        const route: string = `${id}`;
        return this._apiTools.delete(route).pipe(map((body: any) => {
            return body || false;
        }));
    }

    public getAll(): Observable<IEvent[]> {
        const route: string = ``;
        return this._apiTools.get(route).pipe(map((body: any) => {
            return body || false;
        }));
    }

    public getByDifficulty(difficulty: EventDifficulty): Observable<IEvent[]> {
        const route: string = `difficulty/${difficulty}`;
        return this._apiTools.get(route).pipe(map((body: any) => {
            return body || false;
        }));
    }

    public getByEventType(eventType: EventType): Observable<IEvent[]> {
        const route: string = `type/${eventType}`;
        return this._apiTools.get(route).pipe(map((body: any) => {
            return body || false;
        }));
    }

    public getById(id: number): Observable<IEvent> {
        const route: string = `${id}`;
        return this._apiTools.get(route).pipe(map((body: any) => {
            return body || false;
        }));
    }

    public getWeddingEvents(): Observable<IEvent[]> {
        const route: string = `wedding`;
        return this._apiTools.get(route).pipe(map((body: any) => {
            return body || false;
        }));
    }

    public updateEvent(event: IEvent): Observable<IEvent> {
        const route: string = ``;
        return this._apiTools.put(route, event).pipe(map((body: any) => {
            return body || false;
        }));
    }

    public createEvent(event: IEvent): Observable<IEvent> {
        const route: string = ``;
        return this._apiTools.post(route, event).pipe(map((body: any) => {
            return body || false;
        }));
    }

    public registerUser(eventId: number, userId: number): Observable<boolean> {
        const route: string = `registerUser`;
        const registerObj = {
            eventId: eventId,
            userId: userId
        };
        return this._apiTools.put(route, registerObj).pipe(map((body: any) => {
            return body || false;
        }));
    }
    public unregisterUser(eventId: number, userId: number): Observable<boolean> {
        const route: string = `unregisterUser`;
        const unregisterObj = {
            eventId: eventId,
            userId: userId
        };
        return this._apiTools.put(route, unregisterObj).pipe(map((body: any) => {
            return body || false;
        }));
    }

}
