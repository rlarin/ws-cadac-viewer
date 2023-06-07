import { BufferGeometry, EdgesGeometry, LineSegments } from 'three';
import { CadacThreeShape } from '../../../models/types';

const updatePrimGeometry = (
  scope,
  geometry: BufferGeometry,
  object?: CadacThreeShape
) => {
  const updatedObject = object || scope.selectedObject;
  updatedObject.geometry.dispose();
  updatedObject.geometry = geometry;
  updatedObject.geometry.computeBoundingBox();
  updatedObject.geometry.computeBoundingSphere();
  updatedObject?.children?.forEach(child => {
    if (child instanceof LineSegments) {
      child.geometry.dispose();
      child.geometry = new EdgesGeometry(updatedObject.geometry);
    }
  });
  scope.updateObjectPosition();
};

export default updatePrimGeometry;
