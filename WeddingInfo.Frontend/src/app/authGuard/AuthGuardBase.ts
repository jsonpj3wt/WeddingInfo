import { CanActivateChild, Router } from "@angular/router";
import { AuthManager } from '../config/AuthManager';

export abstract class AuthGuardBase implements CanActivateChild {
    private _authManager: AuthManager;
    private _router: Router;

    constructor(
        authManager: AuthManager,
        router: Router
    ) {
        this._authManager = authManager;
        this._router = router;
    }

    public abstract canActivateChild(): boolean;

    protected get authenticated(): boolean {
        return this._authManager.authenticated;
    }

    protected get isAdmin(): boolean {
        return this._authManager.activeUser && this._authManager.activeUser.isAdmin || false;
    }

    protected navigate(path: string[]): void {
        this._router.navigate(path);
    }
}