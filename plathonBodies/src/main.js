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
  updateCtrl,
  ctrlKeyDown,
  ctrlKeyUp,
  ctrlDownLB,
  ctrlUpRB,
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
import { u_skybox } from "./units/u_skybox.js";
import { u_sky } from "./units/u_sky.js";
import { u_ground } from "./units/u_ground.js";

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

  let can = document.getElementById("dsCan");

  can.addEventListener("mousemove", camCtrl);
  can.addEventListener("mousewheel", camCtrl);

  // window.addEventListener("keydown", keyboard);
  window.addEventListener("keydown", async (e) => {
    if (e.keyCode === 48)
      if (!document.pointerLockElement)
        await can.requestPointerLock({ unadjustedMovement: true });
    // keyboard(e);
  });
  window.addEventListener("keydown", ctrlKeyDown);
  window.addEventListener("keyup", ctrlKeyUp);
  window.addEventListener("mousedown", ctrlDownLB);
  window.addEventListener("mouseup", ctrlUpRB);
  mouseOutCan = mouseOut;
  mouseChangeCan = mouseChange;
  setPauseCheckbox = setPause;
  camCtrlCan = camCtrl;

  let myAnim = new dsAnim();

  // myAnim.addUnit(new u_skybox("RedMountains"));
  myAnim.addUnit(new u_sky("starSkytex.png"));
  myAnim.addUnit(new u_tetra(matrIdentity()));
  myAnim.addUnit(new u_hexa(matrIdentity()));
  myAnim.addUnit(new u_octa(matrIdentity()));
  myAnim.addUnit(new u_dodeca(matrIdentity()));
  myAnim.addUnit(new u_icosa(matrIdentity()));
  myAnim.addUnit(new u_cow(matrTranslate(vec3(-2, 0, 0))));
  myAnim.addUnit(new u_tank(vec3(-4, 0, 0)));
  myAnim.addUnit(new u_ground());

  const draw = () => {
    resize();

    myAnim.render();
    updateCtrl();

    sessionStorage.setItem("camera", JSON.stringify(ds_cam));
    window.requestAnimationFrame(draw);
  };

  draw();
});
