import { CadacUnits, DEFAULTS_CADAC } from '../../models/types';
import { UnitsHelper } from '../units-helper';
import { ConeGeometry, Mesh, MeshBasicMaterial } from 'three';

const createCone = (
  radius = 1,
  height = 1,
  radialSegments = 8,
  color: string = DEFAULTS_CADAC.COLOR,
  unit: CadacUnits = DEFAULTS_CADAC.UNIT
) => {
  const { radius: convertedRadius, height: convertedHeight } =
    UnitsHelper.convertConeUnits(radius, height, unit);

  const geometry = new ConeGeometry(
    convertedRadius,
    convertedHeight,
    radialSegments
  );
  const material = new MeshBasicMaterial({ color, transparent: true });
  const cone = new Mesh(geometry, material);
  cone.castShadow = true;
  cone.receiveShadow = true;

  return cone;
};

export default createCone;
