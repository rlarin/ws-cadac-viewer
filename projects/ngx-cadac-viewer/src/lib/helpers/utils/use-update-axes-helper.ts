import { UnitsHelper } from '../units-helper';

const useUpdateAxesHelper = (scope, size?, fontSize?) => {
  if (scope.axesHelper) {
    scope.axesHelper = null;
    for (let i = 0; i < scope.scene.children.length; i++) {
      const child = scope.scene.children[i];
      if (child.type === 'AxesHelper') {
        child.clear();
        scope.scene.remove(child);
        break;
      }
    }

    const boundingBox = UnitsHelper.getConvertedBoundingBox(scope.scene);
    const max = Math.max(
      boundingBox.max.x,
      boundingBox.max.y,
      boundingBox.max.z
    );

    scope.setAxesHelper(size || max, fontSize);
  }
};

export default useUpdateAxesHelper;
