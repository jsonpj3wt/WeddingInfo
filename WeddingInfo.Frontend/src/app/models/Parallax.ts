import { IParallax } from "./interfaces/IParallax";

export class Parallax implements IParallax {
    public id: number;
    public imgUrl: string;

    public constructor(parallax?: IParallax) {
        this.id = parallax && parallax.id || 0;
        this.imgUrl = parallax && parallax.imgUrl || '';
    }
}
