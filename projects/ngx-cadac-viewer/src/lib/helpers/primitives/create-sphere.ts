import { CadacUnits, DEFAULTS_CADAC } from '../../models/types';
import { UnitsHelper } from '../units-helper';
import { Mesh, MeshBasicMaterial, SphereGeometry } from 'three';

const createSphere = (
  radius = 1,
  color: string = DEFAULTS_CADAC.COLOR,
  unit: CadacUnits = DEFAULTS_CADAC.UNIT
) => {
  const { radius: convertedRadius } = UnitsHelper.convertSphereUnits(
    radius,
    unit
  );

  const geometry = new SphereGeometry(convertedRadius);
  const material = new MeshBasicMaterial({ color, transparent: true });
  const sphere = new Mesh(geometry, material);
  sphere.castShadow = true;
  sphere.receiveShadow = true;

  return sphere;
};

export default createSphere;
