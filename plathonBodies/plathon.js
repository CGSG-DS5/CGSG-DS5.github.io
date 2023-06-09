function makeV(v, ind) {
  let res = [];
  if (ind !== null)
    for (i = 0; i < ind.length; i++) {
      res[i] = dsVert(v[ind[i]], vec2(0), vec3(0), vec3(0));
    }
  else
    for (i = 0; i < v.length; i++) {
      res[i] = dsVert(v[i], vec2(0), vec3(0), vec3(0));
    }
  return res;
}

function makeVecs(v, ind) {
  let res = [];
  for (i = 0; i < ind.length; i++) {
    res[i] = vec3(v[ind[i]].x, v[ind[i]].y, v[ind[i]].z);
  }
  return res;
}

function createTetrahedron(matr) {
  let sq2 = Math.sqrt(2),
    sq6 = Math.sqrt(6);
  let vecs = [
    vec3(0, 1, 0),
    vec3(-sq2 / 3, -1 / 3, -sq6 / 3),
    vec3(-sq2 / 3, -1 / 3, sq6 / 3),
    vec3((2 * sq2) / 3, -1 / 3, 0),
  ];

  let i = [0, 1, 2, 0, 2, 3, 0, 3, 1, 1, 2, 3];

  let v = makeV(vecs, i);

  countNormals(v, null);

  let pr = new dsPrim(window.gl.TRIANGLES, v, null);
  pr.trans = matr;
  return pr;
}

function createHexahedron(matr) {
  let l = 1 / Math.sqrt(3);
  let vecs = [
    vec3(-l, l, -l),
    vec3(l, l, -l),
    vec3(l, -l, -l),
    vec3(-l, -l, -l),
    vec3(-l, l, l),
    vec3(l, l, l),
    vec3(l, -l, l),
    vec3(-l, -l, l),
  ];

  let i = [
    0, 1, 2, 0, 2, 3, 2, 1, 5, 2, 5, 6, 3, 2, 6, 3, 6, 7, 0, 3, 7, 0, 7, 4, 1,
    0, 4, 1, 4, 5, 6, 5, 4, 6, 4, 7,
  ];

  let v = makeV(vecs, i);

  countNormals(v, null);

  let pr = new dsPrim(window.gl.TRIANGLES, v, null);
  pr.trans = matr;
  return pr;
}

function createOctahedron(matr) {
  let vecs = [
    vec3(-1, 0, 0),
    vec3(0, 0, 1),
    vec3(1, 0, 0),
    vec3(0, 0, -1),
    vec3(0, 1, 0),
    vec3(0, -1, 0),
  ];

  let i = [
    0, 1, 4, 1, 2, 4, 2, 3, 4, 3, 0, 4, 0, 1, 5, 1, 2, 5, 2, 3, 5, 3, 0, 5,
  ];

  let v = makeV(vecs, i);

  countNormals(v, null);

  let pr = new dsPrim(window.gl.TRIANGLES, v, null);
  pr.trans = matr;
  return pr;
}

function createDodecahedron(matr) {
  let vecs = [
    vec3(0, -1, 0),
    vec3(0, 1, 0),
    vec3(-2 / Math.sqrt(5), -1 / Math.sqrt(5), 0),
    vec3(2 / Math.sqrt(5), 1 / Math.sqrt(5), 0),
    vec3(
      0.5 + 0.5 / Math.sqrt(5),
      -1 / Math.sqrt(5),
      -Math.sqrt(0.1 * (5 - Math.sqrt(5)))
    ),
    vec3(
      0.5 + 0.5 / Math.sqrt(5),
      -1 / Math.sqrt(5),
      Math.sqrt(0.1 * (5 - Math.sqrt(5)))
    ),
    vec3(
      -0.1 * (5 + Math.sqrt(5)),
      1 / Math.sqrt(5),
      -Math.sqrt(0.1 * (5 - Math.sqrt(5)))
    ),
    vec3(
      -0.1 * (5 + Math.sqrt(5)),
      1 / Math.sqrt(5),
      Math.sqrt(0.1 * (5 - Math.sqrt(5)))
    ),
    vec3(
      0.1 * Math.sqrt(5) - 0.5,
      -1 / Math.sqrt(5),
      -Math.sqrt(0.1 * (5 + Math.sqrt(5)))
    ),
    vec3(
      0.1 * Math.sqrt(5) - 0.5,
      -1 / Math.sqrt(5),
      Math.sqrt(0.1 * (5 + Math.sqrt(5)))
    ),
    vec3(
      0.5 - 0.1 * Math.sqrt(5),
      1 / Math.sqrt(5),
      -Math.sqrt(0.1 * (5 + Math.sqrt(5)))
    ),
    vec3(
      0.5 - 0.1 * Math.sqrt(5),
      1 / Math.sqrt(5),
      Math.sqrt(0.1 * (5 + Math.sqrt(5)))
    ),
  ];

  let ind = [
    0, 8, 2, 0, 2, 9, 0, 9, 5, 0, 5, 4, 0, 4, 8,

    1, 3, 10, 1, 10, 6, 1, 6, 7, 1, 7, 11, 1, 11, 3,

    3, 4, 5, 10, 4, 8, 6, 8, 2, 7, 2, 9, 11, 9, 5,

    4, 10, 3, 8, 10, 6, 2, 6, 7, 9, 7, 11, 5, 11, 3,
  ];

  let vecs1 = [];

  for (let i = 0; i + 2 < ind.length; i += 3) {
    let point = vec3(
      vecs[ind[i]].x + vecs[ind[i + 1]].x + vecs[ind[i + 2]].x,
      vecs[ind[i]].y + vecs[ind[i + 1]].y + vecs[ind[i + 2]].y,
      vecs[ind[i]].z + vecs[ind[i + 1]].z + vecs[ind[i + 2]].z
    ).divNum(3);
    vecs1.push(point);
  }

  const matrSc = matrScale(vec3(1 / vecs1[0].len()));

  for (let i = 0; i < vecs1.length; i++) {
    vecs1[i] = vecs1[i].pointTransform(matrSc);
  }

  ind = [
    0, 1, 2, 0, 2, 3, 0, 3, 4,

    1, 2, 13, 2, 13, 14, 13, 14, 18,

    0, 1, 12, 1, 12, 13, 12, 13, 17,

    4, 0, 11, 0, 11, 12, 11, 12, 16,

    3, 4, 10, 4, 10, 11, 10, 11, 15,

    2, 3, 14, 3, 14, 10, 14, 10, 19,

    19, 14, 18, 18, 19, 9, 8, 18, 9,

    18, 13, 17, 17, 18, 8, 7, 17, 8,

    17, 12, 16, 16, 17, 7, 6, 16, 7,

    16, 11, 15, 15, 16, 6, 5, 15, 6,

    15, 10, 19, 19, 15, 5, 9, 19, 5,

    5, 6, 7, 5, 7, 8, 5, 8, 9,
  ];

  let v = makeV(vecs1, ind);

  countNormals(v, null);

  let pr = new dsPrim(window.gl.TRIANGLES, v, null);
  pr.trans = matr;
  return pr;
}

