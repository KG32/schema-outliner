import { fork, ChildProcess } from 'child_process';

class OutlinerService {
  private process: ChildProcess;

  async startOutliner() {
    console.log('start outliner');
    this.process = fork(`${__dirname}/outliner/outlinerProcess`);
  }

  async getProcessInfo() {

  }
}

export default new OutlinerService();
