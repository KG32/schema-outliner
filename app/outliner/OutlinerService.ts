import { fork, ChildProcess } from 'child_process';


class OutlinerService {
  private process: ChildProcess | null;
  private tmpDbData: [{ name: string, docs: [any]}] | null;

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
          console.log('db data:', payload);
          this.tmpDbData = payload;
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
    console.log('start outliner');
    if (this.process) {
      console.log('process already exists');
      return;
    } else {
      this.process = fork(`${__dirname}/outliner/outlinerProcess.js`, [], { silent: true });
    }
  }

  requestDbData() {
    this.process?.send({ type: 'dbData', options: { uri: 'mongodb+srv://outlineragent:pass123@cluster0.p83b2.mongodb.net/testdb?retryWrites=true&w=majority'}});
  }

  getOutlinedData() {
    this.requestDbData();
    const tmpDbDataInterval = setInterval(() => {
      console.log('interval check');
      if (this.tmpDbData) {
        console.log('clear interval');
        console.log(this.tmpDbData);
        clearInterval(tmpDbDataInterval);
      }
    }, 500);
  }
}

export default new OutlinerService();
