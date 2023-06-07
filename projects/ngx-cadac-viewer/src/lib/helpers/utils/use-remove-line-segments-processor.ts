import { CadacThreeShape } from '../../models/types';
import { LineSegments } from 'three';

const useRemoveLineSegmentsProcessor = (shape: CadacThreeShape) => {
  shape?.child?.forEach(child => {
    if (child instanceof LineSegments) {
      shape.remove(child);
    }
  });
};

export default useRemoveLineSegmentsProcessor;
