import { Component, OnInit, AfterViewInit, ElementRef, ViewChild } from '@angular/core';
import { ICellRendererAngularComp } from 'ag-grid-angular';
import { ICellRendererParams, IAfterGuiAttachedParams } from 'ag-grid-community';

@Component({
    selector: 'app-checkbox-cell',
    templateUrl: `./checkbox-cell.component.html`,
    styleUrls: ['./checkbox-cell.component.scss']
})
export class CheckboxCellComponent implements ICellRendererAngularComp {
    @ViewChild('.checkbox') checkbox: ElementRef;

    public params: ICellRendererParams;
    private _ident: string;

    constructor() { }

    agInit(params: ICellRendererParams): void {
        this.params = params;
        this._ident = params.colDef.field + params.rowIndex;
        console.log(this._ident + ' ' + this.params.data[this.params.colDef.field]);
        setTimeout(() => {
            $('#' + this._ident).prop('checked', this.params.data[this.params.colDef.field]);
        }, 500);
    }

    public get Ident(): string {
        return this._ident;
    }

    public onChange(event) {
        this.params.data[this.params.colDef.field] = event.currentTarget.checked;
    }

    public refresh(params: any): boolean {
        return true;
    }
}
