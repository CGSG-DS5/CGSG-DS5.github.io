import { gl } from './main';
import { camera } from './camera';
import { _vec3, vec3 } from './mthvec3';
import { shaderManager } from './shader';
import { uniform_buffer, vertex_buffer } from './buffer';
import { shape } from './shape';
import { textureManager } from './texture';

export class rndContext {
  cam: camera = new camera();
  shdManager: shaderManager = new shaderManager();
  texManager: textureManager = new textureManager();

  shdDef: number = 0;
  cubeMap: number = 0;
  VA: WebGLVertexArrayObject = 0;
  VBO: vertex_buffer | undefined;
  UBOutils: uniform_buffer | undefined;
  UBOshapes: uniform_buffer | undefined;

  maxShapes: number = 10;
  drawingShapes: shape[] = [];

  init = () => {
    gl.clearColor(0.3, 0.47, 0.8, 1);
    gl.clear(gl.COLOR_BUFFER_BIT);

    this.shdDef = this.shdManager.add('default');
    this.cubeMap = this.texManager.addCubemap('mountains', 'png');
    this.texManager.add('mountain.png');

    let res = gl.createVertexArray();
    if (!res) return;
    this.VA = res;
    gl.bindVertexArray(this.VA);
    this.VBO = new vertex_buffer(
      new Float32Array([-1, -1, 0, -1, 1, 0, 1, -1, 0, 1, 1, 0]),
      3
    );
    this.UBOutils = new uniform_buffer('Utils', 4 * 4 * 7, 1);
    this.UBOshapes = new uniform_buffer(
      'Scene',
      4 * 4 * 11 * this.maxShapes + 4 * 4,
      2
    );
  };

  frameStart = () => {
    gl.clear(gl.COLOR_BUFFER_BIT);

    this.drawingShapes.length = 0;
  };

  frameEnd = () => {
    let prg: WebGLProgram = this.shdManager.get(this.shdDef).progID;
    if (!prg) return;
    if (!this.UBOutils || !this.VBO || !this.VA || !this.UBOshapes) return;

    gl.useProgram(prg);
    this.UBOutils.apply(prg);
    gl.bindVertexArray(this.VA);
    this.VBO.apply(prg);

    this.texManager.apply(prg);

    let mas: number[] = [];

    for (let i = 0; i < this.drawingShapes.length; i++)
      this.drawingShapes[i].write2Array(mas);

    this.UBOshapes.update(new Float32Array(mas), 0, mas.length * 4);
    this.UBOshapes.update(
      new Float32Array([this.drawingShapes.length]),
      4 * 4 * 11 * this.maxShapes,
      4
    );
    this.UBOshapes.apply(prg);
    this.drawingShapes.length = 0;

    let loc;
    if ((loc = gl.getAttribLocation(prg, 'InPos')) !== -1) {
      gl.vertexAttribPointer(loc, 3, gl.FLOAT, false, 3 * 4, 0);
      gl.enableVertexAttribArray(loc);
    }

    gl.drawArrays(gl.TRIANGLE_STRIP, 0, this.VBO.numOfVertices);

    gl.finish();
  };

  resize(w: number, h: number) {
    gl.viewport(0, 0, w, h);
    this.cam.resize(w, h);

    if (!this.UBOutils) return;
    this.UBOutils.update(
      new Float32Array([
        this.cam.frameW,
        this.cam.frameH,
        this.cam.wp,
        this.cam.hp
      ]),
      4 * 4 * 5,
      4 * 4 * 1
    );
  }

  camSet = (loc: _vec3, at: _vec3, up1: _vec3) => {
    this.cam.set(loc, at, up1);

    if (!this.UBOutils) return;
    this.UBOutils.update(
      new Float32Array([
        this.cam.loc.x,
        this.cam.loc.y,
        this.cam.loc.z,
        0,
        this.cam.up.x,
        this.cam.up.y,
        this.cam.up.z,
        this.cam.at.x,
        this.cam.right.x,
        this.cam.right.y,
        this.cam.right.z,
        this.cam.at.y,
        this.cam.dir.x,
        this.cam.dir.y,
        this.cam.dir.z,
        this.cam.at.z
      ]),
      4 * 4 * 1,
      4 * 4 * 4
    );
  };

  projSet = (farClip: number, projDist: number, projSize: number) => {
    this.cam.setProj(farClip, projDist, projSize);

    if (!this.UBOutils) return;
    this.UBOutils.update(
      new Float32Array([
        this.cam.wp,
        this.cam.hp,
        this.cam.farClip,
        this.cam.projDist,
        this.cam.projSize,
        0
      ]),
      4 * 4 * 5 + 4 * 2,
      4 * 2 + 4 * 4 * 1
    );
  };

  drawShape = (shp: shape) => {
    if (this.drawingShapes.length >= this.maxShapes) return;
    this.drawingShapes.push(shp);
  };
}
