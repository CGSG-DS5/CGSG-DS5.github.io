import { dsCamera } from "./mthcam.js";
import {
  mat4,
  _mat4,
  matrDeterm3x3,
  matrIdentity,
  matrRotateX,
  matrRotateY,
  matrRotateZ,
  matrScale,
  matrTranslate,
} from "../src/mthmat4.js";
import { dsTimer } from "./timer.js";
import { countNormals, dsPrim, dsRender, dsVert } from "../src/rnd.js";
import * as plathonLib from "../src/plathon.js";
import { dsMtl, dsRndMtl } from "./mtl.js";
import { vec3, _vec3 } from "./mthvec3.js";
import { vec2, _vec2 } from "./mthvec2.js";
import { vec4, _vec4 } from "./mthvec4.js";
import {
  keyboard,
  mouseChange,
  mouseOut,
  setPause,
  resize,
  camCtrl,
} from "./control.js";
import { primsLoad } from "./prims.js";
import { dsAnim } from "./anim.js";
import { u_tetra } from "./units/u_tetra.js";
import { u_hexa } from "./units/u_hexa.js";
import { u_octa } from "./units/u_octa.js";
import { u_dodeca } from "./units/u_dodeca.js";
import { u_icosa } from "./units/u_icosa.js";
import { u_cow } from "./units/u_cow.js";
import { u_tank } from "./units/u_tank";

export let ds_cam;
export let dsRnd = new dsRender();
export let myTimer = new dsTimer();

