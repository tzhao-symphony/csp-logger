export class TwoWayMap<K, V> {
    private readonly _map: Map<K, V>;
    private readonly _reverseMap: Map<V, K>;

    constructor() {
        this._map = new Map<K, V>();
        this._reverseMap = new Map<V, K>();
    }

    public add(key: K, value: V): void {
        this._map.set(key, value);
        this._reverseMap.set(value, key);
    }

    public getValueFromKey(key: K): V | undefined {
        return this._map.get(key);
    }

    public getKeyFromValue(value: V): K | undefined {
        return this._reverseMap.get(value);
    }

    public hasKey(key: K): boolean {
        return this._map.has(key);
    }

    public hasValue(value: V): boolean {
        return this._reverseMap.has(value);
    }

    public deleteKey(key: K): boolean {
        const value = this._map.get(key);
        if (value) {
            this._reverseMap.delete(value);
        }
        return this._map.delete(key);
    }

    public deleteValue(value: V): boolean {
        const key = this._reverseMap.get(value);
        if (key) {
            this._map.delete(key);
        }
        return this._reverseMap.delete(value);
    }

    public clear(): void {
        this._map.clear();
        this._reverseMap.clear();
    }

    public get size(): number {
        return this._map.size;
    }

    public get keys(): IterableIterator<K> {
        return this._map.keys();
    }

    public get values(): IterableIterator<V> {
        return this._map.values();
    }

    public get kvEntries(): IterableIterator<[K, V]> {
        return this._map.entries();
    }

    public get vkEntries(): IterableIterator<[V, K]> {
        return this._reverseMap.entries();
    }
}
