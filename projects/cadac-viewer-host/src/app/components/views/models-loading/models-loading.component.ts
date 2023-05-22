import { AfterViewInit, Component } from '@angular/core';
import { CadacThree, CadacUnits } from 'ngx-cadac-viewer';
import { MessageService } from 'primeng/api';
import {
  DirectionalLight,
  DoubleSide,
  MeshPhongMaterial,
  Vector3,
} from 'three';

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
  };
  public uploadedFiles: any[] = [];

  constructor(private messageService: MessageService) {}

  ngAfterViewInit(): void {
    this.handler.createScene();
    this.handler.setAmbientLight();
    this.handler.setMainDirectionalLight();
  }

  resetScene() {
    this.handler.createScene();
    this.handler.setAmbientLight();
  }

  onFileChange($event: Event) {
    const file = ($event.target as HTMLInputElement).files[0];
    const fileType = file.name.split('.').pop();
    const fileReader: FileReader = new FileReader();

    fileReader.onloadend = () => {
      const content = fileReader.result as string;
      this.resetScene();
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
    console.log(object);
    const maxMax = new Vector3(0, 0, 0);
    object.children.forEach((mesh: any) => {
      const material = new MeshPhongMaterial({
        color: mesh.material.color,
        side: DoubleSide,
        transparent: true,
      });

      mesh.material = material;
      mesh.geometry.computeBoundingBox();
      const bboxMax = mesh.geometry.boundingBox.max;
      maxMax.x = Math.max(bboxMax.x, maxMax.x);
      maxMax.y = Math.max(bboxMax.y, maxMax.y);
      maxMax.z = Math.max(bboxMax.z, maxMax.z);
    });

    this.handler.camera.position.set(maxMax.x * 2, maxMax.y * 2, maxMax.z * 2);
    this.handler.camera.lookAt(0, 0, 0);
    const absMax = Math.max(maxMax.x, maxMax.y, maxMax.z);

    this.handler.toggleOrbitControls(true);
    this.handler.setLineSegments(object, '#046e00');
    this.handler.camera.fov = 65;
    this.handler.camera.far = 100000;
    this.handler.camera.near = 0.1;
    this.handler.camera.updateProjectionMatrix();
    this.handler.setAxisHelper(absMax + absMax / 3, 10);

    const lightXY = new DirectionalLight(0x888888);
    const lightZY = new DirectionalLight(0x888888);
    const positionConst = absMax;
    lightXY.position.set(positionConst, positionConst, 1);
    lightZY.position.set(
      positionConst * -1,
      positionConst * -1,
      positionConst * -1
    );
    this.handler.scene.add(lightXY);
    // this.handler.scene.add(lightZY);
  };
}
