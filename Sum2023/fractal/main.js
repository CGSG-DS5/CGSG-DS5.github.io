function loadShader(gl, type, source) {
  const shader = gl.createShader(type);

  gl.shaderSource(shader, source);
  gl.compileShader(shader);

  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    const Buf = gl.getShaderInfoLog(shader);
    console.log(Buf);
  }
  return shader;
}

const canvas = document.getElementById("ds5Can");
const gl = canvas.getContext("webgl2");

let x0 = -2,
  x1 = 2,
  y0 = -2,
  y1 = 2;
let frcType = 0;

let isPause = false,
  syncTime = 0,
  deltaTime = 0,
  fps = 0;
let beginTime = -1,
  startTime = -1,
  frameCounter = 0,
  fpsTime = 0,
  pauseTime = 0,
  oldTime = 0;

function timer() {
  if (beginTime === -1) beginTime = Date.now();
  let t = Date.now() - beginTime;
  if (startTime === -1) startTime = fpsTime = oldTime = t;
  if (!isPause) {
    deltaTime = (t - oldTime) / 1000.0;
    syncTime = (t - startTime - pauseTime) / 1000.0;
  } else {
    deltaTime = 0;
    pauseTime += t - oldTime;
  }

  frameCounter++;
  if (t - fpsTime > 3000) {
    fps = frameCounter / ((t - fpsTime) / 1000.0);
    fpsTime = t;
    frameCounter = 0;
    // console.log(`FPS: ${fps}`);
    let tag = document.getElementById("fps");
    tag.innerHTML = `FPS: ${fps.toFixed(2)}`;
  }
  oldTime = t;
}

function render(program) {
  timer();

  setSizes();

  const posLoc = gl.getAttribLocation(program, "in_pos");
  const timeLoc = gl.getUniformLocation(program, "Time");
  const frameWLoc = gl.getUniformLocation(program, "FrameW");
  const frameHLoc = gl.getUniformLocation(program, "FrameH");
  const x0Loc = gl.getUniformLocation(program, "X0");
  const x1Loc = gl.getUniformLocation(program, "X1");
  const y0Loc = gl.getUniformLocation(program, "Y0");
  const y1Loc = gl.getUniformLocation(program, "Y1");
  const frcTypeLoc = gl.getUniformLocation(program, "Type");
  const posBuf = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, posBuf);
  const pos = [-1, -1, 0, 1, -1, 1, 0, 1, 1, -1, 0, 1, 1, 1, 0, 1];
  //const pos = [-1, -3, 0, 1, -1, 1, 0, 1, 3, 1, 0, 1];
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(pos), gl.STATIC_DRAW);
  gl.vertexAttribPointer(posLoc, 4, gl.FLOAT, false, 0, 0);
  gl.enableVertexAttribArray(0);
  gl.useProgram(program);

  let timeFromStart = 0;
  let timeInPause = 0;

  const draw = () => {
    timer();

    setSizes();

    gl.bindBuffer(gl.ARRAY_BUFFER, posBuf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(pos), gl.STATIC_DRAW);
    gl.vertexAttribPointer(posLoc, 4, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(0);
    gl.useProgram(program);
    if (timeLoc != -1) gl.uniform1f(timeLoc, syncTime);
    if (frameWLoc != -1) gl.uniform1f(frameWLoc, gl.canvas.width);
    if (frameHLoc != -1) gl.uniform1f(frameHLoc, gl.canvas.height);
    if (x0Loc != -1) gl.uniform1f(x0Loc, x0);
    if (x1Loc != -1) gl.uniform1f(x1Loc, x1);
    if (y0Loc != -1) gl.uniform1f(y0Loc, y0);
    if (y1Loc != -1) gl.uniform1f(y1Loc, y1);
    if (frcTypeLoc != -1) gl.uniform1i(frcTypeLoc, frcType);

    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
    // gl.drawArrays(gl.TRIANGLES, 0, 3);

    window.requestAnimationFrame(draw);
  };

  draw();
}

function initGL() {
  gl.clearColor(0.3, 0.47, 0.8, 1);
  gl.clear(gl.COLOR_BUFFER_BIT);

  let vs, fs;

  const ft1 = fetch("./vert.glsl")
    .then((res) => res.text())
    .then((data) => {
      vs = data;
    });
  const ft2 = fetch("./frag.glsl")
    .then((res) => res.text())
    .then((data) => {
      fs = data;
    });

  // vs = fetchShader("./vert.glsl");
  // fs = fetchShader("./frag.glsl");

  const allData = Promise.all([ft1, ft2]);
  allData.then(() => {
    //(res)
    const vertexSh = loadShader(gl, gl.VERTEX_SHADER, vs);
    const fragmentSh = loadShader(gl, gl.FRAGMENT_SHADER, fs);

    const program = gl.createProgram();
    gl.attachShader(program, vertexSh);
    gl.attachShader(program, fragmentSh);
    gl.linkProgram(program);

    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      const Buf = gl.getProgramInfoLog(program);
      console.log(Buf);
    }

    render(program);
  });
}
