import { _vec3 } from './mthvec3';

export class material {
  ka: _vec3;
  kd: _vec3;
  ks: _vec3;
  ph: number;
  texN: number = -1;

  constructor(ka: _vec3, kd: _vec3, ks: _vec3, ph: number, texN: number) {
    this.ka = ka;
    this.kd = kd;
    this.ks = ks;
    this.ph = ph;
    this.texN = texN;
  }

  write2Array(mas: number[]) {
    mas.push(
      this.ka.x,
      this.ka.y,
      this.ka.z,
      0,
      this.kd.x,
      this.kd.y,
      this.kd.z,
      0,
      this.ks.x,
      this.ks.y,
      this.ks.z,
      this.ph,
      this.texN,
      0,
      0,
      0
    );
  }
}
