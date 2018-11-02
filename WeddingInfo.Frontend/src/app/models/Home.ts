import { IHomeComponent } from './interfaces/IHomeComponent';
import { ISection } from './interfaces/ISection';
import { Section } from './Section';

export class Home implements IHomeComponent {
    public id: number;
    public title: string;
    public sections: ISection[];

    public constructor(homeComponent?: IHomeComponent) {
        this.id = homeComponent && homeComponent.id || 0;
        this.title = homeComponent && homeComponent.title || '';
        this.sections = homeComponent && homeComponent.sections && homeComponent.sections.map(s => new Section(s)) || [];
    }
}
