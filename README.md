# CadacThreeViewer - A Three.js viewer for CADAC models

This package provides a 3D viewer and some functionalities for creating CADAC 3D models. It is based on
the [Three.js](https://threejs.org/) library.
The _CadacThreeViewer_ is a convenient and user-friendly JavaScript library that simplifies the usage
and integration of the popular Three.js framework.

In general, it provides a set of additional functionalities, utilities, and abstractions to enhance the development
experience and streamline the creation of 3D graphics and interactive web applications.

## Demo

> [🌏 Cadac 3D Viewer example page](https://corsr3-4200.csb.app/)

> [🧑‍💻 Cadac 3D Viewer example code](https://codesandbox.io/p/github/rlarin/cadac-3D-viewer-test/draft/tender-knuth?file=%2Fsrc%2Fapp%2Fapp.component.ts%3A1%2C1&layout=%257B%2522sidebarPanel%2522%253A%2522EXPLORER%2522%252C%2522gitSidebarPanel%2522%253A%2522COMMIT%2522%252C%2522rootPanelGroup%2522%253A%257B%2522direction%2522%253A%2522horizontal%2522%252C%2522type%2522%253A%2522PANEL_GROUP%2522%252C%2522id%2522%253A%2522ROOT_LAYOUT%2522%252C%2522panels%2522%253A%255B%257B%2522type%2522%253A%2522PANEL_GROUP%2522%252C%2522direction%2522%253A%2522vertical%2522%252C%2522id%2522%253A%2522EDITOR%2522%252C%2522panels%2522%253A%255B%257B%2522type%2522%253A%2522PANEL_GROUP%2522%252C%2522direction%2522%253A%2522horizontal%2522%252C%2522id%2522%253A%2522clhj0wswj01wr356psjcl0hl0%2522%252C%2522panels%2522%253A%255B%257B%2522type%2522%253A%2522PANEL%2522%252C%2522panelType%2522%253A%2522TABS%2522%252C%2522id%2522%253A%2522clhj0yxlv029u356pfjbxfcaj%2522%257D%252C%257B%2522type%2522%253A%2522PANEL%2522%252C%2522panelType%2522%253A%2522TABS%2522%252C%2522id%2522%253A%2522clhj0yxlv029t356pkaqw7w9t%2522%257D%255D%252C%2522sizes%2522%253A%255B50%252C50%255D%257D%252C%257B%2522type%2522%253A%2522PANEL%2522%252C%2522panelType%2522%253A%2522TABS%2522%252C%2522id%2522%253A%2522clhj0s05c015f356pjz9rjyi4%2522%257D%255D%252C%2522sizes%2522%253A%255B78.94954507857733%252C21.05045492142267%255D%257D%255D%252C%2522sizes%2522%253A%255B100%255D%257D%252C%2522tabbedPanels%2522%253A%257B%2522clhj0yxlv029u356pfjbxfcaj%2522%253A%257B%2522id%2522%253A%2522clhj0yxlv029u356pfjbxfcaj%2522%252C%2522activeTabId%2522%253A%2522clhj0zt6802em356pscbmwx6w%2522%252C%2522tabs%2522%253A%255B%257B%2522id%2522%253A%2522clhj0pwdv0009356pe43on46u%2522%252C%2522mode%2522%253A%2522permanent%2522%252C%2522type%2522%253A%2522FILE%2522%252C%2522filepath%2522%253A%2522%252FREADME.md%2522%257D%252C%257B%2522type%2522%253A%2522FILE%2522%252C%2522filepath%2522%253A%2522%252Fpackage.json%2522%252C%2522id%2522%253A%2522clhj0qsqc00ek356pd3vtefko%2522%252C%2522mode%2522%253A%2522permanent%2522%252C%2522state%2522%253A%2522IDLE%2522%257D%252C%257B%2522id%2522%253A%2522clhj0rl0u00x7356p6ol2y5tm%2522%252C%2522mode%2522%253A%2522permanent%2522%252C%2522type%2522%253A%2522TASK_LOG%2522%252C%2522taskId%2522%253A%2522build%2522%257D%252C%257B%2522type%2522%253A%2522FILE%2522%252C%2522filepath%2522%253A%2522%252Fsrc%252Fapp%252Fapp.component.ts%2522%252C%2522id%2522%253A%2522clhj0zt6802em356pscbmwx6w%2522%252C%2522mode%2522%253A%2522temporary%2522%252C%2522state%2522%253A%2522IDLE%2522%257D%255D%257D%252C%2522clhj0s05c015f356pjz9rjyi4%2522%253A%257B%2522tabs%2522%253A%255B%257B%2522id%2522%253A%2522clhj0rsre0118356pf61cvbsp%2522%252C%2522mode%2522%253A%2522permanent%2522%252C%2522type%2522%253A%2522TERMINAL%2522%252C%2522shellId%2522%253A%2522clhj0rxqw000xfxdia8raeo5r%2522%257D%255D%252C%2522id%2522%253A%2522clhj0s05c015f356pjz9rjyi4%2522%252C%2522activeTabId%2522%253A%2522clhj0rsre0118356pf61cvbsp%2522%257D%252C%2522clhj0yxlv029t356pkaqw7w9t%2522%253A%257B%2522tabs%2522%253A%255B%257B%2522type%2522%253A%2522UNASSIGNED_PORT%2522%252C%2522port%2522%253A4200%252C%2522id%2522%253A%2522clhj0yhk0027m356pi43w7ln5%2522%252C%2522mode%2522%253A%2522permanent%2522%252C%2522path%2522%253A%2522%252F%2522%257D%255D%252C%2522id%2522%253A%2522clhj0yxlv029t356pkaqw7w9t%2522%252C%2522activeTabId%2522%253A%2522clhj0yhk0027m356pi43w7ln5%2522%257D%257D%252C%2522showDevtools%2522%253Atrue%252C%2522showSidebar%2522%253Atrue%252C%2522sidebarPanelSize%2522%253A15%257D)

## Features

The _CadacThreeViewer_ provides the following features:

- **Simplified API**: The wrapper library abstracts away much of the complexity of the Three.js API,
  making it easier for developers to create and manipulate 3D scenes, objects, and animations.

- **Higher-level Abstractions**: It offers higher-level abstractions and components, such as pre-built 3D objects,
  cameras, lights, materials, and controls, allowing developers to quickly prototype and build 3D scenes.

- **Scene management**: It includes a scene manager that simplifies the management of multiple scenes, making it easier
  to switch between different 3D environments or levels within an application.

## Getting Started

### 1. Include the Library in your project.

The _CadacThreeViewer_ is available as a [npm package](https://www.npmjs.com/package/ngx-cadac-three-viewer).

```bash
npm install ngx-cadac-three-viewer
```

Include the lib dependencies in your project.

```bash
npm i --save three troika-three-text three-csg-ts
```

Include the Three.js library types in your project.

```bash
npm i --save-dev @types/three
```

### 2. Import the _CadacThreeViewer_ module.

Import the _CadacThreeViewer_ module in your Angular application.

  ```typescript
  import {CadacThreeViewerModule} from 'ngx-cadac-three-viewer';

@NgModule({
  imports: [CadacThreeViewerModule]
})
export class AppModule {
}
  ```

### 3. Add the _CadacThreeViewer_ component to your application.

- Initialize a new instance of the **CadacThree** class, which will handle the setup and rendering of your 3D scene.

```typescript
import { CadacThree, CadacUnits } from "ngx-cadac-three-viewer";

export class AppComponent implements AfterViewInit, OnDestroy {
  public cadacThreeHandler: CadacThree = new CadacThree({
    sceneOptions: {
      sceneBackground: '#232323',
      // You can set the default units for the scene. 
      // The supported units are: mm, cm, m, in, km
      // The default value is mm.
      defaultUnits: CadacUnits.mm,
    }
  });

  ngAfterViewInit(): void {
    // Renders the scene and starts the animation loop.
    this.cadacThreeHandler.initScene();
  }

  ngOnDestroy(): void {
    // Disposes the scene and free up memory.
    this.cadacThreeHandler.dispose();
  }
}
```

- Add the _CadacThreeViewer_ component to your Angular application.

```html

<cadac-three-viewer [cadacThreeHandler]="cadacThreeHandler"/>
```

### 4. Add 3D objects to the scene.

- Create a new 3D object and include it to the scene

```javascript
const cube = this.cadacThreeHandler.createCube(15, 2, 15, '#f8f8f8', true);
const sphere = this.cadacThreeHandler.createSphere(8, '#eec63e', true);
const cone = this.cadacThreeHandler.createCone(5, 20, 32, '#7a7979', true);
```

### 5. Add lights and some Helpers to the scene.

- Add a light to the scene

```javascript
const light = this.cadacThreeHandler.setMainDirectionalLight();
light.position.set(0, 50, 55);
```

- Add Helpers to the scene

```javascript
this.cadacThreeHandler.setGridHelper(30, 30);
this.cadacThreeHandler.toggleOrbitControls(true);
this.cadacThreeHandler.setAmbientLight();
this.cadacThreeHandler.setAxisHelper(30);
```

- Animate shape rotation

```javascript
this.cadacThreeHandler.animateShapeRotation(cube, 0, 0.01, 0);
```

- Constructive Solid Geometry Operations (CSG)

  To create new shapes by merging two existing shapes, you have the option to employ **CSG** (_Constructive Solid
  Geometry_) operations.
  These operations, namely **Subtract**, **Union**, and **Intersect**, allow you to manipulate shapes in various ways.

  By experimenting with different combinations of these operations and altering the order of input models, you can
  generate a wide range of composite shapes.

  > The `three-csg-ts` library is used to perform these operations.
  For more detailed information regarding CSG operations, please refer to
  the [three-csg-ts](https://github.com/samalexander/three-csg-ts) GitHub repository.

```javascript
/** Using the previous cube and sphere */

// Subtract the sphere from the cube
const sub = handler.csgSubtract(
    { mesh: cube, position: new Vector3(10, 0, 0) },
    { mesh: sphere, position: new Vector3(10, 0, 0) },
    CadacCSGOperation.SUBTRACT,
    '#09ff00'
  );

// Union the sphere and the cube
const int = handler.csgIntersect(
  { mesh: cube, position: new Vector3(0, 10, 0) },
  { mesh: sphere, position: new Vector3(0, 10, 0) },
  CadacCSGOperation.INTERSECT,
  '#ff0000'
);

// Union the sphere and the cube
const union = handler.csgUnion(
  { mesh: box, position: new Vector3(0, 0, 10) },
  { mesh: sphere, position: new Vector3(0, 0, 10) },
  CadacCSGOperation.UNION,
  '#e3b107'
);
```

- Add texts to the scene
  - The texts are created using the `troika-three-text` library.
  > For more detailed information, please refer to
  the [troika-three-text](https://github.com/protectwise/troika) GitHub repository.

```javascript
const text = this.cadacThreeHandler.createText('Hello Cadac', 1, new Vector3(0, 10, 0), '#ff0000');
```

## API Reference

### CadacThree

The _CadacThree_ class is the main class of the _CadacThreeViewer_ library. It is responsible for the setup and
rendering
of the 3D scene.

#### Methods Description

| Method                      | Description                                |
|-----------------------------|--------------------------------------------|
| **initScene**               | Creates a new Three.js scene.              |
| **createCube**              | Creates a new cube.                        |
| **createSphere**            | Creates a new sphere.                      |
| **createCylinder**          | Creates a new cylinder.                    |
| **createCone**              | Creates a new cone.                        |
| **createCylinder**          | Creates a new cylinder.                    |
| **createCapsule**           | Creates a new capsule.                     |
| **createCircle**            | Creates a new circle.                      |
| **createPlane**             | Creates a new plane.                       |
| **mergeMeshes**             | Merges multiple meshes into a single mesh. |
| **csgSubtract**             | CSG subtract operation.                    |
| **csgUnion**                | CSG union operation.                       |
| **csgIntersect**            | CSG intersect operation.                   | 
| **SceneShapes**             | Gets all cadac shapes in the scene.        |
| **toggleOrbitControls**     | Enables or disables the OrbitControls.     |
| **setMainDirectionalLight** | Creates a new main directional light.      |
| **setAmbientLight**         | Creates a new ambient light.               |
| **setGridHelper**           | Creates a new grid helper.                 |
| **setAxisHelper**           | Creates a new axis helper.                 |
| **animateShapeRotation**    | Animates the rotation of a shape.          |
| **dispose**                 | Disposes the scene.                        |

#### Types & Methods

```typescript
export type CadacThreeShapeRotation = {
  shape: CadacThreeShape,
  xSpeed: number,
  ySpeed: number,
  zSpeed: number
}

export enum CadacUnits {
  mm = 'mm', // default
  cm = 'cm',
  m = 'm',
  inch = 'inch',
  km = 'km',
}

export enum CadacCSGOperation {
  SUBTRACT = "SUBTRACT",
  INTERSECT = "INTERSECT",
  UNION = "UNION"
}

export const DEFAULTS_CADAC = {
  UNIT: CadacUnits.mm,
  COLOR: '#f4f4f4',
  CAMERA_NEAR: 0.1,
  CAMERA_FAR: 1000,
  CAMERA_FOV: 50,
  CAMERA_POSITION: new THREE.Vector3(0, 10, 20),
  CAMERA_LOOK_AT: new THREE.Vector3(0, 0, 0)
}

export type CadacThreeSceneOptions = {
  elRef?: ElementRef,
  scene?: THREE.Scene,
  camera?: THREE.PerspectiveCamera,
  renderer?: THREE.WebGLRenderer,
  sceneBackground: string
  defaultUnits?: CadacUnits
};

export type CadacMergeMesh = {
  mesh: THREE.Mesh,
  position: THREE.Vector3,
}

export type CadacThreeShape = THREE.Mesh | THREE.Line | THREE.Points
```

```text
get SceneShapes(): CadacThreeShape[];
initScene(): void;
dispose(): void;
createCube(width?: number, height?: number, depth?: number, color?: string, addToScene?: boolean, unit?: CadacUnits): Mesh<import("three").BoxGeometry, import("three").MeshBasicMaterial>;
createSphere(radius?: number, color?: string, addToScene?: boolean, unit?: CadacUnits): Mesh<import("three").SphereGeometry, import("three").MeshBasicMaterial>;
createCone(radius?: number, height?: number, radialSegments?: number, color?: string, addToScene?: boolean, unit?: CadacUnits): Mesh<import("three").ConeGeometry, import("three").MeshBasicMaterial>;
createCylinder(radiusTop?: number, radiusBottom?: number, height?: number, radialSegments?: number, color?: string, addToScene?: boolean, unit?: CadacUnits): Mesh<import("three").CylinderGeometry, import("three").MeshBasicMaterial>;
createCapsule(radius?: number, height?: number, capSegments?: number, radialSegments?: number, color?: string, addToScene?: boolean, unit?: CadacUnits): Mesh<import("three").CapsuleGeometry, import("three").MeshBasicMaterial>;
createCircle(radius?: number, segments?: number, color?: string, addToScene?: boolean, unit?: CadacUnits): Mesh<import("three").CircleGeometry, import("three").MeshBasicMaterial>;
createPlane(width?: number, height?: number, color?: string, addToScene?: boolean, unit?: CadacUnits): Mesh<import("three").PlaneGeometry, import("three").MeshBasicMaterial>;
mergeMeshes(meshes: CadacMergeMesh[], color?: string, addToScene?: boolean): Mesh<import("three").BufferGeometry, import("three").MeshPhongMaterial>;
csgSubtract(meshes1: CadacMergeMesh, meshes2: CadacMergeMesh, operation?: CadacCSGOperation, color?: string, addToScene?: boolean): Mesh<import("three").BufferGeometry, Material | Material[]>;
csgIntersect(meshes1: CadacMergeMesh, meshes2: CadacMergeMesh, operation?: CadacCSGOperation, color?: string, addToScene?: boolean): Mesh<import("three").BufferGeometry, Material | Material[]>;
csgUnion(meshes1: CadacMergeMesh, meshes2: CadacMergeMesh, operation?: CadacCSGOperation, color?: string, addToScene?: boolean): Mesh<import("three").BufferGeometry, Material | Material[]>;
createText(text: string, fontSize?: number, position?: Vector3, color?: string, addToScene?: boolean): any;
toggleOrbitControls(active: boolean): void;
toggleTransformControls(mesh: Object3D | undefined, active: boolean): void;

setAmbientLight(color?: string, intensity?: number): void;
setAxisHelper(size?: number): void;
setMainDirectionalLight(color?: string, intensity?: number): THREE.DirectionalLight;
animateShapeRotation(shape: THREE.Mesh<THREE.BoxGeometry, THREE.MeshPhongMaterial>, xSpeed?: number, ySpeed?: number, zSpeed?: number): void;
setGridHelper(size?: number, divisions?: number): void;
setLineSegments(sphere: CadacThreeShape, color?: string): void;
setEventClickListener({ object, callback }: CadacClickObjectListenerData): void;
```

## Documentation

For detailed documentation and examples, refer to the official [Three.js](https://threejs.org/) documentation.

## Compatibility

This library is compatible with the latest version of [Three.js](https://threejs.org/) (at the time of
writing  `"three": "^0.152.2"`).
Ensure that you are using a compatible version of [Three.js](https://threejs.org/) to avoid any compatibility issues.

