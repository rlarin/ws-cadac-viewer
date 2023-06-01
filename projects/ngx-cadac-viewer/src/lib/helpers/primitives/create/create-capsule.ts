import { CadacUnits, DEFAULTS_CADAC } from '../../../models/types';
import { UnitsHelper } from '../../units-helper';
import { CapsuleGeometry, Mesh, MeshBasicMaterial } from 'three';

const createCapsule = (
  radius = 1,
  length = 1,
  capSegments = 8,
  radialSegments = 8,
  color: string = DEFAULTS_CADAC.COLOR,
  unit: CadacUnits = DEFAULTS_CADAC.UNIT
) => {
  const { radius: convertedRadius, length: convertedLength } =
    UnitsHelper.convertCapsuleUnits(radius, length, unit);
  const geometry = new CapsuleGeometry(
    convertedRadius,
    convertedLength,
    capSegments,
    radialSegments
  );
  const material = new MeshBasicMaterial({ color, transparent: true });
  const capsule = new Mesh(geometry, material);
  capsule.castShadow = true;
  capsule.receiveShadow = true;

  return capsule;
};

export default createCapsule;
