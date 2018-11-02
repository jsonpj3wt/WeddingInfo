import { IMedia } from './IMedia';

export interface ILodging {
    id: number;
    name: string;
    address: string;
    website: string;
    images: IMedia[];
    videos: IMedia[];
    description: string;
}