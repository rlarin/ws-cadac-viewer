import { AfterViewInit, Component } from '@angular/core';

import { CsgHandler } from '../../../libs/csgHandler';
import { BoxGeometry, Vector3 } from 'three';
import {
  CadacObjectData,
  CadacPlanes,
} from '../../../../../../ngx-cadac-viewer/src/lib/models/types';
import { CadacThree } from 'ngx-cadac-viewer';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-cube-poc',
  templateUrl: './cube-poc.component.html',
  styleUrls: ['./cube-poc.component.scss'],
  providers: [MessageService],
})
export class CubePocComponent implements AfterViewInit {
  public selectedObjectData: CadacObjectData = null;
  public CadacPlanes: typeof CadacPlanes = CadacPlanes;
  public parameters = {
    width: 20,
    height: 10,
    depth: 10,
    position: new Vector3(10, 5, 5),
    color: undefined,
  };
  public restrictedPlanes = {
    YZ: true,
    XZ: true,
    XY: true,
  };

  public handler = new CadacThree({
    sceneOptions: {
      sceneBackground: '#cccccc',
      restrictToPositiveQuadrant: this.restrictedPlanes,
    },
  });
  public planesStateOptions: any[] = [];

  constructor(private messageService: MessageService) {
    this.planesStateOptions['XY'] = [
      { label: 'On', value: true },
      { label: 'Off', value: false },
    ];

    this.planesStateOptions['XZ'] = [
      { label: 'On', value: true },
      { label: 'Off', value: false },
    ];

    this.planesStateOptions['YZ'] = [
      { label: 'On', value: true },
      { label: 'Off', value: false },
    ];
  }

  ngAfterViewInit(): void {
    CsgHandler({ handler: this.handler, parameters: this.parameters });
  }

  objectChangedHandler(objectData: CadacObjectData) {
    this.parameters.position = objectData.position;
  }

  selectedObjectHandler(objectData: any) {
    this.selectedObjectData = objectData;
  }

  changeHandler() {
    if (this.handler.selectedObject) {
      this.handler.updateObjectPosition();
    } else {
      this.messageService.add({
        severity: 'warn',
        summary: 'Warn',
        detail: 'Please select an object first.',
      });
    }
  }

  changeRestrictedPlanes(plane: CadacPlanes) {
    // this.restrictedPlanes[plane] = !this.restrictedPlanes[plane];
    this.handler.toggleRestrictedPlanes([plane]);
  }

  propertiesHandler() {
    if (this.handler.selectedObject) {
      this.handler.updateObjectGeometry(
        new BoxGeometry(
          this.parameters.width,
          this.parameters.height,
          this.parameters.depth
        )
      );
    } else {
      this.messageService.add({
        severity: 'warn',
        summary: 'Warn',
        detail: 'Please select an object first.',
      });
    }
  }

  updateColorHandler() {
    if (this.handler.selectedObject) {
      this.handler.updateObjectColor(this.parameters.color);
    } else {
      this.messageService.add({
        severity: 'warn',
        summary: 'Warn',
        detail: 'Please select an object first.',
      });
    }
  }
}