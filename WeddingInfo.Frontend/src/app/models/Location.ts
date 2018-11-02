import { ILocation } from './interfaces/ILocation';
import { IMedia } from './interfaces/IMedia';

export class Location implements ILocation {
    public id: number;
    public name: string;
    public address: string;
    public website: string;
    public images: IMedia[];
    public videos: IMedia[];
    public description: string;

    public constructor(location?: ILocation) {
        this.id = location && location.id || 0;
        this.name = location && location.name || '';
        this.address = location && location.address || '';
        this.website = location && location.website || '';
        this.images = location && location.images || [];
        this.videos = location && location.videos || [];
        this.description = location && location.description || '';
    }
}