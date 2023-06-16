export class dsTexture {
  constructor(name, texId) {
    this.name = name;
    this.id = texId;
  }
}

export function dsRndTexture() {
  this.textures = [];
  this.texSize = 0;

  this.add = (fileName) => {
    const n = this.texSize++;
    const gl = window.gl;

    this.textures[n] = new dsTexture(fileName, gl.createTexture());

    const img = new Image();
    img.src = "../bin/textures/" + fileName;
    img.onload = () => {
      gl.bindTexture(gl.TEXTURE_2D, this.textures[n].id);
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, img);
      gl.generateMipmap(gl.TEXTURE_2D);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.REPEAT);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.REPEAT);
      gl.texParameteri(
        gl.TEXTURE_2D,
        gl.TEXTURE_MIN_FILTER,
        gl.LINEAR_MIPMAP_LINEAR
      );
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    };

    return n;
  };

  this.addImg = (name, bits, w, h) => {
    const n = this.texSize++;
    const gl = window.gl;

    this.textures[n] = new dsTexture(name, gl.createTexture());

    this.textures[n].id = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, this.textures[n].id);
    gl.texImage2D(
      gl.TEXTURE_2D,
      0,
      gl.RGBA,
      w,
      h,
      0,
      gl.RGBA,
      gl.UNSIGNED_BYTE,
      new Uint8Array(bits)
    );
    gl.generateMipmap(gl.TEXTURE_2D);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.REPEAT);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.REPEAT);
    gl.texParameteri(
      gl.TEXTURE_2D,
      gl.TEXTURE_MIN_FILTER,
      gl.LINEAR_MIPMAP_LINEAR
    );
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);

    return n;
  };

  return this;
}
