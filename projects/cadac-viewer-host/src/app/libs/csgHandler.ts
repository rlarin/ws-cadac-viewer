import { CadacThree } from 'ngx-cadac-viewer';
import { Vector3 } from 'three';

export type HandlerType = {
  handler: CadacThree;
  parameters: {
    width: number;
    height: number;
    depth: number;
    position: Vector3;
  };
};

export const CsgHandler = ({ handler, parameters }: HandlerType) => {
  handler.createScene();

  const cube = handler.createCube(
    parameters.width,
    parameters.height,
    parameters.depth,
    '#09ff00'
  );
  cube.position.set(
    parameters.position.x,
    parameters.position.y,
    parameters.position.z
  );
  handler.setLineSegments(cube, '#046e00');
  handler.setAmbientLight();
  handler.setAxisHelper(30);
  handler.setGridHelper(60, 60, '#e30e0e', '#7a7979');
  handler.toggleOrbitControls(true);
};
