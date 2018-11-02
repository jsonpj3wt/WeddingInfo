import { Component, OnInit, EventEmitter, ViewChild } from '@angular/core';
import { S3Service } from 'app/services/S3Service';
import { IS3Service } from 'app/services/interfaces/IS3Service';
import { AuthManager } from 'app/config/AuthManager';
import { NotificationsService } from 'angular2-notifications';
import { finalize, catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { IEvent } from 'app/models/interfaces/IEvent';
import { UploaderOptions, UploadFile, UploadInput, humanizeBytes, UploadOutput } from 'ngx-uploader';
import { HttpConfig } from 'app/config/HttpConfig';
import { MzModalComponent } from 'ngx-materialize';

@Component({
    selector: 'app-s3upload',
    templateUrl: './s3upload.component.html',
    styleUrls: ['./s3upload.component.scss'],
    providers: [S3Service]
})
export class S3uploadComponent implements OnInit {
    @ViewChild('imageModal') private _imageModal?: MzModalComponent;

    private readonly _authManager: AuthManager;
    private readonly _s3service: IS3Service;
    private readonly _notificationService: NotificationsService;
    private _modalImageSrc: string;

    private _urls: string[];
    private _lastPull: string;
    private _loading: boolean;
    private _limit: number;
    private _uploadInput: UploadInput;
    
    public constructor(
        authManager: AuthManager,
        s3Service: S3Service,
        notificationService: NotificationsService
    ) {
        this._authManager = authManager;
        this._s3service = s3Service;
        this._notificationService = notificationService;

        this._urls = [];
        this._lastPull = '';
        this._limit = 20;
        this._modalImageSrc = '';

        this._uploadInput = {
            type: 'uploadAll',
            url: `${HttpConfig.BASE_URL}/api/uploads`,
            headers: { 'Authorization': 'JWT ' + this._authManager.authToken },
            method: 'POST',
            includeWebKitFormBoundary: true
        };
    }

    public ngOnInit(): void {
        this.pullImages();
    }

    public get urls(): string[] {
        return this._urls;
    }

    public get loading(): boolean {
        return this._loading;
    }

    public get modalImageSrc(): string {
        return this._modalImageSrc;
    }

    public get uploadInputEvent(): UploadInput {
        return this._uploadInput;
    }

    public onDisplayImageModal(index: number) {
        this._modalImageSrc = this._urls[index];
        this._imageModal.openModal();
    }

    public onUploadComplete(urls: string[]) {
        this._urls = urls;
    }

    private pullImages(): void {
        this._loading = true;
        this._s3service.getImages(this._lastPull, this._limit).pipe(finalize(() => {
            this._loading = false;
        }), catchError(err => {
            this._notificationService.error('Could not get Images.');
            return throwError(err);
        })).subscribe((urls: string[]) => {
            if (urls) {
                this._urls = urls;
                this._lastPull = urls[urls.length - 1];
                if (this._lastPull) {
                    const lastIndex: number = this._lastPull.lastIndexOf('/');
                    if (lastIndex >= 0) {
                        this._lastPull = this._lastPull.substring(lastIndex, this._lastPull.length);
                    }
                }
            } else {
                this._notificationService.warn('Could not successfully get Images.');
            }
        });
    }

}
