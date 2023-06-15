#version 300 es
precision highp float;

in vec3 InPos;
in vec3 InNormal;

uniform MatrixUBO // 0
{
  mat4 W;
  mat4 WInv;
  mat4 WVP;
};

out vec3 DrawNormal;
out vec3 DrawPos; 

void main( void )
{
  DrawNormal = mat3(WInv) * normalize(InNormal);
  DrawPos = (W * vec4(InPos, 1.0)).xyz;
  gl_Position = WVP * vec4(InPos, 1.0);
}