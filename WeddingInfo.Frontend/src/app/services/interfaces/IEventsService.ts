import { EventDifficulty } from 'app/models/enums/EventDifficulty';
import { EventType } from 'app/models/enums/EventType';
import { IEvent } from 'app/models/interfaces/IEvent';
import { Observable } from 'rxjs';

export interface IEventsService {
    createEvent(event: IEvent): Observable<IEvent>;
    delete(id: number): Observable<boolean>;
    getAll(): Observable<IEvent[]>;
    getByDifficulty(difficulty: EventDifficulty): Observable<IEvent[]>;
    getByEventType(eventType: EventType): Observable<IEvent[]>;
    getById(id: number): Observable<IEvent>;
    getWeddingEvents(): Observable<IEvent[]>;
    updateEvent(event: IEvent): Observable<IEvent>;
    registerUser(eventId: number, userId: number): Observable<boolean>;
    unregisterUser(eventId: number, userId: number): Observable<boolean>;
}
