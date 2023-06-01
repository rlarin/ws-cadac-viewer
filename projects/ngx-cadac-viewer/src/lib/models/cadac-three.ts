import { ElementRef } from '@angular/core';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import {
  CadacCSGOperation,
  CadacEventData,
  CadacEventDataTypes,
  CadacMergeMesh,
  CadacThreeOptions,
  CadacThreeSceneOptions,
  CadacThreeShape,
  CadacThreeShapeRotation,
  CadacUnits,
  DEFAULTS_CADAC,
  CadacPlanes,
  CadacTransformControlsModes,
} from './types';
import {
  AmbientLight,
  AxesHelper,
  BufferGeometry,
  DirectionalLight,
  EventDispatcher,
  GridHelper,
  Group,
  Material,
  Mesh,
  Object3D,
  PerspectiveCamera,
  Raycaster,
  Scene,
  Vector3,
  WebGLRenderer,
} from 'three';
import {
  useCreateCapsule,
  useCreateCircle,
  useCreateCone,
  useCreateCube,
  useCreateCylinder,
  useCreatePlane,
  useCreateSphere,
  useCreateText,
  useCsgOperator,
  useMergeMeshes,
} from '../helpers/shapes-helper';
import { TransformControls } from 'three/examples/jsm/controls/TransformControls.js';
import { Subject } from 'rxjs';
import { debounce } from '../helpers/utils/utility-functions';
import { ObjCadacLoader, ObjCadacLoaderFromUrl } from '../loaders/obj-loader';
import PrimCadacLoader from '../loaders/prim-loader';
import MtlCadacLoader from '../loaders/mtl-loader';
import GltfCadacLoader from '../loaders/gltf-loader';
import updatePrimOpacity from '../helpers/primitives/update/update-prim-opacity';
import updatePrimColor from '../helpers/primitives/update/update-prim-color';
import updatePrimGeometry from '../helpers/primitives/update/update-prim-geometry';
import initScene from '../helpers/init/init-scene';
import useToggleOrbitControls from '../helpers/utils/use-toggle-orbit-controls';
import useToggleTransformControls from '../helpers/utils/use-toggle-transform-controls';
import useUpdateAxesHelper from '../helpers/utils/use-update-axes-helper';
import useSetAxesHelper from '../helpers/utils/use-set-axes-helper';
import useSetMainDirLight from '../helpers/utils/use-set-main-dir-light';
import useToggleGridHelper from '../helpers/utils/use-toggle-grid-helper';
import useSetGridHelper from '../helpers/utils/use-set-grid-helper';
import useSetLineSegments from '../helpers/utils/use-set-line-segments';
import useRemoveLineSegments from '../helpers/utils/use-remove-line-segments';
import updatePrimPosition from '../helpers/primitives/update/update-prim-position';
import useToggleRestrictedPlanes from '../helpers/utils/use-toggle-restricted-planes';
import useCreateSnapshot from '../helpers/utils/use-create-snapshot';
import useUpdateContainerSize from '../helpers/utils/use-update-container-size';
import useToggleSegmentLines from '../helpers/utils/use-toggle-segment-lines';
import useRemoveLineSegmentsProcessor from '../helpers/utils/use-remove-line-segments-processor';
import updatePrimPositionProcessor from '../helpers/primitives/update/update-prim-position-processor';
import useAnimate from '../helpers/utils/use-animate';
import useUpdateLightPosition from '../helpers/utils/use-update-light-position';
import useRemoveElFromSceneByProp from '../helpers/utils/use-remove-el-from-scene-by-prop';
import useUpdateCameraPosition from '../helpers/utils/use-update-camera-position';
import useDocumentKeydown from '../helpers/utils/use-document-keydown';
import useDocumentMouseClick from '../helpers/utils/use-document-mouse-click';
import useRestrictPlane from '../helpers/utils/use-restrict-plane';

