import { Observable } from 'rxjs';

export interface IAuthenticationService {
    login(email: string, password: string): Observable<boolean>;
}