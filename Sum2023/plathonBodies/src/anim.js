import { resize } from "./control";
import { dsRnd, myTimer } from "./main";

export class dsUnit {
  constructor() {
    const f = () => {};
    this.init = this.close = this.response = this.render = f;
  }
}

export function dsAnim() {
  this.units = [];
  this.addUnit = (uni) => {
    this.units.push(uni);
    uni.init();
  };

  this.render = () => {
    resize();
    myTimer.response();

    for (let i = 0; i < this.units.length; i++) {
      this.units[i].response();
    }

    dsRnd.start();
    for (let i = 0; i < this.units.length; i++) {
      this.units[i].render();
    }
  };

  return this;
}
