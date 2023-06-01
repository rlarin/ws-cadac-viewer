import { CadacThreeShape } from '../../models/types';
import { LineSegments } from 'three';

const useRemoveLineSegmentsProcessor = (shape: CadacThreeShape) => {
  shape.traverse(child => {
    if (child instanceof LineSegments) {
      shape.remove(child);
    }
  });
};

export default useRemoveLineSegmentsProcessor;
