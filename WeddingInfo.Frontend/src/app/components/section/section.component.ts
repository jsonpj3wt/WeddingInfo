import { Component, OnInit, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { ISection } from 'app/models/interfaces/ISection';
import { Section } from 'app/models/Section';
import { UploadInput } from 'ngx-uploader';
import { HttpConfig } from 'app/config/HttpConfig';
import { AuthManager } from 'app/config/AuthManager';
import { MzModalComponent } from 'ngx-materialize';
import { Parallax } from 'app/models/Parallax';

@Component({
    selector: 'app-section',
    templateUrl: './section.component.html',
    styleUrls: ['./section.component.scss']
})
export class SectionComponent implements OnInit {
    @ViewChild('topUploadModal') private _topUploadModal?: MzModalComponent;
    @ViewChild('bottomUploadModal') private _bottomUploadModal?: MzModalComponent;
    private readonly _authManager: AuthManager;

    private _section: ISection;
    private _sectionChange: EventEmitter<ISection>;
    private _uploadInput: UploadInput;
    private _loading: boolean;
    private _editMode: boolean;

    constructor(authManager: AuthManager) {
        this._authManager = authManager;
        this._sectionChange = new EventEmitter<ISection>();
        this._uploadInput = {
            type: 'uploadAll',
            url: `${HttpConfig.BASE_URL}/api/uploads/home`,
            headers: { 'Authorization': 'JWT ' + this._authManager.authToken },
            method: 'POST',
            includeWebKitFormBoundary: true
        };
        this._loading = false;
        this._editMode = true;
    }

    public ngOnInit(): void {
    }

    public get section(): ISection {
        return this._section;
    }

    public get uploadInputEvent(): UploadInput {
        return this._uploadInput;
    }

    public get loading(): boolean {
        return this._loading;
    }

    public get canEdit(): boolean {
        return this._authManager.activeUser && this._authManager.activeUser.isAdmin && this._editMode;
    }

    @Input()
    public set editMode(v: boolean) {
        this._editMode = v;
    }

    @Input()
    public set section(v: ISection) {
        if (v) {
            this._section = v;
        }
    }

    @Output()
    public get sectionChange(): EventEmitter<ISection> {
        return this._sectionChange;
    }

    public textHandler(event): void {
        this._section.text = event;
    }

    public onAddTopParallax(): void {
        this._topUploadModal.openModal();
    }

    public onAddBottomParallax(): void {
        this._bottomUploadModal.openModal();
    }

    public onSave(event): void {
        this._section.text = event;
    }

    public onSetTopParallax(urls: string[]): void {
        this._loading = true;
        if (!this._section.topParallax) {
            this._section.topParallax = new Parallax();
        }
        this._section.topParallax.imgUrl = urls[0];
        this.delay();
    }

    public onSetBottomParallax(urls: string[]): void {
        this._loading = true;
        if (!this._section.bottomParallax) {
            this._section.bottomParallax = new Parallax();
        }
        this._section.bottomParallax.imgUrl = urls[0];
        this.delay();
    }

    private delay(): void {
        setTimeout(() => {
            this._loading = false;
        }, 500);
    }

}
