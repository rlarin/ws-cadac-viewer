import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

const useToggleOrbitControls = (scope, active: boolean) => {
  if (active) {
    scope.orbitControls = new OrbitControls(
      scope.camera,
      scope.renderer.domElement
    );
    scope.orbitControls.enabled = active;
    scope.orbitControls.enableRotate = active;
    scope.orbitControls.enablePan = false;
    scope.orbitControls.enableZoom = active;
    scope.orbitControls.enableDamping = active; // an animation loop is required when either damping or auto-rotation are enabled
    scope.orbitControls.dampingFactor = 0.05;

    scope.orbitControls.listenToKeyEvents(window);
    scope.orbitControls.target.set(0, 1, 0);
    scope.orbitControls.update();
  } else {
    scope.orbitControls.dispose();
  }
};

export default useToggleOrbitControls;
