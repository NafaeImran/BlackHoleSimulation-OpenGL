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

//Camera Uniforms
uniform vec3 cameraPos_u;
uniform vec3 cameraFront_u;
uniform vec3 cameraRight_u;
uniform vec3 cameraUp_u;
uniform float fov_u;

//Rk4 Uniforms
uniform float blackholeMass_u;
uniform float maxSteps_u;
uniform float d_phi;

//Blackhole Uniforms
uniform vec3 blackholeCenter_u;
uniform float radius_u;

#define PI  3.1415926535
bool hit_sphere(in ray r, in float t_min, in float t_max, out hitRecord hit_rec);
vec3 ray_color(in ray r);
vec3 ray_at(in ray r, in float t);
vec2 L(vec2 U_n, float b, float R_s);
vec2 getSkyboxUV(vec3 ray_dir);

void main()
{
    float focal_length = 1.0f;
    vec2 uv = (gl_FragCoord.xy / resolution_u) * 2.0f - 1.0f;
    uv.x *= (resolution_u.x / resolution_u.y);
    uv *= tan(radians(fov_u / 2));
    ray r;
    r.origin = cameraPos_u;
    r.dir = normalize(cameraFront_u + uv.x * cameraRight_u + uv.y * cameraUp_u);
    FragColor = vec4(ray_color(r), 1.0f);
}
//colors where the ray hits
vec3 ray_color(in ray r) {
    hitRecord hit_rec;

    vec3 unit_dir = normalize(r.dir);
    vec3 background = texture(Texture, TexCoord).rgb;
    float R_s = 2.0 * blackholeMass_u;


    //Calculating Impact Parameter
    vec3 r_rel = r.origin - blackholeCenter_u;
    float b = length(cross(r.dir, r_rel)) / length(r.dir);

    //normal to orbital plane
    vec3 n_orbital = cross(r_rel, r.dir);
    //arbitrary axis for orbital plane
    vec3 e1 = normalize(r_rel);
    vec3 e2 = normalize(cross(n_orbital, e1));
    //Rk4 intial conditions
    vec2 U_n;//will be used to store u~ and u~'
    float u_tilde = b / length(r_rel);
    float mag = sqrt(1 - (u_tilde * u_tilde) + ((R_s / b) * u_tilde * u_tilde * u_tilde));//provides the magnitude of u~' i.e how much u~ is change per delta phi
    float ray_dir_sign = (dot(r.dir, e1) < 0.0) ? 1.0 : -1.0;//Allows us to perserve the direction of the ray for u~'
    float u_tilde_prime = ray_dir_sign * mag;
    float phi_n = 0.0f;
    U_n = vec2(u_tilde, u_tilde_prime);

    for (int step = 1;step <= maxSteps_u; step++)
    {
        if (U_n.x >= (b / R_s))//terminate loop ray goes into the event horizon and enters the blackhole
        {
            return vec3(0.0, 0.0, 0.0);
        }
        if (U_n.x <= 0.0)//if ray has escaped sample skybox with reflected ray
        {
            vec3 finalDir = normalize(cos(phi_n) * e1 + sin(phi_n) * e2);
            vec2 uv = getSkyboxUV(finalDir);
            return texture(Texture, uv).rgb;

        }
        vec2 k_1 = L(U_n, b, R_s);
        vec2 k_2 = L(U_n + ((d_phi / 2) * k_1), b, R_s);
        vec2 k_3 = L(U_n + (d_phi / 2) * k_2, b, R_s);
        vec2 k_4 = L(U_n + (d_phi * k_3), b, R_s);
        U_n = U_n + (d_phi / 6) * (k_1 + (2 * k_2) + (2 * k_3) + k_4);
        phi_n += d_phi;

    }
    return vec3(0.0, 0.0, 0.0);



}

vec3 ray_at(in ray r, in float t)
{
    return r.origin + t * r.dir;
}
vec2 L(vec2 U_n, float b, float R_s)
{
    float u_prime_tilde = U_n.y;
    float u_tilde = U_n.x;
    return vec2(u_prime_tilde, (((3.0 * R_s) / (2.0 * b)) * u_tilde * u_tilde) - u_tilde);
}

vec2 getSkyboxUV(vec3 ray_dir) {
    float theta = acos(ray_dir.y);
    float phi = atan(ray_dir.z, ray_dir.x);
    return vec2(phi / (2.0 * PI) + 0.5, theta / PI);
}