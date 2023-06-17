#version 300 es
precision highp float;

in vec2 InTexCoord;
in vec3 InPos;

out vec2 DrawTexCoord;

void main( void )
{
  DrawTexCoord = InTexCoord;
  gl_Position = vec4(InPos, 1);
}