import { Observable } from "rxjs";

export interface IS3Service {
    getImages(lastPull: string, limit: number): Observable<string[]>;
    postImages(files: File[]): Observable<string[]>;
}