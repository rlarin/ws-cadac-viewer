import { ElementRef } from '@angular/core';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import {
  CadacClickObjectListenerData,
  CadacCSGOperation,
  CadacMergeMesh,
  CadacThreeOptions,
  CadacThreeSceneOptions,
  CadacThreeShape,
  CadacThreeShapeRotation,
  CadacUnits,
  DEFAULTS_CADAC,
} from './types';
import { UnitsHelper } from '../helpers/units-helper';
import {
  AmbientLight,
  AxesHelper,
  Color,
  DirectionalLight,
  EdgesGeometry,
  Fog,
  GridHelper,
  Group,
  LineBasicMaterial,
  LineSegments,
  Material,
  Mesh,
  Object3D,
  PCFSoftShadowMap,
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
import * as Troika from 'troika-three-text';
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader';

export class CadacThree {
  public selectedObject: Object3D | undefined = undefined;
  public renderer: WebGLRenderer = new WebGLRenderer({ antialias: true });
  public raycaster: Raycaster = new Raycaster();
  public scene: Scene = new Scene();
  public camera: PerspectiveCamera = new PerspectiveCamera();
  public elRef: ElementRef = new ElementRef(null);
  public orbitControls: OrbitControls = new OrbitControls(
    this.camera,
    this.renderer.domElement
  );
  public transformControls: TransformControls = new TransformControls(
    this.camera,
    this.renderer.domElement
  );
  public axesHelper: AxesHelper | undefined = new AxesHelper(15);
  public gridHelper: GridHelper = new GridHelper(100, 100);
  public options: CadacThreeSceneOptions = {
    elRef: this.elRef,
    renderer: this.renderer,
    camera: this.camera,
    scene: this.scene,
    sceneBackground: '#363636',
    defaultUnits: DEFAULTS_CADAC.UNIT,
  };
  private axesHelperSize = 15;
  private transformControlsCurrentMode: 'translate' | 'rotate' = 'translate';
  private shapesToRotate: CadacThreeShapeRotation[] = [];
  private sceneShapes: CadacThreeShape[] = [];
  private mainLight: DirectionalLight = new DirectionalLight(0xffffff, 1);
  private readonly UPDATE_CAMERA_TIMEOUT = 200;
  private clickObjectsListener: CadacClickObjectListenerData[] = [];

  constructor(options?: CadacThreeOptions) {
    this.options = { ...this.options, ...options?.sceneOptions };
    DEFAULTS_CADAC.UNIT = this.options.defaultUnits || DEFAULTS_CADAC.UNIT;
    this.elRef = this.options.elRef || this.elRef;
  }

  public get SceneShapes(): CadacThreeShape[] {
    return this.sceneShapes;
  }

  public createScene(): void {
    if (!this.elRef.nativeElement) {
      return;
    }

    this.scene = new Scene();
    const { near, far } = UnitsHelper.convertCameraUnits(
      0.1,
      1000,
      this.options.defaultUnits
    );
    this.camera = new PerspectiveCamera(
      50,
      this.elRef.nativeElement?.offsetWidth /
        this.elRef.nativeElement?.offsetHeight,
      near,
      far
    );

    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = PCFSoftShadowMap;
    this.renderer.setPixelRatio(window.devicePixelRatio);
    this.renderer.setSize(
      this.elRef.nativeElement?.offsetWidth,
      this.elRef.nativeElement?.offsetHeight
    );

    this.elRef.nativeElement.appendChild(this.renderer.domElement);
    const { x, y, z } = UnitsHelper.convertCameraPosition(
      0,
      10,
      20,
      this.options.defaultUnits
    );
    this.camera.position.set(x, y, z);
    const {
      x: xLookAt,
      y: yLookAt,
      z: zLookAt,
    } = UnitsHelper.convertCameraPosition(0, 0, 0, this.options.defaultUnits);

    this.camera.lookAt(xLookAt, yLookAt, zLookAt);

    this.scene.background = new Color().set(this.options.sceneBackground);
    const { near: nearFog, far: farFog } = UnitsHelper.convertCameraUnits(
      1,
      5000,
      this.options.defaultUnits
    );
    this.scene.fog = new Fog(this.scene.background, nearFog, farFog);

    this.registerEventListeners();
    this.animate();
  }

  public dispose() {
    this.renderer.dispose();
    this.orbitControls.dispose();
    window.removeEventListener('keydown', this.onDocumentKeydown.bind(this));
    this.renderer.domElement.removeEventListener(
      'click',
      this.onDocumentMouseClick.bind(this)
    );
  }

  public createCube(
    width = 1,
    height = 1,
    depth = 1,
    color: string = DEFAULTS_CADAC.COLOR,
    addToScene = true,
    unit: CadacUnits = DEFAULTS_CADAC.UNIT
  ) {
    const cube = useCreateCube(width, height, depth, color, unit);
    this.setLineSegments(cube, color);
    if (addToScene) {
      this.scene.add(cube);
      this.sceneShapes.push(cube);
      setTimeout(() => {
        this.updateCameraPosition();
      }, this.UPDATE_CAMERA_TIMEOUT);
    }

    return cube;
  }

  public createSphere(
    radius = 1,
    color: string = DEFAULTS_CADAC.COLOR,
    addToScene = true,
    unit: CadacUnits = DEFAULTS_CADAC.UNIT
  ) {
    const sphere = useCreateSphere(radius, color, unit);
    this.setLineSegments(sphere, color);
    if (addToScene) {
      this.scene.add(sphere);
      this.sceneShapes.push(sphere);
      setTimeout(() => {
        this.updateCameraPosition();
      }, this.UPDATE_CAMERA_TIMEOUT);
    }

    return sphere;
  }

  public createCone(
    radius = 1,
    height = 1,
    radialSegments = 8,
    color: string = DEFAULTS_CADAC.COLOR,
    addToScene = true,
    unit: CadacUnits = DEFAULTS_CADAC.UNIT
  ) {
    const cone = useCreateCone(radius, height, radialSegments, color, unit);
    this.setLineSegments(cone, color);
    if (addToScene) {
      this.scene.add(cone);
      this.sceneShapes.push(cone);
      setTimeout(() => {
        this.updateCameraPosition();
      }, this.UPDATE_CAMERA_TIMEOUT);
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
    unit: CadacUnits = DEFAULTS_CADAC.UNIT
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
      setTimeout(() => {
        this.updateCameraPosition();
      }, this.UPDATE_CAMERA_TIMEOUT);
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
    unit: CadacUnits = DEFAULTS_CADAC.UNIT
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
      setTimeout(() => {
        this.updateCameraPosition();
      }, this.UPDATE_CAMERA_TIMEOUT);
    }

    return capsule;
  }

  public createCircle(
    radius = 1,
    segments = 32,
    color: string = DEFAULTS_CADAC.COLOR,
    addToScene = true,
    unit: CadacUnits = DEFAULTS_CADAC.UNIT
  ) {
    const circle = useCreateCircle(radius, segments, color, unit);
    this.setLineSegments(circle, color);
    if (addToScene) {
      this.scene.add(circle);
      this.sceneShapes.push(circle);
      setTimeout(() => {
        this.updateCameraPosition();
      }, this.UPDATE_CAMERA_TIMEOUT);
    }

    return circle;
  }

  public createPlane(
    width = 1,
    height = 1,
    color: string = DEFAULTS_CADAC.COLOR,
    addToScene = true,
    unit: CadacUnits = DEFAULTS_CADAC.UNIT
  ) {
    const plane = useCreatePlane(width, height, color, unit);
    this.setLineSegments(plane, color);
    if (addToScene) {
      this.scene.add(plane);
      this.sceneShapes.push(plane);
      setTimeout(() => {
        this.updateCameraPosition();
      }, this.UPDATE_CAMERA_TIMEOUT);
    }

    return plane;
  }

  public mergeMeshes(
    meshes: CadacMergeMesh[],
    color: string = DEFAULTS_CADAC.COLOR,
    addToScene = true
  ) {
    const mergedMesh = useMergeMeshes(meshes, color);
    this.setLineSegments(mergedMesh, color);
    if (addToScene) {
      this.scene.add(mergedMesh);
      this.sceneShapes.push(mergedMesh);
      setTimeout(() => {
        this.updateCameraPosition();
      }, this.UPDATE_CAMERA_TIMEOUT);
    }

    return mergedMesh;
  }

  public csgSubtract(
    meshes1: CadacMergeMesh,
    meshes2: CadacMergeMesh,
    operation: CadacCSGOperation = CadacCSGOperation.SUBTRACT,
    color: string = DEFAULTS_CADAC.COLOR,
    addToScene = true
  ) {
    const subRes = useCsgOperator(meshes1, meshes2, operation, color);
    this.setLineSegments(subRes, color);

    if (addToScene) {
      this.scene.add(subRes);
      this.sceneShapes.push(subRes);

      setTimeout(() => {
        this.updateCameraPosition();
      }, this.UPDATE_CAMERA_TIMEOUT);
    }

    return subRes;
  }

  public csgIntersect(
    meshes1: CadacMergeMesh,
    meshes2: CadacMergeMesh,
    operation: CadacCSGOperation = CadacCSGOperation.SUBTRACT,
    color: string = DEFAULTS_CADAC.COLOR,
    addToScene = true
  ) {
    const intRes = useCsgOperator(meshes1, meshes2, operation, color);
    this.setLineSegments(intRes, color);

    if (addToScene) {
      this.scene.add(intRes);
      this.sceneShapes.push(intRes);

      setTimeout(() => {
        this.updateCameraPosition();
      }, this.UPDATE_CAMERA_TIMEOUT);
    }

    return intRes;
  }

  public csgUnion(
    meshes1: CadacMergeMesh,
    meshes2: CadacMergeMesh,
    operation: CadacCSGOperation = CadacCSGOperation.UNION,
    color: string = DEFAULTS_CADAC.COLOR,
    addToScene = true
  ) {
    const unionRes = useCsgOperator(meshes1, meshes2, operation, color);
    this.setLineSegments(unionRes, color);

    if (addToScene) {
      this.scene.add(unionRes);
      this.sceneShapes.push(unionRes);

      setTimeout(() => {
        this.updateCameraPosition();
      }, this.UPDATE_CAMERA_TIMEOUT);
    }

    return unionRes;
  }

  public createText(
    text: string,
    fontSize = 1,
    position: Vector3 = new Vector3(0, 0, 0),
    color: string = DEFAULTS_CADAC.COLOR,
    addToScene = true
  ) {
    const textMesh = useCreateText(text, fontSize, position, color);
    this.setLineSegments(textMesh, color);

    if (addToScene) {
      this.scene.add(textMesh);
      this.sceneShapes.push(textMesh);

      setTimeout(() => {
        this.updateCameraPosition();
      }, this.UPDATE_CAMERA_TIMEOUT);
    }

    return textMesh;
  }

  public toggleOrbitControls(active: boolean) {
    this.orbitControls = new OrbitControls(
      this.camera,
      this.renderer.domElement
    );
    this.orbitControls.enabled = active;
    this.orbitControls.enableRotate = active;
    this.orbitControls.enablePan = false;
    this.orbitControls.enableZoom = active;
    this.orbitControls.enableDamping = true; // an animation loop is required when either damping or auto-rotation are enabled
    this.orbitControls.dampingFactor = 0.05;

    this.orbitControls.listenToKeyEvents(window);
    this.orbitControls.target.set(0, 1, 0);
    this.orbitControls.update();
  }

  public toggleTransformControls(mesh: Object3D | undefined, active: boolean) {
    if (mesh) {
      if (active) {
        this.transformControls = new TransformControls(
          this.camera,
          this.renderer.domElement
        );
        this.transformControls.enabled = active;
        this.transformControls.setMode(this.transformControlsCurrentMode);
        this.transformControls.setTranslationSnap(1);
        this.transformControls.attach(mesh);
        this.transformControls.addEventListener(
          'mouseDown',
          this.tcMouseDownListener.bind(this)
        );
        this.transformControls.addEventListener(
          'mouseUp',
          this.tcMouseUpListener.bind(this)
        );
        this.scene.add(this.transformControls);
      } else {
        this.transformControls.removeEventListener(
          'mouseDown',
          this.tcMouseDownListener.bind(this)
        );
        this.transformControls.removeEventListener(
          'mouseUp',
          this.tcMouseUpListener.bind(this)
        );
        this.transformControls.detach();
        this.transformControls.remove(mesh);
        this.scene.remove(this.transformControls);
      }
    }
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

  public setAxisHelper(size = 15) {
    this.axesHelperSize = size;
    this.axesHelper = new AxesHelper(this.axesHelperSize);
    const x = new Troika.Text();
    const y = new Troika.Text();
    const z = new Troika.Text();
    x.text = 'X';
    y.text = 'Y';
    z.text = 'Z';
    x.fontSize = y.fontSize = z.fontSize = 1;

    x.position.x = y.position.y = z.position.z = this.axesHelperSize + 1;

    x.position.y = x.fontSize / 2;
    y.position.x = (y.fontSize / 2) * -1;
    z.position.y = z.fontSize / 2;

    z.rotateY(Math.PI / 2);

    x.color = '#ffffff';
    y.color = '#ffffff';
    z.color = '#ffffff';
    this.scene.add(x);
    this.scene.add(y);
    this.scene.add(z);

    this.scene.add(this.axesHelper);
  }

  /**
   * Create a DirectionalLight and turn on shadows for the light
   * @param color
   * @param intensity
   */
  public setMainDirectionalLight(color = '#ffffff', intensity = 0.8) {
    this.mainLight = new DirectionalLight(color, intensity);
    this.mainLight.castShadow = true;
    this.scene.add(this.mainLight);
    return this.mainLight;
  }

  public animateShapeRotation(
    shape: Mesh,
    xSpeed = 0.001,
    ySpeed = 0.001,
    zSpeed = 0.001
  ) {
    this.shapesToRotate.push({ shape, xSpeed, ySpeed, zSpeed });
  }

  public setGridHelper(size = 20, divisions = 20) {
    this.gridHelper = new GridHelper(size, divisions);
    this.scene.add(this.gridHelper);
  }

  public setLineSegments(shape: CadacThreeShape, color = '#a4a4a4') {
    const edges = new EdgesGeometry(shape.geometry);
    const line = new LineSegments(edges, new LineBasicMaterial({ color }));
    shape.add(line);
  }

  public setEventClickListener({
    object,
    callback,
  }: CadacClickObjectListenerData) {
    this.clickObjectsListener.push({ object, callback });
  }

  public loadModel(model: string, callback: (obj: Group) => void) {
    const loader = new OBJLoader();
    loader.load(
      model,
      obj => {
        callback(obj);
      },
      xhr => {
        console.log((xhr.loaded / xhr.total) * 100 + '% loaded');
      },
      error => {
        console.log('An error happened', error);
      }
    );
  }

  private animate() {
    this.shapesToRotate.forEach(shape => {
      shape.shape.rotation.x += shape.xSpeed;
      shape.shape.rotation.y += shape.ySpeed;
      shape.shape.rotation.z += shape.zSpeed;
    });
    this.updateLightPosition();
    requestAnimationFrame(this.animate.bind(this));
    this.renderer.render(this.scene, this.camera);
  }

  private updateLightPosition() {
    if (this.mainLight) {
      this.mainLight.position.set(
        this.camera.position.x,
        this.camera.position.y,
        this.camera.position.z
      );
    }
  }

  private updateCameraPosition() {
    this.transformControls.removeFromParent();
    const boundingBox = UnitsHelper.getConvertedBoundingBox(this.scene);
    const center = boundingBox.getCenter(new Vector3());
    const size = boundingBox.getSize(new Vector3());
    const maxDim = Math.max(size.x, size.y, size.z);
    const fov = this.camera.fov * (Math.PI / 180);
    let cameraZ = Math.abs((maxDim / 4) * Math.tan(fov * 2));

    cameraZ *= 1.2; // zoom out a little so that objects don't fill the screen

    this.camera.position.z = cameraZ;
    this.camera.position.x = center.x;
    this.camera.position.y = center.y;
    this.camera.lookAt(center);
    this.camera.updateProjectionMatrix();
    this.axesHelper = new AxesHelper(cameraZ * 2);
    this.scene.add(this.transformControls);
  }

  private registerEventListeners() {
    window.addEventListener('keydown', this.onDocumentKeydown.bind(this));
    this.renderer.domElement.addEventListener(
      'click',
      this.onDocumentMouseClick.bind(this)
    );
  }

  private tcMouseDownListener() {
    this.orbitControls.enabled = false;
    ((this.selectedObject as Mesh).material as Material).transparent = true;
    ((this.selectedObject as Mesh).material as Material).opacity = 0.5;
  }

  private tcMouseUpListener() {
    this.orbitControls.enabled = true;
    ((this.selectedObject as Mesh).material as Material).opacity = 1;
  }

  private onDocumentKeydown(event: KeyboardEvent) {
    switch (event.key) {
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
        this.transformControlsCurrentMode = 'rotate';
        this.transformControls.setMode(this.transformControlsCurrentMode);
        break;
      case 't':
        this.transformControlsCurrentMode = 'translate';
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
        this.toggleTransformControls(this.selectedObject, true);
        break;
      }
    }
  }
}
