import { IEvent } from './interfaces/IEvent';
import { IUser } from './interfaces/IUser';
import { EventType } from './enums/EventType';
import { EventDifficulty } from './enums/EventDifficulty';
import { User } from './User';
import { IMedia } from './interfaces/IMedia';

export class Event implements IEvent {
    public id: number;
    public name: string;
    description: string;
    public occurance: Date;
    public address: string;
    public guests: IUser[];
    public images: IMedia[];
    public videos: IMedia[];
    public eventType: EventType;
    public eventDifficulty: EventDifficulty;
    public isWeddingEvent: boolean;
    public isWeddingPartyEvent: boolean;

    public constructor(event?: IEvent) {
        this.id = event && event.id || 0;
        this.name = event && event.name || '';
        this.description = event && event.description || '';
        this.occurance = event && event.occurance && new Date(event.occurance) || new Date();
        this.address = event && event.address || '';
        this.guests = event && event.guests.map(g => new User(g)) || [];
        this.images = event && event.images || [];
        this.videos = event && event.videos || [];
        this.eventType = event && event.eventType || EventType.Outdoors;
        this.eventDifficulty = event && event.eventDifficulty || EventDifficulty.Easy;
        this.isWeddingEvent = event && event.isWeddingEvent || false;
        this.isWeddingPartyEvent = event && event.isWeddingPartyEvent || false;
    }

}
