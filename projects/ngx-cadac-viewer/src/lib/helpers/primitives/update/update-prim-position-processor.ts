import { Box3 } from 'three';

const updatePrimPositionProcessor = (scope, prim) => {
  const { x, y, z } = prim.position;
  const bbox = new Box3().setFromObject(prim);

  const width = bbox.max.x - bbox.min.x;
  const height = bbox.max.y - bbox.min.y;
  const depth = bbox.max.z - bbox.min.z;

  prim.position.set(
    scope.options.restrictToPositiveQuadrant?.YZ
      ? x - width / 2 > 0
        ? x
        : width / 2
      : x,
    scope.options.restrictToPositiveQuadrant?.XZ
      ? y - height / 2 > 0
        ? y
        : height / 2
      : y,
    scope.options.restrictToPositiveQuadrant?.XY
      ? z - depth / 2 > 0
        ? z
        : depth / 2
      : z
  );

  scope.debouncedObjectChangedEmitter();
};

export default updatePrimPositionProcessor;
