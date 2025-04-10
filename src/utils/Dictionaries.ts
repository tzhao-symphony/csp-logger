import {Dictionary} from "./Dictionnary.js";
import {ToLightWeightObj} from "../reports/simplified-report.js";
import {TwoWayMap} from "./TwoWayMap.js";

export class Dictionnaries {
    private readonly _dictionnaries: Map<number, Dictionary>;
    private readonly keyDict: TwoWayMap<number, string>;

    constructor(fields: string[]) {
        this._dictionnaries = new Map<number, Dictionary>();
        this.keyDict = new TwoWayMap();
        fields.forEach((field, index) => {
            this._dictionnaries.set(index, new Dictionary())
            this.keyDict.add(index, field);
        });
    }

    public getLightWeightObject<T extends {}>(object: T): ToLightWeightObj<T> {
        const resObject = {};
        Object.entries(object).forEach(([key, value]) => {
            const keyIndex = this.keyDict.getKeyFromValue(key);
            if (keyIndex !== undefined) {
                const dictionary = this._dictionnaries.get(keyIndex);
                if (dictionary !== undefined && (value === null || typeof value === 'string')) {
                    resObject[keyIndex] = dictionary.getOrAddIndex(value);
                    return;
                }
            }
            resObject[key] = value;
        });
        return resObject as ToLightWeightObj<T>;
    }

    public reviveLightWeightObject(object: Record<string, string | number>) {
        const resObject: any = {};
        Object.entries(object).forEach(([key, value]) => {
            const keyIndex = +key;
            const keyString = this.keyDict.getValueFromKey(keyIndex);
            if (keyString !== undefined) {
                const dictionary = this._dictionnaries.get(keyIndex);
                if (dictionary !== undefined && typeof value === 'number') {
                    resObject[keyString] = dictionary.getValueFromIndex(value);
                    return;
                }
            }
            resObject[key] = value;
        })
        return resObject;
    }

    public getDictionnary() {
        return {
            keyDict: Object.fromEntries(this.keyDict.kvEntries),
            dictionaries: Object.fromEntries(Array.from(this._dictionnaries.entries()).map(([key, value]) => {
                return [key, value.entries];
            }))
        }
    }

    public clear() {
        for (let dict of this._dictionnaries.values()) {
            dict.clear();
        }
    }
}
