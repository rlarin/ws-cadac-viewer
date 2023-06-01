import { Group } from 'three';
import { MTLLoader } from 'three/examples/jsm/loaders/MTLLoader';
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader';

const MtlCadacLoader = (
  scope: any,
  selectedObject,
  { content, filename }: { content: string; filename: string },
  callback?: (obj: Group) => void
) => {
  const mtlLoader = new MTLLoader();
  const materials = mtlLoader.parse(content, '');
  // Apply the materials to the loaded object
  materials.preload();

  const object = new OBJLoader()
    .setMaterials(materials)
    .parse(selectedObject.userData.content);

  object.name = selectedObject.name || filename;
  scope.scene.add(object);
  scope.scene.remove(selectedObject);
  scope.sceneShapes = scope.sceneShapes.filter(
    shape => shape.id !== selectedObject.id
  );
  scope.selectedObject = object;

  if (callback) {
    callback(scope.selectedObject);
  }
};

export default MtlCadacLoader;
