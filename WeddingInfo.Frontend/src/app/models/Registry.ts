import { IRegistry } from "./interfaces/IRegistry";

export class Registry implements IRegistry {
    public id: number;
    public imageSrc: string;
    public name: string;
    public website: string;

    public constructor(registry?: IRegistry) {
        this.id = registry && registry.id || 0;
        this.imageSrc = registry && registry.imageSrc || '';
        this.name = registry && registry.name || '';
        this.website = registry && registry.website || '';
    }
}
