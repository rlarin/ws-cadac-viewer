import { DEFAULTS_CADAC } from '../../models/types';
import { UnitsHelper } from '../units-helper';
import { AxesHelper } from 'three';
import Troika from 'troika-three-text';
import { calculateContrastColor } from './utility-functions';

const useSetAxesHelper = (
  scope,
  size = DEFAULTS_CADAC.DEFAULT_AXES_SIZE,
  fontSize = DEFAULTS_CADAC.DEFAULT_FONT_SIZE
) => {
  const boundingBox = UnitsHelper.getConvertedBoundingBox(scope.scene);
  const max = Math.max(boundingBox.max.x, boundingBox.max.y, boundingBox.max.z);

  scope.axesHelperSize = size || max * 1.5;
  scope.axesHelper = new AxesHelper(scope.axesHelperSize);
  const x = new Troika.Text();
  const y = new Troika.Text();
  const z = new Troika.Text();
  x.text = 'X';
  y.text = 'Y';
  z.text = 'Z';
  x.fontSize = y.fontSize = z.fontSize = fontSize;

  x.position.x = y.position.y = z.position.z = scope.axesHelperSize + fontSize;

  x.position.y = x.fontSize / 2;
  y.position.x = (y.fontSize / 2) * -0.5;
  z.position.y = z.fontSize / 2;

  y.rotateY(Math.PI / 4);
  z.rotateY(Math.PI / 2);

  z.color =
    y.color =
    x.color =
      calculateContrastColor(scope.options.sceneBackground);

  scope.axesHelper.add(x);
  scope.axesHelper.add(y);
  scope.axesHelper.add(z);

  scope.updateRestrictedPlanes();

  scope.scene.add(scope.axesHelper);
};

export default useSetAxesHelper;
