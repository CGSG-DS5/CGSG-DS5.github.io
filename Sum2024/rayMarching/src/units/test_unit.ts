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
import { box, plane, shape, sphere } from '../shape';

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

  render = (ani: animContext) => {
    this.shpSphere.trans = matrTranslate(vec3(0, 2, 3)).mulMatr(
      matrRotateY(ani.localTime * 100)
    );
    ani.drawShape(this.shpSphere);
    ani.drawShape(this.shpPlane);
    ani.drawShape(this.shpBox);
  };
}
