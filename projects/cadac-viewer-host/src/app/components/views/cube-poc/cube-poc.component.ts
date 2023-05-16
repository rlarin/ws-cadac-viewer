import { AfterViewInit, Component } from '@angular/core';

import { CsgHandler } from '../../../libs/csgHandler';
import { Vector3 } from 'three';
import {
  CadacObjectData,
  CadacPlanes,
} from '../../../../../../ngx-cadac-viewer/src/lib/models/types';
import { CadacThree } from 'ngx-cadac-viewer';

@Component({
  selector: 'app-cube-poc',
  templateUrl: './cube-poc.component.html',
  styleUrls: ['./cube-poc.component.scss'],
})
export class CubePocComponent implements AfterViewInit {
  public selectedObjectData: CadacObjectData = null;
  public CadacPlanes: typeof CadacPlanes = CadacPlanes;
  public parameters = {
    width: 20,
    height: 10,
    depth: 10,
    position: new Vector3(10, 5, 5),
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

  constructor() {
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
    this.handler.updateObjectPosition();
  }

  changeRestrictedPlanes(plane: CadacPlanes) {
    // this.restrictedPlanes[plane] = !this.restrictedPlanes[plane];
    this.handler.toggleRestrictedPlanes([plane]);
  }
}
