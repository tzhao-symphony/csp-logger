import {TwoWayMap} from "./TwoWayMap.js";

export class Dictionary {
    private readonly _map: TwoWayMap<number, string | null>;
    private index: number = 1;

    constructor() {
        this._map = new TwoWayMap();
    }

    public getOrAddIndex(value: string | null): number {
        let index = this._map.getKeyFromValue(value);
        if (typeof index === 'undefined') {
            index = this.index;
            this.index++;
            this._map.add(index, value);
        }
        return index;
    }

    public getIndexFromValue(value: string) {
        return this._map.getKeyFromValue(value);
    }

    public getValueFromIndex(index: number) {
        return this._map.getValueFromKey(index);
    }

    public get entries(): Record<number, string | null> {
        return Object.fromEntries(this._map.kvEntries);
    }

    public clear(): void {
        this._map.clear();
    }
}
