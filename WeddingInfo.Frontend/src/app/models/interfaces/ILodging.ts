import { IMedia } from './IMedia';

export interface ILodging {
    address: string;
    description: string;
    id: number;
    images: IMedia[];
    name: string;
    order: number;
    videos: IMedia[];
    website: string;
}