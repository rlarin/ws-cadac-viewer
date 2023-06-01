import { DEFAULTS_CADAC } from '../../models/types';
import { UnitsHelper } from '../units-helper';
import { GridHelper } from 'three';

const useSetGridHelper = (
  scope,
  size?,
  divisions?,
  color1 = DEFAULTS_CADAC.DEFAULT_GRID_COLOR1,
  color2 = DEFAULTS_CADAC.DEFAULT_GRID_COLOR2
) => {
  const boundingBox = UnitsHelper.getConvertedBoundingBox(scope.scene);
  const max = Math.max(boundingBox.max.x, boundingBox.max.y, boundingBox.max.z);

  const gridHelperSize = size || max * 1.5;
  const gridHelperDivisions = divisions || gridHelperSize;

  if (scope.gridHelper) {
    for (let i = 0; i < scope.scene.children.length; i++) {
      const child = scope.scene.children[i];
      if (child.type === 'GridHelper') {
        child.clear();
        scope.scene.remove(child);
        break;
      }
    }

    scope.gridHelper = undefined;
  }

  scope.gridHelper = new GridHelper(
    gridHelperSize,
    gridHelperDivisions,
    color1,
    color2
  );

  scope.scene.add(scope.gridHelper);
};

export default useSetGridHelper;
