import { IUser } from 'app/models/interfaces/IUser';
import { Observable } from 'rxjs';

export interface IUsersService {
    createUser(usr: IUser): Observable<IUser>;
    delete(id: number): Observable<boolean>;
    getAll(): Observable<IUser[]>;
    getAttending(): Observable<IUser[]>;
    getById(id: number): Observable<IUser>;
    getByName(firstName: string, lastName: string): Observable<IUser[]>;
    updateBulkUsers(users: IUser[]): Observable<IUser[]>;
    updateUser(usr: IUser): Observable<IUser>;
}
