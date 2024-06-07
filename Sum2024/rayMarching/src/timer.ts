export class timer {
  isPause: boolean = false;
  globalTime: number = 0;
  globalDeltaTime: number = 0;
  localTime: number = 0;
  localDeltaTime: number = 0;
  fps: number = 30.7;

  private startTime: number = 0;
  private oldTime: number = 0;
  private oldTimeFPS: number = 0;
  private pauseTime: number = 0;
  private frameCounter: number = 0;

  init() {
    let date: Date = new Date();
    this.startTime =
      this.oldTimeFPS =
      this.oldTime =
      this.globalTime =
      this.localTime =
        Date.now() / 1000;
  }

  response() {
    let date: Date = new Date();
    let t = Date.now() / 1000;
    this.globalTime = t;
    this.globalDeltaTime = t - this.oldTime;

    if (this.isPause) {
      this.localDeltaTime = 0;
      this.pauseTime += this.globalDeltaTime;
    } else {
      this.localDeltaTime = this.globalDeltaTime;
      this.localTime = t - this.pauseTime - this.startTime;
    }

    this.frameCounter++;
    if (t - this.oldTimeFPS > 3) {
      this.fps = this.frameCounter / (t - this.oldTimeFPS);
      this.oldTimeFPS = t;
      this.frameCounter = 0;
    }

    this.oldTime = t;
  }
}
