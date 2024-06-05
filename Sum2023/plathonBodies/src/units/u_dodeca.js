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

export class u_dodeca extends dsUnit {
  constructor(matr) {
    super();
    this.prim = plathonLib.createDodecahedron(matr);
    this.prim.mtlNo = dsRnd.mtl.add(
      new dsMtl(
        "Bronze",
        vec3(0.2125, 0.1275, 0.054),
        vec3(0.714, 0.4284, 0.18144),
        vec3(0.393548, 0.271906, 0.166721),
        25.6,
        1,
        0
      )
    );
  }

  render = () => {
    this.prim.draw(
      matrRotateZ(myTimer.localTime * 100)
        .mulMatr(matrRotateX(myTimer.localTime * 100))
        .mulMatr(matrTranslate(vec3(6, 0, 0)))
    );
    this.prim.draw(matrTranslate(vec3(6, 2, 0)));
  };
}
