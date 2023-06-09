import { CadacThree } from 'ngx-cadac-viewer';
import { Vector3 } from 'three';

export type HandlerType = {
  handler: CadacThree;
  parameters: {
    width: number;
    height: number;
    depth: number;
    position: Vector3;
    color: string;
  };
};

export const CsgHandler = ({ handler, parameters }: HandlerType) => {
  handler.createScene();

  const cube = handler.createCube(
    parameters.width,
    parameters.height,
    parameters.depth,
    parameters.color
  );
  cube.position.set(
    parameters.position.x,
    parameters.position.y,
    parameters.position.z
  );

  handler.setLineSegments(cube, '#046e00');
  handler.setAmbientLight();
  handler.setAxesHelper(30);
  handler.setGridHelper(60, 60, '#e30e0e', '#7a7979');
  handler.toggleOrbitControls(true);
};
