import { dsUnit } from "../anim";
import { dsRnd, myTimer } from "../main";
import {
  matrIdentity,
  matrRotateX,
  matrRotateZ,
  matrScale,
  matrTranslate,
} from "../mthmat4";
import { vec3 } from "../mthvec3";
import { dsMtl } from "../mtl";

export class u_cow extends dsUnit {
  constructor(matr) {
    super();
    let prom = dsRnd.primLoad("../bin/models/cow.obj");
    this.prim = null;
    prom.then((res) => {
      this.prim = res;
      this.prim.mtlNo = dsRnd.mtl.add(
        new dsMtl(
          "Cow material",
          dsRnd.mtl.mtls[0].ka,
          dsRnd.mtl.mtls[0].kd,
          dsRnd.mtl.mtls[0].ks,
          dsRnd.mtl.mtls[0].ph,
          1,
          dsRnd.shd.add("cow")
        )
      );
      let v = this.prim.maxBB.sub(this.prim.minBB);
      let max = v.x > v.y ? v.x : v.y;
      max = max > v.z ? max : v.z;
      this.prim.trans = matrScale(
        vec3(1 / max, 1 / max, 1 / max).mulNum(1.5)
      ).mulMatr(matr);
    });
  }

  render = () => {
    if (this.prim !== null) {
      this.prim.draw(matrIdentity());
    }
  };
}
