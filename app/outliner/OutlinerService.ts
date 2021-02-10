import { getDbData } from './getDbData';

export interface CollectionData {
  name: string;
  docs: {
    [key: string]: any;
  }
}

export interface OutlinedCollection {
  name: string;
  keys: OutlinedKey[];
  docsCount: number;
}

interface OutlinedKey {
  keyName: string;
  count: number;
  percentage: number;
}

class OutlinerService {

  outlineCollections(collectionsData: CollectionData[]): OutlinedCollection[] {
    const outlinedCollections: OutlinedCollection[] = [];
    for (let i = 0; i < collectionsData.length; i++) {
      const collection = collectionsData[i];
      const outlinedCollection: OutlinedCollection = {
        name: collection.name,
        keys: [],
        docsCount: collection.docs.length,
      };
      const schemaKeys: {[key: string] : any} = {};
      const { docs } = collection;
      const docsCount = docs.length;
      for (let d = 0; d < docsCount; d++) {
        const doc = docs[d];
        for (const [key] of Object.entries(doc)) {
          const existingKeyLog = schemaKeys[key];
            if (existingKeyLog) {
              schemaKeys[key] = existingKeyLog + 1;
            } else {
              schemaKeys[key] = 1;
            }
        }
      }
      for (const schemaKey in schemaKeys) {
        if ({}.hasOwnProperty.call(schemaKeys, schemaKey)) {
          const count = schemaKeys[schemaKey];
          const percentage = (count / docsCount) * 100;
          const outlinedKey: OutlinedKey = { keyName: schemaKey, count, percentage: Number(percentage.toFixed(2)) };
          outlinedCollection.keys.push(outlinedKey);
        }
      }
      // outlinedCollection.keys.sort((x, y) => x.percentage - y.percentage);
      outlinedCollections.push(outlinedCollection);
    }
    return outlinedCollections;
  }

  async getOutlinedData(uri: string) {
    const dbCollections = await getDbData(uri);
    return this.outlineCollections(dbCollections);
  }
}

export default new OutlinerService();
