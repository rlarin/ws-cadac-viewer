import { Group } from 'three';

const PrimCadacLoader = (
  scope: any,
  { content, filename }: { content: string; filename: string },
  callback?: (obj: Group) => void
) => {
  // const object = scope.parsePrim(content);
  // object.name = filename;
  // scope.scene.add(object);

  scope.updateLightPosition();
  scope.updateCameraPosition();

  // if (callback) {
  //   callback(object);
  // }
};

export default PrimCadacLoader;
