import { fork, ChildProcess } from 'child_process';

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
  private process: ChildProcess | null;
  private tmpDbData: {dbName: string, collections: [name: string, docs: any]} | null;

  constructor() {
    this.process = null;
    this.tmpDbData = null;
    this.watchForProcess();
  }

  watchForProcess() {
    const processWatcher = setInterval(() => {
      if (this.process) {
        this.handleProcessEvents();
        clearInterval(processWatcher);
      }
    }, 1000);
  }

  handleProcessEvents() {
    this.process?.on('message', (data) => {
      const { type, payload } = data;
      switch(type) {
        case 'dbData':
          this.tmpDbData = { dbName: payload.dbName, collections: payload.collections };
          break;
        case 'connectionErr':
          switch (payload.errMsg) {
            case 'bad auth : Authentication failed.':
              alert('Auth error.');
              break;
            case 'dbEmptyOrNotFound':
              alert('DB empty of not found.');
              break;
            default:
              alert('Connection error');
              console.log(payload.errMsg);
          }
          break;
        default:
        console.error('unknown msg type', type);
      }
    });
    this.process?.on('exit', (code) => {
      console.log('process exit', code);
      this.process = null;
    });
    this.process?.stdout?.on('data', (data) => {
      console.log('STDOUT', data.toString());
    });
    this.process?.stderr?.on('data', (data) => {
      console.error('SDTERR', data.toString());
    })
  }

  async startOutliner() {
    if (this.process) return;
    this.process = fork(`${__dirname}/outliner/outlinerProcess.js`, [], { silent: true });
  }

  requestDbData(uri: string) {
    this.process?.send({type: 'dbData', options: { uri }});
  }

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

  getOutlinedData(uri: string) {
    return new Promise((resolve) => {
      this.requestDbData(uri);
      const tmpDbDataInterval = setInterval(() => {
        if (this.tmpDbData) {
          clearInterval(tmpDbDataInterval);
          const { collections } = this.tmpDbData;
          this.tmpDbData = null;
          const outlinedData = this.outlineCollections(collections);
          console.log('outlined data');
          resolve(outlinedData);
        }
      }, 500);
    })
  }
}

export default new OutlinerService();
