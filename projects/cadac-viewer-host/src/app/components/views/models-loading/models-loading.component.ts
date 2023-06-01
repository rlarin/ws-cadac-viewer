import { AfterViewInit, Component, OnDestroy, signal } from '@angular/core';
import {
  CadacFileTypes,
  CadacPlanes,
  CadacThree,
  calculateContrastColor,
} from 'ngx-cadac-viewer';
import { MessageService, TreeNode } from 'primeng/api';
import { InputSwitchOnChangeEvent } from 'primeng/inputswitch';

@Component({
  selector: 'app-models-loading',
  templateUrl: './models-loading.component.html',
  styleUrls: ['./models-loading.component.scss'],
  providers: [MessageService],
})
export class ModelsLoadingComponent implements AfterViewInit, OnDestroy {
  public handler = new CadacThree();
  public CadacPlanes: typeof CadacPlanes = CadacPlanes;
  public parameters = {
    opacity: 50,
    color: '#f4f4f4',
    scale: 1,
    segmentLines: true,
  };
  public colorInputBgColor = signal(this.parameters.color);
  public sceneObjsTreeNode: TreeNode[] = [
    {
      key: '0',
      label: 'Scene Objects',
      data: 'Scene Objects Folder',
      icon: 'pi pi-fw pi-inbox',
      expanded: true,
      children: [],
      selectable: false,
    },
  ];
  public modelsTreeNode: TreeNode[] = [
    {
      key: '0',
      label: 'Models',
      data: 'Models Folder',
      icon: 'pi pi-fw pi-inbox',
      expanded: true,
      children: [
        {
          key: '0-0',
          label: 'Box.obj',
          data: {
            name: 'Box',
            type: CadacFileTypes.OBJ,
          },
          icon: 'pi pi-fw pi-box',
        },
        {
          key: '0-1',
          label: 'Cylinder.obj',
          data: {
            name: 'Cylinder',
            type: CadacFileTypes.OBJ,
          },
          icon: 'pi pi-fw pi-database',
        },
        // {
        //   key: '0-2',
        //   label: 'adamHead.gltf',
        //   data: {
        //     name: 'adamHead',
        //     type: CadacFileTypes.GLTF,
        //   },
        //   icon: 'pi pi-fw pi-user',
        // },
        {
          key: '0-3',
          label: 'DamagedHelmet.gltf',
          data: {
            name: 'DamagedHelmet',
            type: CadacFileTypes.GLTF,
          },
          icon: 'pi pi-fw pi-qrcode',
        },
      ],
    },
  ];

  public objObjectContent: string = null;

  private windowResizeRef = this.windowResizeHandler.bind(this);

  constructor(private messageService: MessageService) {}

  get getColor() {
    return this.parameters.color;
  }

  get getContrastColor() {
    return calculateContrastColor(this.parameters.color, true);
  }

  ngAfterViewInit(): void {
    this.handler.createScene();
    this.handler.setAmbientLight();
    this.handler.setMainDirectionalLight();
    this.setEventListeners();
    this.handler.toggleGridHelper(false);
  }

  ngOnDestroy(): void {
    this.removeEventListeners();
    this.handler.dispose();
  }

  windowResizeHandler() {
    this.handler.updateContainerSize();
  }

  resetScene() {
    this.sceneObjsTreeNode[0].children = [];
    this.handler.createScene();
    this.handler.setAmbientLight();
  }

