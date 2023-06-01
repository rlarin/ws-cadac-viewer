import { CadacUnits, DEFAULTS_CADAC } from '../../models/types';
import { UnitsHelper } from '../units-helper';
import { BoxGeometry, Mesh, MeshBasicMaterial } from 'three';

const createCube = (
  width = 1,
  height = 1,
  depth = 1,
  color: string = DEFAULTS_CADAC.COLOR,
  unit: CadacUnits = DEFAULTS_CADAC.UNIT
) => {
  const {
    width: convertedWidth,
    height: convertedHeight,
    depth: convertedDepth,
  } = UnitsHelper.convertCubeUnits(width, height, depth, unit);

  const geometry = new BoxGeometry(
    convertedWidth,
    convertedHeight,
    convertedDepth
  );
  const material = new MeshBasicMaterial({ color, transparent: true });
  const cube = new Mesh(geometry, material);
  cube.castShadow = true;
  cube.receiveShadow = false;

  return cube;
};

export default createCube;
