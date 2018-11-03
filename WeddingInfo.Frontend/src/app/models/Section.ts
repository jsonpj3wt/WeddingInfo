import { ISection } from './interfaces/ISection';
import { IParallax } from './interfaces/IParallax';
import { Parallax } from './Parallax';

export class Section implements ISection {
    public bottomParallax: IParallax;
    public header: string;
    public id: number;
    public isParallax: boolean;
    public order: number;
    public text: string;
    public topParallax: IParallax;

    public constructor(section?: ISection) {
        this.bottomParallax = section && section.bottomParallax && new Parallax(section.bottomParallax) || null;
        this.header = section && section.header || '';
        this.id = section && section.id || 0;
        this.isParallax = section && (section.bottomParallax != null || section.topParallax != null) || false;
        this.order = section && section.order || 0;
        this.text = section && section.text || '';
        this.topParallax = section && section.topParallax && new Parallax(section.topParallax) || null;
    }
}
