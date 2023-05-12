import { ElementRef } from '@angular/core';
import * as THREE from 'three';
import { Event } from 'three';

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
};

export type CadacMergeMesh = {
  mesh: THREE.Mesh;
  position: THREE.Vector3;
};

export type CadacClickObjectListenerData = {
  object: THREE.Object3D;
  callback: (event: Event, object?: THREE.Object3D) => void;
};

export type CadacThreeShape = THREE.Mesh | THREE.Line | THREE.Points;
