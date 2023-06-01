import { DirectionalLight } from 'three';

const useSetMainDirLight = (scope, color = '#ffffff', intensity = 0.8) => {
  scope.mainLight = new DirectionalLight(color, intensity);
  scope.mainLight.castShadow = true;
  scope.scene.add(scope.mainLight);
  return scope.mainLight;
};

export default useSetMainDirLight;
