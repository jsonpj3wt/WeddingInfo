import {
    Component,
    OnDestroy,
    AfterViewInit,
    EventEmitter,
    Input,
    Output
} from "@angular/core";
import { Editor, Settings as TinyMceSettings } from "tinymce";
import { AuthManager } from "app/config/AuthManager";

@Component({
    selector: "app-editor",
    templateUrl: "./editor.component.html",
    styleUrls: ["./editor.component.scss"]
})
export class EditorComponent implements AfterViewInit, OnDestroy {
    private readonly _authManager: AuthManager;
    private readonly _onEditorKeyup: EventEmitter<string>;
    private readonly _onSave: EventEmitter<string>;

    private _content: string;
    private _contentId: number;
    private _uniqueId: number;
    private _editor: Editor;
    private _editorType: string;
    private _editMode: boolean;

    public constructor(authManager: AuthManager) {
        this._authManager = authManager;
        this._content = "";
        this._contentId = 0;
        this._editor = null;
        this._editorType = "editor";
        this._onEditorKeyup = new EventEmitter<string>();
        this._onSave = new EventEmitter<string>();
        this._uniqueId = 0;
        this._editMode = true;
    }

    public ngAfterViewInit(): void {
        this.initTinymce();
    }

    public ngOnDestroy(): void {
        tinymce.remove(this._editor);
    }

    public get canEdit(): boolean {
        return this._authManager.activeUser && this._authManager.activeUser.isAdmin && this._editMode;
    }

    public get content(): string {
        return this._content;
    }

    @Input()
    public set content(v: string) {
        if (v) {
            this._content = v;
            this.initTinymce();
        }
    }

    @Input()
    public set contentId(value: number) {
        this._contentId = value;
    }

    @Input()
    public set editMode(v: boolean) {
        this._editMode = v;
        this.initTinymce();
    }

    @Input()
    public set editorType(value: string) {
        this._editorType = value;
    }

    public get elementId(): string {
        if (this._contentId !== 0) {
            this._uniqueId = this._contentId;
        }
        else if (this._uniqueId <= 0) {
            this._uniqueId = new Date().getTime();
        }

        return `${this._editorType}${this._uniqueId}`;
    }

    @Output()
    public get onEditorKeyup(): EventEmitter<string> {
        return this._onEditorKeyup;
    }

    @Output()
    public get onSave(): EventEmitter<string> {
        return this._onSave;
    }

    private initTinymce(): void {
        let pluginStrings: string = "advlist autolink lists link image charmap print preview anchor " +
        "searchreplace visualblocks code fullscreen " +
        "insertdatetime table contextmenu paste textcolor";

        if(this.canEdit) {
            pluginStrings += " media";
        }

        const settings: TinyMceSettings = {
            selector: `#${this.elementId}.editor`,
            inline: true,
            menubar: this.canEdit,
            relative_urls: false,
            plugins: [
                pluginStrings
            ],
            toolbar: "insertfile undo redo | styleselect | forecolor backcolor bold italic " +
            "| alignleft aligncenter alignright alignjustify " +
            "| bullist numlist outdent indent | link image",
            skin_url: "assets/skins/lightgray",
            init_instance_callback: (editor: any) => {
                editor && this._content && editor.setContent(this._content);
                editor.on("PostProcess", (e) => {
                    if (this.canEdit) {
                        this._content = e.content;
                        this._onEditorKeyup.emit(e.content);
                    }
                });
            },
            setup: (editor: Editor) => {
                this._editor = editor;
                editor.addMenuItem("save", {
                    text: "Save",
                    context: "file",
                    onclick: () => {
                        this._onSave.emit(this._content);
                    }
                });
                editor.on("keyup", () => {
                    const content = editor.getContent();
                    this._content = content;
                    this._onEditorKeyup.emit(content);
                });
                editor.on("mouseout", () => {
                    if (this.canEdit) {
                        const content = editor.getContent();
                        this._content = content;
                        this._onEditorKeyup.emit(content);
                    }
                });
            }
        };

        // @types/tinymce really sucks.
        (<any>settings).readonly = !this.canEdit

        tinymce.init(settings);
    }
}
