import {
  CadacCSGOperation,
  CadacMergeMesh,
  CadacUnits,
  DEFAULTS_CADAC,
} from '../models/types';
import { Object3D, PerspectiveCamera, Raycaster, Scene, Vector3 } from 'three';
import createCube from './primitives/create-cube';
import createSphere from './primitives/create-sphere';
import createCone from './primitives/create-cone';
import createCylinder from './primitives/create-cylinder';
import createCapsule from './primitives/create-capsule';
import createCircle from './primitives/create-circle';
import createPlane from './primitives/create-plane';
import mergeMeshes from './utils/merge-meshes';
import getIntersects from './utils/get-intersects';
import csgOperator from './csg/csg-operator';
import createText from './primitives/create-text';

export const useCreateCube = (
  width = 1,
  height = 1,
  depth = 1,
  color: string = DEFAULTS_CADAC.COLOR,
  unit: CadacUnits = DEFAULTS_CADAC.UNIT
) => {
  return createCube(width, height, depth, color, unit);
};

export const useCreateSphere = (
  radius = 1,
  color: string = DEFAULTS_CADAC.COLOR,
  unit: CadacUnits = DEFAULTS_CADAC.UNIT
) => {
  return createSphere(radius, color, unit);
};

export const useCreateCone = (
  radius = 1,
  height = 1,
  radialSegments = 8,
  color: string = DEFAULTS_CADAC.COLOR,
  unit: CadacUnits = DEFAULTS_CADAC.UNIT
) => {
  return createCone(radius, height, radialSegments, color, unit);
};

export const useCreateCylinder = (
  radiusTop = 1,
  radiusBottom = 1,
  height = 1,
  radialSegments = 8,
  color: string = DEFAULTS_CADAC.COLOR,
  unit: CadacUnits = DEFAULTS_CADAC.UNIT
) => {
  return createCylinder(
    radiusTop,
    radiusBottom,
    height,
    radialSegments,
    color,
    unit
  );
};

export const useCreateCapsule = (
  radius = 1,
  length = 1,
  capSegments = 8,
  radialSegments = 8,
  color: string = DEFAULTS_CADAC.COLOR,
  unit: CadacUnits = DEFAULTS_CADAC.UNIT
) => {
  return createCapsule(
    radius,
    length,
    capSegments,
    radialSegments,
    color,
    unit
  );
};

export const useCreateCircle = (
  radius = 1,
  segments = 8,
  color: string = DEFAULTS_CADAC.COLOR,
  unit: CadacUnits = DEFAULTS_CADAC.UNIT
) => {
  return createCircle(radius, segments, color, unit);
};

export const useCreatePlane = (
  width = 1,
  height = 1,
  color: string = DEFAULTS_CADAC.COLOR,
  unit: CadacUnits = DEFAULTS_CADAC.UNIT
) => {
  return createPlane(width, height, color, unit);
};

export const useMergeMeshes = (
  meshes: CadacMergeMesh[],
  color: string = DEFAULTS_CADAC.COLOR
) => {
  return mergeMeshes(meshes, color);
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
  return getIntersects(
    event,
    object,
    raycaster,
    scene,
    camera,
    container,
    callback
  );
};

export const useCsgOperator = (
  meshData1: CadacMergeMesh,
  meshData2: CadacMergeMesh,
  operator: CadacCSGOperation = CadacCSGOperation.SUBTRACT,
  color: string = DEFAULTS_CADAC.COLOR
) => {
  return csgOperator(meshData1, meshData2, operator, color);
};

export const useCreateText = (
  text = DEFAULTS_CADAC.DEFAULT_TEXT,
  fontSize = DEFAULTS_CADAC.DEFAULT_FONT_SIZE,
  position: Vector3 = new Vector3(0, 0, 0),
  color: string = DEFAULTS_CADAC.COLOR
) => {
  return createText(text, fontSize, position, color);
};
