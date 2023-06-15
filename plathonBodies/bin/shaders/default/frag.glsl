#version 300 es

precision highp float;

uniform MtlUBO // 1
{
  vec4 KaPh;
  vec4 KdTrans;
  vec4 Ks4;
};

#define Ka (KaPh.xyz)
#define Ph (KaPh.a)
#define Trans (KdTrans.w)
#define Kd (KdTrans.xyz)
#define Ks (Ks4.xyz)

uniform CamUBO // 2
{
  vec4 CamLoc4;
  vec4 CamUp4;
  vec4 CamRight4;
  vec4 CamAt4;
};

#define CamLoc (CamLoc4.xyz)
#define CamUp (CamUp4.xyz)
#define CamRight (CamRight4.xyz)
#define CamAt (CamAt4.xyz)

precision highp float;

out vec4 OutColor;

uniform float Time;

in vec3 DrawNormal;
in vec3 DrawPos;

vec3 gamma( vec3 V, float X )
{
  return vec3(pow(V.x, X), pow(V.y, X), pow(V.z, X));
}

void shade( void )
{
  vec3 N = normalize(DrawNormal);
  // vec3 L = normalize(vec3(cos(Time), 1, sin(Time)));
  vec3 L = normalize(vec3(1.0, 0.5, 0.7));
  vec3 LC = vec3(1.0);
  vec3 V = normalize(DrawPos - CamLoc);
  N = faceforward(N, V, N);
  vec3 color =
    vec3(min(vec3(0.1), Ka) +
         max(0.0, dot(N, L)) * Kd * LC +
         pow(max(0.0, dot(reflect(V, N), L)), Ph) * Ks * LC);

  OutColor = vec4(color, 1.0);
  
  // vec3 color =
  //   vec3(min(vec3(0.1), Ka) +
  //        gamma(max(0.0, dot(N, L)) * gamma(Kd, 2.2) * LC, 1.0 / 2.2) +
  //        pow(max(0.0, dot(reflect(V, N), L)), Ph) * Ks * LC);

  // OutColor = vec4(color, 1.0);
}

void main( void )
{ 
  // OutColor = vec4(DrawPos, 1);
  shade();
}