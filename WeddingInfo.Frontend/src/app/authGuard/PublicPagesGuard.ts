import { AuthManager } from '../config/AuthManager';
import { AuthGuardBase } from './AuthGuardBase';
import { Injectable } from "@angular/core";
import { Router } from "@angular/router";

@Injectable()
export class PublicPagesGuard extends AuthGuardBase {
    constructor(
        authManager: AuthManager,
        router: Router
    ) {
        super(authManager, router);
    }

    public canActivateChild(): boolean {
        if (this.authenticated) {
            this.navigate([""]);
            return false;
        }
        else {
            return true;
        }
    }
}