import { dsUnit } from "../anim";
import { camCtrl, isPressedLeftAll, keys } from "../control";
import { dsRnd, ds_cam, myTimer } from "../main";
import { d2r, r2d } from "../mth";
import {
  matrIdentity,
  matrRotateX,
  matrRotateY,
  matrRotateZ,
  matrScale,
  matrTranslate,
} from "../mthmat4";
import { vec3 } from "../mthvec3";
import { dsMtl } from "../mtl";
import { primsLoad } from "../prims";
import { isTankCam } from "../control";
import { dsPrim, dsRndShdAddnonF, dsRndShdAddnonI, dsVert } from "../rnd";
import { vec2 } from "../mthvec2";
import { vec4 } from "../mthvec4";

const gravA = 9.80665;
const vecGravA = vec3(0, -gravA, 0);

class tankShells {
  constructor(prs) {
    this.shells = [];
    this.prs = prs;
  }

  add = (pos, speed) => {
    this.shells.push({ pos: pos, speed: speed, time: 0 });
  };

  update = () => {
    for (let i = 0; i < this.shells.length; i++) {
      // || pos.y < 0
      if (this.shells[i].time >= 30) this.shells.splice(i, 1);
      else {
        this.shells[i].pos = this.shells[i].pos
          .add(this.shells[i].speed.mulNum(myTimer.localDeltaTime))
          .add(
            vecGravA.mulNum(
              (myTimer.localDeltaTime * myTimer.localDeltaTime) / 2
            )
          );
        this.shells[i].speed.y -= gravA * myTimer.localDeltaTime;
        this.shells[i].speed.time += myTimer.localDeltaTime;
      }
    }
  };

  draw = () => {
    for (let i = 0; i < this.shells.length; i++) {
      const dist = this.shells[i].speed.len();
      const cosT = this.shells[i].speed.y / dist;
      const sinT = Math.sqrt(1 - cosT * cosT);
      const plen = dist * sinT;
      const cosP = this.shells[i].speed.z / plen;
      const sinP = this.shells[i].speed.x / plen;

      const azimuth = r2d(Math.atan2(sinP, cosP));
      const elevator = r2d(Math.atan2(sinT, cosT));

      this.prs.draw(
        matrScale(vec3(0.003))
          .mulMatr(matrRotateX(180))
          .mulMatr(matrRotateX(elevator))
          .mulMatr(matrRotateY(azimuth))
          .mulMatr(matrTranslate(this.shells[i].pos))
      );
    }
  };
}

export class u_tank extends dsUnit {
  constructor(pos) {
    super();
    this.tank = null;
    this.pos = pos;
    let prom = primsLoad("../bin/models/Sherman.g3dm");
    this.shells = null;
    prom.then((res) => {
      this.tank = res;
      const n = dsRnd.shd.add("tank");
      for (let i = 0; i < this.tank.numOfPrims; i++)
        dsRnd.mtl.get(this.tank.prims[i].mtlNo).shdNo = n;

      const len = this.tank.maxBB.y - this.tank.minBB.y;
      this.matrScale = matrScale(vec3(2.743 / len));
      this.tank.trans = this.matrScale.mulMatr(matrTranslate(this.pos));

      let promShell = primsLoad("../bin/models/bomb.g3dm");
      promShell.then((res) => {
        this.shells = new tankShells(res);
      });
    });
    this.cam = false;
    this.anglWheels = this.anglTower = this.anglGun = 0;
    this.anglY = 0;
    this.reloading = 0;
    this.reloadTime = 3;

    const verts = [
      dsVert(vec3(-1, 1, 0), vec2(0), vec3(0), vec4(0)),
      dsVert(vec3(-1, -1, 0), vec2(0), vec3(0), vec4(0)),
      dsVert(vec3(1, 1, 0), vec2(0), vec3(0), vec4(0)),
      dsVert(vec3(1, -1, 0), vec2(0), vec3(0), vec4(0)),
    ];
    this.reloadCirc = new dsPrim(window.gl.TRIANGLE_STRIP, verts, null);
    let mtl = new dsMtl(
      "Reload tank material",
      dsRnd.mtl.mtls[0].ka,
      dsRnd.mtl.mtls[0].kd,
      dsRnd.mtl.mtls[0].ks,
      dsRnd.mtl.mtls[0].ph,
      1,
      0
    );
    mtl.shdNo = dsRnd.shd.add("tankReload");
    this.reloadCirc.mtlNo = dsRnd.mtl.add(mtl);
  }

