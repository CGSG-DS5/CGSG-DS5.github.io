#version 300 es

precision highp float;

in vec2 DrawTexCoord;

uniform samplerCube Cubemap;

uniform CamUBO // 2
{
  vec4 CamLoc4;
  vec4 CamUp4;
  vec4 CamRight4;
  vec4 CamAt4;
  vec4 FrameW_FrameH_ProjDist_ProjSize;
};

#define CamDir vec3(CamLoc4.w, CamUp4.w, CamRight4.w)
#define CamLoc (CamLoc4.xyz)
#define CamUp (CamUp4.xyz)
#define CamRight (CamRight4.xyz)
#define CamAt (CamAt4.xyz)
#define FrameW FrameW_FrameH_ProjDist_ProjSize.x
#define FrameH FrameW_FrameH_ProjDist_ProjSize.y
#define ProjDist FrameW_FrameH_ProjDist_ProjSize.z
#define ProjSize FrameW_FrameH_ProjDist_ProjSize.w

out vec4 OutColor;

void main( void )
{ 
  float Wp, Hp;

  Wp = Hp = ProjSize;
  if (FrameW > FrameH)
    Wp *= FrameW / FrameH;
  else
    Hp *= FrameH / FrameW;
 
  float
    xp = gl_FragCoord.x * Wp / FrameW - Wp / 2.0,
    yp = gl_FragCoord.y * Hp / FrameH - Hp / 2.0;
 
  vec3 D = normalize(CamDir * ProjDist + CamRight * xp + CamUp * yp);
 
  OutColor = texture(Cubemap, D);
  // OutColor = vec4(1);
}  