import {
  AfterViewInit,
  Component,
  ElementRef,
  OnDestroy,
  ViewChild,
} from '@angular/core';
import { CadacPlanes, CadacThree, DEFAULTS_CADAC } from 'ngx-cadac-viewer';
import { Vector3 } from 'three';
import { TreeNode } from 'primeng/api';
import anime from 'animejs/lib/anime.es.js';
import { CadacEventDataTypes } from '../../../../../../ngx-cadac-viewer/src/lib/models/types';

export type PrimitiveType = {
  name: string;
  type: 'box' | 'cylinder' | 'sphere';
  icon?: string;
  maskPropData?: {
    label: string;
    mask: string;
    placeholder: string;
    value: string;
  };
  maskPosData?: {
    label: string;
    mask: string;
    placeholder: string;
    value: string;
  };
  properties: {
    width?: number;
    height?: number;
    depth?: number;
    radius?: number;
    color?: string;
    radiusTop?: number;
    radiusBottom?: number;
    radialSegments?: number;
  };
  fillPropsFromMask?: (mask: any) => {
    width?: number;
    height?: number;
    depth?: number;
  };
  position?: Vector3;
  fillPosFromMask?: (pos: any) => {
    x?: number;
    y?: number;
    z?: number;
  };
};

@Component({
  selector: 'app-drag-drop-primitives',
  templateUrl: './drag-drop-primitives.component.html',
  styleUrls: ['./drag-drop-primitives.component.scss'],
})
export class DragDropPrimitivesComponent implements AfterViewInit, OnDestroy {
  public handler = new CadacThree();
  public scenePrimitives: PrimitiveType[] = [
    {
      name: 'Box',
      type: 'box',
      icon: 'pi-box',
      maskPropData: {
        label: 'Properties (width-height-depth)',
        mask: '99-99-99',
        placeholder: 'width-height-depth',
        value: '10-10-10',
      },
      maskPosData: {
        label: 'Position (x-y-z)',
        mask: '99-99-99',
        placeholder: 'x-y-z',
        value: '10-10-10',
      },
      properties: {
        width: 10,
        height: 10,
        depth: 10,
        color: '#0754e3',
      },
      position: new Vector3(10, 5, 5),
      fillPropsFromMask: mask => {
        if (mask) {
          const maskValues = mask.split('-');
          return {
            width: parseInt(maskValues[0]),
            height: parseInt(maskValues[1]),
            depth: parseInt(maskValues[2]),
          };
        }
        return { width: 10, height: 10, depth: 10 };
      },
      fillPosFromMask: pos => {
        if (pos) {
          const posValues = pos.split('-');
          return {
            x: parseInt(posValues[0]),
            y: parseInt(posValues[1]),
            z: parseInt(posValues[2]),
          };
        }
        return { x: 0, y: 0, z: 0 };
      },
    },
    {
      name: 'Cylinder',
      type: 'cylinder',
      icon: 'pi-database',
      maskPropData: {
        label: 'Properties (radiusTop-radiusBottom-height-radialSegments)',
        mask: '99-99-99-99-99',
        placeholder: 'radiusTop-radiusBottom-height-radialSegments',
        value: '10-10-10-10-32',
      },
      maskPosData: {
        label: 'Position (x-y-z)',
        mask: '99-99-99',
        placeholder: 'x-y-z',
        value: '10-10-10',
      },
      properties: {
        radiusTop: 10,
        radiusBottom: 10,
        height: 10,
        radialSegments: 32,
        color: '#e3b107',
      },
      position: new Vector3(10, 5, 5),
      fillPropsFromMask: mask => {
        if (mask) {
          const maskValues = mask.split('-');
          return {
            radiusTop: parseInt(maskValues[0]),
            radiusBottom: parseInt(maskValues[1]),
            height: parseInt(maskValues[2]),
            radialSegments: parseInt(maskValues[3]),
          };
        }
        return {
          radiusTop: 10,
          radiusBottom: 10,
          height: 10,
          radialSegments: 32,
        };
      },
      fillPosFromMask: pos => {
        if (pos) {
          const posValues = pos.split('-');
          return {
            x: parseInt(posValues[0]),
            y: parseInt(posValues[1]),
            z: parseInt(posValues[2]),
          };
        }
        return { x: 0, y: 0, z: 0 };
      },
    },
  ];
  public primitiveInstances: TreeNode[] = [
    {
      key: '0-0',
      label: 'Scene',
      data: 'Work Folder',
      icon: 'pi pi-fw pi-home',
      children: [],
      expanded: true,
    },
  ];
  public selectedInstance: TreeNode;
  @ViewChild('dropzone') dropzone: ElementRef;
  private eventWindowResizeHandlerRef = this.onWindowResize.bind(this);
  private eventPrimitiveDragOverHandlerRef =
    this.onPrimitiveDragOver.bind(this);
  private eventPrimitiveDropHandlerRef = this.onPrimitiveDrop.bind(this);

  ngAfterViewInit(): void {
    this.handler.createScene();
    this.handler.setAmbientLight();
    this.handler.setMainDirectionalLight();
    this.handler.toggleOrbitControls(true);
    this.handler.setAxisHelper(20);
    this.handler.setCameraToPlane(CadacPlanes.XY);
    this.setEventListeners();
  }

  ngOnDestroy(): void {
    this.removeEventListeners();
    this.handler.dispose();
  }

