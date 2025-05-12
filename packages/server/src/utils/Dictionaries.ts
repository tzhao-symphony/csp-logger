import {Dictionary} from "./Dictionnary.js";
import {TwoWayMap} from "./TwoWayMap.js";

export class Dictionaries<Fields extends ReadonlyArray<string>,
    FieldsWithDictionary extends ReadonlyArray<string>,
    ObjectInitialType extends {[K in Fields[number]]: any}
    > {
    private readonly _dictionnaries: Map<number, Dictionary>;
    private readonly keyDict: TwoWayMap<number, string>;

    constructor(fields: Fields, fieldsWithDictionary: FieldsWithDictionary) {
        this._dictionnaries = new Map<number, Dictionary>();
        this.keyDict = new TwoWayMap();
        fields.forEach((field, index) => {
            if (fieldsWithDictionary.includes(field)) {
                this._dictionnaries.set(index, new Dictionary())
            }
            this.keyDict.add(index, field);
        });
    }

    public getLightWeightObject(object: ObjectInitialType): Array<any> {
        const resObject: any[] = [];
        Object.entries(object).forEach(([fieldName, value]) => {
            const keyIndex = this.keyDict.getKeyFromValue(fieldName);
            if (keyIndex !== undefined) {
                const dictionary = this._dictionnaries.get(keyIndex);
                if (dictionary !== undefined && (value === null || typeof value === 'string')) {
                    resObject[keyIndex] = dictionary.getOrAddIndex(value);
                    return;
                }
                resObject[keyIndex] = value;
                return;
            }
            resObject[fieldName] = value;
        });
        return resObject;
    }

    public reviveLightWeightObject(object: Array<any>): ObjectInitialType {
        const resObject: any = {};
        object.forEach((value, index) => {
            const keyIndex = index;
            const keyString = this.keyDict.getValueFromKey(keyIndex);
            if (keyString !== undefined) {
                const dictionary = this._dictionnaries.get(keyIndex);
                if (dictionary !== undefined && typeof value === 'number') {
                    resObject[keyString] = dictionary.getValueFromIndex(value);
                    return;
                }
                resObject[keyString] = value;
                return;
            }
            resObject[index] = value;
        })
        return resObject;
    }

    public getDictionary() {
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

    public getKeyIndexFromFieldName(name: string) {
        return this.keyDict.getKeyFromValue(name);

    }
}
