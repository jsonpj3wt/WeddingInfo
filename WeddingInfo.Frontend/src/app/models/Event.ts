import { IEvent } from './interfaces/IEvent';
import { IUser } from './interfaces/IUser';
import { EventType } from './enums/EventType';
import { EventDifficulty } from './enums/EventDifficulty';
import { User } from './User';
import { IMedia } from './interfaces/IMedia';

export class Event implements IEvent {
    public address: string;
    public description: string;
    public eventDifficulty: EventDifficulty;
    public eventType: EventType;
    public guests: IUser[];
    public id: number;
    public images: IMedia[];
    public isWeddingEvent: boolean;
    public isWeddingPartyEvent: boolean;
    public name: string;
    public occurance: Date;
    public order: number;
    public videos: IMedia[];

    public constructor(event?: IEvent) {
        this.address = event && event.address || '';
        this.description = event && event.description || '';
        this.eventDifficulty = event && event.eventDifficulty || EventDifficulty.Easy;
        this.eventType = event && event.eventType || EventType.Outdoors;
        this.guests = event && event.guests.map(g => new User(g)) || [];
        this.id = event && event.id || 0;
        this.images = event && event.images || [];
        this.isWeddingEvent = event && event.isWeddingEvent || false;
        this.isWeddingPartyEvent = event && event.isWeddingPartyEvent || false;
        this.name = event && event.name || '';
        this.occurance = event && event.occurance && new Date(event.occurance) || new Date();
        this.order = event && event.order || 0;
        this.videos = event && event.videos || [];
    }

}
