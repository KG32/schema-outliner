import { fork, ChildProcess } from 'child_process';

class OutlinerService {
  private process: ChildProcess | null;

  constructor() {
    this.process = null;
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
    this.process?.on('message', (msg) => {
      console.log('process message');
      console.log(msg);
    });
    this.process?.on('exit', (code) => {
      console.log('process exit', code);
    });
  }

  async startOutliner() {
    console.log('start outliner');
    if (this.process) {
      this.killOutliner();
    } else {
      console.log('process slot free');
      this.process = fork(`${__dirname}/outliner/outlinerProcess.ts`);
    }
  }

  async killOutliner() {
    if (this.process) {
      this.process.kill();
      this.process = null;
      this.watchForProcess();
    }
  }

  pingProcess() {
    this.process?.send('ping');
  }
}

export default new OutlinerService();
