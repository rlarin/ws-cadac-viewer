import { CadacThreeShape } from '../../../models/types';

const updatePrimOpacity = (
  scope,
  opacity: number,
  object?: CadacThreeShape
) => {
  const updatedObject = object || scope.selectedObject;
  updatedObject.material.opacity = opacity;
  updatedObject.material.needsUpdate = true;
};

export default updatePrimOpacity;
