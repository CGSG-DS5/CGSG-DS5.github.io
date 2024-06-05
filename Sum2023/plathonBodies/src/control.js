import { r2d, d2r } from "./mth.js";
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
import { myTimer, ds_cam } from "./main.js";
import { vec3, _vec3 } from "./mthvec3.js";

export let isPressedLeftAll = false;

export let isPressedLeft = false;
export let isPressedRight = false;
export let isTankCam = false;

export let keysOld = [];
export let keys = [];
export let keysClick = [];

keys.length = keysOld.length = keysClick.length = 256;
for (let i = 0; i < 256; i++) {
  keys[i] = keysClick[i] = keysOld[i] = 0;
}

export function ctrlDownLB(e) {
  if (e.button === 0) isPressedLeftAll = true;
}
export function ctrlUpRB(e) {
  if (e.button === 0) isPressedLeftAll = false;
}

export function mouseChange(e, t) {
  e.preventDefault();
  if (e.button === 0) isPressedLeft = t;
  else if (e.button === 2) isPressedRight = t;
}

export function mouseOut() {
  isPressedLeft = isPressedRight = false;
}

export function keyboard(e) {
  switch (e.keyCode) {
    case 80:
      myTimer.isPause = !myTimer.isPause;
      let tag = document.getElementById("pause");
      tag.checked = myTimer.isPause;
      break;
    case 82:
      ds_cam.camSet(vec3(5), vec3(2.5, 0, 0), vec3(0, 1, 0));
      break;
    case 48:
      isTankCam = true;
      break;
    case 27:
      isTankCam = false;
      break;
  }
}

export function ctrlKeyDown(e) {
  keysOld[e.keyCode] = keys[e.keyCode];
  keys[e.keyCode] = 1;
  keysClick[e.keyCode] = !keysOld[e.keyCode];
}

export function ctrlKeyUp(e) {
  keysOld[e.keyCode] = keys[e.keyCode];
  keys[e.keyCode] = 0;
  keysClick[e.keyCode] = 0;
}

export function updateCtrl() {
  if (keysClick[80]) {
    myTimer.isPause = !myTimer.isPause;
    let tag = document.getElementById("pause");
    tag.checked = myTimer.isPause;
  }
  if (keysClick[82]) ds_cam.camSet(vec3(5), vec3(2.5, 0, 0), vec3(0, 1, 0));
  if (keysClick[48]) isTankCam = true;
  if (keysClick[27]) isTankCam = false;
}

export function camCtrl(e) {
  if (ds_cam === undefined) return;

  let dist = ds_cam.at.sub(ds_cam.loc).len();
  let cosT = (ds_cam.loc.y - ds_cam.at.y) / dist;
  let sinT = Math.sqrt(1 - cosT * cosT);
  let plen = dist * sinT;
  let cosP = (ds_cam.loc.z - ds_cam.at.z) / plen;
  let sinP = (ds_cam.loc.x - ds_cam.at.x) / plen;

  let azimuth = r2d(Math.atan2(sinP, cosP));
  let elevator = r2d(Math.atan2(sinT, cosT));

  if (isPressedLeft) {
    azimuth -= myTimer.globalDeltaTime * e.movementX * 10;
    elevator -= myTimer.globalDeltaTime * e.movementY * 10;
  }

  dist +=
    ((myTimer.globalDeltaTime * (e.deltaY === undefined ? 0 : e.deltaY)) / 20) *
    dist;

  if (elevator < 0.1) elevator = 0.1;
  else if (elevator > 178.9) elevator = 178.9;
  if (dist < 0.1) dist = 0.1;

  if (isPressedRight) {
    let wp, hp;
    hp = wp = ds_cam.projSize;

    if (window.gl.canvas.width > window.gl.canvas.height)
      wp *= window.gl.canvas.width / window.gl.canvas.height;
    else wp *= window.gl.canvas.height / window.gl.canvas.width;

    let sx =
      -(((e.movementX * wp) / window.gl.canvas.width) * dist) / ds_cam.projDist;
    let sy =
      (((e.movementY * hp) / window.gl.canvas.height) * dist) / ds_cam.projDist;

    let dv = ds_cam.right.mulNum(sx).add(ds_cam.up.mulNum(sy));

    ds_cam.at = ds_cam.at.add(dv);
    ds_cam.loc = ds_cam.loc.add(dv);
  }

  ds_cam.camSet(
    vec3(0, dist, 0).pointTransform(
      matrRotateX(elevator)
        .mulMatr(matrRotateY(azimuth))
        .mulMatr(matrTranslate(ds_cam.at))
    ),
    ds_cam.at,
    vec3(0, 1, 0)
  );

  e.preventDefault();
}

export function resize() {
  let tagW = document.getElementById("windowW");
  let tagWT = document.getElementById("windowWText");
  window.gl.canvas.width = parseInt(tagW.value);
  tagWT.innerHTML = "FrameW:" + tagW.value;

  let tagH = document.getElementById("windowH");
  let tagHT = document.getElementById("windowHText");
  window.gl.canvas.height = parseInt(tagH.value);
  tagHT.innerHTML = "FrameH:" + tagH.value;

  ds_cam.setSize(window.gl.canvas.width, window.gl.canvas.height);
  window.gl.viewport(0, 0, window.gl.canvas.width, window.gl.canvas.height);
}

export function setPause(tag) {
  myTimer.isPause = tag.checked;
}