export class CadacThree extends EventDispatcher {
  public selectedObject: CadacThreeShape | undefined = undefined;
  public renderer: WebGLRenderer = new WebGLRenderer({ antialias: true });
  public raycaster: Raycaster = new Raycaster();
  public scene: Scene = new Scene();
  public camera: PerspectiveCamera = new PerspectiveCamera();
  public elRef: ElementRef = new ElementRef(null);
  public eventSubject$: Subject<CadacEventData> = new Subject();
  public orbitControls: OrbitControls;
  public transformControls: TransformControls;
  public axesHelper: AxesHelper | undefined;
  public gridHelper: GridHelper | undefined;
  public options: CadacThreeSceneOptions = {
    elRef: this.elRef,
    renderer: this.renderer,
    camera: this.camera,
    scene: this.scene,
    sceneBackground: DEFAULTS_CADAC.SCENE_BACKGROUND_COLOR,
    defaultUnits: DEFAULTS_CADAC.UNIT,
    restrictToPositiveQuadrant: {
      XY: false,
      YZ: false,
      XZ: false,
    },
  };
  private axesHelperSize = DEFAULTS_CADAC.DEFAULT_AXES_SIZE;
  private sceneShapes: CadacThreeShape[] = [];
  private restrictedQuadrants: [] = [];
  private cameraUpdateTimeout: any;
  private transformControlsCurrentMode: CadacTransformControlsModes;
  private shapesToRotate: CadacThreeShapeRotation[] = [];
  private mainLight: DirectionalLight = new DirectionalLight(0xffffff, 1);
  private readonly UPDATE_CAMERA_TIMEOUT = 500;
  private tempProperties: { [key: string]: any } = {};
  private readonly debouncedObjectChangedEmitter;
  private eventKeydownHandlerRef = this.onDocumentKeydown.bind(this);
  private eventMouseClickHandlerRef = this.onDocumentMouseClick.bind(this);

  constructor(options?: CadacThreeOptions) {
    super();
    this.options = { ...this.options, ...options?.sceneOptions };
    DEFAULTS_CADAC.UNIT = this.options.defaultUnits || DEFAULTS_CADAC.UNIT;
    this.elRef = this.options.elRef || this.elRef;
    this.orbitControls = new OrbitControls(
      this.camera,
      this.renderer.domElement
    );
    this.transformControls = new TransformControls(
      this.camera,
      this.renderer.domElement
    );
    this.axesHelper = new AxesHelper(DEFAULTS_CADAC.DEFAULT_AXES_SIZE);
    this.gridHelper = new GridHelper(
      DEFAULTS_CADAC.DEFAULT_GRID_SIZE,
      DEFAULTS_CADAC.DEFAULT_GRID_SIZE
    );
    this.transformControlsCurrentMode = CadacTransformControlsModes.TRANSLATE;
    this.debouncedObjectChangedEmitter = debounce(
      this.handleObjectChangedEmitter.bind(this)
    );

    this.createRestrictedPlane(CadacPlanes.XY);
    this.createRestrictedPlane(CadacPlanes.YZ);
    this.createRestrictedPlane(CadacPlanes.XZ);
  }

  public get SceneShapes(): CadacThreeShape[] {
    return this.sceneShapes;
  }

  public addShapeToScene(shape: CadacThreeShape) {
    this.sceneShapes.push(shape);
  }

  public updateObjectOpacity(opacity: number, object?: CadacThreeShape) {
    return updatePrimOpacity(this, opacity, object);
  }

  public updateObjectColor(color: string, object?: CadacThreeShape) {
    return updatePrimColor(this, color, object);
  }

  public updateObjectGeometry(
    geometry: BufferGeometry,
    object?: CadacThreeShape
  ): void {
    return updatePrimGeometry(this, geometry, object);
  }

  public createScene(): void {
    return initScene(this);
  }

  public dispose() {
    this.renderer.dispose();
    this.orbitControls.dispose();
    this.removeEventListeners();
  }

