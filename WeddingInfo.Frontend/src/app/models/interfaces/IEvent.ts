import { EventType } from '../enums/EventType';
import { EventDifficulty } from '../enums/EventDifficulty';
import { IUser } from './IUser';
import { IMedia } from './IMedia';

export interface IEvent {
    address: string;
    description: string;
    eventDifficulty: EventDifficulty;
    eventType: EventType;
    guests: IUser[];
    id: number;
    images: IMedia[];
    isWeddingEvent: boolean;
    isWeddingPartyEvent: boolean;
    name: string;
    occurance: Date;
    order: number;
    videos: IMedia[];
}
