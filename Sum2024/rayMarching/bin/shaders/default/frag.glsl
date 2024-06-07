#version 300 es

precision highp float;

uniform samplerCube Tex;
uniform sampler2D Tex1;

uniform Utils // 1
{
  vec4 TimeGlobalTimeDeltaTimeGlobalDeltaTime;
  vec4 CamLoc4;
  vec4 CamUp4;
  vec4 CamRight4;
  vec4 CamDir4;
  vec4 FrameWFrameHWpHp;
  vec4 FarClipProjDistProjSize;
};

#define Time TimeGlobalTimeDeltaTimeGlobalDeltaTime.x
#define GlobalTime TimeGlobalTimeDeltaTimeGlobalDeltaTime.y
#define DeltaTime TimeGlobalTimeDeltaTimeGlobalDeltaTime.z
#define GlobalDeltaTime TimeGlobalTimeDeltaTimeGlobalDeltaTime.w

#define CamLoc CamLoc4.xyz
#define CamUp CamUp4.xyz
#define CamRight CamRight4.xyz
#define CamDir CamDir4.xyz
#define CamAt vec3(CamUp4.w, CamRight4.w, CamDir4.w)

#define FrameW FrameWFrameHWpHp.x
#define FrameH FrameWFrameHWpHp.y
#define Wp FrameWFrameHWpHp.z
#define Hp FrameWFrameHWpHp.w

#define FarClip FarClipProjDistProjSize.x
#define ProjDist FarClipProjDistProjSize.y
#define ProjSize FarClipProjDistProjSize.z

out vec4 OutColor;

#define SHAPE_TYPE_SPHERE 0.0
#define SHAPE_TYPE_BOX 1.0
#define SHAPE_TYPE_PLANE 2.0

struct material
{
  vec4 Ka, KdTrans, KsPh;
  vec4 TexN;
};

struct shape
{
  mat4 InvTrans;
  material Mtl;
  vec4 Type;
  vec4 V1, V2;
};

#define MAX_SHAPES 10

uniform Scene // 2
{
  shape Shapes[MAX_SHAPES];
  vec4 NumOfShapes4;
};
#define NumOfShapes int(NumOfShapes4.x)


/*shape Shapes[2] = shape[2]
  (
    shape
    (
      mat4
        (
          1, 0, 0, 0,
          0, 1, 0, 0,
          0, 0, 1, 0,
          0, 1, 0, 1
        ),
      material(vec4(vec3(0.1), 0), vec4(0.8, 0.3, 0.1, 0), vec4(vec3(1), 40), vec4(-1)),
      vec4(SHAPE_TYPE_SPHERE, 0, 0, 0),
      vec4(0.5, 0, 0, 0),
      vec4(0, 0, 0, 0)
    ),
    shape
    (
      mat4
        (
          1, 0, 0, 0,
          0, 1, 0, 0,
          0, 0, 1, 0,
          0, 0, 0, 1
        ),
      material(vec4(vec3(0.1), 0), vec4(vec3(0.1), 0), vec4(vec3(1), 40), vec4(-1)),
      vec4(SHAPE_TYPE_PLANE, 0, 0, 0),
      vec4(0, 1, 0, 0),
      vec4(0, 0, 0, 0)
    )
  ); 
#define NumOfShapes 2*/

struct dist_info
{
  float Dist;
  material Mtl;
};

float GetShapeDistanceSphere( const vec3 P, const shape S )
{
  return length(P) - S.V1.x;
}

float GetShapeDistanceBox( const vec3 P, const shape S )
{
  return length(max(abs(P) - S.V1.xyz, 0.0));
}

float GetShapeDistancePlane( const vec3 P, const shape S )
{
  return abs(dot(P, S.V1.xyz) + S.V1.w);
}

float GetShapeDistance( const vec3 P, const shape S )
{
  vec3 PTrans = (S.InvTrans * vec4(P, 1)).xyz;
  return
    mix(
      mix(
        GetShapeDistancePlane(PTrans, S),
        GetShapeDistanceBox(PTrans, S),
        float(S.Type.x == SHAPE_TYPE_BOX)
      ),
      GetShapeDistanceSphere(PTrans, S),
      float(S.Type.x == SHAPE_TYPE_SPHERE)
    );
}

material mix( const material A, const material B, const float T )
{
  return material
    (
      mix(A.Ka, B.Ka, T),
      mix(A.KdTrans, B.KdTrans, T),
      mix(A.KsPh, B.KsPh, T),
      mix(A.TexN, B.TexN, T)
    );
}

