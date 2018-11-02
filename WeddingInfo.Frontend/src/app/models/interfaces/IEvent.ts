import { EventType } from '../enums/EventType';
import { EventDifficulty } from '../enums/EventDifficulty';
import { IUser } from './IUser';
import { IMedia } from './IMedia';

export interface IEvent {
    id: number;
    name: string;
    description: string;
    occurance: Date;
    address: string;
    guests: IUser[];
    images: IMedia[];
    videos: IMedia[];
    eventType: EventType;
    eventDifficulty: EventDifficulty;
    isWeddingEvent: boolean;
    isWeddingPartyEvent: boolean;
}
