import { ILocation } from './interfaces/ILocation';
import { IMedia } from './interfaces/IMedia';
import { ILodging } from './interfaces/ILodging';

export class Lodging implements ILodging {
    public address: string;
    public description: string;
    public id: number;
    public images: IMedia[];
    public name: string;
    public order: number;
    public videos: IMedia[];
    public website: string;

    public constructor(lodging?: ILodging) {
        this.address = lodging && lodging.address || '';
        this.description = lodging && lodging.description || '';
        this.id = lodging && lodging.id || 0;
        this.images = lodging && lodging.images || [];
        this.name = lodging && lodging.name || '';
        this.order = lodging && lodging.order || 0;
        this.videos = lodging && lodging.videos || [];
        this.website = lodging && lodging.website || '';
    }
}