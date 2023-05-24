import { AfterViewInit, Component, signal } from '@angular/core';
import { CadacThree, calculateContrastColor } from 'ngx-cadac-viewer';
import { MessageService, TreeNode } from 'primeng/api';

export enum CadacFileTypes {
  PRIM = 'prim',
  RFA = 'rfa',
  PNG = 'png',
  OBJ = 'obj',
  MTL = 'mtl',
  FBX = 'fbx',
}

@Component({
  selector: 'app-models-loading',
  templateUrl: './models-loading.component.html',
  styleUrls: ['./models-loading.component.scss'],
  providers: [MessageService],
})
export class ModelsLoadingComponent implements AfterViewInit {
  public handler = new CadacThree();
  public parameters = {
    opacity: 50,
    color: '#f4f4f4',
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
          label: 'Box',
          data: 'Box model',
          icon: 'pi pi-fw pi-box',
        },
        {
          key: '0-1',
          label: 'Cylinder',
          data: 'Cylinder model',
          icon: 'pi pi-fw pi-database',
        },
      ],
    },
  ];

  public objObjectContent: string = null;

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
        default:
          //code goes here
          break;
      }
    };
    fileReader.readAsText(file);
  }

  handleCallback = (object: any) => {
    this.handler.selectedObject = object;
    if ((this.parameters.color = object.children[0].material)) {
      this.parameters.color = object.children[0].material.color.getHexString();
      this.colorInputBgColor.set(this.parameters.color);
      this.handleObjectOpacity();
    }

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
  };

  onNodeSelect({ node }) {
    this.resetScene();
    this.handler.loadObjModelFromUrl(
      {
        baseUrl: 'assets/models/',
        objName: node.label,
      },
      this.handleCallback.bind(this),
      this.handleProgress.bind(this)
    );
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

  private handleObjectOpacity() {
    if (this.handler.selectedObject) {
      this.handler.selectedObject.children[0].material.opacity =
        this.parameters.opacity / 100;
    }
  }
}
