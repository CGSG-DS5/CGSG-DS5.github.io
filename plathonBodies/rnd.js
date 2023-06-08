class _dsVert {
  constructor(p, t, n, c) {
    if (p === undefined) {
      this.p = vec3(0);
      this.t = vec2(0);
      this.n = vec3(0);
      this.c = vec3(0);
    } else if (typeof p === "object" && t === undefined) {
      this.p = p.p;
      this.t = p.t;
      this.n = p.n;
      this.c = p.c;
    } else {
      this.p = p;
      this.t = t;
      this.n = n;
      this.c = c;
    }
  }
}

function dsVert(...args) {
  return new _dsVert(...args);
}

function vertArr2floatArr(vertices) {
  let arr = [];
  for (let i = 0; i < vertices.length; i++) {
    arr.push(vertices[i].p.x);
    arr.push(vertices[i].p.y);
    arr.push(vertices[i].p.z);

    arr.push(vertices[i].t.x);
    arr.push(vertices[i].t.y);
    arr.push(vertices[i].n.x);
    arr.push(vertices[i].n.y);
    arr.push(vertices[i].n.z);
    arr.push(vertices[i].c.x);
    arr.push(vertices[i].c.y);
    arr.push(vertices[i].c.z);
  }
  return arr;
}

function mat2floatArr(arr, mat) {
  for (let i = 0; i < 16; i++) arr.push(mat.a[(i - (i % 4)) / 4][i % 4]);
  return arr;
}

// Primitive class
class dsPrim {
  constructor(type, v, numOfV, ind, numOfI) {
    this.vBuf = this.vA = this.iBuf = 0;
    if (v !== null && numOfV !== 0) {
      let primVertexArray = window.gl.createVertexArray();
      window.gl.bindVertexArray(primVertexArray);

      const pos = vertArr2floatArr(v);

      this.vBuf = new vertex_buffer(pos);
      this.vA = primVertexArray;
    }
    if (ind !== null && numOfI !== 0) {
      let primIndexBuffer = window.gl.createBuffer();
      window.gl.bindBuffer(window.gl.ELEMENT_ARRAY_BUFFER, primIndexBuffer);
      window.gl.bufferData(
        window.gl.ELEMENT_ARRAY_BUFFER,
        ind.length * 2,
        window.gl.STATIC_DRAW
      );
      window.gl.bufferData(
        window.gl.ELEMENT_ARRAY_BUFFER,
        new Uint32Array(ind),
        window.gl.STATIC_DRAW
      );

      this.iBuf = new index_buffer(ind);
      this.numOfElements = numOfI;
    } else this.numOfElements = numOfV;

    this.trans = matrIdentity();
    this.type = type;
    this.mtlNo = 0;
  }

  // Primitive free function
  free = () => {
    this.vBuf.free();
    this.iBuf.free();
  };

  // Primitive draw function
  draw = (world) => {
    let w = this.trans.mulMatr(world),
      wInv = w.inverse().transpose(),
      wvp = w.mulMatr(ds_cam.matrVP);

    let prg = dsRnd.mtl.apply(this.mtlNo);
    if (prg === 0) return;

    let arr = [];
    mat2floatArr(arr, w);
    mat2floatArr(arr, wInv);
    mat2floatArr(arr, wvp);

    dsRnd.matrixUBO.update(arr);
    dsRnd.matrixUBO.apply(prg);

    ds_cam.ubo.apply(prg);

    let loc;

    if ((loc = window.gl.getUniformLocation(prg, "Time")) !== -1) {
      window.gl.uniform1f(loc, myTimer.localTime);
    }

    if ((loc = window.gl.getAttribLocation(prg, "InPos")) !== -1) {
      window.gl.vertexAttribPointer(
        loc,
        3,
        window.gl.FLOAT,
        false,
        (3 + 2 + 3 + 3) * 4,
        0
      );
      window.gl.enableVertexAttribArray(loc);
    }

    if ((loc = window.gl.getAttribLocation(prg, "InNormal")) !== -1) {
      window.gl.vertexAttribPointer(
        loc,
        3,
        window.gl.FLOAT,
        false,
        (3 + 2 + 3 + 3) * 4,
        (3 + 2) * 4
      );
      window.gl.enableVertexAttribArray(loc);
    }

    window.gl.bindVertexArray(this.vA);
    this.vBuf.apply();
    if (this.iBuf === 0) {
      window.gl.drawArrays(this.type, 0, this.numOfElements);
    } else {
      this.iBuf.apply();
      window.gl.drawElements(
        this.type,
        this.numOfElements,
        window.gl.UNSIGNED_INT,
        0
      );
    }
  };
}

// Render class constructor function
function dsRender() {
  // Render init
  this.gl = document.getElementById("dsCan").getContext("webgl2");

  Object.defineProperty(window, "gl", {
    get: () => {
      if (this._gl == null || this._gl == undefined) {
        this.canvas = document.getElementById("dsCan");
        this._gl = this.canvas.getContext("webgl2");
      }
      return this._gl;
    },
    set: (val) => {
      this._gl = val;
    },
  });

  this.shd = new dsRndShader(this.gl);
  this.mtl = new dsRndMtl(this.gl);

  this.matrixUBO = new uniform_buffer("MatrixUBO", 16 * 3 * 4, 0);

  this.gl.clearColor(0.28, 0.47, 0.8, 1);
  this.gl.enable(this.gl.DEPTH_TEST);

  // Render start method
  this.start = () => {
    this.gl.clear(this.gl.COLOR_BUFFER_BIT);
    this.gl.clear(this.gl.DEPTH_BUFFER_BIT);
    this.gl.enable(this.gl.DEPTH_TEST);
  };

  // Render close method
  this.close = () => {
    this.mtl.free();
  };

  return this;
} // End of 'dsRender' function
