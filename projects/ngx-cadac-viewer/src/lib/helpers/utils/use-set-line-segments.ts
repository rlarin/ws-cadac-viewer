import { CadacThreeShape } from '../../models/types';

const useSetLineSegments = (
  scope,
  shape: CadacThreeShape,
  color = '#a4a4a4'
) => {
  if (shape.isGroup) {
    shape.children.forEach(child => {
      scope.setLineSegmentsProcessor(child as CadacThreeShape, color);
    });
  } else {
    scope.setLineSegmentsProcessor(shape, color);
  }
};

export default useSetLineSegments;
