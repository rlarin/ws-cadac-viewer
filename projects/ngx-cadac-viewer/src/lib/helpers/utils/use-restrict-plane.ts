import { CadacPlanes, DEFAULTS_CADAC } from '../../models/types';
import { Vector3 } from 'three';
import { useCreateRestrictedPlane } from '../planes-helper';

const useRestrictPlane = (
  scope,
  plane: CadacPlanes,
  size,
  color = DEFAULTS_CADAC.DEFAULT_RESTRICTED_PLANE_COLOR,
  opacity = DEFAULTS_CADAC.DEFAULT_RESTRICTED_PLANE_OPACITY
) => {
  switch (plane) {
    case 'XY':
      scope.restrictedQuadrants['XY'] = useCreateRestrictedPlane({
        size,
        color,
        opacity,
        position: new Vector3(15, 15, 0),
      });
      return scope.restrictedQuadrants['XY'];
    case 'XZ':
      scope.restrictedQuadrants['XZ'] = useCreateRestrictedPlane({
        size,
        color: '#ff0000',
        opacity: 0.05,
        position: new Vector3(15, 0, 15),
      }).rotateX(Math.PI / 2);
      return scope.restrictedQuadrants['XZ'];
    case 'YZ':
      scope.restrictedQuadrants['YZ'] = useCreateRestrictedPlane({
        size,
        color: '#ff0000',
        opacity: 0.05,
        position: new Vector3(0, 15, 15),
      }).rotateY(Math.PI / 2);
      return scope.restrictedQuadrants['YZ'];
  }
};

export default useRestrictPlane;
