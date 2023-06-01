import { Color, Fog, PCFSoftShadowMap, PerspectiveCamera, Scene } from 'three';
import { UnitsHelper } from '../units-helper';
import { DEFAULTS_CADAC } from '../../models/types';

const initScene = scope => {
  if (!scope.elRef.nativeElement) {
    return;
  }

  scope.scene = new Scene();
  const { near, far } = UnitsHelper.convertCameraUnits(
    DEFAULTS_CADAC.CAMERA_NEAR,
    DEFAULTS_CADAC.CAMERA_FAR,
    scope.options.defaultUnits
  );
  scope.camera = new PerspectiveCamera(
    DEFAULTS_CADAC.CAMERA_FOV,
    scope.elRef.nativeElement?.offsetWidth /
      scope.elRef.nativeElement?.offsetHeight,
    near,
    far
  );

  scope.renderer.shadowMap.enabled = true;
  scope.renderer.shadowMap.type = PCFSoftShadowMap;
  scope.renderer.setPixelRatio(window.devicePixelRatio);
  scope.renderer.setSize(
    scope.elRef.nativeElement?.offsetWidth,
    scope.elRef.nativeElement?.offsetHeight
  );

  scope.elRef.nativeElement.appendChild(scope.renderer.domElement);
  const { x, y, z } = UnitsHelper.convertCameraPosition(
    DEFAULTS_CADAC.CAMERA_POSITION.x,
    DEFAULTS_CADAC.CAMERA_POSITION.y,
    DEFAULTS_CADAC.CAMERA_POSITION.z,
    scope.options.defaultUnits
  );
  scope.camera.position.set(x, y, z);
  const {
    x: xLookAt,
    y: yLookAt,
    z: zLookAt,
  } = UnitsHelper.convertCameraPosition(
    DEFAULTS_CADAC.CAMERA_LOOK_AT.x,
    DEFAULTS_CADAC.CAMERA_LOOK_AT.y,
    DEFAULTS_CADAC.CAMERA_LOOK_AT.z,
    scope.options.defaultUnits
  );

  scope.camera.lookAt(xLookAt, yLookAt, zLookAt);

  scope.scene.background = new Color().set(
    scope.options.sceneBackground || DEFAULTS_CADAC.SCENE_BACKGROUND_COLOR
  );
  const { near: nearFog, far: farFog } = UnitsHelper.convertCameraUnits(
    1,
    5000,
    scope.options.defaultUnits
  );
  scope.scene.fog = new Fog(scope.scene.background, nearFog, farFog);
  scope.selectedObject = undefined;
  scope.sceneShapes = [];
  scope.orbitControls.enableDamping = true;
  scope.orbitControls.dampingFactor = 0.05;
  scope.setRestrictedPlanes();
  scope.registerEventListeners();
  scope.animate();
};

export default initScene;
