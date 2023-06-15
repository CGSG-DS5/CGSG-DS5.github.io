import { ds_cam, dsRnd } from "./main.js";
import {
  buffer,
  index_buffer,
  vertex_buffer,
  uniform_buffer,
} from "./buffer.js";
import { vec3, _vec3 } from "./mthvec3.js";

export class dsMtl {
  constructor(name, ka, kd, ks, ph, trans, shdNo) {
    this.name = name;
    this.ka = ka;
    this.kd = kd;
    this.ks = ks;
    this.ph = ph;
    this.trans = trans;
    this.shdNo = shdNo;

    let buf = [
      this.ka.x,
      this.ka.y,
      this.ka.z,
      this.ph,

      this.kd.x,
      this.kd.y,
      this.kd.z,
      this.trans,

      this.ks.x,
      this.ks.y,
      this.ks.z,
      0.0,
    ];

    this.uboBuf = new uniform_buffer("MtlUBO", buf.length * 4, 1);
    this.uboBuf.update(buf);
  }

  free() {
    this.uboBuf.free();
  }
}

export function dsRndMtl(gl) {
  this.getDef = () => {
    return new dsMtl("Default", vec3(0.1), vec3(0.9), vec3(0.3), 30.0, 1, 0);
  };

  this.add = (mtl) => {
    for (let i = 0; i < this.mtlSize; i++) {
      if (mtl.name === this.mtls[i]) return i;
    }
    this.mtls[this.mtlSize] = mtl;
    return this.mtlSize++;
  };

  this.get = (mtlNo) => {
    if (mtlNo < 0 || mtlNo >= this.mtlSize) return this.mtls[0];
    return this.mtls[mtlNo];
  };

  this.apply = (mtlNo) => {
    let mtl = this.get(mtlNo);

    let prg = dsRnd.shd.shdGet(mtl.shdNo).progId;

    if (prg === undefined) return 0;
    window.gl.useProgram(prg);

    mtl.uboBuf.apply(prg);

    return prg;
  };

  this.free = () => {
    for (let i = 0; i < this.mtlSize; i++) this.mtls[i].free();
  };

  this.mtlSize = 0;
  this.mtls = [];
  this.add(this.getDef());

  return this;
}
