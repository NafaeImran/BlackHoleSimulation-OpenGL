#version 330 core
out vec4 FragColor;
in vec2 TexCoord;

struct ray {
    vec3 origin;
    vec3 dir;
};
struct hitRecord {
    float t;
    vec3 point;
    vec3 normal;
};

uniform sampler2D Texture;
uniform vec2 resolution_u;
uniform vec3 cameraPos_u;
uniform vec3 sphereCenter_u;
uniform float radius_u;


bool hit_sphere(in ray r, in float t_min, in float t_max, out hitRecord hit_rec);
vec3 ray_color(in ray r);
vec3 ray_at(in ray r, in float t);

void main()
{
    float focal_length = 1.0f;
    float fov = 45.0f;
    vec2 uv = (gl_FragCoord.xy / resolution_u) * 2.0f - 1.0f;
    uv.x *= (resolution_u.x / resolution_u.y);
    uv *= tan(radians(fov / 2));
    ray r;
    r.origin = cameraPos_u;
    r.dir = normalize(vec3(uv, -focal_length));
    FragColor = vec4(ray_color(r), 1.0f);
}
//colors where the ray hits
vec3 ray_color(in ray r) {
    hitRecord hit_rec;
    vec3 unit_dir = normalize(r.dir);
    //    float a = 0.5f * (unit_dir.y + 1.0f);
    vec3 background = texture(Texture, TexCoord).rgb;

    bool valid_hit = hit_sphere(r, 0.0001, 1e25, hit_rec);
    vec3 n_color;
    if (valid_hit)
    n_color = 0.5 * (hit_rec.normal + 1.0f);

    return mix(background, n_color, float(valid_hit));
}
//detects if ray intersected with sphere
bool hit_sphere(in ray r, in float t_min, in float t_max, out hitRecord hit_rec)
{
    vec3 dir = r.dir;
    vec3 origin = r.origin;
    vec3 oc = sphereCenter_u - origin;
    float a = dot(dir, dir);
    float h = dot(dir, oc);
    float c = dot(oc, oc) - pow(radius_u, 2.0f);
    float det = pow(h, 2.0f) - (a * c);
    float root;
    if (det >= 0.0f)
    {
        float sqrtd = sqrt(det);
        root = (h - sqrtd) / a;
        if (root <= t_min || t_max <= root) {
            root = (h + sqrtd) / a;
            if (root <= t_min || t_max <= root)
            return false;
        }
        hit_rec.t = root;
        hit_rec.point = ray_at(r, root);
        hit_rec.normal = (hit_rec.point - sphereCenter_u) / radius_u;
        return true;

    }
    return false;
}
vec3 ray_at(in ray r, in float t)
{
    return r.origin + t * r.dir;
}
