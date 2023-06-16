!function(l){"use strict";function o(t){return t*(Math.PI/180)}function d(t){return t*(180/Math.PI)}class i{constructor(s){if("object"==typeof s)if("object"==typeof s[0]){this.a=[];for(let i=0;i<4;i++){var a=[];if(void 0!==s[i])for(let t=0;t<4;t++)a[t]=void 0===s[i][t]?0:s[i][t];else for(let t=0;t<4;t++)a[t]=0;this.a[i]=a}}else{this.a=[];for(let i=0;i<4;i++){var e=[];for(let t=0;t<4;t++)e[t]=void 0===s[4*i+t]?0:s[4*i+t];this.a[i]=e}}else{this.a=[];for(let i=0;i<4;i++){var r=[];for(let t=0;t<4;t++)r[t]=void 0===arguments[4*i+t]?0:arguments[4*i+t];this.a[i]=r}}}mulMatr=a=>{var e=m();for(let s=0;s<4;s++)for(let i=0;i<4;i++)for(let t=0;t<4;t++)e.a[s][i]+=this.a[s][t]*a.a[t][i];return e};transpose=()=>{var s=m();for(let i=0;i<4;i++)for(let t=0;t<4;t++)s.a[i][t]=this.a[t][i];return s};determ=()=>this.a[0][0]*s(this.a[1][1],this.a[1][2],this.a[1][3],this.a[2][1],this.a[2][2],this.a[2][3],this.a[3][1],this.a[3][2],this.a[3][3])-this.a[0][1]*s(this.a[1][0],this.a[1][2],this.a[1][3],this.a[2][0],this.a[2][2],this.a[2][3],this.a[3][0],this.a[3][2],this.a[3][3])+this.a[0][2]*s(this.a[1][0],this.a[1][1],this.a[1][3],this.a[2][0],this.a[2][1],this.a[2][3],this.a[3][0],this.a[3][1],this.a[3][3])-this.a[0][3]*s(this.a[1][0],this.a[1][1],this.a[1][2],this.a[2][0],this.a[2][1],this.a[2][2],this.a[3][0],this.a[3][1],this.a[3][2]);inverse=()=>{var t,i=this.determ();return 0===i?h():((t=m()).a[0][0]=s(this.a[1][1],this.a[1][2],this.a[1][3],this.a[2][1],this.a[2][2],this.a[2][3],this.a[3][1],this.a[3][2],this.a[3][3])/i,t.a[1][0]=-s(this.a[1][0],this.a[1][2],this.a[1][3],this.a[2][0],this.a[2][2],this.a[2][3],this.a[3][0],this.a[3][2],this.a[3][3])/i,t.a[2][0]=s(this.a[1][0],this.a[1][1],this.a[1][3],this.a[2][0],this.a[2][1],this.a[2][3],this.a[3][0],this.a[3][1],this.a[3][3])/i,t.a[3][0]=-s(this.a[1][0],this.a[1][1],this.a[1][2],this.a[2][0],this.a[2][1],this.a[2][2],this.a[3][0],this.a[3][1],this.a[3][2])/i,t.a[0][1]=-s(this.a[0][1],this.a[0][2],this.a[0][3],this.a[2][1],this.a[2][2],this.a[2][3],this.a[3][1],this.a[3][2],this.a[3][3])/i,t.a[1][1]=+s(this.a[0][0],this.a[0][2],this.a[0][3],this.a[2][0],this.a[2][2],this.a[2][3],this.a[3][0],this.a[3][2],this.a[3][3])/i,t.a[2][1]=-s(this.a[0][0],this.a[0][1],this.a[0][3],this.a[2][0],this.a[2][1],this.a[2][3],this.a[3][0],this.a[3][1],this.a[3][3])/i,t.a[3][1]=+s(this.a[0][0],this.a[0][1],this.a[0][2],this.a[2][0],this.a[2][1],this.a[2][2],this.a[3][0],this.a[3][1],this.a[3][2])/i,t.a[0][2]=+s(this.a[0][1],this.a[0][2],this.a[0][3],this.a[1][1],this.a[1][2],this.a[1][3],this.a[3][1],this.a[3][2],this.a[3][3])/i,t.a[1][2]=-s(this.a[0][0],this.a[0][2],this.a[0][3],this.a[1][0],this.a[1][2],this.a[1][3],this.a[3][0],this.a[3][2],this.a[3][3])/i,t.a[2][2]=+s(this.a[0][0],this.a[0][1],this.a[0][3],this.a[1][0],this.a[1][1],this.a[1][3],this.a[3][0],this.a[3][1],this.a[3][3])/i,t.a[3][2]=-s(this.a[0][0],this.a[0][1],this.a[0][2],this.a[1][0],this.a[1][1],this.a[1][2],this.a[3][0],this.a[3][1],this.a[3][2])/i,t.a[0][3]=-s(this.a[0][1],this.a[0][2],this.a[0][3],this.a[1][1],this.a[1][2],this.a[1][3],this.a[2][1],this.a[2][2],this.a[2][3])/i,t.a[1][3]=+s(this.a[0][0],this.a[0][2],this.a[0][3],this.a[1][0],this.a[1][2],this.a[1][3],this.a[2][0],this.a[2][2],this.a[2][3])/i,t.a[2][3]=-s(this.a[0][0],this.a[0][1],this.a[0][3],this.a[1][0],this.a[1][1],this.a[1][3],this.a[2][0],this.a[2][1],this.a[2][3])/i,t.a[3][3]=+s(this.a[0][0],this.a[0][1],this.a[0][2],this.a[1][0],this.a[1][1],this.a[1][2],this.a[2][0],this.a[2][1],this.a[2][2])/i,t)}}function m(...t){return new i(...t)}function h(){return m([[1,0,0,0],[0,1,0,0],[0,0,1,0],[0,0,0,1]])}function s(t,i,s,a,e,r,h,n,l){return t*e*l+i*r*h+s*a*n-t*r*n-i*a*l-s*e*h}function w(t){return m([[1,0,0,0],[0,1,0,0],[0,0,1,0],[t.x,t.y,t.z,1]])}function n(t){return m([[t.x,0,0,0],[0,t.y,0,0],[0,0,t.z,0],[0,0,0,1]])}function u(t){t=o(t);return m([[1,0,0,0],[0,Math.cos(t),Math.sin(t),0],[0,-Math.sin(t),Math.cos(t),0],[0,0,0,1]])}function t(t){t=o(t);return m([[Math.cos(t),Math.sin(t),0,0],[-Math.sin(t),Math.cos(t),0,0],[0,0,1,0],[0,0,0,1]])}class a{constructor(t,i,s){void 0===t?this.x=this.y=this.z=0:"object"==typeof t?3===t.length?(this.x=t[0],this.y=t[1],this.z=t[2]):(this.x=t.x,this.y=t.y,this.z=t.z):void 0===i||void 0===s?this.x=this.y=this.z=t:(this.x=t,this.y=i,this.z=s)}add=t=>E(this.x+t.x,this.y+t.y,this.z+t.z);sub=t=>E(this.x-t.x,this.y-t.y,this.z-t.z);mulNum=t=>E(this.x*t,this.y*t,this.z*t);divNum=t=>E(this.x/t,this.y/t,this.z/t);neg=()=>E(-this.x,-this.y,-this.z);dot=t=>this.x*t.x+this.y*t.y+this.z*t.z;cross=t=>E(this.y*t.z-t.y*this.z,t.x*this.z-this.x*t.z,this.x*t.y-t.x*this.y);len2=()=>this.dot(this,this);len=()=>{var t=this.len2();return 0===t||1===t?t:Math.sqrt(t)};norm=()=>{var t=this.len();return this.divNum(t)};mulMatr=t=>{var i=this.x*t.a[0][3]+this.y*t.a[1][3]+this.z*t.a[2][3]+t.a[3][3];return E((this.x*t.a[0][0]+this.y*t.a[1][0]+this.z*t.a[2][0]+t.a[3][0])/i,(this.x*t.a[0][1]+this.y*t.a[1][1]+this.z*t.a[2][1]+t.a[3][1])/i,(this.x*t.a[0][2]+this.y*t.a[1][2]+this.z*t.a[2][2]+t.a[3][2])/i)};vecTransform=t=>E(this.x*t.a[0][0]+this.y*t.a[1][0]+this.z*t.a[2][0],this.x*t.a[0][1]+this.y*t.a[1][1]+this.z*t.a[2][1],this.x*t.a[0][2]+this.y*t.a[1][2]+this.z*t.a[2][2]);pointTransform=t=>E(this.x*t.a[0][0]+this.y*t.a[1][0]+this.z*t.a[2][0]+t.a[3][0],this.x*t.a[0][1]+this.y*t.a[1][1]+this.z*t.a[2][1]+t.a[3][1],this.x*t.a[0][2]+this.y*t.a[1][2]+this.z*t.a[2][2]+t.a[3][2])}function E(...t){return new a(...t)}class e{constructor(t,i){this.id=window.gl.createBuffer(),this.type=t,window.gl.bindBuffer(t,this.id),window.gl.bufferData(t,i,window.gl.STATIC_DRAW)}update(t){window.gl.bindBuffer(this.type,this.id),window.gl.bufferSubData(this.type,0,new Float32Array(t),0)}apply(){window.gl.bindBuffer(this.type,this.id)}free(){window.gl.deleteBuffer(this.id),this.id=null,this.size=0}}class r extends e{constructor(t){super(window.gl.ARRAY_BUFFER,44*t.length),this.numOfVertices=t.length,window.gl.bufferData(window.gl.ARRAY_BUFFER,new Float32Array(t),window.gl.STATIC_DRAW)}update(t){window.gl.bindBuffer(window.gl.ARRAY_BUFFER,this.id),window.gl.bufferSubData(window.gl.ARRAY_BUFFER,0,new Float32Array(t),0)}free(){super.free(),this.numOfVertices=0}}class c extends e{constructor(t){super(window.gl.ELEMENT_ARRAY_BUFFER,2*t.length),this.numOfIndices=t.length,window.gl.bufferData(window.gl.ELEMENT_ARRAY_BUFFER,new Uint32Array(t),window.gl.STATIC_DRAW)}update(t){window.gl.bindBuffer(window.gl.ELEMENT_ARRAY_BUFFER,this.id),window.gl.bufferSubData(window.gl.ELEMENT_ARRAY_BUFFER,0,new Uint32Array(t),0)}free(){super.free(),this.numOfIndices=0}}class g extends e{constructor(t,i,s){super(window.gl.UNIFORM_BUFFER,i),window.gl.bufferData(window.gl.UNIFORM_BUFFER,i,window.gl.STATIC_DRAW),this.name=t,this.bind=s}update(t){window.gl.bindBuffer(window.gl.UNIFORM_BUFFER,this.id),window.gl.bufferSubData(window.gl.UNIFORM_BUFFER,0,new Float32Array(t),0)}apply(t){var i=window.gl.getUniformBlockIndex(t,this.name);-1!==i&&(window.gl.uniformBlockBinding(t,i,this.bind),window.gl.bindBufferBase(window.gl.UNIFORM_BUFFER,this.bind,this.id))}free(){super.free()}}function f(t){return[t.loc.x,t.loc.y,t.loc.z,0,t.up.x,t.up.y,t.up.z,0,t.right.x,t.right.y,t.right.z,0,t.at.x,t.at.y,t.at.z,0]}class p{constructor(){this.setDefault();var t=f(this);this.ubo=new g("CamUBO",4*t.length,2),this.ubo.update(t)}setDefault=()=>{this.loc=E(1),this.at=E(0),this.dir=E(0,0,-1),this.up=E(0,1,0),this.right=E(1,0,0),this.projDist=.1,this.projSize=.1,this.projFarClip=300,this.frameW=this.frameH=30,this.camSet(this.loc,this.at,this.up),this.setProj(this.projSize,this.projDist,this.projFarClip)};camSet=(t,i,s)=>{var a,e,r;this.matrView=(a=t,s=s,e=(e=i).sub(a).norm(),r=(s=e.cross(s).norm()).cross(e),m([[s.x,r.x,-e.x,0],[s.y,r.y,-e.y,0],[s.z,r.z,-e.z,0],[-a.dot(s),-a.dot(r),a.dot(e),1]])),this.loc=t,this.at=i,this.dir=E(-this.matrView.a[0][2],-this.matrView.a[1][2],-this.matrView.a[2][2]),this.up=E(this.matrView.a[0][1],this.matrView.a[1][1],this.matrView.a[2][1]),this.right=E(this.matrView.a[0][0],this.matrView.a[1][0],this.matrView.a[2][0]),void 0!==this.ubo&&this.ubo.update(f(this)),void 0!==this.matrProj&&(this.matrVP=this.matrView.mulMatr(this.matrProj))};setProj=(t,i,s)=>{let a,e;var r,h,n;a=e=t,this.projDist=i,this.projSize=t,this.projFarClip=s,this.frameW>this.frameH?a*=this.frameW/this.frameH:e*=this.frameH/this.frameW,this.matrProj=(i=-a/2,t=a/2,s=-e/2,r=e/2,h=this.projDist,n=this.projFarClip,m([[2*h/(t-i),0,0,0],[0,2*h/(r-s),0,0],[(t+i)/(t-i),(r+s)/(r-s),(n+h)/(h-n),-1],[0,0,2*h*n/(h-n),0]])),this.matrVP=this.matrView.mulMatr(this.matrProj),void 0!==this.ubo&&this.ubo.update(f(this))};setSize=(t,i)=>{this.frameW=t,this.frameH=i,this.setProj(this.projSize,this.projDist,this.projFarClip)}}class D{constructor(t,i){this.x=t,this.y=void 0===i?t:i}}function T(...t){return new D(...t)}class N{constructor(t,i,s,a){this.x=t,this.y=i,this.z=s,this.w=a}}function x(...t){return new N(...t)}class M{constructor(t,i){this.progId=i,this.name=t}}function L(h){return this.load=s=>{const a=[["vert",h.VERTEX_SHADER],["frag",h.FRAGMENT_SHADER]];var t=[];for(let i=0;i<a.length;i++){const r="../bin/shaders/"+s+"/"+a[i][0]+".glsl";t[i]=fetch(r).then(t=>t.text()).then(t=>{a[i][2]=h.createShader(a[i][1]),h.shaderSource(a[i][2],t),h.compileShader(a[i][2]),h.getShaderParameter(a[i][2],h.COMPILE_STATUS)||(t=h.getShaderInfoLog(a[i][2]),console.log(r+":\n"+t))})}const e=this.shaderSize;this.shaders[e]=new M(s,void 0),Promise.all(t).then(()=>{var t,i=h.createProgram();for(let t=0;t<a.length;t++)h.attachShader(i,a[t][2]);h.linkProgram(i),h.getProgramParameter(i,h.LINK_STATUS)||(t=h.getProgramInfoLog(i),console.log(t)),this.shaders[e]=new M(s,i)})},this.add=i=>{for(let t=0;t<this.shaderSize;t++)if(this.shaders[t].name===i)return t;return this.load(i),this.shaderSize++},this.shdGet=t=>t<0||t>=this.shaderSize?this.shaders[0]:this.shaders[t],this.shaderSize=0,this.shaders=[],this.add("default"),this}class B{constructor(t,i,s,a,e,r,h){this.name=t,this.ka=i,this.kd=s,this.ks=a,this.ph=e,this.trans=r,this.shdNo=h;t=[this.ka.x,this.ka.y,this.ka.z,this.ph,this.kd.x,this.kd.y,this.kd.z,this.trans,this.ks.x,this.ks.y,this.ks.z,0];this.uboBuf=new g("MtlUBO",4*t.length,1),this.uboBuf.update(t),this.tex=[-1,-1,-1,-1,-1,-1,-1,-1]}free(){this.uboBuf.free()}}function C(t){return this.getDef=()=>new B("Default",E(.1),E(.9),E(.3),30,1,0),this.add=i=>{for(let t=0;t<this.mtlSize;t++)if(i.name===this.mtls[t])return t;return this.mtls[this.mtlSize]=i,this.mtlSize++},this.get=t=>t<0||t>=this.mtlSize?this.mtls[0]:this.mtls[t],this.apply=t=>{var i=this.get(t),s=I.shd.shdGet(i.shdNo).progId;if(void 0===s)return 0;window.gl.useProgram(s),i.uboBuf.apply(s);let a;for(let t=0;t<i.tex.length;t++)-1!==i.tex[t]?(window.gl.activeTexture(window.gl.TEXTURE0+t),window.gl.bindTexture(window.gl.TEXTURE_2D,I.tex.textures[i.tex[t]].id),-1!==(a=window.gl.getUniformLocation(s,"Texture"+t))&&window.gl.uniform1i(a,t),-1!==(a=window.gl.getUniformLocation(s,"IsTexture"+t))&&window.gl.uniform1i(a,1)):-1!==(a=window.gl.getUniformLocation(s,"IsTexture"+t))&&window.gl.uniform1i(a,0);return s},this.free=()=>{for(let t=0;t<this.mtlSize;t++)this.mtls[t].free()},this.mtlSize=0,this.mtls=[],this.add(this.getDef()),this}class y{constructor(t,i){this.name=t,this.id=i}}function O(){return this.textures=[],this.texSize=0,this.add=t=>{const i=this.texSize++,s=window.gl,a=(this.textures[i]=new y(t,s.createTexture()),new Image);return a.src="../bin/textures/"+t,a.onload=()=>{s.bindTexture(s.TEXTURE_2D,this.textures[i].id),s.texImage2D(s.TEXTURE_2D,0,s.RGBA,s.RGBA,s.UNSIGNED_BYTE,a),s.generateMipmap(s.TEXTURE_2D),s.texParameteri(s.TEXTURE_2D,s.TEXTURE_WRAP_S,s.REPEAT),s.texParameteri(s.TEXTURE_2D,s.TEXTURE_WRAP_T,s.REPEAT),s.texParameteri(s.TEXTURE_2D,s.TEXTURE_MIN_FILTER,s.LINEAR_MIPMAP_LINEAR),s.texParameteri(s.TEXTURE_2D,s.TEXTURE_MAG_FILTER,s.LINEAR)},i},this.addImg=(t,i,s,a)=>{var e=this.texSize++,r=window.gl;return this.textures[e]=new y(t,r.createTexture()),this.textures[e].id=r.createTexture(),r.bindTexture(r.TEXTURE_2D,this.textures[e].id),r.texImage2D(r.TEXTURE_2D,0,r.RGBA,s,a,0,r.RGBA,r.UNSIGNED_BYTE,new Uint8Array(i)),r.generateMipmap(r.TEXTURE_2D),r.texParameteri(r.TEXTURE_2D,r.TEXTURE_WRAP_S,r.REPEAT),r.texParameteri(r.TEXTURE_2D,r.TEXTURE_WRAP_T,r.REPEAT),r.texParameteri(r.TEXTURE_2D,r.TEXTURE_MIN_FILTER,r.LINEAR_MIPMAP_LINEAR),r.texParameteri(r.TEXTURE_2D,r.TEXTURE_MAG_FILTER,r.LINEAR),e},this}let v=[0,0];function _(i,s){for(let t=0;t<i.length;t++)i[t].n=E(0);if(null!==s)for(let t=0;t+2<s.length;t+=3){var a=i[s[t+1]].p.sub(i[s[t]].p).cross(i[s[t+2]].p.sub(i[s[t]].p)).norm();i[s[t]].n=i[s[t]].n.add(a).norm(),i[s[t+1]].n=i[s[t+1]].n.add(a).norm(),i[s[t+2]].n=i[s[t+2]].n.add(a).norm()}else for(let t=0;t+2<i.length;t+=3){var e=i[t+1].p.sub(i[t].p).cross(i[t+2].p.sub(i[t].p)).norm();i[t].n=i[t].n.add(e).norm(),i[t+1].n=i[t+1].n.add(e).norm(),i[t+2].n=i[t+2].n.add(e).norm()}}class j{constructor(t,i,s,a){void 0===t?(this.p=E(0),this.t=T(0),this.n=E(0),this.c=x(0)):"object"==typeof t&&void 0===i?(this.p=t.p,this.t=t.t,this.n=t.n,this.c=t.c):(this.p=t,this.t=i,this.n=s,this.c=a)}}function A(...t){return new j(...t)}function R(i,s){for(let t=0;t<16;t++)i.push(s.a[(t-t%4)/4][t%4])}class z{constructor(t,i,s){var a,e;this.vBuf=this.vA=this.iBuf=0,null!==i&&(a=window.gl.createVertexArray(),window.gl.bindVertexArray(a),e=function(i){if("object"!=typeof i[0])return i;var s=[];for(let t=0;t<i.length;t++)s.push(i[t].p.x),s.push(i[t].p.y),s.push(i[t].p.z),s.push(i[t].t.x),s.push(i[t].t.y),s.push(i[t].n.x),s.push(i[t].n.y),s.push(i[t].n.z),s.push(i[t].c.x),s.push(i[t].c.y),s.push(i[t].c.z),s.push(i[t].c.w);return s}(i),this.vBuf=new r(e),this.vA=a),null!==s?(e=window.gl.createBuffer(),window.gl.bindBuffer(window.gl.ELEMENT_ARRAY_BUFFER,e),window.gl.bufferData(window.gl.ELEMENT_ARRAY_BUFFER,2*s.length,window.gl.STATIC_DRAW),window.gl.bufferData(window.gl.ELEMENT_ARRAY_BUFFER,new Uint32Array(s),window.gl.STATIC_DRAW),this.iBuf=new c(s),this.numOfElements=s.length):this.numOfElements=i.length,this.trans=h(),this.type=t,this.mtlNo=0,[this.minBB,this.maxBB]=function(i){let s,a;if("object"==typeof i[0]){s=E(i[0].p),a=E(i[0].p);for(let t=1;t<i.length;t++)i[t].p.x<s.x?s.x=i[t].p.x:i[t].p.x>a.x&&(a.x=i[t].p.x),i[t].p.y<s.y?s.y=i[t].p.y:i[t].p.y>a.y&&(a.y=i[t].p.y),i[t].p.z<s.z?s.z=i[t].p.z:i[t].p.z>a.z&&(a.z=i[t].p.z)}else{s=E(i[0],i[1],i[2]),a=E(i[0],i[1],i[2]);for(let t=3;t+2<i.length;t+=12)i[t]<s.x?s.x=i[t]:i[t]>a.x&&(a.x=i[t]),i[t+1]<s.y?s.y=i[t+1]:i[t+1]>a.y&&(a.y=i[t+1]),i[t+2]<s.z?s.z=i[t+2]:i[t+2]>a.z&&(a.z=i[t+2])}return[s,a]}(i)}free=()=>{this.vBuf.free(),this.iBuf.free()};draw=t=>{var i,t=this.trans.mulMatr(t),s=t.inverse().transpose(),a=t.mulMatr(l.ds_cam.matrVP),e=I.mtl.apply(this.mtlNo);0!==e&&(R(i=[],t),R(i,s),R(i,a),I.matrixUBO.update(i),I.matrixUBO.apply(e),l.ds_cam.ubo.apply(e),-1!==(t=window.gl.getUniformLocation(e,"Time"))&&window.gl.uniform1f(t,P.localTime),-1!==(t=window.gl.getUniformLocation(e,"AddonI0"))&&window.gl.uniform1i(t,v[0]),-1!==(t=window.gl.getUniformLocation(e,"AddonI1"))&&window.gl.uniform1i(t,v[1]),window.gl.bindVertexArray(this.vA),this.vBuf.apply(),0===this.iBuf?window.gl.drawArrays(this.type,0,this.numOfElements):(this.iBuf.apply(),window.gl.drawElements(this.type,this.numOfElements,window.gl.UNSIGNED_INT,0)),-1!==(t=window.gl.getAttribLocation(e,"InPos"))&&(window.gl.vertexAttribPointer(t,3,window.gl.FLOAT,!1,48,0),window.gl.enableVertexAttribArray(t)),-1!==(t=window.gl.getAttribLocation(e,"InTexCoord"))&&(window.gl.vertexAttribPointer(t,2,window.gl.FLOAT,!1,48,12),window.gl.enableVertexAttribArray(t)),-1!==(t=window.gl.getAttribLocation(e,"InNormal"))&&(window.gl.vertexAttribPointer(t,3,window.gl.FLOAT,!1,48,20),window.gl.enableVertexAttribArray(t)),-1!==(t=window.gl.getAttribLocation(e,"InColor")))&&(window.gl.vertexAttribPointer(t,4,window.gl.FLOAT,!1,48,32),window.gl.enableVertexAttribArray(t))}}function b(i,s){var a=[];if(null!==s)for(let t=0;t<s.length;t++)a[t]=A(i[s[t]],T(0),E(0),x(0));else for(let t=0;t<i.length;t++)a[t]=A(i[t],T(0),E(0),x(0));return a}let S=!1,F=!1;function k(t,i){t.preventDefault(),0===t.button?S=i:2===t.button&&(F=i)}function X(){S=F=!1}function V(t){switch(t.keyCode){case 80:P.isPause=!P.isPause,document.getElementById("pause").checked=P.isPause;break;case 82:l.ds_cam.camSet(E(5),E(2.5,0,0),E(0,1,0))}}function G(a){if(a.ctrlKey&&void 0!==l.ds_cam){let s=l.ds_cam.at.sub(l.ds_cam.loc).len();var e=(l.ds_cam.loc.y-l.ds_cam.at.y)/s,r=Math.sqrt(1-e*e),h=s*r,n=(l.ds_cam.loc.z-l.ds_cam.at.z)/h,h=(l.ds_cam.loc.x-l.ds_cam.at.x)/h;let t=d(Math.atan2(h,n)),i=d(Math.atan2(r,e));if(S&&(t-=P.globalDeltaTime*a.movementX*10,i-=P.globalDeltaTime*a.movementY*10),s+=P.globalDeltaTime*(void 0===a.deltaY?0:a.deltaY)/20*s,i<.1?i=.1:178.9<i&&(i=178.9),s<.1&&(s=.1),F){let t,i;i=t=l.ds_cam.projSize,window.gl.canvas.width>window.gl.canvas.height?t*=window.gl.canvas.width/window.gl.canvas.height:t*=window.gl.canvas.height/window.gl.canvas.width;h=-(a.movementX*t/window.gl.canvas.width*s)/l.ds_cam.projDist,n=a.movementY*i/window.gl.canvas.height*s/l.ds_cam.projDist,r=l.ds_cam.right.mulNum(h).add(l.ds_cam.up.mulNum(n));l.ds_cam.at=l.ds_cam.at.add(r),l.ds_cam.loc=l.ds_cam.loc.add(r)}l.ds_cam.camSet(E(0,s,0).pointTransform(u(i).mulMatr((e=o(e=t),m([[Math.cos(e),0,-Math.sin(e),0],[0,1,0,0],[Math.sin(e),0,Math.cos(e),0],[0,0,0,1]]))).mulMatr(w(l.ds_cam.at))),l.ds_cam.at,E(0,1,0)),a.preventDefault()}}function U(){var t=document.getElementById("windowW"),i=document.getElementById("windowWText"),i=(window.gl.canvas.width=parseInt(t.value),i.innerHTML="FrameW:"+t.value,document.getElementById("windowH")),t=document.getElementById("windowHText");window.gl.canvas.height=parseInt(i.value),t.innerHTML="FrameH:"+i.value,l.ds_cam.setSize(window.gl.canvas.width,window.gl.canvas.height),window.gl.viewport(0,0,window.gl.canvas.width,window.gl.canvas.height)}function W(t){P.isPause=t.checked}class H{constructor(t){this.numOfPrims=t,this.trans=h(),this.minBB=this.maxBB=E(0),this.prims=[]}draw=t=>{var i=this.trans.mulMatr(t);v[0]=this.numOfPrims;for(let t=0;t<this.numOfPrims;t++)1===I.mtl.get(this.prims[t].mtlNo).trans&&(v[1]=t,this.prims[t].draw(i));window.gl.enable(window.gl.CULL_FACE),window.gl.cullFace(window.gl.FRONT);for(let t=0;t<this.numOfPrims;t++)1!==I.mtl.get(this.prims[t].mtlNo).trans&&(v[1]=t,this.prims[t].draw(i));window.gl.cullFace(window.gl.BACK);for(let t=0;t<this.numOfPrims;t++)1!==I.mtl.get(this.prims[t].mtlNo).trans&&(v[1]=t,this.prims[t].draw(i));window.gl.disable(window.gl.CULL_FACE)}}class q{constructor(){this.init=this.close=this.response=this.render=()=>{}}}function Y(){return this.units=[],this.addUnit=t=>{this.units.push(t),t.init()},this.render=()=>{U(),P.response();for(let t=0;t<this.units.length;t++)this.units[t].response();I.start();for(let t=0;t<this.units.length;t++)this.units[t].render()},this}class K extends q{constructor(t){var i,s;super(),this.prim=(t=t,i=Math.sqrt(2),s=Math.sqrt(6),_(s=b([E(0,1,0),E(-i/3,-1/3,-s/3),E(-i/3,-1/3,s/3),E(2*i/3,-1/3,0)],[0,1,2,0,2,3,0,3,1,1,2,3]),null),(i=new z(window.gl.TRIANGLES,s,null)).trans=t,i),this.prim.mtlNo=I.mtl.add(new B("Gold",E(.24725,.1995,.0745),E(.75164,.60648,.22648),E(.628281,.555802,.366065),51.2,1,0))}render=()=>{this.prim.draw(t(100*P.localTime).mulMatr(u(100*P.localTime))),this.prim.draw(w(E(0,2,0)))}}class J extends q{constructor(t){var i;super(),this.prim=(t=t,_(i=b([E(-(i=1/Math.sqrt(3)),i,-i),E(i,i,-i),E(i,-i,-i),E(-i,-i,-i),E(-i,i,i),E(i,i,i),E(i,-i,i),E(-i,-i,i)],[0,1,2,0,2,3,2,1,5,2,5,6,3,2,6,3,6,7,0,3,7,0,7,4,1,0,4,1,4,5,6,5,4,6,4,7]),null),(i=new z(window.gl.TRIANGLES,i,null)).trans=t,i),this.prim.mtlNo=I.mtl.add(new B("Silver",E(.19225),E(.50754),E(.508273),51.2,1,0))}render=()=>{this.prim.draw(t(100*P.localTime).mulMatr(u(100*P.localTime)).mulMatr(w(E(2,0,0)))),this.prim.draw(w(E(2,2,0)))}}class Q extends q{constructor(t){var i;super(),this.prim=(t=t,_(i=b([E(-1,0,0),E(0,0,1),E(1,0,0),E(0,0,-1),E(0,1,0),E(0,-1,0)],[0,1,4,1,2,4,2,3,4,3,0,4,0,1,5,1,2,5,2,3,5,3,0,5]),null),(i=new z(window.gl.TRIANGLES,i,null)).trans=t,i),this.prim.mtlNo=I.mtl.add(new B("Obsidian",E(.05375,.05,.06625),E(.18275,.17,.22525),E(.332741,.328634,.346435),38.4,1,0))}render=()=>{this.prim.draw(t(100*P.localTime).mulMatr(u(100*P.localTime)).mulMatr(w(E(4,0,0)))),this.prim.draw(w(E(4,2,0)))}}class Z extends q{constructor(t){super(),this.prim=function(t){var i=[E(0,-1,0),E(0,1,0),E(-2/Math.sqrt(5),-1/Math.sqrt(5),0),E(2/Math.sqrt(5),1/Math.sqrt(5),0),E(.5+.5/Math.sqrt(5),-1/Math.sqrt(5),-Math.sqrt(.1*(5-Math.sqrt(5)))),E(.5+.5/Math.sqrt(5),-1/Math.sqrt(5),Math.sqrt(.1*(5-Math.sqrt(5)))),E(-.1*(5+Math.sqrt(5)),1/Math.sqrt(5),-Math.sqrt(.1*(5-Math.sqrt(5)))),E(-.1*(5+Math.sqrt(5)),1/Math.sqrt(5),Math.sqrt(.1*(5-Math.sqrt(5)))),E(.1*Math.sqrt(5)-.5,-1/Math.sqrt(5),-Math.sqrt(.1*(5+Math.sqrt(5)))),E(.1*Math.sqrt(5)-.5,-1/Math.sqrt(5),Math.sqrt(.1*(5+Math.sqrt(5)))),E(.5-.1*Math.sqrt(5),1/Math.sqrt(5),-Math.sqrt(.1*(5+Math.sqrt(5)))),E(.5-.1*Math.sqrt(5),1/Math.sqrt(5),Math.sqrt(.1*(5+Math.sqrt(5))))];let s=[0,8,2,0,2,9,0,9,5,0,5,4,0,4,8,1,3,10,1,10,6,1,6,7,1,7,11,1,11,3,3,4,5,10,4,8,6,8,2,7,2,9,11,9,5,4,10,3,8,10,6,2,6,7,9,7,11,5,11,3];var a=[];for(let t=0;t+2<s.length;t+=3){var e=E(i[s[t]].x+i[s[t+1]].x+i[s[t+2]].x,i[s[t]].y+i[s[t+1]].y+i[s[t+2]].y,i[s[t]].z+i[s[t+1]].z+i[s[t+2]].z).divNum(3);a.push(e)}var r=n(E(1/a[0].len()));for(let t=0;t<a.length;t++)a[t]=a[t].pointTransform(r);var h=b(a,s=[0,1,2,0,2,3,0,3,4,1,2,13,2,13,14,13,14,18,0,1,12,1,12,13,12,13,17,4,0,11,0,11,12,11,12,16,3,4,10,4,10,11,10,11,15,2,3,14,3,14,10,14,10,19,19,14,18,18,19,9,8,18,9,18,13,17,17,18,8,7,17,8,17,12,16,16,17,7,6,16,7,16,11,15,15,16,6,5,15,6,15,10,19,19,15,5,9,19,5,5,6,7,5,7,8,5,8,9]);return _(h,null),(h=new z(window.gl.TRIANGLES,h,null)).trans=t,h}(t),this.prim.mtlNo=I.mtl.add(new B("Bronze",E(.2125,.1275,.054),E(.714,.4284,.18144),E(.393548,.271906,.166721),25.6,1,0))}render=()=>{this.prim.draw(t(100*P.localTime).mulMatr(u(100*P.localTime)).mulMatr(w(E(6,0,0)))),this.prim.draw(w(E(6,2,0)))}}class $ extends q{constructor(t){var i;super(),this.prim=(t=t,_(i=b([E(0,-1,0),E(0,1,0),E(-2/Math.sqrt(5),-1/Math.sqrt(5),0),E(2/Math.sqrt(5),1/Math.sqrt(5),0),E(.5+.5/Math.sqrt(5),-1/Math.sqrt(5),-Math.sqrt(.1*(5-Math.sqrt(5)))),E(.5+.5/Math.sqrt(5),-1/Math.sqrt(5),Math.sqrt(.1*(5-Math.sqrt(5)))),E(-.1*(5+Math.sqrt(5)),1/Math.sqrt(5),-Math.sqrt(.1*(5-Math.sqrt(5)))),E(-.1*(5+Math.sqrt(5)),1/Math.sqrt(5),Math.sqrt(.1*(5-Math.sqrt(5)))),E(.1*Math.sqrt(5)-.5,-1/Math.sqrt(5),-Math.sqrt(.1*(5+Math.sqrt(5)))),E(.1*Math.sqrt(5)-.5,-1/Math.sqrt(5),Math.sqrt(.1*(5+Math.sqrt(5)))),E(.5-.1*Math.sqrt(5),1/Math.sqrt(5),-Math.sqrt(.1*(5+Math.sqrt(5)))),E(.5-.1*Math.sqrt(5),1/Math.sqrt(5),Math.sqrt(.1*(5+Math.sqrt(5))))],[0,8,2,0,2,9,0,9,5,0,5,4,0,4,8,1,3,10,1,10,6,1,6,7,1,7,11,1,11,3,3,4,5,10,4,8,6,8,2,7,2,9,11,9,5,4,10,3,8,10,6,2,6,7,9,7,11,5,11,3]),null),(i=new z(window.gl.TRIANGLES,i,null)).trans=t,i),this.prim.mtlNo=I.mtl.add(new B("Emerald",E(.0215,.1745,.0215),E(.07568,.61424,.07568),E(.633,.727811,.633),76.8,1,0))}render=()=>{this.prim.draw(t(100*P.localTime).mulMatr(u(100*P.localTime)).mulMatr(w(E(8,0,0)))),this.prim.draw(w(E(8,2,0)))}}class tt extends q{constructor(s){super();var t=I.primLoad("../bin/models/cow.obj");this.prim=null,t.then(t=>{this.prim=t,this.prim.mtlNo=I.mtl.add(new B("Cow material",I.mtl.mtls[0].ka,I.mtl.mtls[0].kd,I.mtl.mtls[0].ks,I.mtl.mtls[0].ph,1,I.shd.add("cow")));var t=this.prim.maxBB.sub(this.prim.minBB),i=(i=t.x>t.y?t.x:t.y)>t.z?i:t.z;this.prim.trans=n(E(1/i,1/i,1/i).mulNum(1.5)).mulMatr(s)})}render=()=>{null!==this.prim&&this.prim.draw(h())}}class it extends q{constructor(s){super(),this.tank=null,async function(t){var i=await(await fetch(t)).arrayBuffer(),s=new Uint8Array(i);let a=0;if("G3DM"!==s.slice(a,a+=4).reduce((t,i)=>t+String.fromCharCode(i),""))return null;var[e,r,h]=new Uint32Array(i.slice(a,a+=12)),n=new H(e);for(let t=0;t<e;t++){var[l,o,d]=new Uint32Array(i.slice(a,a+=12)),l=new Float32Array(i.slice(a,a+=48*l)),o=new Uint32Array(i.slice(a,a+=4*o));n.prims.push(new z(window.gl.TRIANGLES,l,o)),n.prims[t].mtlNo=I.mtl.mtlSize+d,0===t?(n.minBB=n.prims[0].minBB,n.maxBB=n.prims[0].maxBB):(n.minBB.x>n.prims[t].minBB.x&&(n.minBB.x=n.prims[t].minBB.x),n.maxBB.x<n.prims[t].maxBB.x&&(n.maxBB.x=n.prims[t].maxBB.x),n.minBB.y>n.prims[t].minBB.y&&(n.minBB.y=n.prims[t].minBB.y),n.maxBB.y<n.prims[t].maxBB.y&&(n.maxBB.y=n.prims[t].maxBB.y),n.minBB.z>n.prims[t].minBB.z&&(n.minBB.z=n.prims[t].minBB.z),n.maxBB.z<n.prims[t].maxBB.z&&(n.maxBB.z=n.prims[t].maxBB.z))}for(let t=0;t<r;t++){var m=s.slice(a,a+=300).reduce((t,i)=>t+(0==i?"":String.fromCharCode(i)),""),w=new Float32Array(i.slice(a,a+=44)),u=new Int32Array(i.slice(a,a+=32)),m=new B(m,E(w[0],w[1],w[2]),E(w[3],w[4],w[5]),E(w[6],w[7],w[8]),w[9],w[10],0);m.tex=u,I.mtl.add(m),a+=304}for(let t=0;t<h;t++){var c=s.slice(a,a+=300).reduce((t,i)=>t+(0==i?"":String.fromCharCode(i)),""),[g,f,p]=new Uint32Array(i.slice(a,a+=12)),T=s.slice(a,a+=g*f*p);for(let t=0;t<T.length;t+=4){var x=T[t];T[t]=T[t+2],T[t+2]=x}I.tex.addImg(c,T,g,f)}return n}("../bin/models/Sherman.g3dm").then(t=>{this.tank=t,this.tank.trans=s;var i=I.shd.add("tank");for(let t=0;t<this.tank.numOfPrims;t++)I.mtl.get(this.tank.prims[t].mtlNo).shdNo=i})}render=()=>{null!==this.tank&&this.tank.draw(h())}}l.ds_cam=void 0;let I=new function(){return this.can=document.getElementById("dsCan"),this.gl=this.can.getContext("webgl2"),Object.defineProperty(window,"gl",{get:()=>(null!=this._gl&&null!=this._gl||(this.canvas=document.getElementById("dsCan"),this._gl=this.canvas.getContext("webgl2")),this._gl),set:t=>{this._gl=t}}),this.shd=new L(this.gl),this.mtl=new C(this.gl),this.tex=new O,this.matrixUBO=new g("MatrixUBO",192,0),this.gl.clearColor(.28,.47,.8,1),this.gl.enable(this.gl.DEPTH_TEST),this.start=()=>{this.gl.clear(this.gl.COLOR_BUFFER_BIT),this.gl.clear(this.gl.DEPTH_BUFFER_BIT),this.gl.enable(this.gl.DEPTH_TEST)},this.close=()=>{this.mtl.free()},this.primLoad=i=>new Promise((h,t)=>{let n=[],l=[],o,d;fetch(i).then(t=>t.text()).then(t=>{var i=t.split("\n");for(let t=0;t<i.length;t++)"v"===i[t].split(" ")[0]&&o++;for(let t=0;t<i.length;t++){var e=i[t].split(" ");if("v"===e[0]){var s=parseFloat(e[1]),a=parseFloat(e[2]),r=parseFloat(e[3]);n.push(A(E(s,a,r),T(0),E(0),E(0)))}else if("f"==e[0]){let i=0,s=0,a=0;for(let t=1;t<e.length;t++)(d=parseInt(e[t]))<0?d+=o:d--,0===i?s=d:a=(1===i||(l.push(s),l.push(a),l.push(d)),d),i++}}_(n,l),h(new z(gl.TRIANGLES,n,l))})}),this},P=new function(){const s=()=>{var t=new Date;return t.getMilliseconds()/1e3+t.getSeconds()+60*t.getMinutes()};return this.response=(t=null)=>{var i=s();this.globalTime=i,this.globalDeltaTime=i-this.oldTime,this.isPause?(this.localDeltaTime=0,this.pauseTime+=i-this.oldTime):(this.localDeltaTime=this.globalDeltaTime,this.localTime=i-this.pauseTime-this.startTime),this.frameCounter++,3<i-this.oldTimeFPS&&(this.FPS=this.frameCounter/(i-this.oldTimeFPS),this.oldTimeFPS=i,this.frameCounter=0,null!=t)&&(document.getElementById(t).innerHTML=this.getFPS()),this.oldTime=i,document.getElementById("fps").innerHTML="FPS:"+this.getFPS()},this.getFPS=()=>this.FPS.toFixed(3),this.globalTime=this.localTime=s(),this.globalDeltaTime=this.localDeltaTime=0,this.startTime=this.oldTime=this.oldTimeFPS=this.globalTime,this.frameCounter=0,this.isPause=!1,this.FPS=30,this.pauseTime=0,this};window.addEventListener("load",()=>{var t,i,s,a=sessionStorage.getItem("camera");a?(a=JSON.parse(a),l.ds_cam=new p,t=E(a.loc),i=E(a.at),s=a.up,l.ds_cam.camSet(t,i,s),l.ds_cam.setProj(a.projSize,a.projDist,a.projFarClip),l.ds_cam.setSize(a.frameW,a.frameH)):(l.ds_cam=new p,l.ds_cam.setSize(window.gl.canvas.width,window.gl.canvas.height),l.ds_cam.camSet(E(5),E(2.5,0,0),E(0,1,0))),window.addEventListener("keydown",V),mouseOutCan=X,mouseChangeCan=k,setPauseCheckbox=W,camCtrlCan=G;let e=new Y;e.addUnit(new K(h())),e.addUnit(new J(h())),e.addUnit(new Q(h())),e.addUnit(new Z(h())),e.addUnit(new $(h())),e.addUnit(new tt(w(E(-2,0,0)))),e.addUnit(new it(w(E(-4,0,0))));const r=()=>{U(),e.render(),sessionStorage.setItem("camera",JSON.stringify(l.ds_cam)),window.requestAnimationFrame(r)};r()}),l.dsRnd=I,l.myTimer=P}({});