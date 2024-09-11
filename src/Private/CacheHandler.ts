import NodeCache from 'node-cache';

class CacheHandler {
  declare cache: NodeCache;
  constructor() {
    this.cache = new NodeCache({ stdTTL: 300, maxKeys: -1, checkperiod: 180 });
  }

  set(key: string, value: any): any {
    return this.cache.set(key, value);
  }

  has(key: string): boolean {
    return this.cache.has(key);
  }

  get(key: string): any {
    return this.cache.get(key);
  }

  keys(): string[] {
    return this.cache.keys();
  }

  size(): number {
    return this.cache.keys().length;
  }

  clear(): void {
    this.cache.flushAll();
  }
}

export default CacheHandler;
