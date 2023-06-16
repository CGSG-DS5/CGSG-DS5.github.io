import { dsUnit } from "../anim";
import { dsRnd, myTimer } from "../main";
import {
  matrIdentity,
  matrRotateX,
  matrRotateZ,
  matrTranslate,
} from "../mthmat4";
import { vec3 } from "../mthvec3";
import { dsMtl } from "../mtl";
import * as plathonLib from "../plathon.js";

export class u_icosa extends dsUnit {
  constructor(matr) {
    super();
    this.prim = plathonLib.createIcosahedron(matr);
    this.prim.mtlNo = dsRnd.mtl.add(
      new dsMtl(
        "Emerald",
        vec3(0.0215, 0.1745, 0.0215),
        vec3(0.07568, 0.61424, 0.07568),
        vec3(0.633, 0.727811, 0.633),
        76.8,
        1,
        0
      )
    );
  }

  render = () => {
    this.prim.draw(
      matrRotateZ(myTimer.localTime * 100)
        .mulMatr(matrRotateX(myTimer.localTime * 100))
        .mulMatr(matrTranslate(vec3(8, 0, 0)))
    );
    this.prim.draw(matrTranslate(vec3(8, 2, 0)));
  };
}
