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

export class u_tetra extends dsUnit {
  constructor(matr) {
    super();
    this.prim = plathonLib.createTetrahedron(matr);
    this.prim.mtlNo = dsRnd.mtl.add(
      new dsMtl(
        "Gold",
        vec3(0.24725, 0.1995, 0.0745),
        vec3(0.75164, 0.60648, 0.22648),
        vec3(0.628281, 0.555802, 0.366065),
        51.2,
        1,
        0
      )
    );
  }

  render = () => {
    this.prim.draw(
      matrRotateZ(myTimer.localTime * 100).mulMatr(
        matrRotateX(myTimer.localTime * 100)
      )
    );
    this.prim.draw(matrTranslate(vec3(0, 2, 0)));
  };
}
