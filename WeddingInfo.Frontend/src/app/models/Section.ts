import { ISection } from './interfaces/ISection';
import { IParallax } from './interfaces/IParallax';
import { Parallax } from './Parallax';

export class Section implements ISection {
    public id: number;
    public header: string;
    public text: string;
    public topParallax: IParallax;
    public bottomParallax: IParallax;
    public isParallax: boolean;

    public constructor(section?: ISection) {
        this.id = section && section.id || 0;
        this.header = section && section.header || '';
        this.text = section && section.text || '';
        this.topParallax = section && section.topParallax && new Parallax(section.topParallax) || null;
        this.bottomParallax = section && section.bottomParallax && new Parallax(section.bottomParallax) || null;
        this.isParallax = section && (section.bottomParallax != null || section.topParallax != null) || false;
    }
}
