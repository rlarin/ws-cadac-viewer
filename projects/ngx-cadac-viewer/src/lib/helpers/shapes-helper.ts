import {
  CadacCSGOperation,
  CadacMergeMesh,
  CadacUnits,
  DEFAULTS_CADAC,
} from '../models/types';
import { UnitsHelper } from './units-helper';
import {
  BoxGeometry,
  BufferGeometry,
  CapsuleGeometry,
  CircleGeometry,
  ConeGeometry,
  CylinderGeometry,
  DoubleSide,
  Mesh,
  MeshBasicMaterial,
  MeshPhongMaterial,
  Object3D,
  PerspectiveCamera,
  PlaneGeometry,
  Raycaster,
  Scene,
  SphereGeometry,
  Vector2,
  Vector3,
} from 'three';
import * as BufferGeometryUtils from 'three/examples/jsm/utils/BufferGeometryUtils.js';
import { CSG } from 'three-csg-ts';

import { Text } from 'troika-three-text';

export const useCreateCube = (
  width = 1,
  height = 1,
  depth = 1,
  color: string = DEFAULTS_CADAC.COLOR,
  unit: CadacUnits = DEFAULTS_CADAC.UNIT
) => {
  const {
    width: convertedWidth,
    height: convertedHeight,
    depth: convertedDepth,
  } = UnitsHelper.convertCubeUnits(width, height, depth, unit);

  const geometry = new BoxGeometry(
    convertedWidth,
    convertedHeight,
    convertedDepth
  );
  const material = new MeshBasicMaterial({ color, transparent: true });
  const cube = new Mesh(geometry, material);
  cube.castShadow = true;
  cube.receiveShadow = false;

  return cube;
};

export const useCreateSphere = (
  radius = 1,
  color: string = DEFAULTS_CADAC.COLOR,
  unit: CadacUnits = DEFAULTS_CADAC.UNIT
) => {
  const { radius: convertedRadius } = UnitsHelper.convertSphereUnits(
    radius,
    unit
  );

  const geometry = new SphereGeometry(convertedRadius);
  const material = new MeshBasicMaterial({ color, transparent: true });
  const sphere = new Mesh(geometry, material);
  sphere.castShadow = true;
  sphere.receiveShadow = true;

  return sphere;
};

export const useCreateCone = (
  radius = 1,
  height = 1,
  radialSegments = 8,
  color: string = DEFAULTS_CADAC.COLOR,
  unit: CadacUnits = DEFAULTS_CADAC.UNIT
) => {
  const { radius: convertedRadius, height: convertedHeight } =
    UnitsHelper.convertConeUnits(radius, height, unit);

  const geometry = new ConeGeometry(
    convertedRadius,
    convertedHeight,
    radialSegments
  );
  const material = new MeshBasicMaterial({ color, transparent: true });
  const cone = new Mesh(geometry, material);
  cone.castShadow = true;
  cone.receiveShadow = true;

  return cone;
};

export const useCreateCylinder = (
  radiusTop = 1,
  radiusBottom = 1,
  height = 1,
  radialSegments = 8,
  color: string = DEFAULTS_CADAC.COLOR,
  unit: CadacUnits = DEFAULTS_CADAC.UNIT
) => {
  const {
    radiusTop: convertedRadiusTop,
    radiusBottom: convertedRadiusBottom,
    height: convertedHeight,
  } = UnitsHelper.convertCylinderUnits(radiusTop, radiusBottom, height, unit);

  const geometry = new CylinderGeometry(
    convertedRadiusTop,
    convertedRadiusBottom,
    convertedHeight,
    radialSegments
  );
  const material = new MeshBasicMaterial({ color, transparent: true });
  const cylinder = new Mesh(geometry, material);
  cylinder.castShadow = true;
  cylinder.receiveShadow = true;

  return cylinder;
};

export const useCreateCapsule = (
  radius = 1,
  length = 1,
  capSegments = 8,
  radialSegments = 8,
  color: string = DEFAULTS_CADAC.COLOR,
  unit: CadacUnits = DEFAULTS_CADAC.UNIT
) => {
  const { radius: convertedRadius, length: convertedLength } =
    UnitsHelper.convertCapsuleUnits(radius, length, unit);
  const geometry = new CapsuleGeometry(
    convertedRadius,
    convertedLength,
    capSegments,
    radialSegments
  );
  const material = new MeshBasicMaterial({ color, transparent: true });
  const capsule = new Mesh(geometry, material);
  capsule.castShadow = true;
  capsule.receiveShadow = true;

  return capsule;
};

