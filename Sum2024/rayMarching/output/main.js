var XXX = (function (exports) {
    'use strict';

    class timer {
        isPause = false;
        globalTime = 0;
        globalDeltaTime = 0;
        localTime = 0;
        localDeltaTime = 0;
        fps = 30.7;
        startTime = 0;
        oldTime = 0;
        oldTimeFPS = 0;
        pauseTime = 0;
        frameCounter = 0;
        init() {
            this.startTime =
                this.oldTimeFPS =
                    this.oldTime =
                        this.globalTime =
                            this.localTime =
                                Date.now() / 1000;
        }
        response() {
            let t = Date.now() / 1000;
            this.globalTime = t;
            this.globalDeltaTime = t - this.oldTime;
            if (this.isPause) {
                this.localDeltaTime = 0;
                this.pauseTime += this.globalDeltaTime;
            }
            else {
                this.localDeltaTime = this.globalDeltaTime;
                this.localTime = t - this.pauseTime - this.startTime;
            }
            this.frameCounter++;
            if (t - this.oldTimeFPS > 3) {
                this.fps = this.frameCounter / (t - this.oldTimeFPS);
                this.oldTimeFPS = t;
                this.frameCounter = 0;
            }
            this.oldTime = t;
        }
    }

    class input extends timer {
        VK_LBUTTON = 0x0;
        VK_MBUTTON = 0x1;
        VK_RBUTTON = 0x2;
        VK_SHIFT = 0x10;
        VK_CONTROL = 0x11;
        VK_MENU = 0x12;
        VK_ESCAPE = 0x1b;
        VK_LEFT = 0x25;
        VK_UP = 0x26;
        VK_RIGHT = 0x27;
        VK_DOWN = 0x28;
        mX = 0;
        mY = 0;
        mdX = 0;
        mdY = 0;
        mdZ = 0;
        keysOld = [];
        keys = [];
        keysClick = [];
        keysEvent = [];
        mXEvent = 0;
        mYEvent = 0;
        mdXEvent = 0;
        mdYEvent = 0;
        mdZEvent = 0;
        init() {
            super.init();
            this.mXEvent =
                this.mYEvent =
                    this.mdXEvent =
                        this.mdYEvent =
                            this.mdZEvent =
                                0;
            this.mX = this.mY = this.mdX = this.mdY = this.mdZ = 0;
            for (let i = 0; i < 255; i++)
                this.keysEvent[i] =
                    this.keysOld[i] =
                        this.keys[i] =
                            this.keysClick[i] =
                                false;
        }
        response() {
            super.response();
            this.mX = this.mXEvent;
            this.mY = this.mYEvent;
            this.mdX = this.mdXEvent;
            this.mdY = this.mdYEvent;
            this.mdZ = this.mdZEvent;
            for (let i = 0; i < 255; i++)
                this.keys[i] = this.keysEvent[i];
            for (let i = 0; i < 255; i++)
                this.keysClick[i] = this.keys[i] && !this.keysOld[i];
            for (let i = 0; i < 255; i++)
                this.keysOld[i] = this.keys[i];
            this.mdXEvent = this.mdYEvent = this.mdZEvent = 0;
        }
        onKeyDown = (e) => {
            //e.preventDefault();
            this.keysEvent[e.keyCode] = true;
        };
        onKeyUp = (e) => {
            //e.preventDefault();
            this.keysEvent[e.keyCode] = false;
        };
        onMouseDown = (e) => {
            //e.preventDefault();
            this.keysEvent[e.button] = true;
        };
        onMouseUp = (e) => {
            //e.preventDefault();
            this.keysEvent[e.button] = false;
        };
        onMouseMove = (e) => {
            //e.preventDefault();
            this.mXEvent = e.x;
            this.mdXEvent += e.movementX;
            this.mYEvent = e.y;
            this.mdYEvent += e.movementY;
        };
        onMouseWheel = (e) => {
            //e.preventDefault();
            this.mdZEvent -= e.deltaY;
        };
    }

    class _vec3 {
        x;
        y;
        z;
        constructor(x, y, z) {
            if (x instanceof _vec3) {
                this.x = x.x;
                this.y = x.y;
                this.z = x.z;
            }
            else if (x instanceof Object) {
                this.x = x[0];
                this.y = x[1];
                this.z = x[2];
            }
            else if (x != undefined && y == undefined) {
                this.x = this.y = this.z = x;
            }
            else if (x != undefined && y != undefined && z != undefined) {
                this.x = x;
                this.y = y;
                this.z = z;
            }
            else {
                this.x = this.y = this.z = 0;
            }
        }
        add = (v) => {
            return vec3(this.x + v.x, this.y + v.y, this.z + v.z);
        };
        sub = (v) => {
            return vec3(this.x - v.x, this.y - v.y, this.z - v.z);
        };
        mulNum = (n) => {
            return vec3(this.x * n, this.y * n, this.z * n);
        };
        divNum = (n) => {
            return vec3(this.x / n, this.y / n, this.z / n);
        };
        neg = () => {
            return vec3(-this.x, -this.y, -this.z);
        };
        dot = (v) => {
            return this.x * v.x + this.y * v.y + this.z * v.z;
        };
        cross = (v) => {
            return vec3(this.y * v.z - v.y * this.z, v.x * this.z - this.x * v.z, this.x * v.y - v.x * this.y);
        };
        len2 = () => {
            return this.dot(this);
        };
        len = () => {
            const l = this.len2();
            if (l === 0 || l === 1)
                return l;
            else
                return Math.sqrt(l);
        };
        norm = () => {
            let len = this.len();
            return this.divNum(len);
        };
        mulMatr = (m) => {
            const w = this.x * m.a[0][3] + this.y * m.a[1][3] + this.z * m.a[2][3] + m.a[3][3];
            return vec3((this.x * m.a[0][0] +
                this.y * m.a[1][0] +
                this.z * m.a[2][0] +
                m.a[3][0]) /
                w, (this.x * m.a[0][1] +
                this.y * m.a[1][1] +
                this.z * m.a[2][1] +
                m.a[3][1]) /
                w, (this.x * m.a[0][2] +
                this.y * m.a[1][2] +
                this.z * m.a[2][2] +
                m.a[3][2]) /
                w);
        };
        vecTransform = (m) => {
            return vec3(this.x * m.a[0][0] + this.y * m.a[1][0] + this.z * m.a[2][0], this.x * m.a[0][1] + this.y * m.a[1][1] + this.z * m.a[2][1], this.x * m.a[0][2] + this.y * m.a[1][2] + this.z * m.a[2][2]);
        };
        pointTransform = (m) => {
            return vec3(this.x * m.a[0][0] + this.y * m.a[1][0] + this.z * m.a[2][0] + m.a[3][0], this.x * m.a[0][1] + this.y * m.a[1][1] + this.z * m.a[2][1] + m.a[3][1], this.x * m.a[0][2] + this.y * m.a[1][2] + this.z * m.a[2][2] + m.a[3][2]);
        };
    }
    function vec3(x, y, z) {
        return new _vec3(x, y, z);
    }

    /* Camera class */
    class camera {
        loc = vec3(0, 0, 0); /* Camera location */
        dir = vec3(0, 0, 0); /* Camera forward direction */
        right = vec3(0, 0, 0); /* Camera right direction */
        up = vec3(0, 0, 0); /* Camera up direction */
        at = vec3(0, 0, 0); /* Camera location */
        projDist = 0.1;
        projSize = 0.1;
        farClip = 1000;
        wp = 0.1;
        hp = 0.1;
        frameW = 100;
        frameH = 100;
        set = (loc, at, up1) => {
            this.loc = loc;
            this.dir = at.sub(loc).norm();
            this.right = this.dir.cross(up1).norm();
            this.up = this.right.cross(this.dir);
        };
        setProj = (farClip, projDist, projSize) => {
            this.farClip = farClip;
            this.projDist = projDist;
            this.projSize = projSize;
            this.wp = this.hp = this.projSize;
            if (this.frameW > this.frameH)
                this.wp *= this.frameW / this.frameH;
            else
                this.hp *= this.frameH / this.frameW;
        };
        resize = (w, h) => {
            this.frameW = w;
            this.frameH = h;
            this.wp = this.hp = this.projSize;
            if (this.frameW > this.frameH)
                this.wp *= this.frameW / this.frameH;
            else
                this.hp *= this.frameH / this.frameW;
        };
    }

    class shader {
        constructor(str, id) {
            this.progID = id;
            this.name = str;
        }
        progID = 0;
        name = '';
    }
    class shaderManager {
        shaders = [];
        shadersNum = 0;
        load = (fileName) => {
            const shdsName = ['vert', 'frag'];
            const shdsType = [exports.gl.VERTEX_SHADER, exports.gl.FRAGMENT_SHADER];
            const shdsID = [];
            let proms = [];
            for (let i = 0; i < shdsName.length; i++) {
                const buf = '../bin/shaders/' + fileName + '/' + shdsName[i] + '.glsl';
                proms[i] = fetch(buf)
                    .then((res) => res.text())
                    .then((data) => {
                    let res = exports.gl.createShader(Number(shdsType[i]));
                    if (!res)
                        return;
                    shdsID[i] = res;
                    exports.gl.shaderSource(shdsID[i], data);
                    exports.gl.compileShader(shdsID[i]);
                    if (!exports.gl.getShaderParameter(shdsID[i], exports.gl.COMPILE_STATUS)) {
                        const buf1 = exports.gl.getShaderInfoLog(shdsID[i]);
                        console.log(buf + ':' + '\n' + buf1);
                    }
                });
            }
            const n = this.shadersNum;
            this.shaders[n] = new shader(fileName, 0);
            Promise.all(proms).then(() => {
                const program = exports.gl.createProgram();
                if (!program)
                    return;
                for (let i = 0; i < shdsName.length; i++)
                    exports.gl.attachShader(program, shdsID[i]);
                exports.gl.linkProgram(program);
                if (!exports.gl.getProgramParameter(program, exports.gl.LINK_STATUS)) {
                    const Buf = exports.gl.getProgramInfoLog(program);
                    console.log(Buf);
                }
                this.shaders[n].name = fileName;
                this.shaders[n].progID = program;
            });
        };
        add = (fileName) => {
            for (let i = 0; i < this.shadersNum; i++)
                if (this.shaders[i].name == fileName)
                    return i;
            this.load(fileName);
            return this.shadersNum++;
        };
        get = (index) => {
            if (index < 0 || index > this.shadersNum)
                return this.shaders[0];
            return this.shaders[index];
        };
    }

    class buffer {
        id = 0;
        type = 0;
        size = 0;
        constructor(type, size) {
            let res = exports.gl.createBuffer();
            if (!res)
                return;
            this.id = res;
            this.type = type;
            this.size = size;
            exports.gl.bindBuffer(type, this.id);
            exports.gl.bufferData(type, size, exports.gl.STATIC_DRAW);
        }
        update(data, offset, size) {
            exports.gl.bindBuffer(this.type, this.id);
            exports.gl.bufferSubData(this.type, offset, data, 0);
        }
        apply(prg) {
            exports.gl.bindBuffer(this.type, this.id);
        }
        free() {
            exports.gl.deleteBuffer(this.id);
            this.id = 0;
            this.size = 0;
        }
    }
    class vertex_buffer extends buffer {
        numOfVertices;
        constructor(vertices, vertSize) {
            super(exports.gl.ARRAY_BUFFER, vertices.length);
            this.numOfVertices = vertices.length / vertSize;
            exports.gl.bufferData(exports.gl.ARRAY_BUFFER, vertices, exports.gl.STATIC_DRAW);
        }
        update(data, offset, size) {
            super.update(data, offset, size);
        }
        free() {
            super.free();
            this.numOfVertices = 0;
        }
    }
    class uniform_buffer extends buffer {
        name;
        bind;
        constructor(name, size, bindingPoint) {
            super(exports.gl.UNIFORM_BUFFER, size);
            exports.gl.bufferData(exports.gl.UNIFORM_BUFFER, size, exports.gl.STATIC_DRAW);
            this.bind = bindingPoint;
            this.name = name;
        }
        update(data, offset, size) {
            super.update(data, offset, size);
        }
        apply(prg) {
            let blk_loc = exports.gl.getUniformBlockIndex(prg, this.name);
            if (blk_loc !== -1 && blk_loc !== 4294967295) {
                exports.gl.uniformBlockBinding(prg, blk_loc, this.bind);
                exports.gl.bindBufferBase(exports.gl.UNIFORM_BUFFER, this.bind, this.id);
            }
        }
        free() {
            super.free();
        }
    }

    class texture {
        name;
        texId;
        isCube;
        constructor(name, texId, isCube) {
            this.name = name;
            this.texId = texId;
            this.isCube = isCube;
        }
    }
    class textureManager {
        textures = [];
        texturesNum = 0;
        apply = (prg) => {
            let loc;
            for (let i = 0; i < this.texturesNum; i++)
                if (!this.textures[i].isCube) {
                    exports.gl.activeTexture(exports.gl.TEXTURE1);
                    exports.gl.bindTexture(exports.gl.TEXTURE_2D, this.textures[i].texId);
                    if ((loc = exports.gl.getUniformLocation(prg, 'Tex' + 1)) != -1)
                        exports.gl.uniform1i(loc, 1);
                }
                else {
                    exports.gl.activeTexture(exports.gl.TEXTURE0);
                    exports.gl.bindTexture(exports.gl.TEXTURE_CUBE_MAP, this.textures[i].texId);
                    if ((loc = exports.gl.getUniformLocation(prg, 'Tex')) != -1)
                        exports.gl.uniform1i(loc, 0);
                }
        };
        add = (fileName) => {
            const n = this.texturesNum++;
            const res = exports.gl.createTexture();
            if (!res)
                return -1;
            this.textures[n] = new texture(fileName, res, false);
            const img = new Image();
            img.src = '../bin/textures/' + fileName;
            img.onload = () => {
                exports.gl.bindTexture(exports.gl.TEXTURE_2D, this.textures[n].texId);
                exports.gl.texImage2D(exports.gl.TEXTURE_2D, 0, exports.gl.RGBA, exports.gl.RGBA, exports.gl.UNSIGNED_BYTE, img);
                exports.gl.generateMipmap(exports.gl.TEXTURE_2D);
                exports.gl.texParameteri(exports.gl.TEXTURE_2D, exports.gl.TEXTURE_WRAP_S, exports.gl.REPEAT);
                exports.gl.texParameteri(exports.gl.TEXTURE_2D, exports.gl.TEXTURE_WRAP_T, exports.gl.REPEAT);
                exports.gl.texParameteri(exports.gl.TEXTURE_2D, exports.gl.TEXTURE_MIN_FILTER, exports.gl.LINEAR_MIPMAP_LINEAR);
                exports.gl.texParameteri(exports.gl.TEXTURE_2D, exports.gl.TEXTURE_MAG_FILTER, exports.gl.LINEAR);
            };
            return n;
        };
        addCubemap = (name, ext) => {
            const n = this.texturesNum++;
            const names = ['PosX', 'NegX', 'PosY', 'NegY', 'PosZ', 'NegZ'];
            const res = exports.gl.createTexture();
            if (!res)
                return -1;
            this.textures[n] = new texture(name, res, true);
            exports.gl.bindTexture(exports.gl.TEXTURE_CUBE_MAP, this.textures[n].texId);
            for (let i = 0; i < 6; i++) {
                const img = new Image();
                img.src = '../bin/textures/skyboxes/' + name + '/' + names[i] + '.' + ext;
                img.onload = () => {
                    exports.gl.bindTexture(exports.gl.TEXTURE_CUBE_MAP, this.textures[n].texId);
                    exports.gl.texImage2D(exports.gl.TEXTURE_CUBE_MAP_POSITIVE_X + i, 0, exports.gl.RGBA, exports.gl.RGBA, exports.gl.UNSIGNED_BYTE, img);
                };
            }
            exports.gl.texParameteri(exports.gl.TEXTURE_CUBE_MAP, exports.gl.TEXTURE_MIN_FILTER, exports.gl.LINEAR_MIPMAP_LINEAR);
            // gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
            // gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
            // gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
            // gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_WRAP_R, gl.CLAMP_TO_EDGE);
            return n;
        };
    }

    class rndContext {
        cam = new camera();
        shdManager = new shaderManager();
        texManager = new textureManager();
        shdDef = 0;
        cubeMap = 0;
        VA = 0;
        VBO;
        UBOutils;
        UBOshapes;
        maxShapes = 10;
        drawingShapes = [];
        init = () => {
            exports.gl.clearColor(0.3, 0.47, 0.8, 1);
            exports.gl.clear(exports.gl.COLOR_BUFFER_BIT);
            this.shdDef = this.shdManager.add('default');
            this.cubeMap = this.texManager.addCubemap('mountains', 'png');
            this.texManager.add('mountain.png');
            let res = exports.gl.createVertexArray();
            if (!res)
                return;
            this.VA = res;
            exports.gl.bindVertexArray(this.VA);
            this.VBO = new vertex_buffer(new Float32Array([-1, -1, 0, -1, 1, 0, 1, -1, 0, 1, 1, 0]), 3);
            this.UBOutils = new uniform_buffer('Utils', 4 * 4 * 7, 1);
            this.UBOshapes = new uniform_buffer('Scene', 4 * 4 * 11 * this.maxShapes + 4 * 4, 2);
        };
        frameStart = () => {
            exports.gl.clear(exports.gl.COLOR_BUFFER_BIT);
            this.drawingShapes.length = 0;
        };
        frameEnd = () => {
            let prg = this.shdManager.get(this.shdDef).progID;
            if (!prg)
                return;
            if (!this.UBOutils || !this.VBO || !this.VA || !this.UBOshapes)
                return;
            exports.gl.useProgram(prg);
            this.UBOutils.apply(prg);
            exports.gl.bindVertexArray(this.VA);
            this.VBO.apply(prg);
            this.texManager.apply(prg);
            let mas = [];
            for (let i = 0; i < this.drawingShapes.length; i++)
                this.drawingShapes[i].write2Array(mas);
            this.UBOshapes.update(new Float32Array(mas), 0, mas.length * 4);
            this.UBOshapes.update(new Float32Array([this.drawingShapes.length]), 4 * 4 * 11 * this.maxShapes, 4);
            this.UBOshapes.apply(prg);
            this.drawingShapes.length = 0;
            let loc;
            if ((loc = exports.gl.getAttribLocation(prg, 'InPos')) !== -1) {
                exports.gl.vertexAttribPointer(loc, 3, exports.gl.FLOAT, false, 3 * 4, 0);
                exports.gl.enableVertexAttribArray(loc);
            }
            exports.gl.drawArrays(exports.gl.TRIANGLE_STRIP, 0, this.VBO.numOfVertices);
            exports.gl.finish();
        };
        resize(w, h) {
            exports.gl.viewport(0, 0, w, h);
            this.cam.resize(w, h);
            if (!this.UBOutils)
                return;
            this.UBOutils.update(new Float32Array([
                this.cam.frameW,
                this.cam.frameH,
                this.cam.wp,
                this.cam.hp
            ]), 4 * 4 * 5, 4 * 4 * 1);
        }
        camSet = (loc, at, up1) => {
            this.cam.set(loc, at, up1);
            if (!this.UBOutils)
                return;
            this.UBOutils.update(new Float32Array([
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
            ]), 4 * 4 * 1, 4 * 4 * 4);
        };
        projSet = (farClip, projDist, projSize) => {
            this.cam.setProj(farClip, projDist, projSize);
            if (!this.UBOutils)
                return;
            this.UBOutils.update(new Float32Array([
                this.cam.wp,
                this.cam.hp,
                this.cam.farClip,
                this.cam.projDist,
                this.cam.projSize,
                0
            ]), 4 * 4 * 5 + 4 * 2, 4 * 2 + 4 * 4 * 1);
        };
        drawShape = (shp) => {
            if (this.drawingShapes.length >= this.maxShapes)
                return;
            this.drawingShapes.push(shp);
        };
    }

    class unit {
        init = (ani) => { };
        response = (ani) => { };
        render = (ani) => { };
    }
    class animContext extends input {
        rnd = new rndContext();
        units = [];
        addUnit = (uni) => {
            this.units.push(uni);
            uni.init(this);
        };
        init = () => {
            super.init();
            this.rnd.init();
        };
        resize = (w, h) => {
            this.rnd.resize(w, h);
        };
        camSet = (loc, at, up1) => {
            this.rnd.camSet(loc, at, up1);
        };
        projSet = (farClip, projDist, projSize) => {
            this.rnd.projSet(farClip, projDist, projSize);
        };
        response = () => {
            super.response();
            if (!this.rnd.UBOutils)
                return;
            this.rnd.UBOutils.update(new Float32Array([
                this.localTime,
                this.globalTime,
                this.localDeltaTime,
                this.globalDeltaTime
            ]), 0, 4 * 4 * 1);
            this.rnd.frameStart();
            for (let i = 0; i < this.units.length; i++)
                this.units[i].response(this);
            for (let i = 0; i < this.units.length; i++)
                this.units[i].render(this);
            /*gl.clearColor(Math.abs(Math.sin(this.tmr.globalTime)), 0, 0, 1);
            gl.clear(gl.COLOR_BUFFER_BIT);*/
            this.rnd.frameEnd();
        };
        drawShape = (shp) => {
            this.rnd.drawShape(shp);
        };
    }

    function d2r(a) {
        return a * (Math.PI / 180.0);
    }
    function r2d(a) {
        return a * (180.0 / Math.PI);
    }
    class _matr {
        a = [
            [0, 0, 0, 0],
            [0, 0, 0, 0],
            [0, 0, 0, 0],
            [0, 0, 0, 0]
        ];
        constructor(x) {
            for (let i = 0; i < 4; i++)
                for (let j = 0; j < 4; j++)
                    this.a[i][j] = x[i * 4 + j];
        }
        mulMatr = (m) => {
            let r = matrZero();
            for (let i = 0; i < 4; i++)
                for (let j = 0; j < 4; j++)
                    for (let k = 0; k < 4; k++)
                        r.a[i][j] += this.a[i][k] * m.a[k][j];
            return r;
        };
        transpose = () => {
            let r = matrZero();
            for (let i = 0; i < 4; i++)
                for (let j = 0; j < 4; j++)
                    r.a[i][j] = this.a[j][i];
            return r;
        };
        determ = () => {
            return (this.a[0][0] *
                matrDeterm3x3(this.a[1][1], this.a[1][2], this.a[1][3], this.a[2][1], this.a[2][2], this.a[2][3], this.a[3][1], this.a[3][2], this.a[3][3]) -
                this.a[0][1] *
                    matrDeterm3x3(this.a[1][0], this.a[1][2], this.a[1][3], this.a[2][0], this.a[2][2], this.a[2][3], this.a[3][0], this.a[3][2], this.a[3][3]) +
                this.a[0][2] *
                    matrDeterm3x3(this.a[1][0], this.a[1][1], this.a[1][3], this.a[2][0], this.a[2][1], this.a[2][3], this.a[3][0], this.a[3][1], this.a[3][3]) -
                this.a[0][3] *
                    matrDeterm3x3(this.a[1][0], this.a[1][1], this.a[1][2], this.a[2][0], this.a[2][1], this.a[2][2], this.a[3][0], this.a[3][1], this.a[3][2]));
        };
        inverse = () => {
            let det = this.determ();
            if (det === 0)
                return matrIdentity();
            let r = matrZero();
            // build adjoint matrix
            r.a[0][0] =
                matrDeterm3x3(this.a[1][1], this.a[1][2], this.a[1][3], this.a[2][1], this.a[2][2], this.a[2][3], this.a[3][1], this.a[3][2], this.a[3][3]) / det;
            r.a[1][0] =
                -matrDeterm3x3(this.a[1][0], this.a[1][2], this.a[1][3], this.a[2][0], this.a[2][2], this.a[2][3], this.a[3][0], this.a[3][2], this.a[3][3]) / det;
            r.a[2][0] =
                matrDeterm3x3(this.a[1][0], this.a[1][1], this.a[1][3], this.a[2][0], this.a[2][1], this.a[2][3], this.a[3][0], this.a[3][1], this.a[3][3]) / det;
            r.a[3][0] =
                -matrDeterm3x3(this.a[1][0], this.a[1][1], this.a[1][2], this.a[2][0], this.a[2][1], this.a[2][2], this.a[3][0], this.a[3][1], this.a[3][2]) / det;
            r.a[0][1] =
                -matrDeterm3x3(this.a[0][1], this.a[0][2], this.a[0][3], this.a[2][1], this.a[2][2], this.a[2][3], this.a[3][1], this.a[3][2], this.a[3][3]) / det;
            r.a[1][1] =
                +matrDeterm3x3(this.a[0][0], this.a[0][2], this.a[0][3], this.a[2][0], this.a[2][2], this.a[2][3], this.a[3][0], this.a[3][2], this.a[3][3]) / det;
            r.a[2][1] =
                -matrDeterm3x3(this.a[0][0], this.a[0][1], this.a[0][3], this.a[2][0], this.a[2][1], this.a[2][3], this.a[3][0], this.a[3][1], this.a[3][3]) / det;
            r.a[3][1] =
                +matrDeterm3x3(this.a[0][0], this.a[0][1], this.a[0][2], this.a[2][0], this.a[2][1], this.a[2][2], this.a[3][0], this.a[3][1], this.a[3][2]) / det;
            r.a[0][2] =
                +matrDeterm3x3(this.a[0][1], this.a[0][2], this.a[0][3], this.a[1][1], this.a[1][2], this.a[1][3], this.a[3][1], this.a[3][2], this.a[3][3]) / det;
            r.a[1][2] =
                -matrDeterm3x3(this.a[0][0], this.a[0][2], this.a[0][3], this.a[1][0], this.a[1][2], this.a[1][3], this.a[3][0], this.a[3][2], this.a[3][3]) / det;
            r.a[2][2] =
                +matrDeterm3x3(this.a[0][0], this.a[0][1], this.a[0][3], this.a[1][0], this.a[1][1], this.a[1][3], this.a[3][0], this.a[3][1], this.a[3][3]) / det;
            r.a[3][2] =
                -matrDeterm3x3(this.a[0][0], this.a[0][1], this.a[0][2], this.a[1][0], this.a[1][1], this.a[1][2], this.a[3][0], this.a[3][1], this.a[3][2]) / det;
            r.a[0][3] =
                -matrDeterm3x3(this.a[0][1], this.a[0][2], this.a[0][3], this.a[1][1], this.a[1][2], this.a[1][3], this.a[2][1], this.a[2][2], this.a[2][3]) / det;
            r.a[1][3] =
                +matrDeterm3x3(this.a[0][0], this.a[0][2], this.a[0][3], this.a[1][0], this.a[1][2], this.a[1][3], this.a[2][0], this.a[2][2], this.a[2][3]) / det;
            r.a[2][3] =
                -matrDeterm3x3(this.a[0][0], this.a[0][1], this.a[0][3], this.a[1][0], this.a[1][1], this.a[1][3], this.a[2][0], this.a[2][1], this.a[2][3]) / det;
            r.a[3][3] =
                +matrDeterm3x3(this.a[0][0], this.a[0][1], this.a[0][2], this.a[1][0], this.a[1][1], this.a[1][2], this.a[2][0], this.a[2][1], this.a[2][2]) / det;
            return r;
        };
    }
    function matr(x) {
        return new _matr(x);
    }
    function matrZero() {
        return new _matr([0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]);
    }
    function matrIdentity() {
        return new _matr([1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1]);
    }
    function matrDeterm3x3(a11, a12, a13, a21, a22, a23, a31, a32, a33) {
        return (a11 * a22 * a33 +
            a12 * a23 * a31 +
            a13 * a21 * a32 -
            a11 * a23 * a32 -
            a12 * a21 * a33 -
            a13 * a22 * a31);
    }
    function matrTranslate(t) {
        return matr([1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, t.x, t.y, t.z, 1]);
    }
    function matrRotateX(angleInDegree) {
        const a = d2r(angleInDegree);
        return matr([
            1,
            0,
            0,
            0,
            0,
            Math.cos(a),
            Math.sin(a),
            0,
            0,
            -Math.sin(a),
            Math.cos(a),
            0,
            0,
            0,
            0,
            1
        ]);
    }
    function matrRotateY(angleInDegree) {
        const a = d2r(angleInDegree);
        return matr([
            Math.cos(a),
            0,
            -Math.sin(a),
            0,
            0,
            1,
            0,
            0,
            Math.sin(a),
            0,
            Math.cos(a),
            0,
            0,
            0,
            0,
            1
        ]);
    }

    class control_unit extends unit {
        PrevTime = 0;
        PrevW = 0;
        PrevH = 0;
        init = (ani) => { };
        response = (ani) => {
            let Dist, plen, cosT, sinT, cosP, sinP, Azimuth, Elevator, sx, sy;
            if (ani.globalTime - this.PrevTime > 1 ||
                this.PrevW != ani.rnd.cam.frameW ||
                this.PrevH != ani.rnd.cam.frameH) {
                exports.can2d.fillStyle = 'yellow';
                exports.can2d.font = '30px sans-serif';
                exports.can2d.clearRect(0, 0, exports.can2d.canvas.width, exports.can2d.canvas.height);
                exports.can2d.fillText('FPS: ' + ani.fps.toFixed(1), 20, 50);
                this.PrevTime = ani.globalTime;
                this.PrevW = ani.rnd.cam.frameW;
                this.PrevH = ani.rnd.cam.frameH;
            }
            if (ani.keysClick['P'.charCodeAt(0)])
                ani.isPause = !ani.isPause;
            Dist = ani.rnd.cam.at.sub(ani.rnd.cam.loc).len();
            cosT = (ani.rnd.cam.loc.y - ani.rnd.cam.at.y) / Dist;
            sinT = Math.sqrt(1 - cosT * cosT);
            plen = Dist * sinT;
            cosP = (ani.rnd.cam.loc.z - ani.rnd.cam.at.z) / plen;
            sinP = (ani.rnd.cam.loc.x - ani.rnd.cam.at.x) / plen;
            Azimuth = r2d(Math.atan2(sinP, cosP));
            Elevator = r2d(Math.atan2(sinT, cosT));
            Azimuth +=
                (ani.globalDeltaTime *
                    (-30 * Number(ani.keys[ani.VK_LBUTTON]) * ani.mdX +
                        47 *
                            (Number(ani.keys[ani.VK_LEFT]) - Number(ani.keys[ani.VK_RIGHT])) *
                            10)) /
                    5;
            Elevator +=
                (ani.globalDeltaTime *
                    (-30 * Number(ani.keys[ani.VK_LBUTTON]) * ani.mdY +
                        47 *
                            (Number(ani.keys[ani.VK_UP]) -
                                Number(ani.keys[ani.VK_DOWN]) * 10))) /
                    5;
            Dist -=
                ((ani.globalDeltaTime *
                    ((3 + Number(ani.keys[ani.VK_CONTROL]) * 10) *
                        (ani.mdZ / 20 +
                            (Number(ani.keys['W'.charCodeAt(0)]) -
                                Number(ani.keys['S'.charCodeAt(0)]))))) /
                    5) *
                    ani.rnd.cam.at.sub(ani.rnd.cam.loc).len();
            if (Elevator < 0.08)
                Elevator = 0.08;
            else if (Elevator > 178.9)
                Elevator = 178.9;
            if (Dist < 0.1)
                Dist = 0.1;
            sx =
                (((Number(ani.keys[ani.VK_RBUTTON]) * -ani.mdX * ani.rnd.cam.wp) /
                    ani.rnd.cam.frameW) *
                    Dist) /
                    ani.rnd.cam.projDist;
            sy =
                (((-Number(ani.keys[ani.VK_RBUTTON]) * -ani.mdY * ani.rnd.cam.hp) /
                    ani.rnd.cam.frameH) *
                    Dist) /
                    ani.rnd.cam.projDist;
            let dv = ani.rnd.cam.right.mulNum(sx).add(ani.rnd.cam.up.mulNum(sy));
            ani.rnd.cam.at = ani.rnd.cam.at.add(dv);
            ani.rnd.cam.loc = ani.rnd.cam.loc.add(dv);
            ani.camSet(vec3(0, Dist, 0).pointTransform(matrRotateX(Elevator)
                .mulMatr(matrRotateY(Azimuth))
                .mulMatr(matrTranslate(ani.rnd.cam.at))), ani.rnd.cam.at, vec3(0, 1, 0));
        };
    }

    class material {
        ka;
        kd;
        ks;
        ph;
        texN = 0;
        constructor(ka, kd, ks, ph, texN) {
            this.ka = ka;
            this.kd = kd;
            this.ks = ks;
            this.ph = ph;
            this.texN = texN;
        }
        write2Array(mas) {
            mas.push(this.ka.x, this.ka.y, this.ka.z, 0, this.kd.x, this.kd.y, this.kd.z, 0, this.ks.x, this.ks.y, this.ks.z, this.ph, this.texN, 0, 0, 0);
        }
    }

    class shape {
        trans;
        mtl;
        type;
        constructor(trans, mtl, type) {
            this.trans = trans;
            this.mtl = mtl;
            this.type = type;
        }
        write2Array(mas) {
            let invTrans = this.trans.inverse();
            for (let i = 0; i < 4; i++)
                for (let j = 0; j < 4; j++)
                    mas.push(invTrans.a[i][j]);
            this.mtl.write2Array(mas);
            mas.push(this.type, 0, 0, 0);
        }
    }
    class sphere extends shape {
        radius;
        constructor(trans, mtl, radius) {
            super(trans, mtl, 0);
            this.radius = radius;
        }
        write2Array(mas) {
            super.write2Array(mas);
            mas.push(this.radius, 0, 0, 0);
            mas.push(0, 0, 0, 0);
        }
    }
    class box extends shape {
        sizes;
        constructor(trans, mtl, sizes) {
            super(trans, mtl, 1);
            this.sizes = sizes;
        }
        write2Array(mas) {
            super.write2Array(mas);
            mas.push(this.sizes.x, this.sizes.y, this.sizes.z, 0);
            mas.push(0, 0, 0, 0);
        }
    }
    class plane extends shape {
        normal;
        offset;
        constructor(trans, mtl, point, normal) {
            super(trans, mtl, 2);
            this.normal = normal.norm();
            this.offset = this.normal.dot(point);
        }
        write2Array(mas) {
            super.write2Array(mas);
            mas.push(this.normal.x, this.normal.y, this.normal.z, this.offset);
            mas.push(0, 0, 0, 0);
        }
    }

    class redactor_unit extends unit {
        shps = [];
        response = (ani) => {
            let px = ((2 * ani.mX + 1) / ani.rnd.cam.frameW - 1) * ani.rnd.cam.wp, py = (-(2 * ani.mY + 1) / ani.rnd.cam.frameH + 1) * ani.rnd.cam.hp;
            let dir = ani.rnd.cam.dir
                .mulNum(ani.rnd.cam.projDist)
                .add(ani.rnd.cam.right.mulNum(px))
                .add(ani.rnd.cam.up.mulNum(py)), org = ani.rnd.cam.loc.add(dir);
            dir = dir.norm();
            let t = -org.y / dir.y;
            if (t < 0)
                return;
            let pnt = org.add(dir.mulNum(t));
            pnt.y = 0.2 + Math.random() * 2;
            if (ani.keysClick['1'.charCodeAt(0)]) {
                this.shps.push(new sphere(matrTranslate(pnt), new material(vec3(Math.random(), Math.random(), Math.random()), vec3(Math.random(), Math.random(), Math.random()), vec3(Math.random(), Math.random(), Math.random()), Math.random() * 100, -1), pnt.y));
            }
            if (ani.keysClick['2'.charCodeAt(0)]) {
                this.shps.push(new box(matrTranslate(pnt), new material(vec3(Math.random(), Math.random(), Math.random()), vec3(Math.random(), Math.random(), Math.random()), vec3(Math.random(), Math.random(), Math.random()), Math.random() * 100, -1), vec3(pnt.y, pnt.y, pnt.y)));
            }
            if (ani.keys[ani.VK_CONTROL] && ani.keysClick['Z'.charCodeAt(0)])
                this.shps.pop();
        };
        render = (ani) => {
            for (let i = 0; i < this.shps.length; i++)
                ani.drawShape(this.shps[i]);
        };
    }

    class test_unit extends unit {
        shpSphere = new sphere(matrIdentity(), new material(vec3(0.1, 0.1, 0.1), vec3(0.8, 0.3, 0.1), vec3(0.7, 0.7, 0.7), 40, -1), 1);
        shpPlane = new plane(matrIdentity(), new material(vec3(0.1, 0.1, 0.1), vec3(0.3, 0.3, 0.3), vec3(0.2, 0.2, 0.2), 5, -1), vec3(0, 0, 0), vec3(0, 1, 0));
        shpBox = new box(matrTranslate(vec3(0, 1, 0)), new material(vec3(0.1, 0.1, 0.1), vec3(0.3, 0.9, 0.5), vec3(0.5, 0.5, 0.5), 28, -1), vec3(1, 1, 1));
        render = (ani) => {
            this.shpSphere.trans = matrTranslate(vec3(0, 2, 3)).mulMatr(matrRotateY(ani.localTime * 100));
            ani.drawShape(this.shpSphere);
            ani.drawShape(this.shpPlane);
            ani.drawShape(this.shpBox);
        };
    }

    exports.gl = void 0;
    exports.can2d = void 0;
    function getContext() {
        const canvas = document.querySelector('#glcan');
        if (!canvas)
            return;
        const ctx = canvas.getContext('webgl2');
        if (!ctx)
            return;
        exports.gl = ctx;
        const canvas2 = document.querySelector('#can2D');
        if (!canvas2)
            return;
        const ctx2 = canvas2.getContext('2d');
        if (!ctx2)
            return;
        exports.can2d = ctx2;
    }
    let anim = new animContext();
    window.addEventListener('load', () => {
        getContext();
        anim.init();
        let w = window.innerWidth;
        let h = window.innerHeight;
        anim.resize(w, h);
        exports.gl.canvas.width = w;
        exports.gl.canvas.height = h;
        exports.can2d.canvas.width = w;
        exports.can2d.canvas.height = h;
        exports.can2d.fillStyle = 'yellow';
        exports.can2d.font = '30px sans-serif';
        exports.can2d.clearRect(0, 0, exports.can2d.canvas.width, exports.can2d.canvas.height);
        exports.can2d.fillText('FPS: 30.7', 100, 100);
        anim.camSet(vec3(1, 1, 1), vec3(0, 0, 0), vec3(0, 1, 0));
        anim.projSet(100, 0.1, 0.1);
        anim.addUnit(new control_unit());
        anim.addUnit(new test_unit());
        anim.addUnit(new redactor_unit());
        const renderFrame = () => {
            anim.response();
            window.requestAnimationFrame(renderFrame);
        };
        renderFrame();
    });
    window.addEventListener('resize', (event) => {
        let w = window.innerWidth;
        let h = window.innerHeight;
        anim.resize(w, h);
        exports.gl.canvas.width = w;
        exports.gl.canvas.height = h;
        exports.can2d.canvas.width = w;
        exports.can2d.canvas.height = h;
    });
    window.addEventListener('keydown', anim.onKeyDown);
    window.addEventListener('keyup', anim.onKeyUp);
    window.addEventListener('mousedown', anim.onMouseDown);
    window.addEventListener('mouseup', anim.onMouseUp);
    window.addEventListener('mousemove', anim.onMouseMove);
    window.addEventListener('wheel', anim.onMouseWheel);

    return exports;

})({});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWFpbi5qcyIsInNvdXJjZXMiOlsiLi4vc3JjL3RpbWVyLnRzIiwiLi4vc3JjL2lucHV0LnRzIiwiLi4vc3JjL210aHZlYzMudHMiLCIuLi9zcmMvY2FtZXJhLnRzIiwiLi4vc3JjL3NoYWRlci50cyIsIi4uL3NyYy9idWZmZXIudHMiLCIuLi9zcmMvdGV4dHVyZS50cyIsIi4uL3NyYy9ybmQudHMiLCIuLi9zcmMvYW5pbS50cyIsIi4uL3NyYy9tdGhtYXRyLnRzIiwiLi4vc3JjL3VuaXRzL2NvbnRyb2xfdW5pdC50cyIsIi4uL3NyYy9tYXRlcmlhbC50cyIsIi4uL3NyYy9zaGFwZS50cyIsIi4uL3NyYy91bml0cy9yZWRhY3Rvcl91bml0LnRzIiwiLi4vc3JjL3VuaXRzL3Rlc3RfdW5pdC50cyIsIi4uL3NyYy9tYWluLnRzIl0sInNvdXJjZXNDb250ZW50IjpbbnVsbCxudWxsLG51bGwsbnVsbCxudWxsLG51bGwsbnVsbCxudWxsLG51bGwsbnVsbCxudWxsLG51bGwsbnVsbCxudWxsLG51bGwsbnVsbF0sIm5hbWVzIjpbImdsIiwiY2FuMmQiXSwibWFwcGluZ3MiOiI7OztVQUFhLEtBQUssQ0FBQTtRQUNoQixPQUFPLEdBQVksS0FBSyxDQUFDO1FBQ3pCLFVBQVUsR0FBVyxDQUFDLENBQUM7UUFDdkIsZUFBZSxHQUFXLENBQUMsQ0FBQztRQUM1QixTQUFTLEdBQVcsQ0FBQyxDQUFDO1FBQ3RCLGNBQWMsR0FBVyxDQUFDLENBQUM7UUFDM0IsR0FBRyxHQUFXLElBQUksQ0FBQztRQUVYLFNBQVMsR0FBVyxDQUFDLENBQUM7UUFDdEIsT0FBTyxHQUFXLENBQUMsQ0FBQztRQUNwQixVQUFVLEdBQVcsQ0FBQyxDQUFDO1FBQ3ZCLFNBQVMsR0FBVyxDQUFDLENBQUM7UUFDdEIsWUFBWSxHQUFXLENBQUMsQ0FBQztRQUVqQyxJQUFJLEdBQUE7SUFFRixRQUFBLElBQUksQ0FBQyxTQUFTO0lBQ1osWUFBQSxJQUFJLENBQUMsVUFBVTtJQUNmLGdCQUFBLElBQUksQ0FBQyxP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QUssQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDO0lBQUUsWUFBQSxPQUFPLENBQUMsQ0FBQzs7SUFDNUIsWUFBQSxPQUFPLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUM7SUFDM0IsS0FBQyxDQUFDO1FBRUYsSUFBSSxHQUFHLE1BQUs7SUFDVixRQUFBLElBQUksR0FBRyxHQUFHLElBQUksQ0FBQyxHQUFHLEVBQUUsQ0FBQztJQUNyQixRQUFBLE9BQU8sSUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsQ0FBQztJQUMxQixLQUFDLENBQUM7SUFFRixJQUFBLE9BQU8sR0FBRyxDQUFDLENBQVEsS0FBSTtZQUNyQixNQUFNLENBQUMsR0FDTCxJQUFJLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO0lBRTNFLFFBQUEsT0FBTyxJQUFJLENBQ1QsQ0FBQyxJQUFJLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO2dCQUNqQixJQUFJLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO2dCQUNsQixJQUFJLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO2dCQUNsQixDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztJQUNULFlBQUEsQ0FBQyxFQUNILENBQUMsSUFBSSxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztnQkFDakIsSUFBSSxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztnQkFDbEIsSUFBSSxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztnQkFDbEIsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7SUFDVCxZQUFBLENBQUMsRUFDSCxDQUFDLElBQUksQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7Z0JBQ2pCLElBQUksQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7Z0JBQ2xCLElBQUksQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7Z0JBQ2xCLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO0lBQ1QsWUFBQSxDQUFDLENBQ0osQ0FBQztJQUNKLEtBQUMsQ0FBQztJQUVGLElBQUEsWUFBWSxHQUFHLENBQUMsQ0FBUSxLQUFJO0lBQzFCLFFBQUEsT0FBTyxJQUFJLENBQ1QsSUFBSSxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQzVELElBQUksQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUM1RCxJQUFJLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FDN0QsQ0FBQztJQUNKLEtBQUMsQ0FBQztJQUVGLElBQUEsY0FBYyxHQUFHLENBQUMsQ0FBUSxLQUFJO0lBQzVCLFFBQUEsT0FBTyxJQUFJLENBQ1QsSUFBSSxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFDeEUsSUFBSSxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxD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QUFDLENBQUMsRUFDWixJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUNaLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQ1osSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFDWixJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUNaLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQ1osSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FDYjtJQUNILFlBQUEsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7SUFDVixnQkFBQSxhQUFhLENBQ1gsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFDWixJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUNaLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQ1osSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFDWixJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUNaLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQ1osSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFDWixJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUNaLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQ2I7SUFDSCxZQUFBLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO0lBQ1YsZ0JBQUEsYUFBYSxDQUNYLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQ1osSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFDWixJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUNaLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQ1osSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFDWixJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUNaLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQ1osSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFDWixJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUNiO0lBQ0gsWUFBQSxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztvQkFDVixhQUFhLENBQ1gsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFDWixJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUNaLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQ1osSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFDWixJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUNaLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQ1osSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFDWixJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUNaLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQ2IsRUFDSDtJQUNKLEtBQUMsQ0FBQztRQUVGLE9BQU8sR0FBRyxNQUFLO0lBQ2IsUUFBQSxJQUFJLEdBQUcsR0FBRyxJQUFJLENBQUMsTUFBTSxFQUFFLENBQUM7WUFDeEIsSUFBSSxHQUFHLEtBQUssQ0FBQztnQkFBRSxPQUFPLFlBQVksRUFBRSxDQUFDO0lBRXJDLFFBQUEsSUFBSSxDQUFDLEdBQUcsUUFBUSxFQUFFLENBQUM7O0lBR25CLFFBQUEsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7Z0JBQ1AsYUFBYSxDQUNYLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQ1osSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFDWixJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUNaLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQ1osSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFDWixJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUNaLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQ1osSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFDWixJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUNiLEdBQUcsR0FBRyxDQUFDO0lBRVYsUUFBQSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztnQkFDUCxDQUFDLGFBQWEsQ0FDWixJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUNaLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQ1osSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFDWixJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUNaLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQ1osSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFDWixJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUNaLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQ1osSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FDYixHQUFHLEdBQUcsQ0FBQztJQUVWLFFBQUEsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7Z0JBQ1AsYUFBYSxDQUNYLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQ1osSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFDWixJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUNaLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQ1osSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFDWixJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUNaLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQ1osSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFDWixJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUNiLEdBQUcsR0FBRyxDQUFDO0lBRVYsUUFBQSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztnQkFDUCxDQUFDLGFBQWEsQ0FDWixJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUNaLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQ1osSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFDWixJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUNaLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQ1osSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFDWixJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUNaLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQ1osSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FDYixHQUFHLEdBQUcsQ0FBQztJQUVWLFFBQUEsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7Z0JBQ1AsQ0FBQyxhQUFhLENBQ1osSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFDWixJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUNaLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQ1osSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFDWixJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUNaLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQ1osSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFDWixJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUNaLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQ2IsR0FBRyxHQUFHLENBQUM7SUFFVixRQUFBLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO2dCQUNQLENBQUMsYUFBYSxDQUNaLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQ1osSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFDWixJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUNaLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQ1osSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFDWixJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUNaLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQ1osSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFDWixJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUNiLEdBQUcsR0FBRyxDQUFDO0lBRVYsUUFBQSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztnQkFDUCxDQUFDLGFBQWEsQ0FDWixJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUNaLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQ1osSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFDWixJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUNaLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQ1osSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFDWixJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUNaLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQ1osSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FDYixHQUFHLEdBQUcsQ0FBQztJQUVWLFFBQUEsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7Z0JBQ1AsQ0FBQyxhQUFhLENBQ1osSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFDWixJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUNaLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQ1osSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFDWixJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUNaLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQ1osSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFDWixJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUNaLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQ2IsR0FBRyxHQUFHLENBQUM7SUFFVixRQUFBLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO2dCQUNQLENBQUMsYUFBYSxDQUNaLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQ1osSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFDWixJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUNaLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQ1osSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFDWixJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUNaLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQ1osSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFDWixJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUNiLEdBQUcsR0FBRyxDQUFDO0lBRVYsUUFBQSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztnQkFDUCxDQUFDLGFBQWEsQ0FDWixJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUNaLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQ1osSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFDWixJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUNaLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQ1osSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFDWixJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUNaLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQ1osSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FDYixHQUFHLEdBQUcsQ0FBQztJQUVWLFFBQUEsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7Z0JBQ1AsQ0FBQyxhQUFhLENBQ1osSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFDWixJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUNaLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQ1osSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFDWixJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUNaLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQ1osSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFDWixJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUNaLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQ2IsR0FBRyxHQUFHLENBQUM7SUFFVixRQUFBLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO2dCQUNQLENBQUMsYUFBYSxDQUNaLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQ1osSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFDWixJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUNaLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQ1osSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFDWixJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUNaLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQ1osSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFDWixJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUNiLEdBQUcsR0FBRyxDQUFDO0lBRVYsUUFBQSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztnQkFDUCxDQUFDLGFBQWEsQ0FDWixJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUNaLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQ1osSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFDWixJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUNaLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQ1osSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFDWixJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUNaLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQ1osSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FDYixHQUFHLEdBQUcsQ0FBQztJQUVWLFFBQUEsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7Z0JBQ1AsQ0FBQyxhQUFhLENBQ1osSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFDWixJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUNaLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQ1osSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFDWixJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUNaLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQ1osSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFDWixJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUNaLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQ2IsR0FBRyxHQUFHLENBQUM7SUFFVixRQUFBLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO2dCQUNQLENBQUMsYUFBYSxDQUNaLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQ1osSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFDWixJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUNaLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQ1osSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFDWixJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUNaLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQ1osSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFDWixJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUNiLEdBQUcsR0FBRyxDQUFDO0lBRVYsUUFBQSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztnQkFDUCxDQUFDLGFBQWEsQ0FDWixJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUNaLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQ1osSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFDWixJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUNaLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQ1osSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFDWixJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUNaLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQ1osSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FDYixHQUFHLEdBQUcsQ0FBQztJQUVWLFFBQUEsT0FBTyxDQUFDLENBQUM7SUFDWCxLQUFDLENBQUM7SUFDSCxDQUFBO0lBRUssU0FBVSxJQUFJLENBQUMsQ0FBVyxFQUFBO0lBQzlCLElBQUEsT0FBTyxJQUFJLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQztJQUN0QixDQUFDO2FBRWUsUUFBUSxHQUFBO0lBQ3RCLElBQUEsT0FBTyxJQUFJLEtBQUssQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUM7SUFDckUsQ0FBQzthQUVlLFlBQVksR0FBQTtJQUMxQixJQUFBLE9BQU8sSUFBSSxLQUFLLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDO0lBQ3JFLENBQUM7YUFFZSxhQUFhLENBQzNCLEdBQVcsRUFDWCxHQUFXLEVBQ1gsR0FBVyxFQUNYLEdBQVcsRUFDWCxHQUFXLEVBQ1gsR0FBVyxFQUNYLEdBQVcsRUFDWCxHQUFXLEVBQ1gsR0FBVyxFQUFBO0lBRVgsSUFBQSxRQUNFLEdBQUcsR0FBRyxHQUFHLEdBQUcsR0FBRztZQUNmLEdBQUcsR0FBRyxHQUFHLEdBQUcsR0FBRztZQUNmLEdBQUcsR0FBRyxHQUFHLEdBQUcsR0FBRztZQUNmLEdBQUcsR0FBRyxHQUFHLEdBQUcsR0FBRztZQUNmLEdBQUcsR0FBRyxHQUFHLEdBQUcsR0FBRztJQUNmLFFBQUEsR0FBRyxHQUFHLEdBQUcsR0FBRyxHQUFHLEVBQ2Y7SUFDSixDQUFDO0lBRUssU0FBVSxhQUFhLENBQUMsQ0FBUSxFQUFBO0lBQ3BDLElBQUEsT0FBTyxJQUFJLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDO0lBQ3RFLENBQUM7SUFNSyxTQUFVLFdBQVcsQ0FBQyxhQUFxQixFQUFBO0lBQy9DLElBQUEsTUFBTSxDQUFDLEdBQUcsR0FBRyxDQUFDLGFBQWEsQ0FBQyxDQUFDO0lBQzdCLElBQUEsT0FBTyxJQUFJLENBQUM7WUFDVixDQUFDO1lBQ0QsQ0FBQztZQUNELENBQUM7WUFDRCxDQUFDO1lBQ0QsQ0FBQztJQUNELFFBQUEsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUM7SUFDWCxRQUFBLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDO1lBQ1gsQ0FBQztZQUNELENBQUM7SUFDRCxRQUFBLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUM7SUFDWixRQUFBLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDO1lBQ1gsQ0FBQztZQUNELENBQUM7WUFDRCxDQUFDO1lBQ0QsQ0FBQztZQUNELENBQUM7SUFDRixLQUFBLENBQUMsQ0FBQztJQUNMLENBQUM7SUFFSyxTQUFVLFdBQVcsQ0FBQyxhQUFxQixFQUFBO0lBQy9DLElBQUEsTUFBTSxDQUFDLEdBQUcsR0FBRyxDQUFDLGFBQWEsQ0FBQyxDQUFDO0lBQzdCLElBQUEsT0FBTyxJQUFJLENBQUM7SUFDVixRQUFBLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDO1lBQ1gsQ0FBQztJQUNELFFBQUEsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQztZQUNaLENBQUM7WUFDRCxDQUFDO1lBQ0QsQ0FBQztZQUNELENBQUM7WUFDRCxDQUFDO0lBQ0QsUUFBQSxJQUFJLENB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
