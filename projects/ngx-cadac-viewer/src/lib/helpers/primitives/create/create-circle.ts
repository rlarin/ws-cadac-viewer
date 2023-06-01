import { CadacUnits, DEFAULTS_CADAC } from '../../../models/types';
import { UnitsHelper } from '../../units-helper';
import { CircleGeometry, DoubleSide, Mesh, MeshBasicMaterial } from 'three';

const createCircle = (
  radius = 1,
  segments = 8,
  color: string = DEFAULTS_CADAC.COLOR,
  unit: CadacUnits = DEFAULTS_CADAC.UNIT
) => {
  const { radius: convertedRadius } = UnitsHelper.convertCircleUnits(
    radius,
    unit
  );

  const geometry = new CircleGeometry(
    convertedRadius,
    segments,
    0,
    Math.PI * 2
  );
  const material = new MeshBasicMaterial({
    color,
    side: DoubleSide,
    transparent: true,
  });
  const circle = new Mesh(geometry, material);
  circle.castShadow = true;
  circle.receiveShadow = true;

  return circle;
};

export default createCircle;
