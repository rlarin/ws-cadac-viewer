import { CadacThree } from 'ngx-cadac-viewer';

export const CsgHandler = (handler: CadacThree) => {
  handler.createScene();

  const cube = handler.createCube(10, 10, 10, '#09ff00');
  handler.setLineSegments(cube, '#046e00');

  handler.setAmbientLight();
  handler.setAxisHelper(30);
  handler.toggleOrbitControls(true);
};
