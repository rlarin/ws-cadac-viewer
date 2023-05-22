import { Group, LoadingManager } from 'three';
import { MTLLoader } from 'three/examples/jsm/loaders/MTLLoader';
import ObjCadacLoader from './obj-loader';

const MtlCadacLoader = (
  scope: any,
  { content, filename }: { content: string; filename: string },
  callback?: (obj: Group) => void
) => {
  const manager = new LoadingManager();
  const loader = new MTLLoader();
  loader.setMaterialOptions({ ignoreZeroRGBs: true });
  loader.setPath(scope.path);

  if (callback) {
    // callback(object);
  }
};

export default MtlCadacLoader;
