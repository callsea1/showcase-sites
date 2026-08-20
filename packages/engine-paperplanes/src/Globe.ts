import * as THREE from 'three';

export type GlobeLocation = {
  city: string;
  lat: number;
  lng: number;
  label: string;
};

function latLngToVector3(lat: number, lng: number, radius: number): THREE.Vector3 {
  const phi = (90 - lat) * (Math.PI / 180);
  const theta = (lng + 180) * (Math.PI / 180);
  return new THREE.Vector3(
    -radius * Math.sin(phi) * Math.cos(theta),
    radius * Math.cos(phi),
    radius * Math.sin(phi) * Math.sin(theta)
  );
}

export type GlobeHandle = {
  group: THREE.Group;
  markers: THREE.Mesh[];
  update: (elapsed: number) => void;
  setActiveIndex: (index: number) => void;
  rotateToLocation: (index: number) => void;
};

export function createGlobe(locations: GlobeLocation[]): GlobeHandle {
  const group = new THREE.Group();
  group.name = 'globe';

  const geometry = new THREE.IcosahedronGeometry(2.2, 4);
  const positions = geometry.attributes.position;

  for (let i = 0; i < positions.count; i++) {
    const x = positions.getX(i);
    const y = positions.getY(i);
    const z = positions.getZ(i);
    const wave = Math.sin(x * 3.5 + y * 2.2) * 0.04 + Math.cos(z * 2.8) * 0.03;
    positions.setXYZ(i, x * (1 + wave), y * (1 + wave), z * (1 + wave));
  }
  positions.needsUpdate = true;
  geometry.computeVertexNormals();

  const material = new THREE.MeshStandardMaterial({
    color: 0x5ecfcf,
    roughness: 0.45,
    metalness: 0.2,
    emissive: 0x2a6a6a,
    emissiveIntensity: 0.42,
    transparent: false,
    opacity: 1
  });

  const globe = new THREE.Mesh(geometry, material);
  group.add(globe);

  const rimLight = new THREE.PointLight(0x7ad4d4, 2.5, 20);
  rimLight.position.set(4, 2, 3);
  group.add(rimLight);

  const markers: THREE.Mesh[] = [];
  locations.forEach((loc, index) => {
    const pos = latLngToVector3(loc.lat, loc.lng, 2.35);
    const markerGeo = new THREE.SphereGeometry(0.08, 12, 12);
    const markerMat = new THREE.MeshStandardMaterial({
      color: index === 0 ? 0xff9398 : 0xffffff,
      emissive: index === 0 ? 0xff9398 : 0xffffff,
      emissiveIntensity: 0.6
    });
    const marker = new THREE.Mesh(markerGeo, markerMat);
    marker.position.copy(pos);
    marker.userData = { index, city: loc.city };
    group.add(marker);
    markers.push(marker);
  });

  let activeIndex = 0;
  let targetRotationY = 0;

  return {
    group,
    markers,
    update(elapsed: number) {
      globe.rotation.y = THREE.MathUtils.lerp(globe.rotation.y, targetRotationY, 0.02);
      globe.rotation.x = Math.sin(elapsed * 0.08) * 0.05;

      markers.forEach((marker, i) => {
        const scale = i === activeIndex ? 1.4 + Math.sin(elapsed * 3) * 0.15 : 1;
        marker.scale.setScalar(scale);
      });
    },
    setActiveIndex(index: number) {
      activeIndex = index;
      markers.forEach((marker, i) => {
        const mat = marker.material as THREE.MeshStandardMaterial;
        mat.color.setHex(i === index ? 0xff9398 : 0xffffff);
        mat.emissive.setHex(i === index ? 0xff9398 : 0xffffff);
      });
    },
    rotateToLocation(index: number) {
      const loc = locations[index];
      if (!loc) return;
      targetRotationY = (-loc.lng * Math.PI) / 180 + Math.PI;
      activeIndex = index;
      this.setActiveIndex(index);
    }
  };
}
