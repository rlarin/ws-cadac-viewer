import * as THREE from 'three';
import { DirectionalLight } from 'three';

export const useLightHelper = (
  scene: THREE.Scene,
  light: THREE.Light,
  size: number
) => {
  if (light instanceof DirectionalLight) {
    const lightHelper = new THREE.DirectionalLightHelper(light, size);
    scene.add(lightHelper);
    return lightHelper;
  }

  return null;
};
