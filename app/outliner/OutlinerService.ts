import * as path from 'path';
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
      this.process = null;
    });
  }

  async startOutliner(uri: string, db: string) {
    console.log('start outliner');
    if (this.process) {
      console.log('process already exists');
      return;
    } else {
      this.process = fork(`${__dirname}/outliner/outlinerProcess.js`);
    }
  }

  async killOutliner() {
    if (this.process) {
      this.process.kill();
      this.process = null;
      this.watchForProcess();
    }
  }

  requestOutline() {
    this.process?.send('outline');
  }

  pingProcess() {
    this.process?.send('ping');
  }
}

export default new OutlinerService();