  public createCube(
    width = 1,
    height = 1,
    depth = 1,
    color: string = DEFAULTS_CADAC.COLOR,
    addToScene = true,
    unit: CadacUnits = DEFAULTS_CADAC.UNIT,
    updateCameraPosition = true
  ) {
    const cube = useCreateCube(width, height, depth, color, unit);
    this.setLineSegments(cube, color);
    if (addToScene) {
      this.scene.add(cube);
      this.sceneShapes.push(cube);

      if (updateCameraPosition) {
        this.updateCameraPositionAfter();
      }
    }

    return cube;
  }

  public createSphere(
    radius = 1,
    color: string = DEFAULTS_CADAC.COLOR,
    addToScene = true,
    unit: CadacUnits = DEFAULTS_CADAC.UNIT,
    updateCameraPosition = true
  ) {
    const sphere = useCreateSphere(radius, color, unit);
    this.setLineSegments(sphere, color);
    if (addToScene) {
      this.scene.add(sphere);
      this.sceneShapes.push(sphere);

      if (updateCameraPosition) {
        this.updateCameraPositionAfter();
      }
    }

    return sphere;
  }

  public createCone(
    radius = 1,
    height = 1,
    radialSegments = 8,
    color: string = DEFAULTS_CADAC.COLOR,
    addToScene = true,
    unit: CadacUnits = DEFAULTS_CADAC.UNIT,
    updateCameraPosition = true
  ) {
    const cone = useCreateCone(radius, height, radialSegments, color, unit);
    this.setLineSegments(cone, color);
    if (addToScene) {
      this.scene.add(cone);
      this.sceneShapes.push(cone);

      if (updateCameraPosition) {
        this.updateCameraPositionAfter();
      }
    }

    return cone;
  }

  public createCylinder(
    radiusTop = 1,
    radiusBottom = 1,
    height = 1,
    radialSegments = 8,
    color: string = DEFAULTS_CADAC.COLOR,
    addToScene = true,
    unit: CadacUnits = DEFAULTS_CADAC.UNIT,
    updateCameraPosition = true
  ) {
    const cylinder = useCreateCylinder(
      radiusTop,
      radiusBottom,
      height,
      radialSegments,
      color,
      unit
    );
    this.setLineSegments(cylinder, color);
    if (addToScene) {
      this.scene.add(cylinder);
      this.sceneShapes.push(cylinder);

      if (updateCameraPosition) {
        this.updateCameraPositionAfter();
      }
    }

    return cylinder;
  }

  public createCapsule(
    radius = 1,
    height = 1,
    capSegments = 8,
    radialSegments = 8,
    color: string = DEFAULTS_CADAC.COLOR,
    addToScene = true,
    unit: CadacUnits = DEFAULTS_CADAC.UNIT,
    updateCameraPosition = true
  ) {
    const capsule = useCreateCapsule(
      radius,
      height,
      capSegments,
      radialSegments,
      color,
      unit
    );
    this.setLineSegments(capsule, color);
    if (addToScene) {
      this.scene.add(capsule);
      this.sceneShapes.push(capsule);

      if (updateCameraPosition) {
        this.updateCameraPositionAfter();
      }
    }

    return capsule;
  }

  public createCircle(
    radius = 1,
    segments = 32,
    color: string = DEFAULTS_CADAC.COLOR,
    addToScene = true,
    unit: CadacUnits = DEFAULTS_CADAC.UNIT,
    updateCameraPosition = true
  ) {
    const circle = useCreateCircle(radius, segments, color, unit);
    this.setLineSegments(circle, color);
    if (addToScene) {
      this.scene.add(circle);
      this.sceneShapes.push(circle);

      if (updateCameraPosition) {
        this.updateCameraPositionAfter();
      }
    }

    return circle;
  }

