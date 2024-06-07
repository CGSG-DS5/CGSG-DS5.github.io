import { material } from './material';
import { _matr } from './mthmatr';
import { _vec3, vec4 } from './mthvec3';

export class shape {
  trans: _matr;
  mtl: material;
  type: number;

  constructor(trans: _matr, mtl: material, type: number) {
    this.trans = trans;
    this.mtl = mtl;
    this.type = type;
  }

  write2Array(mas: number[]) {
    let invTrans = this.trans.inverse();
    for (let i = 0; i < 4; i++)
      for (let j = 0; j < 4; j++) mas.push(invTrans.a[i][j]);
    this.mtl.write2Array(mas);
    mas.push(this.type, 0, 0, 0);
  }
}

export class sphere extends shape {
  radius: number;

  constructor(trans: _matr, mtl: material, radius: number) {
    super(trans, mtl, 0);
    this.radius = radius;
  }

  write2Array(mas: number[]) {
    super.write2Array(mas);
    mas.push(this.radius, 0, 0, 0);
    mas.push(0, 0, 0, 0);
  }
}

export class box extends shape {
  sizes: _vec3;

  constructor(trans: _matr, mtl: material, sizes: _vec3) {
    super(trans, mtl, 1);
    this.sizes = sizes;
  }

  write2Array(mas: number[]) {
    super.write2Array(mas);
    mas.push(this.sizes.x, this.sizes.y, this.sizes.z, 0);
    mas.push(0, 0, 0, 0);
  }
}

export class plane extends shape {
  normal: _vec3;
  offset: number;

  constructor(trans: _matr, mtl: material, point: _vec3, normal: _vec3) {
    super(trans, mtl, 2);
    this.normal = normal.norm();
    this.offset = this.normal.dot(point);
  }

  write2Array(mas: number[]) {
    super.write2Array(mas);
    mas.push(this.normal.x, this.normal.y, this.normal.z, this.offset);
    mas.push(0, 0, 0, 0);
  }
}
