export interface IUser {
    id: number;
    isAdmin: boolean;
    firstName: string;
    lastName: string;
    middleName: string;
    address: string;
    phoneNumber: string;
    email: string;
    isAttending: boolean;
    isGuest: boolean;
    guests: number[];
    password: string;
    icon: string;
    category: string;
    title: string;
    household: string;
    sentSaveTheDate: boolean;
    rehearsal: boolean;
    dietary: string;
    gift: string;
    sentThankYou: boolean;
}
