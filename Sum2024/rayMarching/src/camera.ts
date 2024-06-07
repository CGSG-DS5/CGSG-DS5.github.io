import { _matr, matr, matrZero } from './mthmatr';
import { vec3, _vec3 } from './mthvec3';

/* Camera class */
export class camera {
  loc: _vec3 = vec3(0, 0, 0); /* Camera location */
  dir: _vec3 = vec3(0, 0, 0); /* Camera forward direction */
  right: _vec3 = vec3(0, 0, 0); /* Camera right direction */
  up: _vec3 = vec3(0, 0, 0); /* Camera up direction */
  at: _vec3 = vec3(0, 0, 0); /* Camera location */

  projDist: number = 0.1;
  projSize: number = 0.1;
  farClip: number = 1000;
  wp: number = 0.1;
  hp: number = 0.1;
  frameW: number = 100;
  frameH: number = 100;

  set = (loc: _vec3, at: _vec3, up1: _vec3) => {
    this.loc = loc;
    this.dir = at.sub(loc).norm();
    this.right = this.dir.cross(up1).norm();
    this.up = this.right.cross(this.dir);
  };

  setProj = (farClip: number, projDist: number, projSize: number) => {
    this.farClip = farClip;
    this.projDist = projDist;
    this.projSize = projSize;

    this.wp = this.hp = this.projSize;

    if (this.frameW > this.frameH) this.wp *= this.frameW / this.frameH;
    else this.hp *= this.frameH / this.frameW;
  };

  resize = (w: number, h: number) => {
    this.frameW = w;
    this.frameH = h;

    this.wp = this.hp = this.projSize;

    if (this.frameW > this.frameH) this.wp *= this.frameW / this.frameH;
    else this.hp *= this.frameH / this.frameW;
  };
}
