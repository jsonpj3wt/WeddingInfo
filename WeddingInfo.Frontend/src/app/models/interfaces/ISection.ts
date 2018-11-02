import { IParallax } from './IParallax';

export interface ISection {
    id: number;
    header: string;
    text: string;
    topParallax: IParallax;
    bottomParallax: IParallax;
    isParallax: boolean;
}
