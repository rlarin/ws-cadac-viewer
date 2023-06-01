import {
  CadacCSGOperation,
  CadacMergeMesh,
  DEFAULTS_CADAC,
} from '../../models/types';
import { Mesh, MeshPhongMaterial } from 'three';
import { CSG } from 'three-csg-ts';

const csgOperator = (
  meshData1: CadacMergeMesh,
  meshData2: CadacMergeMesh,
  operator: CadacCSGOperation = CadacCSGOperation.SUBTRACT,
  color: string = DEFAULTS_CADAC.COLOR
) => {
  const { mesh: mesh1 } = meshData1;
  const { mesh: mesh2 } = meshData2;

  mesh1.position.set(
    meshData1.position.x,
    meshData1.position.y,
    meshData1.position.z
  );
  mesh1.updateMatrix();

  mesh2.position.set(
    meshData2.position.x,
    meshData2.position.y,
    meshData2.position.z
  );
  mesh2.updateMatrix();

  let resultShape = new Mesh();

  switch (operator) {
    case CadacCSGOperation.SUBTRACT:
      resultShape = CSG.subtract(mesh1, mesh2);
      break;
    case CadacCSGOperation.UNION:
      resultShape = CSG.union(mesh1, mesh2);
      break;
    case CadacCSGOperation.INTERSECT:
      resultShape = CSG.intersect(mesh1, mesh2);
      break;
  }

  resultShape.castShadow = true;
  resultShape.receiveShadow = true;
  resultShape.material = new MeshPhongMaterial({ color, transparent: true });

  return resultShape;
};

export default csgOperator;
