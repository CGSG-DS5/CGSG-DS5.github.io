import { input } from './input';
import { _matr } from './mthmatr';
import { _vec3 } from './mthvec3';
import { rndContext } from './rnd';
import { shape } from './shape';

export class unit {
  init = (ani: animContext) => {};
  response = (ani: animContext) => {};
  render = (ani: animContext) => {};
}

export class animContext extends input {
  rnd: rndContext = new rndContext();
  scale: number = 1 / 3;

  units: unit[] = [];

  addUnit = (uni: unit) => {
    this.units.push(uni);
    uni.init(this);
  };

  init = () => {
    super.init();
    this.rnd.init();
  };

  resize = (w: number, h: number) => {
    this.rnd.resize(this.scale * w, this.scale * h);
  };

  camSet = (loc: _vec3, at: _vec3, up1: _vec3) => {
    this.rnd.camSet(loc, at, up1);
  };

  projSet = (farClip: number, projDist: number, projSize: number) => {
    this.rnd.projSet(farClip, projDist, projSize);
  };

  response = () => {
    super.response();

    this.mX *= this.scale;
    this.mY *= this.scale;

    if (!this.rnd.UBOutils) return;
    this.rnd.UBOutils.update(
      new Float32Array([
        this.localTime,
        this.globalTime,
        this.localDeltaTime,
        this.globalDeltaTime
      ]),
      0,
      4 * 4 * 1
    );
    this.rnd.frameStart();

    for (let i = 0; i < this.units.length; i++) this.units[i].response(this);
    for (let i = 0; i < this.units.length; i++) this.units[i].render(this);

    /*gl.clearColor(Math.abs(Math.sin(this.tmr.globalTime)), 0, 0, 1);
    gl.clear(gl.COLOR_BUFFER_BIT);*/

    this.rnd.frameEnd();
  };

  drawShape = (shp: shape) => {
    this.rnd.drawShape(shp);
  };
}
