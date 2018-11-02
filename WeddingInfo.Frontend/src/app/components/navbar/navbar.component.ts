import { Component, OnInit, ViewChild } from '@angular/core';
import { AuthManager } from 'app/config/AuthManager';
import { Router } from '@angular/router';
import { MzMediaService, MzSidenavComponent } from 'ngx-materialize';
import { Observable } from 'rxjs';

@Component({
    selector: 'app-navbar',
    templateUrl: './navbar.component.html',
    styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {
    @ViewChild('sidenav') private _sideNav: MzSidenavComponent;
    private readonly _authManager: AuthManager;
    private readonly _router: Router;
    private readonly _mediaService: MzMediaService;

    private _smallResolution: Observable<boolean>;

    constructor(
        mediaService: MzMediaService,
        authManager: AuthManager,
        router: Router
    ) {
        this._authManager = authManager;
        this._router = router;
        this._mediaService = mediaService;
    }

    public ngOnInit(): void {
        this._smallResolution = this._mediaService.isActive('s');
    }

    public get authenticated(): boolean {
        return this._authManager.authenticated;
    }

    public get smallResolution(): Observable<boolean> {
        return this._smallResolution;
    }

    public get admin(): boolean {
        return this._authManager.activeUser && this._authManager.activeUser.isAdmin || false;
    }

    public changeNavWidth(): void {
        $('#sidenav').width('300px');
    }

    public logout(): void {
        this._authManager.destroyAuth();
        this._router.navigate(["/login"]);
    }

}
