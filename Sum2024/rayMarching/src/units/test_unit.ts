import { animContext, unit } from '../anim';
import { can2d } from '../main';
import { material } from '../material';
import {
  _matr,
  matr,
  matrIdentity,
  matrRotateX,
  matrRotateY,
  matrTranslate,
  r2d
} from '../mthmatr';
import { vec3 } from '../mthvec3';
import { blend, box, plane, shape, sphere, union } from '../shape';

export class test_unit extends unit {
  shpSphere: shape = new sphere(
    matrIdentity(),
    new material(
      vec3(0.1, 0.1, 0.1),
      vec3(0.8, 0.3, 0.1),
      vec3(0.7, 0.7, 0.7),
      40,
      -1
    ),
    1
  );
  shpPlane: shape = new plane(
    matrIdentity(),
    new material(
      vec3(0.1, 0.1, 0.1),
      vec3(0.3, 0.3, 0.3),
      vec3(0.2, 0.2, 0.2),
      5,
      -1
    ),
    vec3(0, 0, 0),
    vec3(0, 1, 0)
  );
  shpBox: shape = new box(
    matrTranslate(vec3(0, 1, 0)),
    new material(
      vec3(0.1, 0.1, 0.1),
      vec3(0.3, 0.9, 0.5),
      vec3(0.5, 0.5, 0.5),
      28,
      -1
    ),
    vec3(1, 1, 1)
  );
  shpBlend: blend = new blend(
    matrIdentity(),
    new material(
      vec3(0.1, 0.1, 0.1),
      vec3(0.3, 0.9, 0.5),
      vec3(0.5, 0.5, 0.5),
      28,
      -1
    ),
    this.shpPlane,
    this.shpBox,
    0.5
  );
  shpBlend1: blend = new blend(
    matrIdentity(),
    new material(
      vec3(0.1, 0.1, 0.1),
      vec3(0.3, 0.9, 0.5),
      vec3(0.5, 0.5, 0.5),
      28,
      -1
    ),
    this.shpBlend,
    this.shpSphere,
    0.5
  );

  render = (ani: animContext) => {
    // ani.drawShape(this.shpPlane);
    // this.shpSphere.trans = matrTranslate(vec3(0, 2, 3)).mulMatr(
    //   matrRotateY(ani.localTime * 100)
    // );
    // ani.drawShape(this.shpSphere);
    // ani.drawShape(this.shpBox);
    this.shpBlend1.ks = Math.abs(Math.sin(ani.localTime));
    (this.shpBlend1.shpA as blend).ks = Math.abs(Math.sin(ani.localTime));
    this.shpBlend1.shpB.trans = matrTranslate(vec3(0, 2, 2)).mulMatr(
      matrRotateY(ani.localTime * 100)
    );
    ani.drawShape(this.shpBlend1);
    // this.shpBlend.shpA.trans = matrTranslate(vec3(0, 2, 2)).mulMatr(
    // matrRotateY(ani.localTime * 100)
    // );
    // ani.drawShape(this.shpBlend);
  };
}