  public createPlane(
    width = 1,
    height = 1,
    color: string = DEFAULTS_CADAC.COLOR,
    addToScene = true,
    unit: CadacUnits = DEFAULTS_CADAC.UNIT,
    updateCameraPosition = true
  ) {
    const plane = useCreatePlane(width, height, color, unit);
    this.setLineSegments(plane, color);
    if (addToScene) {
      this.scene.add(plane);
      this.sceneShapes.push(plane);

      if (updateCameraPosition) {
        this.updateCameraPositionAfter();
      }
    }

    return plane;
  }

  public mergeMeshes(
    meshes: CadacMergeMesh[],
    color: string = DEFAULTS_CADAC.COLOR,
    addToScene = true,
    updateCameraPosition = true
  ) {
    const mergedMesh = useMergeMeshes(meshes, color);
    this.setLineSegments(mergedMesh, color);
    if (addToScene) {
      this.scene.add(mergedMesh);
      this.sceneShapes.push(mergedMesh);

      if (updateCameraPosition) {
        this.updateCameraPositionAfter();
      }
    }

    return mergedMesh;
  }

  public csgSubtract(
    meshes1: CadacMergeMesh,
    meshes2: CadacMergeMesh,
    operation: CadacCSGOperation = CadacCSGOperation.SUBTRACT,
    color: string = DEFAULTS_CADAC.COLOR,
    addToScene = true,
    updateCameraPosition = true
  ) {
    const subRes = useCsgOperator(meshes1, meshes2, operation, color);
    this.setLineSegments(subRes, color);

    if (addToScene) {
      this.scene.add(subRes);
      this.sceneShapes.push(subRes);

      if (updateCameraPosition) {
        this.updateCameraPositionAfter();
      }
    }

    return subRes;
  }

  public csgIntersect(
    meshes1: CadacMergeMesh,
    meshes2: CadacMergeMesh,
    operation: CadacCSGOperation = CadacCSGOperation.SUBTRACT,
    color: string = DEFAULTS_CADAC.COLOR,
    addToScene = true,
    updateCameraPosition = true
  ) {
    const intRes = useCsgOperator(meshes1, meshes2, operation, color);
    this.setLineSegments(intRes, color);

    if (addToScene) {
      this.scene.add(intRes);
      this.sceneShapes.push(intRes);

      if (updateCameraPosition) {
        this.updateCameraPositionAfter();
      }
    }

    return intRes;
  }

  public csgUnion(
    meshes1: CadacMergeMesh,
    meshes2: CadacMergeMesh,
    operation: CadacCSGOperation = CadacCSGOperation.UNION,
    color: string = DEFAULTS_CADAC.COLOR,
    addToScene = true,
    updateCameraPosition = true
  ) {
    const unionRes = useCsgOperator(meshes1, meshes2, operation, color);
    this.setLineSegments(unionRes, color);

    if (addToScene) {
      this.scene.add(unionRes);
      this.sceneShapes.push(unionRes);

      if (updateCameraPosition) {
        this.updateCameraPositionAfter();
      }
    }

    return unionRes;
  }

  public createText(
    text: string,
    fontSize = 1,
    position: Vector3 = new Vector3(0, 0, 0),
    color: string = DEFAULTS_CADAC.COLOR,
    addToScene = true,
    updateCameraPosition = true
  ) {
    const textMesh = useCreateText(text, fontSize, position, color);
    this.setLineSegments(textMesh, color);

    if (addToScene) {
      this.scene.add(textMesh);
      this.sceneShapes.push(textMesh);

      if (updateCameraPosition) {
        this.updateCameraPositionAfter();
      }
    }

    return textMesh;
  }

  public toggleOrbitControls(active: boolean) {
    return useToggleOrbitControls(this, active);
  }

  public toggleTransformControls(mesh: Object3D | undefined, active: boolean) {
    return useToggleTransformControls(this, mesh, active);
  }

  /**
   * This light globally illuminates all objects in the scene equally.
   * @param color
   * @param intensity
   */
  public setAmbientLight(color = '#ffffff', intensity = 0.5) {
    const ambientLight = new AmbientLight(color, intensity);
    this.scene.add(ambientLight);
  }

