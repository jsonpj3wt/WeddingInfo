import { Component, OnInit } from '@angular/core';
import { UsersService } from 'app/services/UsersService';
import { IUsersService } from 'app/services/interfaces/IUsersService';
import { AuthManager } from 'app/config/AuthManager';
import { NotificationsService } from 'angular2-notifications';
import { IUser } from 'app/models/interfaces/IUser';
import { User } from 'app/models/User';
import { finalize, catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { ColDef, GridOptions, ICellRendererParams, CellClickedEvent, CellValueChangedEvent } from 'ag-grid-community';
import { CheckboxCellComponent } from 'app/components/checkbox-cell/checkbox-cell.component';

@Component({
    selector: 'app-view-rsvp',
    templateUrl: './view-rsvp.component.html',
    styleUrls: ['./view-rsvp.component.scss'],
    providers: [UsersService]
})
export class ViewRsvpComponent implements OnInit {

    private readonly _notificationService: NotificationsService;
    private readonly _userService: IUsersService;

    private _loading: boolean;
    private _users: IUser[];
    private _columnDefs: ColDef[];
    private _gridOptions: GridOptions;
    private _updatedUsers: IUser[];

    public constructor(
        authManager: AuthManager,
        notificationService: NotificationsService,
        userService: UsersService
    ) {
        this._notificationService = notificationService;
        this._userService = userService;

        this._users = [];
        this._updatedUsers = [];
        this._loading = true;

        this._columnDefs = [
            {headerName: 'Id', field: 'id', width: 30},
            {headerName: 'Category', field: 'category', editable: true},
            {headerName: 'Title', field: 'title', editable: true},
            {headerName: 'FirstName', field: 'firstName', editable: true},
            {headerName: 'MiddleName', field: 'middleName', editable: true},
            {headerName: 'LastName', field: 'lastName', editable: true},
            {headerName: 'Household', field: 'household', editable: true},
            {headerName: 'Email', field: 'email', editable: true},
            {headerName: 'Attending', field: 'isAttending', cellRendererFramework: CheckboxCellComponent},
            {headerName: 'Guests', field: 'guests', editable: true},
            {headerName: 'Address', field: 'address', editable: true},
            {headerName: 'Phone Number', field: 'phoneNumber', editable: true},
            {headerName: 'Save the Date', field: 'sentSaveTheDate', cellRendererFramework: CheckboxCellComponent},
            {headerName: 'Attending Rehearsal', field: 'rehearsal', cellRendererFramework: CheckboxCellComponent},
            {headerName: 'Dietary', field: 'dietary', editable: true, cellStyle: {'white-space': 'normal'}},
            {headerName: 'Gift', field: 'gift', editable: true, cellStyle: {'white-space': 'normal'}},
            {headerName: 'Thank You Letter', field: 'sentThankYou', cellRendererFramework: CheckboxCellComponent}
        ];

        this._gridOptions = {
            context: {
                parentContext: this
            },
            rowHeight: 400
        };
    }

    public ngOnInit(): void {
        this.getAllUsers();
    }

    public get users(): IUser[] {
        return this._users;
    }

    public get columnDefs(): ColDef[] {
        return this._columnDefs;
    }

    public get loading(): boolean {
        return this._loading;
    }

    public get gridOptions(): GridOptions {
        return this._gridOptions;
    }

    public onGridReady(params: ICellRendererParams): void {
        params.api.sizeColumnsToFit();
        setTimeout(function() {
            params.api.resetRowHeights();
          }, 500);
    }

    public onModelUpdated(): void {
        console.log('onModelUpdated');
    }

    public onCellClicked($event: CellClickedEvent): void {
        console.log($event.colDef.field + ' clicked');
        if ($event.colDef.field === "isAttending") {
            const usrIndex: number = this._users.findIndex(u => u.id === $event.data['id']);
            console.log(usrIndex);
            this._users[usrIndex].isAttending = !this._users[usrIndex].isAttending;
            this.setUpdatedUsers(this._users[usrIndex]);
        }
        if ($event.colDef.field === "sentSaveTheDate") {
            const usrIndex: number = this._users.findIndex(u => u.id === $event.data['id']);
            console.log(usrIndex);
            this._users[usrIndex].sentSaveTheDate = !this._users[usrIndex].sentSaveTheDate;
            this.setUpdatedUsers(this._users[usrIndex]);
        }
        if ($event.colDef.field === "rehearsal") {
            const usrIndex: number = this._users.findIndex(u => u.id === $event.data['id']);
            console.log(usrIndex);
            this._users[usrIndex].rehearsal = !this._users[usrIndex].rehearsal;
            this.setUpdatedUsers(this._users[usrIndex]);
        }
        if ($event.colDef.field === "sentThankYou") {
            const usrIndex: number = this._users.findIndex(u => u.id === $event.data['id']);
            console.log(usrIndex);
            this._users[usrIndex].sentThankYou = !this._users[usrIndex].sentThankYou;
            this.setUpdatedUsers(this._users[usrIndex]);
        }
    }

    public onCellValueChanged($event: CellValueChangedEvent): void {
        console.log('onCellValueChanged: ' + $event.oldValue + ' to ' + $event.newValue);
        console.log($event.data);
        this.setUpdatedUsers($event.data);
    }

    public onCellDoubleClicked($event): void {
        console.log('onCellDoubleClicked: ' + $event.rowIndex + ' ' + $event.colDef.field);
    }

    public onSaveChanges(): void {
        if (this._updatedUsers.length === 0) {
            this._notificationService.warn("No RSVPs to update!");
        } else {
            this._loading = true;
            this._userService.updateBulkUsers(this._updatedUsers).pipe(finalize(() => {
                this._loading = false;
            }), catchError(err => {
                this._notificationService.error('Could not update RSVPs.');
                return throwError(err);
            })).subscribe((users: IUser[]) => {
                if (users) {
                    this._users = users.map(u => new User(u));
                    this._updatedUsers.splice(0);
                } else {
                    this._notificationService.warn('Could not successfully update RSVPs.');
                }
            });
        }
    }


    private setUpdatedUsers(user: IUser) {
        const usrIndex: number = this._updatedUsers.findIndex(u => u.id === user.id);
        if (usrIndex >= 0) {
            this._updatedUsers.splice(usrIndex, 1);
        }
        this._updatedUsers.push(user);
    }

    private getAllUsers(): void {
        this._loading = true;
        this._userService.getAll().pipe(finalize(() => {
            this._loading = false;
        }), catchError(err => {
            this._notificationService.error('Could not get RSVPs.');
            return throwError(err);
        })).subscribe((users: IUser[]) => {
            if (users) {
                this._users = users.map(u => new User(u));
            } else {
                this._notificationService.warn('Could not successfully get RSVPs.');
            }
        });
    }
}

