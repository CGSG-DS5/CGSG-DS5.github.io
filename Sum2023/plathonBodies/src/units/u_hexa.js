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

export class u_hexa extends dsUnit {
  constructor(matr) {
    super();
    this.prim = plathonLib.createHexahedron(matr);
    this.prim.mtlNo = dsRnd.mtl.add(
      new dsMtl(
        "Silver",
        vec3(0.19225),
        vec3(0.50754),
        vec3(0.508273),
        51.2,
        1,
        0
      )
    );
  }

  render = () => {
    this.prim.draw(
      matrRotateZ(myTimer.localTime * 100)
        .mulMatr(matrRotateX(myTimer.localTime * 100))
        .mulMatr(matrTranslate(vec3(2, 0, 0)))
    );
    this.prim.draw(matrTranslate(vec3(2, 2, 0)));
  };
}