  public updateAxesHelper(size?, fontSize?) {
    return useUpdateAxesHelper(this, size, fontSize);
  }

  public setAxesHelper(size, fontSize = 1) {
    return useSetAxesHelper(this, size, fontSize);
  }

  /**
   * Create a DirectionalLight and turn on shadows for the light
   * @param color
   * @param intensity
   */
  public setMainDirectionalLight(color = '#ffffff', intensity = 0.8) {
    return useSetMainDirLight(this, color, intensity);
  }

  public animateShapeRotation(
    shape: Mesh,
    xSpeed = 0.001,
    ySpeed = 0.001,
    zSpeed = 0.001
  ) {
    this.shapesToRotate.push({ shape, xSpeed, ySpeed, zSpeed });
  }

  public updateGridHelper() {
    this.setGridHelper();
  }

  public toggleGridHelper(visible?) {
    return useToggleGridHelper(this, visible);
  }

  public setGridHelper(
    size?,
    divisions?,
    color1 = DEFAULTS_CADAC.DEFAULT_GRID_COLOR1,
    color2 = DEFAULTS_CADAC.DEFAULT_GRID_COLOR2
  ) {
    return useSetGridHelper(this, size, divisions, color1, color2);
  }

  public setLineSegments(shape: CadacThreeShape, color = '#a4a4a4') {
    return useSetLineSegments(shape, color);
  }

  public removeLineSegments(shape: CadacThreeShape) {
    return useRemoveLineSegments(this, shape);
  }

  public loadPrimModel(
    { content, filename }: { content: string; filename: string },
    callback?: (obj: Group) => void
  ) {
    PrimCadacLoader(this, { content, filename }, callback);
  }

  public loadMtlModel(
    { content, filename }: { content: string; filename: string },
    callback?: (obj: Group) => void
  ) {
    MtlCadacLoader(this, this.selectedObject, { content, filename }, callback);
  }

  public loadObjModel(
    { content, filename }: { content: string; filename: string },
    callback?: (obj: Group) => void
  ) {
    ObjCadacLoader(this, { content, filename }, callback);
  }

  public loadObjModelFromUrl(
    { baseUrl, objName },
    callback?: (obj: Group) => void,
    progress?: (xhr: ProgressEvent<EventTarget>) => void
  ) {
    ObjCadacLoaderFromUrl(this, { baseUrl, objName }, callback, progress);
  }

  public loadGltfModelFromUrl(
    { baseUrl, objName },
    callback?: (obj: Group) => void,
    progress?: (xhr: ProgressEvent<EventTarget>) => void
  ) {
    GltfCadacLoader(this, { baseUrl, objName }, callback, progress);
  }

  public updateObjectPosition() {
    return updatePrimPosition(this);
  }

  public toggleRestrictedPlanes(planes: CadacPlanes[]) {
    return useToggleRestrictedPlanes(this, planes);
  }

  public createSnapshot() {
    return useCreateSnapshot(this);
  }

  public setCameraToPlane(plane: CadacPlanes) {
    this.updateCameraPosition(plane);
  }

  public updateSceneCameraPosition(delay = this.UPDATE_CAMERA_TIMEOUT) {
    this.updateCameraPositionAfter(delay);
  }

  public updateContainerSize() {
    return useUpdateContainerSize(this);
  }

  public toggleSegmentLines(value: boolean) {
    return useToggleSegmentLines(this, value);
  }

  private updateCameraPositionAfter(delay = this.UPDATE_CAMERA_TIMEOUT) {
    clearTimeout(this.cameraUpdateTimeout);
    this.cameraUpdateTimeout = setTimeout(() => {
      this.updateCameraPosition();
    }, delay);
  }

  private setLineSegmentsProcessor(shape: CadacThreeShape, color = '#a4a4a4') {
    return useSetLineSegments(shape, color);
  }

  private removeLineSegmentsProcessor(shape: CadacThreeShape) {
    return useRemoveLineSegmentsProcessor(shape);
  }