  onFileChange($event: Event, resetScene = true) {
    const file = ($event.target as HTMLInputElement).files[0];
    const fileType = file.name.split('.').pop();
    const fileReader: FileReader = new FileReader();

    fileReader.onloadend = () => {
      const content = fileReader.result as string;
      if (resetScene) this.resetScene();

      switch (fileType) {
        case CadacFileTypes.PRIM:
          this.handler.loadPrimModel(
            { content, filename: file.name },
            this.handleCallback.bind(this)
          );
          break;
        case CadacFileTypes.MTL:
          this.handler.loadMtlModel(
            { content, filename: file.name },
            this.handleCallback.bind(this)
          );
          break;
        case CadacFileTypes.OBJ:
          this.objObjectContent = content;
          this.handler.loadObjModel(
            { content, filename: file.name },
            this.handleCallback.bind(this)
          );
          break;
        case CadacFileTypes.GLB:
          // sss
          break;
        default:
          //code goes here
          break;
      }
    };
    fileReader.readAsText(file);
  }

  handleCallback = (object: any) => {
    this.handler.selectedObject = object;
    this.handler.addShapeToScene(object);

    if (this.parameters.color && object.children[0].material) {
      this.parameters.color = object.children[0].material.color.getHexString();
      this.colorInputBgColor.set(this.parameters.color);
      this.handleObjectOpacity();
    }

    this.handler.setLineSegments(
      object,
      calculateContrastColor(this.parameters.color, true)
    );

    const objNode: TreeNode = {
      key: object.uuid,
      label: object.name,
      data: object,
      icon: 'pi pi-fw pi-box',
      children: [],
      selectable: true,
    };

    this.handler.selectedObject.children.forEach(child => {
      objNode.children.push({
        key: child.uuid,
        label: child.name,
        data: child,
        icon: 'pi pi-fw pi-box',
        selectable: true,
      });
    });

    this.sceneObjsTreeNode[0].children = [objNode];

    this.handler.updateSceneCameraPosition(300);
    this.handler.updateAxisHelper();
  };

  onNodeSelect({ node }) {
    this.resetScene();
    switch (node.data.type) {
      case CadacFileTypes.OBJ:
        this.handler.loadObjModelFromUrl(
          {
            baseUrl: 'assets/models/',
            objName: node.data.name,
          },
          this.handleCallback.bind(this),
          this.handleProgress.bind(this)
        );
        break;
      case CadacFileTypes.GLTF:
        this.handler.loadGltfModelFromUrl(
          {
            baseUrl: `assets/models/${node.data.name}/`,
            objName: node.data.name,
          },
          this.handleCallback.bind(this),
          this.handleProgress.bind(this)
        );
        break;
      default:
        //code goes here
        break;
    }
  }

  handleProgress(percent) {
    console.log(`${percent}% loaded`);
  }

  handleSliderChange(value) {
    this.handleObjectOpacity();
  }

  handleColorChange({ value }) {
    this.colorInputBgColor.set(value);
    if (this.handler.selectedObject) {
      this.handler.selectedObject.children[0].material.color.set(value);
    }
  }

  createSnapshot($event: MouseEvent) {
    $event.stopPropagation();
    const snapshotDataUrl = this.handler.createSnapshot();

    const link = document.createElement('a');
    link.href = snapshotDataUrl;
    link.download = 'model.png';
    link.click();
  }

  onSceneNodeSelect({ node }) {
    node.data.visible = false;
  }

  onSceneNodeUnselect({ node }) {
    node.data.visible = true;
  }

  handleSliderScaleChange(value) {
    if (this.handler.selectedObject) {
      this.handler.selectedObject.scale.set(value, value, value);
    }
  }

  handleCameraPlaneView($event: MouseEvent, plane: CadacPlanes) {
    $event.stopPropagation();
    this.handler.setCameraToPlane(plane);
  }

  handleToggleSegmentLinesChange($event: InputSwitchOnChangeEvent) {
    this.handler.toggleSegmentLines($event.checked);
  }

  private handleObjectOpacity() {
    if (this.handler.selectedObject) {
      this.handler.selectedObject.children[0].material.opacity =
        this.parameters.opacity / 100;
    }
  }

  private setEventListeners() {
    window.addEventListener('resize', this.windowResizeRef);
  }

  private removeEventListeners() {
    window.removeEventListener('resize', this.windowResizeRef);
  }
}
