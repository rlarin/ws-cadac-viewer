import { CadacThreeShape } from '../../models/types';
import { EdgesGeometry, LineBasicMaterial, LineSegments } from 'three';

const useSetSegmentLineProcessor = (
  shape: CadacThreeShape,
  color = '#a4a4a4'
) => {
  const edges = new EdgesGeometry(shape.geometry);
  const line = new LineSegments(edges, new LineBasicMaterial({ color }));
  shape.add(line);
};

export default useSetSegmentLineProcessor;