  private updateObjectPositionProcessor(object) {
    return updatePrimPositionProcessor(this, object);
  }

  private animate() {
    return useAnimate(this);
  }

  private updateLightPosition() {
    return useUpdateLightPosition(this);
  }

  private removeElementFromSceneByProp(prop: string, value) {
    return useRemoveElFromSceneByProp(this, prop, value);
  }

  private updateCameraPosition(plane: CadacPlanes = CadacPlanes.XY) {
    return useUpdateCameraPosition(this, plane);
  }

  private registerEventListeners() {
    this.removeEventListeners();
    window.addEventListener('keydown', this.eventKeydownHandlerRef);
    this.renderer.domElement.addEventListener(
      'click',
      this.eventMouseClickHandlerRef
    );
  }

  private removeEventListeners() {
    window.removeEventListener('keydown', this.eventKeydownHandlerRef);
    this.renderer.domElement.removeEventListener(
      'click',
      this.eventMouseClickHandlerRef
    );
  }

  private tcObjectChangeListener() {
    this.updateObjectPosition();
  }

  private tcMouseDownListenerProcessor(object) {
    const material = (object as Mesh)?.material as Material;
    if (material) {
      material.transparent = true;
      this.tempProperties[object.uuid] = material.opacity;
      material.opacity = 0.5;
    }
  }

  private tcMouseDownListener() {
    this.toggleOrbitControls(false);
    if (this.selectedObject.isGroup) {
      (this.selectedObject as Group).children.forEach(child => {
        this.tcMouseDownListenerProcessor(child);
      });
    } else {
      this.tcMouseDownListenerProcessor(this.selectedObject);
    }
  }

  private tcMouseUpListenerProcessor(object) {
    const material = (object as Mesh)?.material as Material;
    if (material) {
      material.opacity = this.tempProperties[object.uuid];
      delete this.tempProperties[object.uuid];
    }
  }

  private tcMouseUpListener() {
    this.toggleOrbitControls(true);
    if (this.selectedObject.isGroup) {
      (this.selectedObject as Group).children.forEach(child => {
        this.tcMouseUpListenerProcessor(child);
      });
    } else {
      this.tcMouseUpListenerProcessor(this.selectedObject);
    }
  }

  private onDocumentKeydown(event: KeyboardEvent) {
    return useDocumentKeydown(this, event);
  }

  private onDocumentMouseClick(event: MouseEvent) {
    return useDocumentMouseClick(this, event);
  }

  private createRestrictedPlane(
    plane: CadacPlanes,
    size = this.axesHelperSize,
    color = DEFAULTS_CADAC.DEFAULT_RESTRICTED_PLANE_COLOR,
    opacity = DEFAULTS_CADAC.DEFAULT_RESTRICTED_PLANE_OPACITY
  ) {
    return useRestrictPlane(this, plane, size, color, opacity);
  }

  private setRestrictedPlanes(XY?, YZ?, XZ?) {
    if (this.options.restrictToPositiveQuadrant?.XY) {
      this.scene.add(XY || this.createRestrictedPlane(CadacPlanes.XY));
    }

    if (this.options.restrictToPositiveQuadrant?.YZ) {
      this.scene.add(YZ || this.createRestrictedPlane(CadacPlanes.YZ));
    }

    if (this.options.restrictToPositiveQuadrant?.XZ) {
      this.scene.add(XZ || this.createRestrictedPlane(CadacPlanes.XZ));
    }
  }

  private updateRestrictedPlanes() {
    this.scene.remove(this.restrictedQuadrants['XY']);
    this.scene.remove(this.restrictedQuadrants['YZ']);
    this.scene.remove(this.restrictedQuadrants['XZ']);
    this.setRestrictedPlanes();
  }

  private handleObjectChangedEmitter() {
    this.eventSubject$.next({
      type: CadacEventDataTypes.OBJECT_CHANGED,
      payload: {
        object: this.selectedObject,
      },
    });
  }
}
