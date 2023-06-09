class _vec2 {
  constructor(x, y) {
    this.x = x;
    this.y = y === undefined ? x : y;
  }
}

function vec2(...args) {
  return new _vec2(...args);
}
