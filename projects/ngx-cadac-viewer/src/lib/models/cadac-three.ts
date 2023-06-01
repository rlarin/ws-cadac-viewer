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
import { UnitsHelper } from '../helpers/units-helper';
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
  useGetIntersects,
  useMergeMeshes,
} from '../helpers/shapes-helper';
import { TransformControls } from 'three/examples/jsm/controls/TransformControls.js';
import { useCreateRestrictedPlane } from '../helpers/planes-helper';
import { Subject } from 'rxjs';
import { debounce } from '../helpers/utils/utility-functions';
import { ObjCadacLoader, ObjCadacLoaderFromUrl } from '../loaders/obj-loader';
import PrimCadacLoader from '../loaders/prim-loader';
import MtlCadacLoader from '../loaders/mtl-loader';
import GltfCadacLoader from '../loaders/gltf-loader';
import anime from 'animejs/lib/anime.es.js';
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
    return useSetLineSegments(this, shape, color);
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
    const el = this.scene.children.find(child => child[prop] === value);
    if (el) {
      this.scene.remove(el);
    }
  }

  private updateCameraPosition(plane: CadacPlanes = CadacPlanes.XY) {
    this.removeElementFromSceneByProp('uuid', this.transformControls.uuid);
    this.removeElementFromSceneByProp('uuid', this.gridHelper.uuid);
    const boundingBox = UnitsHelper.getConvertedBoundingBox(this.scene);
    const center = boundingBox.getCenter(new Vector3());
    const size = boundingBox.getSize(new Vector3());
    const maxDim = Math.max(size.x, size.y, size.z);
    const fov = this.camera.fov * (Math.PI / 180);
    let cameraZ = Math.abs((maxDim / 4) * Math.tan(fov * 2));

    cameraZ *= 1.8; // zoom out a little so that objects don't fill the screen

    const cameraFinalPosition = this.camera.position.clone();

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

    this.axesHelper = new AxesHelper(maxDim * 2);
    this.scene.add(this.transformControls);
    this.scene.add(this.gridHelper);

    anime({
      targets: [this.camera.position],
      y: cameraFinalPosition.y,
      x: cameraFinalPosition.x,
      z: cameraFinalPosition.z,
      easing: 'easeInOutQuad',
      duration: DEFAULTS_CADAC.ANIMATION_DURATION,
      update: () => {
        this.camera.lookAt(center);
        this.camera.updateProjectionMatrix();
        this.transformControls.updateMatrix();
        this.gridHelper.updateMatrix();
        this.orbitControls.update();
      },
      complete: () => {
        console.log('Anime complete');
      },
    });
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
    if (document.activeElement?.tagName === 'body') {
      event.preventDefault();
      event.stopPropagation();
    }

    const axesHelper = this.scene.children.find(
      child => child.type === 'AxesHelper'
    );
    switch (event.key) {
      case 'a':
        axesHelper.visible = !axesHelper.visible;
        break;
      case 'g':
        this.gridHelper.visible = !this.gridHelper.visible;
        break;
      case 'x':
        this.transformControls.showX = !this.transformControls.showX;
        break;
      case 'y':
        this.transformControls.showY = !this.transformControls.showY;
        break;
      case 'z':
        this.transformControls.showZ = !this.transformControls.showZ;
        break;
      case 'r':
        this.transformControlsCurrentMode = CadacTransformControlsModes.ROTATE;
        this.transformControls.setMode(this.transformControlsCurrentMode);
        break;
      case 's':
        this.transformControlsCurrentMode = CadacTransformControlsModes.SCALE;
        this.transformControls.setMode(this.transformControlsCurrentMode);
        break;
      case 't':
        this.transformControlsCurrentMode =
          CadacTransformControlsModes.TRANSLATE;
        this.transformControls.setMode(this.transformControlsCurrentMode);
        break;
    }
  }

  private onDocumentMouseClick(event: MouseEvent) {
    for (let i = 0; i < this.sceneShapes.length; i++) {
      const shape = this.sceneShapes[i];
      this.toggleTransformControls(shape, false);
      const intersectedObject = useGetIntersects(
        event,
        shape,
        this.raycaster,
        this.scene,
        this.camera,
        this.elRef.nativeElement
      );

      if (intersectedObject) {
        this.selectedObject = this.scene.getObjectById(intersectedObject.id);
        const eventData = {
          payload: {
            object: this.selectedObject,
          },
          type: CadacEventDataTypes.OBJECT_SELECTED,
        };
        this.dispatchEvent(eventData);

        this.toggleTransformControls(this.selectedObject, true);
        this.eventSubject$.next(eventData);

        this.debouncedObjectChangedEmitter();
        break;
      } else {
        this.toggleTransformControls(this.selectedObject, false);
        const eventData = {
          payload: {
            object: this.selectedObject,
          },
          type: CadacEventDataTypes.OBJECT_UNSELECTED,
        };
        this.eventSubject$.next(eventData);
        this.dispatchEvent(eventData);
        this.selectedObject = null;
      }
    }
  }

  private createRestrictedPlane(
    plane: CadacPlanes,
    size = this.axesHelperSize,
    color = '#ff0000',
    opacity = 0.05
  ) {
    switch (plane) {
      case 'XY':
        this.restrictedQuadrants['XY'] = useCreateRestrictedPlane({
          size,
          color,
          opacity,
          position: new Vector3(15, 15, 0),
        });
        return this.restrictedQuadrants['XY'];
      case 'XZ':
        this.restrictedQuadrants['XZ'] = useCreateRestrictedPlane({
          size,
          color: '#ff0000',
          opacity: 0.05,
          position: new Vector3(15, 0, 15),
        }).rotateX(Math.PI / 2);
        return this.restrictedQuadrants['XZ'];
      case 'YZ':
        this.restrictedQuadrants['YZ'] = useCreateRestrictedPlane({
          size,
          color: '#ff0000',
          opacity: 0.05,
          position: new Vector3(0, 15, 15),
        }).rotateY(Math.PI / 2);
        return this.restrictedQuadrants['YZ'];
    }
  }

  private setRestrictedPlanes(XY?, YZ?, XZ?) {
    if (this.options.restrictToPositiveQuadrant?.XY) {
      // this.scene.add(this.restrictedQuadrants['XY']);
      this.scene.add(XY || this.createRestrictedPlane(CadacPlanes.XY));
    }

    if (this.options.restrictToPositiveQuadrant?.YZ) {
      // this.scene.add(this.restrictedQuadrants['YZ']);
      this.scene.add(YZ || this.createRestrictedPlane(CadacPlanes.YZ));
    }

    if (this.options.restrictToPositiveQuadrant?.XZ) {
      // this.scene.add(this.restrictedQuadrants['XZ']);
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
