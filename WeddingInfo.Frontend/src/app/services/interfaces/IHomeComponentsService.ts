import { IHomeComponent } from 'app/models/interfaces/IHomeComponent';
import { Observable } from 'rxjs';

export interface IHomeComponentsService {
    create(home: IHomeComponent): Observable<IHomeComponent>;
    getAll(): Observable<IHomeComponent[]>;
    getById(id: number): Observable<IHomeComponent>;
    update(home: IHomeComponent): Observable<IHomeComponent>;
}