window.addEventListener("load", () => {
  let data = sessionStorage.getItem("camera");
  if (data) {
    const ds_cam1 = JSON.parse(data);

    ds_cam = new dsCamera();
    const loc = vec3(ds_cam1.loc),
      at = vec3(ds_cam1.at),
      up = ds_cam1.up;
    ds_cam.camSet(loc, at, up);
    ds_cam.setProj(ds_cam1.projSize, ds_cam1.projDist, ds_cam1.projFarClip);
    ds_cam.setSize(ds_cam1.frameW, ds_cam1.frameH);
  } else {
    ds_cam = new dsCamera();
    ds_cam.setSize(window.gl.canvas.width, window.gl.canvas.height);
    ds_cam.camSet(vec3(5), vec3(2.5, 0, 0), vec3(0, 1, 0));
  }
  window.addEventListener("keydown", keyboard);

  mouseOutCan = mouseOut;
  mouseChangeCan = mouseChange;
  setPauseCheckbox = setPause;
  camCtrlCan = camCtrl;

  // let gold = dsRnd.mtl.add(
  //   new dsMtl(
  //     "Gold",
  //     vec3(0.24725, 0.1995, 0.0745),
  //     vec3(0.75164, 0.60648, 0.22648),
  //     vec3(0.628281, 0.555802, 0.366065),
  //     51.2,
  //     1,
  //     0
  //   )
  // );

  // let silver = dsRnd.mtl.add(
  //   new dsMtl(
  //     "Silver",
  //     vec3(0.19225),
  //     vec3(0.50754),
  //     vec3(0.508273),
  //     51.2,
  //     1,
  //     0
  //   )
  // );

  // let obsidian = dsRnd.mtl.add(
  //   new dsMtl(
  //     "Obsidian",
  //     vec3(0.05375, 0.05, 0.06625),
  //     vec3(0.18275, 0.17, 0.22525),
  //     vec3(0.332741, 0.328634, 0.346435),
  //     38.4,
  //     1,
  //     0
  //   )
  // );

  // let bronze = dsRnd.mtl.add(
  //   new dsMtl(
  //     "Bronze",
  //     vec3(0.2125, 0.1275, 0.054),
  //     vec3(0.714, 0.4284, 0.18144),
  //     vec3(0.393548, 0.271906, 0.166721),
  //     25.6,
  //     1,
  //     0
  //   )
  // );

  // let emerald = dsRnd.mtl.add(
  //   new dsMtl(
  //     "Emerald",
  //     vec3(0.0215, 0.1745, 0.0215),
  //     vec3(0.07568, 0.61424, 0.07568),
  //     vec3(0.633, 0.727811, 0.633),
  //     76.8,
  //     1,
  //     0
  //   )
  // );

  // let pr = plathonLib.createTetrahedron(matrIdentity());
  // pr.mtlNo = gold;
  // let pr1 = plathonLib.createHexahedron(matrIdentity());
  // pr1.mtlNo = silver;

  // let pr2 = plathonLib.createOctahedron(matrIdentity());
  // pr2.mtlNo = obsidian;
  // let pr3 = plathonLib.createDodecahedron(matrIdentity());
  // pr3.mtlNo = bronze;
  // let pr4 = plathonLib.createIcosahedron(matrIdentity());
  // pr4.mtlNo = emerald;

  // let prom = dsRnd.primLoad("../bin/models/cow.obj");
  // let pr5;
  // prom.then((res) => {
  //   pr5 = res;
  //   pr5.mtlNo = dsRnd.mtl.add(
  //     new dsMtl(
  //       "Cow material",
  //       dsRnd.mtl.mtls[0].ka,
  //       dsRnd.mtl.mtls[0].kd,
  //       dsRnd.mtl.mtls[0].ks,
  //       dsRnd.mtl.mtls[0].ph,
  //       1,
  //       dsRnd.shd.add("cow")
  //     )
  //   );
  //   let v = pr5.maxBB.sub(pr.minBB);
  //   let max = v.x > v.y ? v.x : v.y;
  //   max = max > v.z ? max : v.z;
  //   pr5.trans = matrScale(vec3(1 / max, 1 / max, 1 / max).mulNum(1.5));
  // });

  // let prG3DM;
  // let prG3DMprom = primsLoad("../bin/models/Sherman.g3dm");
  // prG3DMprom.then((res) => {
  //   prG3DM = res;
  //   const n = dsRnd.shd.add("tank");
  //   for (let i = 0; i < prG3DM.numOfPrims; i++)
  //     dsRnd.mtl.get(prG3DM.prims[i].mtlNo).shdNo = n;
  // });

  // let matr, matr1;

  let myAnim = new dsAnim();

  myAnim.addUnit(new u_tetra(matrIdentity()));
  myAnim.addUnit(new u_hexa(matrIdentity()));
  myAnim.addUnit(new u_octa(matrIdentity()));
  myAnim.addUnit(new u_dodeca(matrIdentity()));
  myAnim.addUnit(new u_icosa(matrIdentity()));
  myAnim.addUnit(new u_cow(matrTranslate(vec3(-2, 0, 0))));
  myAnim.addUnit(new u_tank(matrTranslate(vec3(-4, 0, 0))));

  const draw = () => {
    resize();

    myAnim.render();

    // if (prG3DM !== undefined) {
    //   prG3DM.draw(matrTranslate(vec3(-3, 0, -3)));
    // }

    // pr.draw(matr);
    // matr1 = matrTranslate(vec3(0, 2, 0));
    // pr.draw(matr1);

    // if (pr5 !== undefined) {
    //   matr1 = matr.mulMatr(matrTranslate(vec3(-2, 0, 0)));
    //   pr5.draw(matr1);
    //   matr1 = matrTranslate(vec3(-2, 2, 0));
    //   pr5.draw(matr1);
    // }

    // matr1 = matr.mulMatr(matrTranslate(vec3(2, 0, 0)));
    // pr1.draw(matr1);
    // matr1 = matrTranslate(vec3(2, 2, 0));
    // pr1.draw(matr1);

    // matr1 = matr.mulMatr(matrTranslate(vec3(4, 0, 0)));
    // pr2.draw(matr1);
    // matr1 = matrTranslate(vec3(4, 2, 0));
    // pr2.draw(matr1);

    // matr1 = matr.mulMatr(matrTranslate(vec3(6, 0, 0)));
    // pr3.draw(matr1);
    // matr1 = matrTranslate(vec3(6, 2, 0));
    // pr3.draw(matr1);

    // matr1 = matr.mulMatr(matrTranslate(vec3(8, 0, 0)));
    // pr4.draw(matr1);
    // matr1 = matrTranslate(vec3(8, 2, 0));
    // pr4.draw(matr1);

    sessionStorage.setItem("camera", JSON.stringify(ds_cam));
    window.requestAnimationFrame(draw);
  };

  draw();
});
