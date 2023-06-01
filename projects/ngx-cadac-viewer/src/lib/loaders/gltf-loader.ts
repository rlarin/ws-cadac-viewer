import { Group } from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader';
import { CadacFileTypes } from '../models/types';
import adjustScene from './adjust-scene';

const GltfCadacLoader = (
  scope: any,
  { baseUrl, objName },
  callback?: (obj: Group) => void,
  progress?: (percent, xhr: ProgressEvent<EventTarget>) => void
) => {
  const loader = new GLTFLoader();
  const dracoLoader = new DRACOLoader();
  dracoLoader.setDecoderPath('/examples/jsm/libs/draco/');
  loader.setDRACOLoader(dracoLoader);

  loader.load(
    `${baseUrl}/${objName}.${CadacFileTypes.GLTF}`,
    gltf => {
      const object = gltf.scene;
      object.name = objName;
      scope.scene.add(object);
      adjustScene(scope, object);

      if (callback) {
        callback(object);
      }
    },
    xhr => {
      progress((xhr.loaded / xhr.total) * 100, xhr);
    },
    error => {
      console.error('An error happened', error);
    }
  );
};

export default GltfCadacLoader;
