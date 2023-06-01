import { CadacUnits, DEFAULTS_CADAC } from '../../models/types';
import { UnitsHelper } from '../units-helper';
import { CylinderGeometry, Mesh, MeshBasicMaterial } from 'three';

const createCylinder = (
  radiusTop = 1,
  radiusBottom = 1,
  height = 1,
  radialSegments = 8,
  color: string = DEFAULTS_CADAC.COLOR,
  unit: CadacUnits = DEFAULTS_CADAC.UNIT
) => {
  const {
    radiusTop: convertedRadiusTop,
    radiusBottom: convertedRadiusBottom,
    height: convertedHeight,
  } = UnitsHelper.convertCylinderUnits(radiusTop, radiusBottom, height, unit);

  const geometry = new CylinderGeometry(
    convertedRadiusTop,
    convertedRadiusBottom,
    convertedHeight,
    radialSegments
  );
  const material = new MeshBasicMaterial({ color, transparent: true });
  const cylinder = new Mesh(geometry, material);
  cylinder.castShadow = true;
  cylinder.receiveShadow = true;

  return cylinder;
};

export default createCylinder;
