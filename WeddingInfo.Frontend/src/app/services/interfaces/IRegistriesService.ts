import { IRegistry } from "app/models/interfaces/IRegistry";
import { Observable } from "rxjs";

export interface IRegistriesService {
    create(registry: IRegistry): Observable<IRegistry>;
    delete(id: number): Observable<boolean>;
    getAll(): Observable<IRegistry[]>;
    getById(id: number): Observable<IRegistry>;
    update(registry: IRegistry): Observable<IRegistry>;
}
