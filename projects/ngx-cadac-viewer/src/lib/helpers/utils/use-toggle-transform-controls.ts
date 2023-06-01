import { Object3D } from 'three';
import { TransformControls } from 'three/examples/jsm/controls/TransformControls.js';

const useToggleTransformControls = (
  scope,
  mesh: Object3D | undefined,
  active: boolean
) => {
  if (mesh) {
    if (active) {
      scope.transformControls = new TransformControls(
        scope.camera,
        scope.renderer.domElement
      );
      scope.transformControls.enabled = active;
      scope.transformControls.setMode(scope.transformControlsCurrentMode);
      scope.transformControls.setTranslationSnap(1);
      scope.transformControls.attach(mesh);
      scope.transformControls.addEventListener(
        'mouseDown',
        scope.tcMouseDownListener.bind(scope)
      );
      scope.transformControls.addEventListener(
        'mouseUp',
        scope.tcMouseUpListener.bind(scope)
      );
      scope.transformControls.addEventListener(
        'objectChange',
        scope.tcObjectChangeListener.bind(scope)
      );
      scope.scene.add(scope.transformControls);
    } else {
      scope.transformControls.removeEventListener(
        'mouseDown',
        scope.tcMouseDownListener.bind(scope)
      );
      scope.transformControls.removeEventListener(
        'mouseUp',
        scope.tcMouseUpListener.bind(scope)
      );
      scope.transformControls.detach();
      scope.transformControls.remove(mesh);
      scope.scene.remove(scope.transformControls);
    }
  }
};

export default useToggleTransformControls;
