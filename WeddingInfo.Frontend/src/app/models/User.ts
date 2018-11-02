import { IUser } from './interfaces/IUser';

export class User implements IUser {
    public id: number;
    public isAdmin: boolean;
    public firstName: string;
    public lastName: string;
    public middleName: string;
    public address: string;
    public phoneNumber: string;
    public email: string;
    public isAttending: boolean;
    public isGuest: boolean;
    public guests: number[];
    public icon: string;
    public password: string;
    public category: string;
    public title: string;
    public household: string;
    public sentSaveTheDate: boolean;
    public rehearsal: boolean;
    public dietary: string;
    public gift: string;
    public sentThankYou: boolean;

    public constructor(user?: IUser) {
        this.id = user && user.id || 0;
        this.isAdmin = user && user.isAdmin || false;
        this.firstName = user && user.firstName || '';
        this.lastName = user && user.lastName || '';
        this.middleName = user && user.middleName || '';
        this.address = user && user.address || '';
        this.phoneNumber = user && user.phoneNumber || '';
        this.email = user && user.email || '';
        this.isAttending = user && user.isAttending || false;
        this.isGuest = user && user.isGuest || false;
        this.guests = user && user.guests || [];
        this.icon = user && user.icon || '';
        this.password = user && user.password || '';
        this.category = user && user.category || '';
        this.title = user && user.title || '';
        this.household = user && user.household || '';
        this.sentSaveTheDate = user && user.sentSaveTheDate || false;
        this.rehearsal = user && user.rehearsal || false;
        this.dietary = user && user.dietary || '';
        this.gift = user && user.gift || '';
        this.sentThankYou = user && user.sentThankYou || false;
    }
}
