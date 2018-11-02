import { Component, OnInit, EventEmitter, Input, Output } from '@angular/core';
import { UploaderOptions, UploadFile, UploadInput, humanizeBytes, UploadOutput } from 'ngx-uploader';

@Component({
    selector: 'app-image-uploader',
    templateUrl: './image-uploader.component.html',
    styleUrls: ['./image-uploader.component.scss']
})
export class ImageUploaderComponent implements OnInit {

    private _uploaderOptions: UploaderOptions;
    private _files: UploadFile[];
    private _uploadInput: EventEmitter<UploadInput>;
    private _notifySave: EventEmitter<string[]>;
    private _humanizeBytes: Function;
    private _dragOver: boolean;
    private _uploadInputEvent: UploadInput;
    private _loading: boolean;

    constructor() {
        this._uploaderOptions = {
            concurrency: 1,
            maxUploads: 1,
            allowedContentTypes: ['image/jpeg', 'image/jpg', 'image/png', 'image/gif']
        };
        this._files = []; // local uploading files array
        this._uploadInput = new EventEmitter<UploadInput>(); // input events, we use this to emit data to ngx-uploader
        this._notifySave = new EventEmitter<string[]>();
        this._humanizeBytes = humanizeBytes;
        this._uploadInputEvent = null;
        this._loading = false;
    }

    ngOnInit() {
    }

    public get dragOver(): boolean {
        return this._dragOver;
    }

    public get uploaderOptions(): UploaderOptions {
        return this._uploaderOptions;
    }

    public get uploadInput(): EventEmitter<UploadInput> {
        return this._uploadInput;
    }

    @Output()
    public get uploadComplete(): EventEmitter<string[]> {
        return this._notifySave;
    }

    public get files(): UploadFile[] {
        return this._files;
    }

    @Input()
    public set uploadInputEvent(v: UploadInput) {
        this._uploadInputEvent = v;
    }

    @Input()
    public set maxUploads(v: number) {
        this._uploaderOptions.maxUploads = v;
    }

    public get loading(): boolean {
        return this._loading;
    }

    public onUploadOutput(output: UploadOutput): void {
        switch (output.type) {
            case 'allAddedToQueue':
                // uncomment this if you want to auto upload files when added
                // const event: UploadInput = {
                //   type: 'uploadAll',
                //   url: '/upload',
                //   method: 'POST',
                //   data: { foo: 'bar' }
                // };
                // this.uploadInput.emit(event);
                break;
            case 'addedToQueue':
                if (typeof output.file !== 'undefined') {
                    this._files.push(output.file);
                }
                break;
            case 'uploading':
                if (typeof output.file !== 'undefined') {
                    // update current data in files array for uploading file
                    const index = this._files.findIndex((file) => typeof output.file !== 'undefined' && file.id === output.file.id);
                    this._files[index] = output.file;
                }
                break;
            case 'removed':
                // remove file from array when removed
                this._files = this._files.filter((file: UploadFile) => file !== output.file);
                break;
            case 'dragOver':
                this._dragOver = true;
                break;
            case 'dragOut':
            case 'drop':
                this._dragOver = false;
                break;
            case 'done':
                this._notifySave.emit(output.file.response);
                break;
        }
    }

    public startUpload(): void {
        if (this._uploadInputEvent) {
            this._uploadInput.emit(this._uploadInputEvent);
            
        }
    }

    public cancelUpload(id: string): void {
        this._uploadInput.emit({ type: 'cancel', id: id });
    }

    public removeFile(id: string): void {
        this._uploadInput.emit({ type: 'remove', id: id });
    }

    public removeAllFiles(): void {
        this._uploadInput.emit({ type: 'removeAll' });
    }

}
