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

export class u_octa extends dsUnit {
  constructor(matr) {
    super();
    this.prim = plathonLib.createOctahedron(matr);
    this.prim.mtlNo = dsRnd.mtl.add(
      new dsMtl(
        "Obsidian",
        vec3(0.05375, 0.05, 0.06625),
        vec3(0.18275, 0.17, 0.22525),
        vec3(0.332741, 0.328634, 0.346435),
        38.4,
        1,
        0
      )
    );
  }

  render = () => {
    this.prim.draw(
      matrRotateZ(myTimer.localTime * 100)
        .mulMatr(matrRotateX(myTimer.localTime * 100))
        .mulMatr(matrTranslate(vec3(4, 0, 0)))
    );
    this.prim.draw(matrTranslate(vec3(4, 2, 0)));
  };
}
