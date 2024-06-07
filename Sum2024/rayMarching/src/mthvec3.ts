import { _matr, matr } from './mthmatr';

export class _vec3 {
  x: number;
  y: number;
  z: number;

  constructor(
    x: number | undefined | _vec3 | number[],
    y: number | undefined,
    z: number | undefined
  ) {
    if (x instanceof _vec3) {
      this.x = x.x;
      this.y = x.y;
      this.z = x.z;
    } else if (x instanceof Object) {
      this.x = x[0];
      this.y = x[1];
      this.z = x[2];
    } else if (x != undefined && y == undefined) {
      this.x = this.y = this.z = x;
    } else if (x != undefined && y != undefined && z != undefined) {
      this.x = x;
      this.y = y;
      this.z = z;
    } else {
      this.x = this.y = this.z = 0;
    }
  }

  add = (v: _vec3) => {
    return vec3(this.x + v.x, this.y + v.y, this.z + v.z);
  };

  sub = (v: _vec3) => {
    return vec3(this.x - v.x, this.y - v.y, this.z - v.z);
  };

  mulNum = (n: number) => {
    return vec3(this.x * n, this.y * n, this.z * n);
  };

  divNum = (n: number) => {
    return vec3(this.x / n, this.y / n, this.z / n);
  };

  neg = () => {
    return vec3(-this.x, -this.y, -this.z);
  };

  dot = (v: _vec3) => {
    return this.x * v.x + this.y * v.y + this.z * v.z;
  };

  cross = (v: _vec3) => {
    return vec3(
      this.y * v.z - v.y * this.z,
      v.x * this.z - this.x * v.z,
      this.x * v.y - v.x * this.y
    );
  };

  len2 = () => {
    return this.dot(this);
  };

  len = () => {
    const l = this.len2();

    if (l === 0 || l === 1) return l;
    else return Math.sqrt(l);
  };

  norm = () => {
    let len = this.len();
    return this.divNum(len);
  };

  mulMatr = (m: _matr) => {
    const w =
      this.x * m.a[0][3] + this.y * m.a[1][3] + this.z * m.a[2][3] + m.a[3][3];

    return vec3(
      (this.x * m.a[0][0] +
        this.y * m.a[1][0] +
        this.z * m.a[2][0] +
        m.a[3][0]) /
        w,
      (this.x * m.a[0][1] +
        this.y * m.a[1][1] +
        this.z * m.a[2][1] +
        m.a[3][1]) /
        w,
      (this.x * m.a[0][2] +
        this.y * m.a[1][2] +
        this.z * m.a[2][2] +
        m.a[3][2]) /
        w
    );
  };

  vecTransform = (m: _matr) => {
    return vec3(
      this.x * m.a[0][0] + this.y * m.a[1][0] + this.z * m.a[2][0],
      this.x * m.a[0][1] + this.y * m.a[1][1] + this.z * m.a[2][1],
      this.x * m.a[0][2] + this.y * m.a[1][2] + this.z * m.a[2][2]
    );
  };

  pointTransform = (m: _matr) => {
    return vec3(
      this.x * m.a[0][0] + this.y * m.a[1][0] + this.z * m.a[2][0] + m.a[3][0],
      this.x * m.a[0][1] + this.y * m.a[1][1] + this.z * m.a[2][1] + m.a[3][1],
      this.x * m.a[0][2] + this.y * m.a[1][2] + this.z * m.a[2][2] + m.a[3][2]
    );
  };
}

export function vec3(
  x: number | undefined | _vec3 | number[],
  y: number | undefined,
  z: number | undefined
) {
  return new _vec3(x, y, z);
}

export class vec4 {
  x: number;
  y: number;
  z: number;
  w: number;

  constructor(x: number, y: number, z: number, w: number) {
    this.x = x;
    this.y = y;
    this.z = z;
    this.w = w;
  }
}
