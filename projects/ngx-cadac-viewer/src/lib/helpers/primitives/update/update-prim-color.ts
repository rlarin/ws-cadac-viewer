import { CadacThreeShape } from '../../../models/types';
import { LineSegments, Material } from 'three';
import { calculateContrastColor } from '../../utils/utility-functions';

const updatePrimColor = (scope, color: string, object?: CadacThreeShape) => {
  const updatedObject = object || scope.selectedObject;
  if (
    !(updatedObject instanceof LineSegments) &&
    updatedObject?.material &&
    updatedObject?.material instanceof Material
  ) {
    updatedObject.material.color.set(color);
    updatedObject.material.needsUpdate = true;
  }
  updatedObject?.children?.forEach(child => {
    if (child instanceof LineSegments) {
      const contrastColor = calculateContrastColor(color);
      child.material.color.set(contrastColor);
      child.material.needsUpdate = true;
    }

    updatePrimColor(color, child as CadacThreeShape);
  });
};

export default updatePrimColor;
