import { IMedia } from './IMedia';

export interface ILocation {
    id: number;
    name: string;
    address: string;
    website: string;
    images: IMedia[];
    videos: IMedia[];
    description: string;
}