function createIcosahedron(matr) {
  let vecs = [
    vec3(0, -1, 0),
    vec3(0, 1, 0),
    vec3(-2 / Math.sqrt(5), -1 / Math.sqrt(5), 0),
    vec3(2 / Math.sqrt(5), 1 / Math.sqrt(5), 0),
    vec3(
      0.5 + 0.5 / Math.sqrt(5),
      -1 / Math.sqrt(5),
      -Math.sqrt(0.1 * (5 - Math.sqrt(5)))
    ),
    vec3(
      0.5 + 0.5 / Math.sqrt(5),
      -1 / Math.sqrt(5),
      Math.sqrt(0.1 * (5 - Math.sqrt(5)))
    ),
    vec3(
      -0.1 * (5 + Math.sqrt(5)),
      1 / Math.sqrt(5),
      -Math.sqrt(0.1 * (5 - Math.sqrt(5)))
    ),
    vec3(
      -0.1 * (5 + Math.sqrt(5)),
      1 / Math.sqrt(5),
      Math.sqrt(0.1 * (5 - Math.sqrt(5)))
    ),
    vec3(
      0.1 * Math.sqrt(5) - 0.5,
      -1 / Math.sqrt(5),
      -Math.sqrt(0.1 * (5 + Math.sqrt(5)))
    ),
    vec3(
      0.1 * Math.sqrt(5) - 0.5,
      -1 / Math.sqrt(5),
      Math.sqrt(0.1 * (5 + Math.sqrt(5)))
    ),
    vec3(
      0.5 - 0.1 * Math.sqrt(5),
      1 / Math.sqrt(5),
      -Math.sqrt(0.1 * (5 + Math.sqrt(5)))
    ),
    vec3(
      0.5 - 0.1 * Math.sqrt(5),
      1 / Math.sqrt(5),
      Math.sqrt(0.1 * (5 + Math.sqrt(5)))
    ),
  ];

  // 0, 8, 2,
  // 0, 2, 9,
  // 0, 9, 5,
  // 0, 5, 4,
  // 0, 4, 8,

  // 1, 3, 10,
  // 1, 10, 6,
  // 1, 6, 7,
  // 1, 7, 11,
  // 1, 11, 3,

  // 3, 4, 5,
  // 10, 4, 8,
  // 6, 8, 2,
  // 7, 2, 9,
  // 11, 9, 5,

  // 4, 10, 3,
  // 8, 10, 6,
  // 2, 6, 7,
  // 9, 7, 11,
  // 5, 11, 3,
  let i = [
    0, 8, 2, 0, 2, 9, 0, 9, 5, 0, 5, 4, 0, 4, 8,

    1, 3, 10, 1, 10, 6, 1, 6, 7, 1, 7, 11, 1, 11, 3,

    3, 4, 5, 10, 4, 8, 6, 8, 2, 7, 2, 9, 11, 9, 5,

    4, 10, 3, 8, 10, 6, 2, 6, 7, 9, 7, 11, 5, 11, 3,
  ];

  let v = makeV(vecs, i);

  countNormals(v, null);

  let pr = new dsPrim(window.gl.TRIANGLES, v, null);
  pr.trans = matr;
  return pr;
}
