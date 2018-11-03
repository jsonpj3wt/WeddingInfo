import { ILocation } from './interfaces/ILocation';
import { IMedia } from './interfaces/IMedia';

export class Location implements ILocation {
    public address: string;
    public description: string;
    public id: number;
    public images: IMedia[];
    public name: string;
    public order: number;
    public videos: IMedia[];
    public website: string;

    public constructor(location?: ILocation) {
        this.address = location && location.address || '';
        this.description = location && location.description || '';
        this.id = location && location.id || 0;
        this.images = location && location.images || [];
        this.name = location && location.name || '';
        this.order = location && location.order || 0;
        this.videos = location && location.videos || [];
        this.website = location && location.website || '';
    }
}