dist_info mix( const dist_info A, const dist_info B, const float T )
{
  return dist_info
    (
      mix(A.Dist, B.Dist, T),
      mix(A.Mtl, B.Mtl, T)
    );
}

dist_info GetDistance( const vec3 P )
{
  dist_info best = dist_info(GetShapeDistance(P, Shapes[0]), Shapes[0].Mtl), cur;
  for (int i = 1; i < NumOfShapes; i++)
  {
    cur = dist_info(GetShapeDistance(P, Shapes[i]), Shapes[i].Mtl);
    best = mix(best, cur, float(best.Dist > cur.Dist));
  }

  return best;
}

vec3 GetNormal( const vec3 P )
{
  const float step = 0.001;

  float gradient_x = GetDistance(P + vec3(step, 0, 0)).Dist - GetDistance(P - vec3(step, 0, 0)).Dist;
  float gradient_y = GetDistance(P + vec3(0, step, 0)).Dist - GetDistance(P - vec3(0, step, 0)).Dist;
  float gradient_z = GetDistance(P + vec3(0, 0, step)).Dist - GetDistance(P - vec3(0, 0, step)).Dist;

  return normalize(vec3(gradient_x, gradient_y, gradient_z));
}

bool RayMarchIsInShadow( const vec3 Org, const vec3 Dir )
{
  const int MaxSteps = 32;
  const float MinDist = 0.01;

  vec3 CurPos = Org;
  float TotalDist = 0.0;
  dist_info DistNearest;

  for (int i = 0; i < MaxSteps; i++)
  {
    if (TotalDist > FarClip)
      break;

    DistNearest = GetDistance(CurPos);

    if (DistNearest.Dist < MinDist)
      return true;

    TotalDist += DistNearest.Dist;
    CurPos = TotalDist * Dir + Org;
  }

  return false;
}


vec3 RayMarch( const vec3 Org, const vec3 Dir )
{
  const int MaxSteps = 200;
  const float MinDist = 0.01;

  vec3 CurPos = Org;
  float TotalDist = 0.0;
  dist_info DistNearest;

  for (int i = 0; i < MaxSteps; i++)
  {
    if (TotalDist > FarClip)
      break;

    DistNearest = GetDistance(CurPos);

    if (DistNearest.Dist < MinDist)
    {
      vec3 N = GetNormal(CurPos);
      vec3 L = normalize(vec3(1.0, 0.5, 0.7));
      vec3 LC = vec3(1.0);
      vec3 V = normalize(CurPos - CamLoc);
      N = faceforward(N, V, N);

      float shadow = RayMarchIsInShadow(CurPos + L * 0.03, L) ? 0.1 : 1.0;

      return 
        (vec3(min(vec3(0.1), DistNearest.Mtl.Ka.xyz) +
             max(0.0, dot(N, L)) * DistNearest.Mtl.KdTrans.xyz * LC +
             pow(max(0.0, dot(reflect(V, N), L)), DistNearest.Mtl.KsPh.w) * DistNearest.Mtl.KsPh.xyz * LC)) * shadow;
    }

    TotalDist += DistNearest.Dist;
    CurPos = TotalDist * Dir + Org;
  }

  return vec3(0); // skybox here
}

void main( void )
{
  //OutColor = vec4(gl_FragCoord.x * abs(sin(Time)) / FrameW, gl_FragCoord.y * abs(sin(Time)) / FrameH, 0, 1);

  float
    px = ((2.0 * gl_FragCoord.x + 1.0) / FrameW - 1.0) * Wp,
    py = ((2.0 * gl_FragCoord.y + 1.0) / FrameH - 1.0) * Hp;
  vec3
    RayDir = CamDir * ProjDist + px * CamRight + py * CamUp,
    RayOrg = CamLoc + RayDir;
  RayDir = normalize(RayDir);

  // OutColor = vec4(RayMarch(RayOrg, RayDir), 1);
  OutColor = vec4(texture(Tex, -RayDir).xyz, 1);
  // OutColor = vec4(texture(Tex1, gl_FragCoord.xy / vec2(FrameW, FrameH)).xyz, 1);
  // OutColor = vec4(texture(Tex1, vec2(atan(RayDir.x, RayDir.z) / (2.0 * acos(-1.0)), acos(-RayDir.y) / acos(-1.0))).xyz, 1);
}