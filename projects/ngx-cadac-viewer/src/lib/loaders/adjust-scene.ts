import {
  DirectionalLight,
  DoubleSide,
  MeshPhongMaterial,
  Vector3,
} from 'three';

const adjustScene = (scope, object) => {
  const maxMax = new Vector3(0, 0, 0);
  object.children.forEach((mesh: any) => {
    mesh.material = new MeshPhongMaterial({
      color: mesh.material.color,
      side: DoubleSide,
      transparent: true,
    });
    mesh.geometry.computeBoundingBox();
    const bboxMax = mesh.geometry.boundingBox.max;
    maxMax.x = Math.max(bboxMax.x, maxMax.x);
    maxMax.y = Math.max(bboxMax.y, maxMax.y);
    maxMax.z = Math.max(bboxMax.z, maxMax.z);
  });

  scope.camera.position.set(maxMax.x * 2, maxMax.y * 2, maxMax.z * 2);
  scope.camera.lookAt(0, 0, 0);
  const absMax = Math.max(maxMax.x, maxMax.y, maxMax.z);

  scope.toggleOrbitControls(true);
  scope.setLineSegments(object, '#046e00');
  // scope.camera.fov = 65;
  scope.camera.far = 100000;
  scope.camera.near = 0.1;
  // scope.camera.updateProjectionMatrix();
  scope.setAxisHelper(absMax + absMax / 3, 10);

  const lightXY = new DirectionalLight(0x888888);
  const lightZY = new DirectionalLight(0x888888);
  const positionConst = absMax;
  lightXY.position.set(positionConst, positionConst, 1);
  lightZY.position.set(
    positionConst * -1,
    positionConst * -1,
    positionConst * -1
  );
  scope.scene.add(lightXY);
  // scope.sceneShapes.push(object);
  scope.updateLightPosition();
  scope.updateCameraPosition();
};

export default adjustScene;