  ctrlTank = (e) => {
    let dist = ds_cam.at.sub(ds_cam.loc).len();
    let cosT = (ds_cam.loc.y - ds_cam.at.y) / dist;
    let sinT = Math.sqrt(1 - cosT * cosT);
    let plen = dist * sinT;
    let cosP = (ds_cam.loc.z - ds_cam.at.z) / plen;
    let sinP = (ds_cam.loc.x - ds_cam.at.x) / plen;

    let azimuth = r2d(Math.atan2(sinP, cosP));
    let elevator = r2d(Math.atan2(sinT, cosT));

    azimuth -= myTimer.globalDeltaTime * e.movementX * 10;
    elevator -= myTimer.globalDeltaTime * e.movementY * 10;
    e.preventDefault();

    dist +=
      ((myTimer.globalDeltaTime *
        ((e.deltaY === undefined ? 0 : e.deltaY) +
          20 * (keys[34] - keys[33]))) /
        20) *
      dist;

    if (elevator < 0.1) elevator = 0.1;
    else if (elevator > 178.9) elevator = 178.9;
    if (dist < 0.1) dist = 0.1;

    let at = this.tank.prims[14].maxBB
      .add(this.tank.prims[14].minBB)
      .divNum(2)
      .add(vec3(0, 0.75, 0))
      .pointTransform(this.tank.trans);

    let loc = vec3(0, dist, 0).pointTransform(
      matrRotateX(elevator)
        .mulMatr(matrRotateY(azimuth))
        .mulMatr(matrTranslate(at))
    );

    ds_cam.camSet(loc, at, vec3(0, 1, 0));

    e.preventDefault();
  };

