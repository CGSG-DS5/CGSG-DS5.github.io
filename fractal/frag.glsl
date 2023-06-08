#version 300 es
out highp vec4 o_color;

uniform highp float Time;
uniform highp float FrameW, FrameH;
uniform highp float X0, Y0, X1, Y1;
uniform highp int Type;

// Complex numbers math
highp vec2 cmplMul( highp vec2 z1, highp vec2 z2 )
{
  return vec2(z1.x * z2.x - z1.y * z2.y, z1.x * z2.y + z2.x * z1.y);
}
highp float cmplNorm2( highp vec2 z )
{
  return z.x * z.x + z.y * z.y;
}

// Fractal
highp float Julia( highp vec2 z, highp vec2 c )
{
  highp float n = 0.0;

  while (n < 255.0 && cmplNorm2(z) < 4.0)
  {
    z = cmplMul(z, z) + c;
    n++;
  }
  return n;
}
    
void drawMB( highp vec2 z )
{    
  highp float n = Julia(z, z);
  o_color = vec4(n / 255.0, n / 255.0, n * 8.0 / 255.0, 1.0);
}

void drawJulia( highp vec2 z )
{    
  highp vec2 c = vec2(0.47 + 0.2 * sin(Time + 1.5), 0.51 + 0.11 * sin(2.1 * Time));
  highp float n = Julia(z, c);
  o_color = vec4(n / 255.0, n / 255.0, n * 8.0 / 255.0, 1.0);
}

void main( void )
{
  highp float x = mix(X0, X1, gl_FragCoord.x / FrameW), y = mix(Y0, Y1, gl_FragCoord.y / FrameH);
  if (Type == 0)
    drawJulia(vec2(x, y));
  else
    drawMB(vec2(x, y));
}