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

export class u_skybox extends dsUnit {
  constructor(fileName) {
    super();
    const v = [
      dsVert(vec3(-1, -3, 0), vec2(0, -3), vec3(0), vec4(0)),
      dsVert(vec3(-1, 1, 0), vec2(0, 1), vec3(0), vec4(0)),
      dsVert(vec3(3, 1, 0), vec2(3, 1), vec3(0), vec4(0)),
    ];
    this.prim = new dsPrim(window.gl.TRIANGLES, v, null);
    let mtl = new dsMtl(
      "Skybox material",
      dsRnd.mtl.mtls[0].ka,
      dsRnd.mtl.mtls[0].kd,
      dsRnd.mtl.mtls[0].ks,
      dsRnd.mtl.mtls[0].ph,
      1,
      0
    );
    mtl.tex[0] = dsRnd.tex.addCubeMap(fileName);
    mtl.shdNo = dsRnd.shd.add("skybox");
    this.prim.mtlNo = dsRnd.mtl.add(mtl);
  }

  render = () => {
    window.gl.depthMask(false);
    this.prim.draw(matrIdentity());
    window.gl.depthMask(true);
  };
}
