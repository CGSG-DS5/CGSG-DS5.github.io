let isPressedLeft = false;
let isPressedRight = false;

function mouseChange(e, t) {
  e.preventDefault();
  if (e.button === 0) isPressedLeft = t;
  else if (e.button === 2) isPressedRight = t;
}

function mouseOut() {
  isPressedLeft = isPressedRight = false;
}

function pause(e) {
  if (e.keyCode === 80) {
    myTimer.isPause = !myTimer.isPause;
    let tag = document.getElementById("pause");
    tag.checked = myTimer.isPause;
  }
}

function camCtrl(e) {
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

function resize() {
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

function setPause(tag) {
  myTimer.isPause = tag.checked;
}
