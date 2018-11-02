import { ILocation } from 'app/models/interfaces/ILocation';
import { Observable } from 'rxjs';

export interface ILocationsService {
    createLocation(loc: ILocation): Observable<ILocation>;
    delete(id: number): Observable<boolean>;
    getAll(): Observable<ILocation[]>;
    getById(id: number): Observable<ILocation>;
    updateLocation(loc: ILocation): Observable<ILocation>;
}
