import { Observable } from 'rxjs';
import { ILodging } from 'app/models/interfaces/ILodging';

export interface ILodgingsService {
    create(lodging: ILodging): Observable<ILodging>;
    delete(id: number): Observable<boolean>;
    getAll(): Observable<ILodging[]>;
    getById(id: number): Observable<ILodging>;
    update(lodging: ILodging): Observable<ILodging>;
}
