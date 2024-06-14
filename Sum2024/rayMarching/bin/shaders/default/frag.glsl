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

#define SHAPE_TYPE_SPHERE 0
#define SHAPE_TYPE_BOX 1
#define SHAPE_TYPE_PLANE 2
#define SHAPE_TYPE_UNION 3
#define SHAPE_TYPE_SUBTRACT 4
#define SHAPE_TYPE_INTERSECT 5
#define SHAPE_TYPE_BLEND 6
#define SHAPE_TYPE_TORUS 7

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

struct dist_info
{
  float Dist;
  int Indx;
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
  return abs(dot(P, S.V1.xyz) - S.V1.w);
}

float GetShapeDistanceUnion( const vec3 P, const float A, const float B )
{
  return min(A, B);
}

float GetShapeDistanceSubtract( const vec3 P, const float A, const float B )
{
  return max(-A, B);
}

float GetShapeDistanceIntersect( const vec3 P, const float A, const float B )
{
  return max(A, B);
}

float GetShapeDistanceTorus( const vec3 P, const shape S )
{
  return length(vec2(length(P.xz) - S.V1.x, P.y)) - S.V1.y;
}

float smin( float a, float b, float k )
{
  float h = clamp(0.5 + 0.5 * (a - b) / k, 0.0, 1.0);
  return mix(a, b, h) - k * h * (1.0 - h);
}

float GetShapeDistanceBlend( const vec3 P, const float A, const float B, const float k )
{
  return smin(A, B, k);
}

#define GSD(Name, Name0)                                                                               \
dist_info Name( const vec3 P, const int I, const int C )                                               \
{                                                                                                      \
  vec3 PTrans = (Shapes[I].InvTrans * vec4(P, 1)).xyz;                                                 \
  dist_info A, B;                                                                                      \
  switch (int(Shapes[I].Type.x))                                                                       \
  {                                                                                                    \
    case SHAPE_TYPE_PLANE:                                                                             \
      return dist_info(GetShapeDistancePlane(PTrans, Shapes[I]), C + 1);                               \
    case SHAPE_TYPE_BOX:                                                                               \
      return dist_info(GetShapeDistanceBox(PTrans, Shapes[I]), C + 1);                                 \
    case SHAPE_TYPE_SPHERE:                                                                            \
      return dist_info(GetShapeDistanceSphere(PTrans, Shapes[I]), C + 1);                              \
    case SHAPE_TYPE_TORUS:                                                                             \
      return dist_info(GetShapeDistanceTorus(PTrans, Shapes[I]), C + 1);                               \
    default:                                                                                           \
      A = Name0(PTrans, I + 1, 0);                                                                     \
      B = Name0(PTrans, I + 1 + A.Indx, 0);                                                            \
  }                                                                                                    \
                                                                                                       \
  switch (int(Shapes[I].Type.x))                                                                       \
  {                                                                                                    \
    case SHAPE_TYPE_UNION:                                                                             \
      return dist_info(GetShapeDistanceUnion(PTrans, A.Dist, B.Dist), C + 1 + A.Indx + B.Indx);        \
    case SHAPE_TYPE_SUBTRACT:                                                                          \
      return dist_info(GetShapeDistanceSubtract(PTrans, A.Dist, B.Dist), C + 1 + A.Indx + B.Indx);     \
    case SHAPE_TYPE_INTERSECT:                                                                         \
      return dist_info(GetShapeDistanceIntersect(PTrans, A.Dist, B.Dist), C + 1 + A.Indx + B.Indx);    \
    default:                                                                                           \
      return dist_info(GetShapeDistanceBlend(PTrans, A.Dist, B.Dist, Shapes[I].V1.x), C + 1 + A.Indx + B.Indx);   \
  }                                                                                                    \
}

dist_info OverflowFunc( const vec3 P, const int I, const int C )
{
  return dist_info(0.0, C + 1);
}

GSD(GSD1, OverflowFunc)

GSD(GSD2, GSD1)

GSD(GetShapeDistance, GSD2)

dist_info GetDistance( const vec3 P )
{
  dist_info best = dist_info(-1.0, -1), cur;
  for (int i = 0; i < NumOfShapes; i += cur.Indx)
  {
    cur = GetShapeDistance(P, i, 0);
    if (best.Indx == -1 || best.Dist > cur.Dist)
    {
      best.Dist = cur.Dist;
      best.Indx = i;
    }
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

float RayMarchShadow( const vec3 Org, const vec3 Dir, const float K )
{
  const int MaxSteps = 200;
  const float MinDist = 0.01;

  vec3 CurPos = Org;
  float TotalDist = 0.0;
  dist_info DistNearest;

  float t = 1.0;

  for (int i = 0; i < MaxSteps; i++)
  {
    if (TotalDist > FarClip)
      break;

    DistNearest = GetDistance(CurPos);

    if (DistNearest.Dist < MinDist)
      return 0.0;

    t = min(t, K * DistNearest.Dist / TotalDist);

    TotalDist += DistNearest.Dist;
    CurPos = TotalDist * Dir + Org;
  }

  return t;
}

int rec = 0;

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

      float shadow = RayMarchShadow(CurPos + L * 0.1, L, abs(sin(Time / 10.0)) * 100.0);

      shape S = Shapes[DistNearest.Indx];

      vec3 R = Dir - N * (2.0 * dot(N, Dir));

      return 
        (vec3(min(vec3(0.1), S.Mtl.Ka.xyz) +
             max(0.0, dot(N, L)) * S.Mtl.KdTrans.xyz * LC * shadow +
             pow(max(0.0, dot(reflect(V, N), L)), S.Mtl.KsPh.w) * S.Mtl.KsPh.xyz * LC) * shadow +
         S.Mtl.KsPh.xyz * texture(Tex, R).xyz * shadow
        );
    }

    TotalDist += abs(DistNearest.Dist);
    CurPos = TotalDist * Dir + Org;
  }

  return texture(Tex, Dir).xyz; // skybox here
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

  OutColor = vec4(RayMarch(RayOrg, RayDir), 1);
  // OutColor = vec4(texture(Tex, RayDir).xyz, 1);
  // OutColor = vec4(texture(Tex0, gl_FragCoord.xy / vec2(FrameW, FrameH)).xyz, 1);
  // OutColor = vec4(texture(Tex[0], vec2(atan(RayDir.x, RayDir.z) / (2.0 * acos(-1.0)), acos(-RayDir.y) / acos(-1.0))).xyz, 1);
}