  handleDragStartPrimitive($event, primitive: PrimitiveType) {
    const dt = $event.dataTransfer;
    const {
      maskPropData,
      properties,
      fillPropsFromMask,
      maskPosData,
      position,
      fillPosFromMask,
    } = primitive;

    if (maskPropData) {
      const { width, height, depth } = fillPropsFromMask(maskPropData.value);
      properties.width = width || properties.width;
      properties.height = height || properties.height;
      properties.depth = depth || properties.depth;
    }

    if (maskPosData) {
      const { x, y, z } = fillPosFromMask(maskPosData.value);
      position.x = x || position.x;
      position.y = y || position.y;
      position.z = z || position.z;
    }

    dt.setData('Primitive', JSON.stringify(primitive));
  }

  handleDragEndPrimitive($event, primitive) {
    // console.log('handleDragEndPrimitive', $event, primitive);
  }

  handleDropPrimitive($event: DragEvent) {
    const dt = $event.dataTransfer;
    const primitive = dt.getData('Primitive');
    const parsedPrimitive = JSON.parse(primitive);
    this.createPrimitive(parsedPrimitive);
  }

  handleNodeSelect({ node }) {
    this.primitiveInstances[0].children.forEach(child => {
      this.handleNodeUnselect({ node: child });
    });

    const { primitive } = node.data;

    if (primitive) {
      this.handler.setLineSegments(primitive);
    }
  }

  handleNodeUnselect({ node }) {
    const { primitive } = node.data;

    if (primitive) {
      this.handler.removeLineSegments(primitive);
    }
  }

  handleInstancePositionChange($event) {
    console.log('handleInstancePositionChange', $event);
    const maskValues = $event.target.value.split('-');
    const x = parseInt(maskValues[0]);
    const y = parseInt(maskValues[1]);
    const z = parseInt(maskValues[2]);

    anime({
      targets: [this.selectedInstance.data.primitive.position],
      x,
      y,
      z,
      easing: 'easeInOutQuad',
      duration: 200,
      complete: () => {
        this.handler.updateSceneCameraPosition(300);
        this.handler.updateAxisHelper();
        this.handler.updateGridHelper();
      },
    });
  }

  private setEventListeners() {
    window.addEventListener('resize', this.eventWindowResizeHandlerRef);
    this.dropzone.nativeElement.addEventListener(
      'dragover',
      this.eventPrimitiveDragOverHandlerRef.bind(this)
    );
    this.dropzone.nativeElement.addEventListener(
      'drop',
      this.eventPrimitiveDropHandlerRef.bind(this)
    );

    this.handler.addEventListener(
      CadacEventDataTypes.OBJECT_SELECTED,
      event => {
        const primitive = event['payload'].object;
        if (primitive) {
          console.log(primitive);
          this.selectedInstance = this.primitiveInstances[0].children.find(
            child => child.data.primitive.uuid === primitive.uuid
          );

          this.selectedInstance.data.primitive = primitive;
          this.selectedInstance.data.parsedPrimitive.position =
            primitive.position;

          this.selectedInstance.data.parsedPrimitive.maskPosData.value = `${primitive.position.x}-${primitive.position.y}-${primitive.position.z}`;
        }
      }
    );

    this.handler.addEventListener(CadacEventDataTypes.OBJECT_UNSELECTED, () => {
      console.log('OBJECT_UNSELECTED');
      this.selectedInstance = null;
    });
  }

  private removeEventListeners() {
    window.removeEventListener('resize', this.eventWindowResizeHandlerRef);
    this.dropzone.nativeElement.removeEventListener(
      'dragover',
      this.eventPrimitiveDragOverHandlerRef.bind(this)
    );
    this.dropzone.nativeElement.removeEventListener(
      'drop',
      this.eventPrimitiveDropHandlerRef.bind(this)
    );
  }

  private onWindowResize() {
    this.handler.updateContainerSize();
  }

  private onPrimitiveDrop(event) {
    event.preventDefault();

    // Handle the dropped object
    this.handleDrop(event.dataTransfer.files);
  }

  private onPrimitiveDragOver(event) {
    // console.log('onPrimitiveDragOver', event);
    event.preventDefault();
    event.dataTransfer.dropEffect = 'copy';
  }

  private handleDrop(files) {
    // console.log('handleDrop', files);
  }

  private createPrimitive(parsedPrimitive: PrimitiveType) {
    const { type, properties, position } = parsedPrimitive;
    let primitive;

    switch (type) {
      case 'box':
        primitive = this.handler.createCube(
          properties.width,
          properties.height,
          properties.depth,
          properties.color,
          true,
          DEFAULTS_CADAC.UNIT,
          this.handler.SceneShapes.length === 0
        );
        break;
      case 'cylinder':
        primitive = this.handler.createCylinder(
          properties.radiusTop,
          properties.radiusBottom,
          properties.height,
          properties.radialSegments,
          properties.color,
          true,
          DEFAULTS_CADAC.UNIT,
          this.handler.SceneShapes.length === 0
        );
        break;
    }

    primitive.position.set(position.x, position.y, position.z);
    this.handler.updateAxisHelper();

    this.addPrimitiveToTree(parsedPrimitive, primitive);
  }

  private addPrimitiveToTree(parsedPrimitive: PrimitiveType, primitive) {
    this.primitiveInstances[0].children.push({
      key: `${this.primitiveInstances[0].children.length}`,
      label: parsedPrimitive.type,
      data: { parsedPrimitive, primitive },
      icon: `pi pi-fw ${parsedPrimitive.icon}`,
      children: [],
    });
  }
}
