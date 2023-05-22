import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader';
import { Group } from 'three';

const ObjCadacLoader = (
  scope: any,
  { content, filename }: { content: string; filename: string },
  callback?: (obj: Group) => void
) => {
  const object = new OBJLoader().parse(content);
  object.name = filename;
  scope.scene.add(object);

  scope.updateLightPosition();
  scope.updateCameraPosition();
  // scope.sceneShapes.push(object);

  if (callback) {
    callback(object);
  }
};

export default ObjCadacLoader;
