import { timer } from './timer';

export class input extends timer {
  VK_LBUTTON: number = 0x0;
  VK_MBUTTON: number = 0x1;
  VK_RBUTTON: number = 0x2;
  VK_SHIFT: number = 0x10;
  VK_CONTROL: number = 0x11;
  VK_MENU: number = 0x12;
  VK_ESCAPE: number = 0x1b;
  VK_LEFT: number = 0x25;
  VK_UP: number = 0x26;
  VK_RIGHT: number = 0x27;
  VK_DOWN: number = 0x28;

  mX: number = 0;
  mY: number = 0;
  mdX: number = 0;
  mdY: number = 0;
  mdZ: number = 0;

  keysOld: boolean[] = [];
  keys: boolean[] = [];
  keysClick: boolean[] = [];

  keysEvent: boolean[] = [];
  mXEvent: number = 0;
  mYEvent: number = 0;
  mdXEvent: number = 0;
  mdYEvent: number = 0;
  mdZEvent: number = 0;

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

    for (let i = 0; i < 255; i++) this.keys[i] = this.keysEvent[i];
    for (let i = 0; i < 255; i++)
      this.keysClick[i] = this.keys[i] && !this.keysOld[i];
    for (let i = 0; i < 255; i++) this.keysOld[i] = this.keys[i];

    this.mdXEvent = this.mdYEvent = this.mdZEvent = 0;
  }

  onKeyDown = (e: KeyboardEvent) => {
    //e.preventDefault();
    this.keysEvent[e.keyCode] = true;
  };
  onKeyUp = (e: KeyboardEvent) => {
    //e.preventDefault();
    this.keysEvent[e.keyCode] = false;
  };
  onMouseDown = (e: MouseEvent) => {
    //e.preventDefault();
    this.keysEvent[e.button] = true;
  };
  onMouseUp = (e: MouseEvent) => {
    //e.preventDefault();
    this.keysEvent[e.button] = false;
  };
  onMouseMove = (e: MouseEvent) => {
    //e.preventDefault();
    this.mXEvent = e.x;
    this.mdXEvent += e.movementX;
    this.mYEvent = e.y;
    this.mdYEvent += e.movementY;
  };
  onMouseWheel = (e: WheelEvent) => {
    //e.preventDefault();
    this.mdZEvent -= e.deltaY;
  };
}