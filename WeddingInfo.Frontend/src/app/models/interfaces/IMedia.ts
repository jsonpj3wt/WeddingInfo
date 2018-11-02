import { MediaType } from "../enums/MediaType";

export interface IMedia {
    id: number;
    path: string;
    mediaType: MediaType;
}
