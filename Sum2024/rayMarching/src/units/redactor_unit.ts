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

export class redactor_unit extends unit {
  shps: shape[] = [];

  response = (ani: animContext) => {
    let px = ((2 * ani.mX + 1) / ani.rnd.cam.frameW - 1) * ani.rnd.cam.wp,
      py = (-(2 * ani.mY + 1) / ani.rnd.cam.frameH + 1) * ani.rnd.cam.hp;
    let dir = ani.rnd.cam.dir
        .mulNum(ani.rnd.cam.projDist)
        .add(ani.rnd.cam.right.mulNum(px))
        .add(ani.rnd.cam.up.mulNum(py)),
      org = ani.rnd.cam.loc.add(dir);
    dir = dir.norm();
    let t = -org.y / dir.y;

    if (t < 0) return;

    let pnt = org.add(dir.mulNum(t));
    pnt.y = 0.2 + Math.random() * 2;

    if (ani.keysClick['1'.charCodeAt(0)]) {
      this.shps.push(
        new sphere(
          matrTranslate(pnt),
          new material(
            vec3(Math.random(), Math.random(), Math.random()),
            vec3(Math.random(), Math.random(), Math.random()),
            vec3(Math.random(), Math.random(), Math.random()),
            Math.random() * 100,
            -1
          ),
          pnt.y
        )
      );
    }

    if (ani.keysClick['2'.charCodeAt(0)]) {
      this.shps.push(
        new box(
          matrTranslate(pnt),
          new material(
            vec3(Math.random(), Math.random(), Math.random()),
            vec3(Math.random(), Math.random(), Math.random()),
            vec3(Math.random(), Math.random(), Math.random()),
            Math.random() * 100,
            -1
          ),
          vec3(pnt.y, pnt.y, pnt.y)
        )
      );
    }

    if (ani.keys[ani.VK_CONTROL] && ani.keysClick['Z'.charCodeAt(0)])
      this.shps.pop();
  };

  render = (ani: animContext) => {
    for (let i = 0; i < this.shps.length; i++) ani.drawShape(this.shps[i]);
  };
}
