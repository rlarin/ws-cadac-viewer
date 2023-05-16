import { ElementRef } from '@angular/core';
import * as THREE from 'three';
import { BoxGeometry, CylinderGeometry, Event, SphereGeometry } from 'three';
import { Geometry } from 'three/examples/jsm/deprecated/Geometry';

export type CadacThreeShapeRotation = {
  shape: CadacThreeShape;
  xSpeed: number;
  ySpeed: number;
  zSpeed: number;
};

export enum CadacUnits {
  mm = 'mm', // default
  cm = 'cm',
  m = 'm',
  inch = 'inch',
  km = 'km',
}

export enum CadacCSGOperation {
  SUBTRACT = 'SUBTRACT',
  INTERSECT = 'INTERSECT',
  UNION = 'UNION',
}

export const DEFAULTS_CADAC = {
  UNIT: CadacUnits.mm,
  COLOR: '#f4f4f4',
  CAMERA_NEAR: 0.1,
  CAMERA_FAR: 1000,
  CAMERA_FOV: 50,
  CAMERA_POSITION: new THREE.Vector3(0, 10, 20),
  CAMERA_LOOK_AT: new THREE.Vector3(0, 0, 0),
};

export enum CadacPlanes {
  XY = 'XY',
  YZ = 'YZ',
  XZ = 'XZ',
}

export type CadacThreeOptions = {
  defaultUnits?: CadacUnits;
  elRef?: ElementRef;
  sceneOptions?: CadacThreeSceneOptions;
};

export type CadacThreeSceneOptions = {
  elRef?: ElementRef;
  scene?: THREE.Scene;
  camera?: THREE.PerspectiveCamera;
  renderer?: THREE.WebGLRenderer;
  sceneBackground: string;
  defaultUnits?: CadacUnits;
  restrictToPositiveQuadrant?: {
    XY: boolean;
    YZ: boolean;
    XZ: boolean;
  };
};

export type CadacMergeMesh = {
  mesh: THREE.Mesh;
  position: THREE.Vector3;
};

export type CadacObjectData = {
  object: CadacThreeShape;
  position?: THREE.Vector3;
  rotation?: THREE.Euler;
  scale?: THREE.Vector3;
  geometry?: BoxGeometry | SphereGeometry | CylinderGeometry | Geometry;
};

export type CadacClickObjectListenerData = {
  object: THREE.Object3D;
  callback: (event: Event, object?: THREE.Object3D) => void;
};

export enum CadacEventDataTypes {
  OBJECT_SELECTED = 'OBJECT_SELECTED',
  OBJECT_CHANGED = 'OBJECT_CHANGED',
  TOGGLE_RESTRICTED_PLANE = 'TOGGLE_RESTRICTED_PLANE',
}

export type CadacEventData = {
  type: CadacEventDataTypes;
  payload?: any;
};

export type CadacThreeShape =
  | THREE.Mesh
  | THREE.Line
  | THREE.Points
  | THREE.Object3D
  | any;
