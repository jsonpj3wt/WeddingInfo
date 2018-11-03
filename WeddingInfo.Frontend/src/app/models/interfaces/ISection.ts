import { IParallax } from './IParallax';

export interface ISection {
    bottomParallax: IParallax;
    header: string;
    id: number;
    isParallax: boolean;
    order: number;
    text: string;
    topParallax: IParallax;
}
