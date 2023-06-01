import { CadacUnits, DEFAULTS_CADAC } from '../../models/types';
import { UnitsHelper } from '../units-helper';
import { DoubleSide, Mesh, MeshBasicMaterial, PlaneGeometry } from 'three';

const createPlane = (
  width = 1,
  height = 1,
  color: string = DEFAULTS_CADAC.COLOR,
  unit: CadacUnits = DEFAULTS_CADAC.UNIT
) => {
  const { width: convertedWidth, height: convertedHeight } =
    UnitsHelper.convertPlaneUnits(width, height, unit);

  const geometry = new PlaneGeometry(convertedWidth, convertedHeight);
  const material = new MeshBasicMaterial({
    color,
    side: DoubleSide,
    transparent: true,
  });
  const plane = new Mesh(geometry, material);
  plane.castShadow = true;
  plane.receiveShadow = true;

  return plane;
};

export default createPlane;
