let isPressed = false;

function setPress(b) {
  isPressed = b;
}

function setReset(tag) {
  x0 = y0 = -2;
  x1 = y1 = 2;
}

function setType(tag) {
  frcType = 1 - frcType;
  if (frcType == 0) tag.value = "Julia";
  else tag.value = "Mandelbrot";
}

function changeType(t) {
  frcType = t;
  let tag = document.getElementById("frcType");
  if (t == 0) tag.value = "Julia";
  else tag.value = "Mandelbrot";
}

function setPause(tag) {
  isPause = tag.checked;
}

function zoomWheel(e) {
  if (
    e.x >= gl.canvas.offsetLeft &&
    e.y >= gl.canvas.offsetTop &&
    e.x <= gl.canvas.offsetLeft + gl.canvas.width &&
    e.y <= gl.canvas.offsetTop + gl.canvas.height
  ) {
    e.preventDefault();
    let x = ((x1 - x0) * (e.x - gl.canvas.offsetLeft)) / gl.canvas.width + x0,
      y = ((y0 - y1) * (e.y - gl.canvas.offsetTop)) / gl.canvas.height + y1;

    let t = (e.deltaY * (x1 - x0)) / 1000;
    x0 -= t;
    x1 += t;
    t = (e.deltaY * (y1 - y0)) / 1000;
    y0 -= t;
    y1 += t;

    xn = ((x1 - x0) * (e.x - gl.canvas.offsetLeft)) / gl.canvas.width + x0;
    yn = ((y0 - y1) * (e.y - gl.canvas.offsetTop)) / gl.canvas.height + y1;

    x0 += x - xn;
    x1 += x - xn;
    y0 += y - yn;
    y1 += y - yn;
  }
}

function setSizes() {
  let tagS = document.getElementById("windowSize");
  let tagST = document.getElementById("windowSizeText");
  let tagCan = document.getElementById("ds5Can");
  tagCan.width = tagCan.height = parseInt(tagS.value);
  tagST.innerHTML = tagS.value;
}
