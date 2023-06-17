import { dsUnit } from "../anim";
import { dsRnd, myTimer } from "../main";
import {
  matrIdentity,
  matrRotateX,
  matrRotateZ,
  matrTranslate,
} from "../mthmat4";
import { vec2 } from "../mthvec2";
import { vec3 } from "../mthvec3";
import { vec4 } from "../mthvec4";
import { dsMtl } from "../mtl";
import { dsPrim, dsVert } from "../rnd";

export class u_ground extends dsUnit {
  constructor() {
    super();
    const v = [
      dsVert(vec3(-1000, 0, -1000), vec2(0), vec3(0, 1, 0), vec4(0)),
      dsVert(vec3(-1000, 0, 1000), vec2(0), vec3(0, 1, 0), vec4(0)),
      dsVert(vec3(1000, 0, -1000), vec2(0), vec3(0, 1, 0), vec4(0)),
      dsVert(vec3(1000, 0, 1000), vec2(0), vec3(0, 1, 0), vec4(0)),
    ];
    this.prim = new dsPrim(window.gl.TRIANGLE_STRIP, v, null);
    this.prim.mtlNo = 0;
  }

  render = () => {
    this.prim.draw(matrIdentity());
  };
}
