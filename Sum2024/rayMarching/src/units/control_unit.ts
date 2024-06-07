import { animContext, unit } from '../anim';
import { can2d } from '../main';
import {
  _matr,
  matr,
  matrRotateX,
  matrRotateY,
  matrTranslate,
  r2d
} from '../mthmatr';
import { vec3 } from '../mthvec3';

export class control_unit extends unit {
  PrevTime = 0;
  PrevW = 0;
  PrevH = 0;
  init = (ani: animContext) => {};
  response = (ani: animContext) => {
    let Dist, plen, cosT, sinT, cosP, sinP, Azimuth, Elevator, sx, sy;

    if (
      ani.globalTime - this.PrevTime > 1 ||
      this.PrevW != ani.rnd.cam.frameW ||
      this.PrevH != ani.rnd.cam.frameH
    ) {
      can2d.fillStyle = 'yellow';
      can2d.font = '30px sans-serif';

      can2d.clearRect(0, 0, can2d.canvas.width, can2d.canvas.height);
      can2d.fillText('FPS: ' + ani.fps.toFixed(1), 20, 50);
      this.PrevTime = ani.globalTime;
      this.PrevW = ani.rnd.cam.frameW;
      this.PrevH = ani.rnd.cam.frameH;
    }

    if (ani.keysClick['P'.charCodeAt(0)]) ani.isPause = !ani.isPause;

    Dist = ani.rnd.cam.at.sub(ani.rnd.cam.loc).len();
    cosT = (ani.rnd.cam.loc.y - ani.rnd.cam.at.y) / Dist;
    sinT = Math.sqrt(1 - cosT * cosT);
    plen = Dist * sinT;
    cosP = (ani.rnd.cam.loc.z - ani.rnd.cam.at.z) / plen;
    sinP = (ani.rnd.cam.loc.x - ani.rnd.cam.at.x) / plen;

    Azimuth = r2d(Math.atan2(sinP, cosP));
    Elevator = r2d(Math.atan2(sinT, cosT));

    Azimuth +=
      (ani.globalDeltaTime *
        (-30 * Number(ani.keys[ani.VK_LBUTTON]) * ani.mdX +
          47 *
            (Number(ani.keys[ani.VK_LEFT]) - Number(ani.keys[ani.VK_RIGHT])) *
            10)) /
      5;
    Elevator +=
      (ani.globalDeltaTime *
        (-30 * Number(ani.keys[ani.VK_LBUTTON]) * ani.mdY +
          47 *
            (Number(ani.keys[ani.VK_UP]) -
              Number(ani.keys[ani.VK_DOWN]) * 10))) /
      5;
    Dist -=
      ((ani.globalDeltaTime *
        ((3 + Number(ani.keys[ani.VK_CONTROL]) * 10) *
          (ani.mdZ / 20 +
            (Number(ani.keys['W'.charCodeAt(0)]) -
              Number(ani.keys['S'.charCodeAt(0)]))))) /
        5) *
      ani.rnd.cam.at.sub(ani.rnd.cam.loc).len();

    if (Elevator < 0.08) Elevator = 0.08;
    else if (Elevator > 178.9) Elevator = 178.9;
    if (Dist < 0.1) Dist = 0.1;

    sx =
      (((Number(ani.keys[ani.VK_RBUTTON]) * -ani.mdX * ani.rnd.cam.wp) /
        ani.rnd.cam.frameW) *
        Dist) /
      ani.rnd.cam.projDist;
    sy =
      (((-Number(ani.keys[ani.VK_RBUTTON]) * -ani.mdY * ani.rnd.cam.hp) /
        ani.rnd.cam.frameH) *
        Dist) /
      ani.rnd.cam.projDist;

    let dv = ani.rnd.cam.right.mulNum(sx).add(ani.rnd.cam.up.mulNum(sy));

    ani.rnd.cam.at = ani.rnd.cam.at.add(dv);
    ani.rnd.cam.loc = ani.rnd.cam.loc.add(dv);

    ani.camSet(
      vec3(0, Dist, 0).pointTransform(
        matrRotateX(Elevator)
          .mulMatr(matrRotateY(Azimuth))
          .mulMatr(matrTranslate(ani.rnd.cam.at))
      ),
      ani.rnd.cam.at,
      vec3(0, 1, 0)
    );
  };
}