export const useCreateCircle = (
  radius = 1,
  segments = 8,
  color: string = DEFAULTS_CADAC.COLOR,
  unit: CadacUnits = DEFAULTS_CADAC.UNIT
) => {
  const { radius: convertedRadius } = UnitsHelper.convertCircleUnits(
    radius,
    unit
  );

  const geometry = new CircleGeometry(
    convertedRadius,
    segments,
    0,
    Math.PI * 2
  );
  const material = new MeshBasicMaterial({
    color,
    side: DoubleSide,
    transparent: true,
  });
  const circle = new Mesh(geometry, material);
  circle.castShadow = true;
  circle.receiveShadow = true;

  return circle;
};

export const useCreatePlane = (
  width = 1,
  height = 1,
  color: string = DEFAULTS_CADAC.COLOR,
  unit: CadacUnits = DEFAULTS_CADAC.UNIT
) => {
  const { width: convertedWidth, height: convertedHeight } =
    UnitsHelper.convertPlaneUnits(width, height, unit);

  const geometry = new PlaneGeometry(convertedWidth, convertedHeight);
  const material = new MeshBasicMaterial({
    color,
    side: DoubleSide,
    transparent: true,
  });
  const plane = new Mesh(geometry, material);
  plane.castShadow = true;
  plane.receiveShadow = true;

  return plane;
};

export const useMergeMeshes = (
  meshes: CadacMergeMesh[],
  color: string = DEFAULTS_CADAC.COLOR
) => {
  const mergedGeometry = new BufferGeometry();
  const mergedMaterial = new MeshPhongMaterial({ color, transparent: true });
  const mergedMesh = new Mesh(mergedGeometry, mergedMaterial);

  const geometries = meshes.map(meshObj => {
    const { x, y, z } = meshObj.position;
    meshObj.mesh.position.set(x, y, z);
    meshObj.mesh.updateMatrix();
    meshObj.mesh.geometry.applyMatrix4(meshObj.mesh.matrix);

    return meshObj.mesh.geometry;
  });

  const mergedGeometryBuffer = BufferGeometryUtils.mergeGeometries(geometries);
  mergedGeometryBuffer.computeBoundingSphere();
  mergedGeometryBuffer.computeBoundingBox();
  mergedGeometryBuffer.computeVertexNormals();
  mergedGeometry.copy(mergedGeometryBuffer);

  return mergedMesh;
};

export const useGetIntersects = (
  event: MouseEvent,
  object: Object3D,
  raycaster: Raycaster,
  scene: Scene,
  camera: PerspectiveCamera,
  container: HTMLDivElement,
  callback?: (event: Event, object?: Object3D) => void
) => {
  const objectId = object.uuid;
  const mouse = new Vector2();
  mouse.x =
    ((event.clientX - container.offsetLeft) / container.offsetWidth) * 2 - 1;
  mouse.y =
    -((event.clientY - container.offsetTop) / container.offsetHeight) * 2 + 1;
  raycaster.setFromCamera(mouse, camera);
  const intersects = raycaster.intersectObjects(scene.children, false);
  const intersectedObject = intersects.find(
    intersectedEl => intersectedEl.object.uuid === objectId
  );
  if (intersectedObject?.object) {
    if (callback) {
      callback(event, intersectedObject?.object);
    }
  }

  return intersectedObject?.object;
};

export const useCsgOperator = (
  meshData1: CadacMergeMesh,
  meshData2: CadacMergeMesh,
  operator: CadacCSGOperation = CadacCSGOperation.SUBTRACT,
  color: string = DEFAULTS_CADAC.COLOR
) => {
  const { mesh: mesh1 } = meshData1;
  const { mesh: mesh2 } = meshData2;

  mesh1.position.set(
    meshData1.position.x,
    meshData1.position.y,
    meshData1.position.z
  );
  mesh1.updateMatrix();

  mesh2.position.set(
    meshData2.position.x,
    meshData2.position.y,
    meshData2.position.z
  );
  mesh2.updateMatrix();

  let resultShape = new Mesh();

  switch (operator) {
    case CadacCSGOperation.SUBTRACT:
      resultShape = CSG.subtract(mesh1, mesh2);
      break;
    case CadacCSGOperation.UNION:
      resultShape = CSG.union(mesh1, mesh2);
      break;
    case CadacCSGOperation.INTERSECT:
      resultShape = CSG.intersect(mesh1, mesh2);
      break;
  }

  resultShape.castShadow = true;
  resultShape.receiveShadow = true;
  resultShape.material = new MeshPhongMaterial({ color, transparent: true });

  return resultShape;
};

export const useCreateText = (
  text = 'Hello CADAC',
  fontSize = 1,
  position: Vector3 = new Vector3(0, 0, 0),
  color: string = DEFAULTS_CADAC.COLOR
) => {
  const textObject = new Text();
  textObject.text = text;
  textObject.fontSize = fontSize;
  textObject.position.set(position.x, position.y, position.z);
  textObject.color = color;

  return textObject;
};
