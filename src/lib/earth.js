// The Earth in the landing intro: one full-screen WebGL quad that ray-casts a
// unit sphere, so there is no 3D library behind it. Imagery is NASA's Blue
// Marble Next Generation (July 2004, topography and bathymetry, public domain).

const TAN_FOV = Math.tan((22 * Math.PI) / 180) // half the vertical field of view
const RAD = Math.PI / 180

// The globe's radius on screen, as a share of half the canvas height, from `altitude` Earth radii up.
export const limbRadius = (altitude) => 1 / Math.sqrt((1 + altitude) ** 2 - 1) / TAN_FOV

const VERT = 'attribute vec2 p; void main() { gl_Position = vec4(p, 0.0, 1.0); }'

const FRAG = `
#ifdef GL_FRAGMENT_PRECISION_HIGH
precision highp float;
#else
precision mediump float;
#endif
uniform vec2 uRes;
uniform float uDist, uTanFov, uAlpha, uBloomR;
uniform vec3 uE, uN, uF, uSun;
uniform sampler2D uGlobe;
const vec3 PAPER = vec3(246.0, 243.0, 236.0) / 255.0;
const vec3 AIR = vec3(0.36, 0.6, 1.0);

void main() {
  vec2 frag = gl_FragCoord.xy - 0.5 * uRes;
  vec3 rd = normalize(vec3(frag / (0.5 * uRes.y) * uTanFov, -1.0));
  vec3 ro = vec3(0.0, 0.0, uDist);
  float b = dot(ro, rd);
  float c = uDist * uDist - 1.0;
  float disc = b * b - c;
  float nearD = sqrt(max(uDist * uDist - b * b, 0.0));   // how close this ray passes to the center
  float px = uTanFov / (0.5 * uRes.y) * sqrt(max(c, 0.0)); // one pixel, measured at the limb

  // thin blue air around the lit side
  vec3 q = normalize(ro - rd * b);
  float sunSide = smoothstep(-0.35, 0.45, dot(q, uSun));
  float halo = exp(-(max(nearD, 1.0) - 1.0) / 0.03) * 0.6 * sunSide;
  vec4 col = vec4(AIR * halo, halo);

  if (disc > 0.0) {
    vec3 p = ro + rd * (-b - sqrt(disc));
    vec3 pe = uE * p.x + uN * p.y + uF * p.z;
    float lat = asin(clamp(pe.y, -1.0, 1.0));
    float lon = atan(pe.x, pe.z);
    vec3 tex = texture2D(uGlobe, vec2(lon / 6.28318531 + 0.5, 0.5 - lat / 3.14159265)).rgb;

    float diff = dot(p, uSun);
    float day = smoothstep(-0.08, 0.3, diff);
    vec3 lit = tex * (0.035 + 1.3 * pow(max(diff, 0.0), 0.75));
    float ocean = smoothstep(0.0, 0.08, tex.b - max(tex.r, tex.g));
    lit += vec3(1.0, 0.95, 0.85) * pow(max(dot(p, normalize(uSun - rd)), 0.0), 70.0) * 0.45 * ocean;
    float fres = pow(1.0 - max(dot(p, -rd), 0.0), 3.0);
    lit = mix(lit, AIR, 0.06 * day) + AIR * fres * (0.05 + 0.75 * day);

    float a = clamp((1.0 - nearD) / (1.5 * px), 0.0, 1.0);
    col = vec4(lit * a + col.rgb * (1.0 - a), a + col.a * (1.0 - a));
  }

  col *= uAlpha;
  // the paper page opening out of the Earth
  if (uBloomR > 0.0) {
    float k = 1.0 - smoothstep(0.55 * uBloomR, uBloomR, length(frag));
    col = mix(col, vec4(PAPER, 1.0), k);
  }
  gl_FragColor = col;
}`

function point(lat, lon) {
  const cl = Math.cos(lat)
  return [cl * Math.sin(lon), Math.sin(lat), cl * Math.cos(lon)]
}

