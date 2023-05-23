import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader';
import { Group } from 'three';
import { MTLLoader } from 'three/examples/jsm/loaders/MTLLoader';
import adjustScene from './adjust-scene';

export const ObjCadacLoader = (
  scope: any,
  { content, filename }: { content: string; filename: string },
  callback?: (obj: Group) => void
) => {
  const object = new OBJLoader().parse(content);
  object.name = filename;
  object.userData = {
    content,
  };
  scope.scene.add(object);
  adjustScene(scope, object);

  if (callback) {
    callback(object);
  }
};

export const ObjCadacLoaderFromUrl = (
  scope: any,
  { baseUrl, objName },
  callback?: (obj: Group) => void,
  progress?: (percent, xhr: ProgressEvent<EventTarget>) => void
) => {
  const mtlLoader = new MTLLoader();
  mtlLoader.load(
    `${baseUrl}/${objName}.mtl`,
    materials => {
      materials.preload();
      const objLoader = new OBJLoader();
      objLoader.setMaterials(materials);
      objLoader.load(`${baseUrl}/${objName}.obj`, object => {
        object.name = objName;
        scope.scene.add(object);
        adjustScene(scope, object);

        if (callback) {
          callback(object);
        }
      });
    },
    xhr => {
      progress((xhr.loaded / xhr.total) * 100, xhr);
    },
    error => {
      console.error('An error happened', error);
    }
  );
};
