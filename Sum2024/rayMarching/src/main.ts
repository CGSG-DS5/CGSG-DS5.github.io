export let gl: WebGL2RenderingContext;
export let can2d: CanvasRenderingContext2D;

import { animContext } from './anim';
import { vec3 } from './mthvec3';
import { control_unit } from './units/control_unit';
import { redactor_unit } from './units/redactor_unit';
import { test_unit } from './units/test_unit';

function getContext() {
  const canvas = document.querySelector('#glcan') as HTMLCanvasElement | null;
  if (!canvas) return;
  const ctx = canvas.getContext('webgl2');
  if (!ctx) return;
  gl = ctx;

  const canvas2 = document.querySelector('#can2D') as HTMLCanvasElement | null;
  if (!canvas2) return;
  const ctx2 = canvas2.getContext('2d');
  if (!ctx2) return;
  can2d = ctx2;
}

let anim: animContext = new animContext();

window.addEventListener('load', () => {
  getContext();

  anim.init();

  let w: number = window.innerWidth;
  let h: number = window.innerHeight;
  anim.resize(w, h);
  gl.canvas.width = w;
  gl.canvas.height = h;
  can2d.canvas.width = w;
  can2d.canvas.height = h;

  can2d.fillStyle = 'yellow';
  can2d.font = '30px sans-serif';

  can2d.clearRect(0, 0, can2d.canvas.width, can2d.canvas.height);
  can2d.fillText('FPS: 30.7', 100, 100);

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

window.addEventListener('resize', (event: UIEvent) => {
  let w: number = window.innerWidth;
  let h: number = window.innerHeight;
  anim.resize(w, h);
  gl.canvas.width = w;
  gl.canvas.height = h;
  can2d.canvas.width = w;
  can2d.canvas.height = h;
});

window.addEventListener('keydown', anim.onKeyDown);
window.addEventListener('keyup', anim.onKeyUp);
window.addEventListener('mousedown', anim.onMouseDown);
window.addEventListener('mouseup', anim.onMouseUp);
window.addEventListener('mousemove', anim.onMouseMove);
window.addEventListener('wheel', anim.onMouseWheel);
