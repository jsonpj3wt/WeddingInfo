import { ILocation } from './interfaces/ILocation';
import { IMedia } from './interfaces/IMedia';
import { ILodging } from './interfaces/ILodging';

export class Lodging implements ILodging {
    public id: number;
    public name: string;
    public address: string;
    public website: string;
    public images: IMedia[];
    public videos: IMedia[];
    public description: string;

    public constructor(lodging?: ILodging) {
        this.id = lodging && lodging.id || 0;
        this.name = lodging && lodging.name || '';
        this.address = lodging && lodging.address || '';
        this.website = lodging && lodging.website || '';
        this.images = lodging && lodging.images || [];
        this.videos = lodging && lodging.videos || [];
        this.description = lodging && lodging.description || '';
    }
}