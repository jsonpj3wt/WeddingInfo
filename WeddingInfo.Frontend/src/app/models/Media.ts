import { IMedia } from './interfaces/IMedia';
import { MediaType } from './enums/MediaType';

export class Media implements IMedia {
    public id: number;
    public path: string;
    public mediaType: MediaType;

    public constructor(media?: IMedia) {
        this.id = media && media.id || 0;
        this.path = media && media.path || '';
        this.mediaType = media && media.mediaType || MediaType.Image;
    }
}