// Returns null when this browser cannot draw it (no WebGL, a texture too big
// for the GPU, a shader that will not compile); the intro then runs on stars alone.
export function createEarth(canvas, globeImg) {
  let gl
  try { gl = canvas.getContext('webgl', { alpha: true, premultipliedAlpha: true, antialias: false }) } catch { return null }
  if (!gl) return null
  if (gl.getParameter(gl.MAX_TEXTURE_SIZE) < globeImg.naturalWidth) return null

  const compile = (type, src) => {
    const s = gl.createShader(type)
    gl.shaderSource(s, src); gl.compileShader(s)
    return gl.getShaderParameter(s, gl.COMPILE_STATUS) ? s : null
  }
  const vs = compile(gl.VERTEX_SHADER, VERT), fs = compile(gl.FRAGMENT_SHADER, FRAG)
  if (!vs || !fs) return null
  const prog = gl.createProgram()
  gl.attachShader(prog, vs); gl.attachShader(prog, fs); gl.linkProgram(prog)
  if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) return null
  gl.useProgram(prog)

  gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer())
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW)
  const loc = gl.getAttribLocation(prog, 'p')
  gl.enableVertexAttribArray(loc)
  gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0)

  const aniso = gl.getExtension('EXT_texture_filter_anisotropic')
  gl.activeTexture(gl.TEXTURE0)
  gl.bindTexture(gl.TEXTURE_2D, gl.createTexture())
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, globeImg)
  gl.generateMipmap(gl.TEXTURE_2D)
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_LINEAR)
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR)
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.REPEAT)
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE)
  if (aniso) gl.texParameterf(gl.TEXTURE_2D, aniso.TEXTURE_MAX_ANISOTROPY_EXT, 4)
  if (gl.getError() !== gl.NO_ERROR) return null

  const u = (name) => gl.getUniformLocation(prog, name)
  const U = { res: u('uRes'), dist: u('uDist'), alpha: u('uAlpha'), bloom: u('uBloomR'), e: u('uE'), n: u('uN'), f: u('uF') }
  gl.uniform1i(u('uGlobe'), 0)
  gl.uniform1f(u('uTanFov'), TAN_FOV)
  const sun = [-0.55, 0.3, 0.78], sl = Math.hypot(...sun)
  gl.uniform3f(u('uSun'), sun[0] / sl, sun[1] / sl, sun[2] / sl)
  gl.clearColor(0, 0, 0, 0)

  let lost = false
  canvas.addEventListener('webglcontextlost', (e) => { e.preventDefault(); lost = true })

  return {
    get lost() { return lost },
    resize(w, h, dpr) {
      canvas.width = Math.round(w * dpr); canvas.height = Math.round(h * dpr)
      gl.viewport(0, 0, canvas.width, canvas.height)
      gl.uniform2f(U.res, canvas.width, canvas.height)
    },
    // The camera looks straight down at (lat, lon), in degrees, from `altitude`
    // Earth radii above the ground. bloom is the paper radius as a share of
    // the half diagonal (0 = none).
    draw({ lat, lon, altitude, alpha, bloom }) {
      if (lost) return
      const la = lat * RAD, lo = lon * RAD
      const f = point(la, lo)
      const e = [Math.cos(lo), 0, -Math.sin(lo)]
      const n = [f[1] * e[2] - f[2] * e[1], f[2] * e[0] - f[0] * e[2], f[0] * e[1] - f[1] * e[0]]
      gl.uniform3fv(U.e, e); gl.uniform3fv(U.n, n); gl.uniform3fv(U.f, f)
      gl.uniform1f(U.dist, 1 + altitude)
      gl.uniform1f(U.alpha, alpha)
      gl.uniform1f(U.bloom, bloom * Math.hypot(canvas.width, canvas.height) / 2)
      gl.clear(gl.COLOR_BUFFER_BIT)
      gl.drawArrays(gl.TRIANGLES, 0, 3)
    },
    destroy() { gl.getExtension('WEBGL_lose_context')?.loseContext() },
  }
}