  response = () => {
    if (this.tank === null) return;
    if (isTankCam !== this.cam) {
      this.cam = isTankCam;
      const can = document.getElementById("dsCan");
      if (!isTankCam) {
        can.removeEventListener("mousemove", this.ctrlTank);
        can.removeEventListener("mousewheel", this.ctrlTank);
        can.addEventListener("mousemove", camCtrl);
        can.addEventListener("mousewheel", camCtrl);
        camCtrlCan = camCtrl;
      } else {
        can.removeEventListener("mousemove", camCtrl);
        can.removeEventListener("mousewheel", camCtrl);
        can.addEventListener("mousemove", this.ctrlTank);
        can.addEventListener("mousewheel", this.ctrlTank);
        camCtrlCan = this.ctrlTank;

        let dist = ds_cam.at.sub(ds_cam.loc).len();
        let cosT = (ds_cam.loc.y - ds_cam.at.y) / dist;
        let sinT = Math.sqrt(1 - cosT * cosT);
        let plen = dist * sinT;
        let cosP = (ds_cam.loc.z - ds_cam.at.z) / plen;
        let sinP = (ds_cam.loc.x - ds_cam.at.x) / plen;

        let azimuth = r2d(Math.atan2(sinP, cosP));
        let elevator = r2d(Math.atan2(sinT, cosT));

        if (elevator < 0.1) elevator = 0.1;
        else if (elevator > 178.9) elevator = 178.9;
        if (dist < 0.1) dist = 0.1;

        let at = this.tank.prims[14].maxBB
          .add(this.tank.prims[14].minBB)
          .divNum(2)
          .add(vec3(0, 0.75, 0))
          .pointTransform(this.tank.trans);

        let loc = vec3(0, dist, 0).pointTransform(
          matrRotateX(elevator)
            .mulMatr(matrRotateY(azimuth))
            .mulMatr(matrTranslate(at))
        );

        ds_cam.camSet(loc, at, vec3(0, 1, 0));
      }
    }
    if (!isTankCam) this.anglTower += myTimer.localDeltaTime * 30 * 0;
    else {
      /* Movement */
      let v = vec3(
        this.tank.prims[14].maxBB.x,
        this.tank.prims[14].maxBB.y,
        this.tank.prims[14].minBB.z
      );
      this.pos = this.pos.add(
        this.tank.prims[14].maxBB
          .pointTransform(this.tank.trans)
          .sub(v.pointTransform(this.tank.trans))
          .mulNum((keys[87] - keys[83]) * 5 * myTimer.localDeltaTime)
      );
      this.anglY +=
        (keys[87] - keys[83] !== 0 ? 0.5 * (keys[87] - keys[83]) : 1) *
        (keys[65] - keys[68]) *
        80 *
        myTimer.localDeltaTime;

      let dt = (keys[87] - keys[83]) * myTimer.localDeltaTime * 1000;
      if (dt === 0) dt = (keys[68] - keys[65]) * myTimer.localDeltaTime * 1000;
      this.anglWheels += dt;

      this.tank.trans = this.matrScale
        .mulMatr(matrRotateY(this.anglY))
        .mulMatr(matrTranslate(this.pos));

      let dist = ds_cam.at.sub(ds_cam.loc).len();
      let cosT = (ds_cam.loc.y - ds_cam.at.y) / dist;
      let sinT = Math.sqrt(1 - cosT * cosT);
      let plen = dist * sinT;
      let cosP = (ds_cam.loc.z - ds_cam.at.z) / plen;
      let sinP = (ds_cam.loc.x - ds_cam.at.x) / plen;

      let azimuth = r2d(Math.atan2(sinP, cosP));
      let elevator = r2d(Math.atan2(sinT, cosT));

      if (elevator < 0.1) elevator = 0.1;
      else if (elevator > 178.9) elevator = 178.9;
      if (dist < 0.1) dist = 0.1;

      let at = this.tank.prims[14].maxBB
        .add(this.tank.prims[14].minBB)
        .divNum(2)
        .add(vec3(0, 0.75, 0))
        .pointTransform(this.tank.trans);

      let loc = vec3(0, dist, 0).pointTransform(
        matrRotateX(elevator)
          .mulMatr(matrRotateY(azimuth))
          .mulMatr(matrTranslate(at))
      );

      ds_cam.camSet(loc, at, vec3(0, 1, 0));

      /*  */

      let avrg = this.tank.prims[15].maxBB
        .add(this.tank.prims[15].minBB)
        .divNum(2);

      /* Firing */
      if (this.shells !== null)
        if (isPressedLeftAll && this.reloading <= 0) {
          let speed = avrg
            .pointTransform(this.tank.prims[15].trans.mulMatr(this.tank.trans))
            .sub(
              vec3(avrg.x, avrg.y, this.tank.prims[15].minBB.z).pointTransform(
                this.tank.prims[15].trans.mulMatr(this.tank.trans)
              )
            )
            .norm()
            .mulNum(50);
          let pos = avrg.pointTransform(
            this.tank.prims[15].trans.mulMatr(this.tank.trans)
          );
          this.shells.add(pos, speed);
          this.reloading = this.reloadTime;
        }

      /* Rotating tower */
      let org = avrg.pointTransform(
        this.tank.prims[14].trans.mulMatr(this.tank.trans)
      );
      let t = ds_cam.loc.sub(org).dot(ds_cam.up) / ds_cam.up.len2();
      let intrsc = ds_cam.up.mulNum(t).add(org);
      let cosA =
        intrsc.sub(ds_cam.at).dot(ds_cam.dir) /
        (intrsc.sub(ds_cam.at).len() * ds_cam.dir.len());
      let angle = Math.acos(Math.max(Math.min(cosA, 1), -1));
      angle = r2d(angle);

      if (Math.abs(angle) > myTimer.localDeltaTime * 30) {
        let cosB =
          intrsc.sub(ds_cam.at).dot(ds_cam.right) /
          (intrsc.sub(ds_cam.at).len() * ds_cam.right.len());

        this.anglTower += (cosB > 0 ? 1 : -1) * myTimer.localDeltaTime * 30;
      } else {
        let cosB =
          intrsc.sub(ds_cam.at).dot(ds_cam.right) /
          (intrsc.sub(ds_cam.at).len() * ds_cam.right.len());

        this.anglTower += (cosB > 0 ? 1 : -1) * angle;
      }

      /* Rotating gun */
      org = avrg.pointTransform(
        this.tank.prims[15].trans.mulMatr(this.tank.trans)
      );
      t = ds_cam.loc.sub(org).dot(ds_cam.right) / ds_cam.right.len2();
      intrsc = org.add(ds_cam.right.mulNum(t));

      org = vec3(avrg.x, avrg.y, this.tank.prims[15].minBB.z).pointTransform(
        this.tank.prims[15].trans.mulMatr(this.tank.trans)
      );
      t = ds_cam.loc.sub(org).dot(ds_cam.right) / ds_cam.right.len2();
      let intrsc1 = ds_cam.right.mulNum(t).add(org);

      cosA =
        intrsc.sub(intrsc1).dot(ds_cam.dir) /
        (intrsc.sub(intrsc1).len() * ds_cam.dir.len());
      angle = Math.acos(Math.max(Math.min(cosA, 1), -1));
      angle = r2d(angle);

      if (Math.abs(angle) > myTimer.localDeltaTime * 10) {
        let cosB =
          intrsc.sub(intrsc1).dot(ds_cam.up) /
          (intrsc.sub(intrsc1).len() * ds_cam.up.len());

        this.anglGun += (cosB > 0 ? -1 : 1) * myTimer.localDeltaTime * 10;
        if (this.anglGun > 30) this.anglGun = 30;
        else if (this.anglGun < -10) this.anglGun = -10;
      }
    }

    if (this.reloading > 0) this.reloading -= myTimer.localDeltaTime;

    const vtower = this.tank.prims[14].maxBB
      .add(this.tank.prims[14].minBB)
      .divNum(2);
    let vgun = this.tank.prims[15].maxBB
      .add(this.tank.prims[15].minBB)
      .divNum(2);
    vgun.z = this.tank.prims[15].minBB.z;
    const vdisk = this.tank.prims[16].maxBB
      .add(this.tank.prims[16].minBB)
      .divNum(2);

    const matrtower = matrTranslate(vtower.neg())
      .mulMatr(matrRotateY(this.anglTower))
      .mulMatr(matrTranslate(vtower));
    const matrgun = matrTranslate(vgun.neg())
      .mulMatr(matrRotateX(-this.anglGun))
      .mulMatr(matrTranslate(vgun));
    const matrdisk = matrTranslate(vdisk.neg())
      .mulMatr(matrRotateX(this.anglWheels))
      .mulMatr(matrTranslate(vdisk));

    for (let i = 0; i <= 3; i++) this.tank.prims[i].trans = matrtower;
    for (let i = 5; i <= 6; i++) this.tank.prims[i].trans = matrtower;
    this.tank.prims[14].trans = matrtower;

    this.tank.prims[15].trans = matrgun.mulMatr(matrtower);
    this.tank.prims[16].trans = matrdisk;

    if (this.shells !== null) this.shells.update();
  };

  render = () => {
    if (this.tank === null) return;

    dsRndShdAddnonF[0] = d2r(this.anglWheels);
    dsRndShdAddnonF[1] = Math.cos(dsRndShdAddnonF[0]);
    dsRndShdAddnonF[2] = Math.sin(dsRndShdAddnonF[0]);

    dsRndShdAddnonI[2] = keys[87] - keys[83];
    dsRndShdAddnonI[3] = keys[65] - keys[68];

    this.tank.draw(matrIdentity());
    if (this.shells !== null) this.shells.draw();

    if (isTankCam) {
      dsRndShdAddnonF[0] = 1 - Math.max(this.reloading, 0) / this.reloadTime;
      this.reloadCirc.draw(matrIdentity());
    }
  };
}
