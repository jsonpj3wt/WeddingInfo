import { Component, OnInit, ViewChildren, ViewChild } from '@angular/core';
import { NotificationsService } from 'angular2-notifications';
import { finalize, catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { SwiperConfigInterface, SwiperComponent } from 'ngx-swiper-wrapper';
import { AuthManager } from 'app/config/AuthManager';
import { Router } from '@angular/router';
import { MzModalComponent } from 'ngx-materialize';
import { LodgingsService } from 'app/services/LodgingsService';
import { ILodgingsService } from 'app/services/interfaces/ILodgingsService';
import { ILodging } from 'app/models/interfaces/ILodging';
import { Lodging } from 'app/models/Lodging';

@Component({
    selector: 'app-view-lodging',
    templateUrl: './view-lodging.component.html',
    styleUrls: ['./view-lodging.component.scss'],
    providers: [LodgingsService]
})
export class ViewLodgingComponent implements OnInit {
    @ViewChildren(SwiperComponent) private _componentRef?: SwiperComponent[];
    @ViewChildren('imageSwiper') private _imageSwiperRef?: SwiperComponent[];
    @ViewChildren('basicModal') private _basicModals?: MzModalComponent[];
    @ViewChild('imageModal') private _imageModal?: MzModalComponent;

    private readonly _authManager: AuthManager;
    private readonly _lodgingService: ILodgingsService;
    private readonly _notificationService: NotificationsService;
    private readonly _router: Router;

    private _swiperConfig: SwiperConfigInterface;
    private _lodgings: ILodging[];
    private _loading: boolean;
    private _modalImageSrc: string;

    private _players: any[];
    private _ytEvents: any[];

    constructor(
        authManager: AuthManager,
        lodgingService: LodgingsService,
        notificationService: NotificationsService,
        router: Router
    ) {
        this._authManager = authManager;
        this._lodgingService = lodgingService;
        this._notificationService = notificationService;
        this._router = router;

        this._modalImageSrc = '';
        this._lodgings = [];
        this._ytEvents = [];
        this._players = [];

        this._swiperConfig = {
            navigation: true,
            slidesPerView: 'auto',
            centeredSlides: true,
            spaceBetween: 30
        };

        this._loading = true;
    }

    public get swiperConfig(): SwiperConfigInterface {
        return this._swiperConfig;
    }

    public ngOnInit(): void {
        this.getAll();
    }

    public get admin(): boolean {
        return this._authManager.activeUser && this._authManager.activeUser.isAdmin || false;
    }

    public get loading(): boolean {
        return this._loading;
    }

    public get lodgings(): ILodging[] {
        return this._lodgings;
    }

    public get modalImageSrc(): string {
        return this._modalImageSrc;
    }

    public onStateChange(event): void {
        if (this._ytEvents.findIndex(y => y === event) === -1) {
            this._ytEvents.push(event.data);
        }
    }
    public savePlayer(player): void {
        if (this._players.findIndex(p => p === player) === -1) {
            this._players.push(player);
        }
    }

    public onBringUp(id: number): void {
        const eventIndex: number = this._lodgings.findIndex(e => e.id === id);
        if (eventIndex >= 0) {
            this._lodgings[eventIndex].order--;
            this.saveOrder(this._lodgings[eventIndex]);
            if (eventIndex > 0) {
                this._lodgings[eventIndex - 1].order++;
                this.saveOrder(this._lodgings[eventIndex]);
            }
        }
        this._lodgings = this._lodgings.sort(e => e.order);
    }

    public onLower(id: number): void {
        const eventIndex: number = this._lodgings.findIndex(e => e.id === id);
        if (eventIndex >= 0) {
            this._lodgings[eventIndex].order++;
            this.saveOrder(this._lodgings[eventIndex]);
            if (eventIndex < this._lodgings.length) {
                this._lodgings[eventIndex + 1].order--;
                this.saveOrder(this._lodgings[eventIndex]);
            }
        }
        this._lodgings = this._lodgings.sort(e => e.order);
    }

    public onEdit(id: number): void {
        this._router.navigate(['editLodging/' + id]);
    }

    public onIndexChange(): void {
        this._players.forEach(p => p.pauseVideo());
    }

    public onSwiperClick(index: number): void {
        let swiper: SwiperComponent = null;
        this._imageSwiperRef.forEach((s: SwiperComponent, sIndex: number) => {
            if (index === sIndex) {
                swiper = s;
                return;
            }
        });

        if (swiper) {
            this._modalImageSrc = this._lodgings[index].images[swiper.directiveRef.getIndex()].path;
            this._imageModal.openModal();
        }
    }

    public onDeleteConfirm(index: number): void {
        this._basicModals.forEach((m: MzModalComponent, mIndex: number) => {
            if (index === mIndex) {
                m.openModal();
                return;
            }
        });
    }

    public onDelete(id: number): void {
        const lodgingIndex = this._lodgings.findIndex(lodging => lodging.id === id);
        if (lodgingIndex < 0) {
            this._notificationService.error('Could not Delete Lodging.');
            return;
        }
        this._loading = true;
        this._lodgingService.delete(id).pipe(finalize(() => {
            this._loading = false;
            this.updateSwipers();
        }), catchError(err => {
            this._notificationService.error('Could not Delete Lodging.');
            return throwError(err);
        })).subscribe((success: boolean) => {
            if (success) {
                this._lodgings.splice(lodgingIndex, 1);
                this.updateSwipers();
                this._notificationService.success('Lodging Deleted!');
            } else {
                this._notificationService.warn('Could not successfully delete Lodging.');
            }
        });
    }

    public updateSwipers(): void {
        setTimeout(() => {
            this._componentRef.forEach((scomp) => {
                scomp.directiveRef.update();
            });
            this._imageSwiperRef.forEach((scomp) => {
                scomp.directiveRef.update();
            });
        }, 500);
    }

    private getAll(): void {
        this._loading = true;
        this._lodgingService.getAll().pipe(finalize(() => {
            this._loading = false;
            this.updateSwipers();
        }), catchError(err => {
            this._notificationService.error('Could not get Lodging.');
            return throwError(err);
        })).subscribe((lodgings: ILodging[]) => {
            if (lodgings) {
                this._lodgings = lodgings.map(l => {
                    return new Lodging(l);
                }).sort(l => l.order);
                setTimeout(() => {
                    $('.collapsible-header').click(() => {
                        this.updateSwipers();
                    });
                }, 500);
            } else {
                this._notificationService.warn('Could not successfully get Lodging.');
            }
        });
    }

    private saveOrder(lodging: ILodging): void {
        this._loading = true;
        this._lodgingService.update(lodging).pipe(finalize(() => {
            this._loading = false;
            this.updateSwipers();
        }), catchError(err => {
            this._notificationService.error('Could not save ordering.');
            return throwError(err);
        })).subscribe((logde: ILodging) => {
            if (logde) {
                setTimeout(() => {
                    $('.collapsible-header').click(() => {
                        this.updateSwipers();
                    });
                }, 500);
            } else {
                this._notificationService.warn('Could not successfully save ordering.');
            }
        });
    }

}
