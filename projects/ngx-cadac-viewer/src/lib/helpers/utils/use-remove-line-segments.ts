import { CadacThreeShape } from '../../models/types';

const useRemoveLineSegments = (scope, shape: CadacThreeShape) => {
  if (shape.isGroup) {
    shape.children.forEach(child => {
      scope.removeLineSegmentsProcessor(child as CadacThreeShape);
    });
  } else {
    scope.removeLineSegmentsProcessor(shape);
  }
};

export default useRemoveLineSegments;
