import { CadacThreeShape } from '../../models/types';
import useSetSegmentLineProcessor from './use-set-segment-line-processor';

const useSetLineSegments = (shape: CadacThreeShape, color = '#a4a4a4') => {
  if (shape.isGroup) {
    shape.children.forEach(child => {
      useSetSegmentLineProcessor(child as CadacThreeShape, color);
    });
  } else {
    useSetSegmentLineProcessor(shape, color);
  }
};

export default useSetLineSegments;
