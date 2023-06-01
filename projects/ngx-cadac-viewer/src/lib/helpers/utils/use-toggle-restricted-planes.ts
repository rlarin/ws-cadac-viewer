import { CadacPlanes } from '../../models/types';

const useToggleRestrictedPlanes = (scope, planes: CadacPlanes[]) => {
  planes.forEach(
    plane =>
      (scope.options.restrictToPositiveQuadrant[plane] =
        !scope.options.restrictToPositiveQuadrant[plane])
  );
  scope.updateRestrictedPlanes();
};

export default useToggleRestrictedPlanes;
