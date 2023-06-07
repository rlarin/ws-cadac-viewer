import { CadacPlanes, DEFAULTS_CADAC } from '../../models/types';
import { UnitsHelper } from '../units-helper';
import { AxesHelper, Vector3 } from 'three';
import anime from 'animejs/lib/anime.es';

const useUpdateCameraPosition = (
  scope,
  plane: CadacPlanes = CadacPlanes.XY
) => {
  scope.removeElementFromSceneByProp('uuid', scope.transformControls.uuid);
  scope.removeElementFromSceneByProp('uuid', scope.gridHelper.uuid);
  const boundingBox = UnitsHelper.getConvertedBoundingBox(scope.scene);
  const center = boundingBox.getCenter(new Vector3());
  const size = boundingBox.getSize(new Vector3());
  const maxDim = Math.max(size.x, size.y, size.z);
  const fov = scope.camera.fov * (Math.PI / 180);
  let cameraZ = Math.abs((maxDim / 4) * Math.tan(fov * 2));

  cameraZ *= 1.8; // zoom out a little so that objects don't fill the screen

  const cameraFinalPosition = scope.camera.position.clone();

  switch (plane) {
    case CadacPlanes.XY:
      cameraFinalPosition.z = cameraZ;
      cameraFinalPosition.x = center.x;
      cameraFinalPosition.y = center.y;
      break;
    case CadacPlanes.XZ:
      cameraFinalPosition.z = center.y;
      cameraFinalPosition.x = center.x;
      cameraFinalPosition.y = cameraZ;
      break;
    case CadacPlanes.YZ:
      cameraFinalPosition.z = center.x;
      cameraFinalPosition.x = cameraZ;
      cameraFinalPosition.y = center.y;
      break;
  }

  scope.axesHelper = new AxesHelper(maxDim * 2);
  scope.scene.add(scope.transformControls);
  scope.scene.add(scope.gridHelper);

  anime({
    targets: [scope.camera.position],
    y: cameraFinalPosition.y,
    x: cameraFinalPosition.x,
    z: cameraFinalPosition.z,
    easing: 'easeInOutQuad',
    duration: DEFAULTS_CADAC.ANIMATION_DURATION,
    update: () => {
      updateScene(scope, center);
    },
    complete: () => {
      updateScene(scope, center);
    },
  });
};

const updateScene = (scope, center) => {
  scope.camera.lookAt(center);
  scope.camera.updateProjectionMatrix();
  scope.transformControls.updateMatrix();
  scope.gridHelper.updateMatrix();
  scope.orbitControls.update();
};

export default useUpdateCameraPosition;
