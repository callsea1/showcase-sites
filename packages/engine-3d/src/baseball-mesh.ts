import * as THREE from 'three';

const stitchVertexShader = /* glsl */ `
  varying vec3 vNormal;
  varying vec3 vView;
  void main() {
    vNormal = normalize(normalMatrix * normal);
    vec4 mv = modelViewMatrix * vec4(position, 1.0);
    vView = -mv.xyz;
    gl_Position = projectionMatrix * mv;
  }
`;

const stitchFragmentShader = /* glsl */ `
  varying vec3 vNormal;
  varying vec3 vView;
  uniform float uTime;

  float seam(vec3 n, float offset) {
    float lat = asin(clamp(n.y, -1.0, 1.0));
    float lon = atan(n.z, n.x);
    float curve = sin(lon * 2.0 + offset) * 0.55;
    return smoothstep(0.08, 0.02, abs(lat - curve));
  }

  void main() {
    vec3 n = normalize(vNormal);
    float stitch = max(seam(n, 0.0), seam(n, 3.14159));
    vec3 leather = vec3(0.92, 0.86, 0.72);
    vec3 stitchCol = vec3(0.85, 0.15, 0.12);
    vec3 col = mix(leather, stitchCol, stitch * 0.9);
    float fresnel = pow(1.0 - max(dot(n, normalize(vView)), 0.0), 2.5);
    col += fresnel * 0.08;
    gl_FragColor = vec4(col, 1.0);
  }
`;

export function createBaseballMesh(radius = 0.22): THREE.Mesh {
  const geo = new THREE.SphereGeometry(radius, 32, 32);
  const mat = new THREE.ShaderMaterial({
    vertexShader: stitchVertexShader,
    fragmentShader: stitchFragmentShader,
    uniforms: { uTime: { value: 0 } }
  });
  const mesh = new THREE.Mesh(geo, mat);
  mesh.castShadow = true;
  return mesh;
}

export function updateBaseballMesh(mesh: THREE.Mesh, time: number): void {
  const mat = mesh.material as THREE.ShaderMaterial;
  if (mat.uniforms.uTime) mat.uniforms.uTime.value = time;
  mesh.rotation.y = time * 0.4;
  mesh.rotation.x = Math.sin(time * 0.3) * 0.15;
}
