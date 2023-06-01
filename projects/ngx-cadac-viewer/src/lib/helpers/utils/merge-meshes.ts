import { CadacMergeMesh, DEFAULTS_CADAC } from '../../models/types';
import { BufferGeometry, Mesh, MeshPhongMaterial } from 'three';
import * as BufferGeometryUtils from 'three/examples/jsm/utils/BufferGeometryUtils.js';

const mergeMeshes = (
  meshes: CadacMergeMesh[],
  color: string = DEFAULTS_CADAC.COLOR
) => {
  const mergedGeometry = new BufferGeometry();
  const mergedMaterial = new MeshPhongMaterial({ color, transparent: true });
  const mergedMesh = new Mesh(mergedGeometry, mergedMaterial);

  const geometries = meshes.map(meshObj => {
    const { x, y, z } = meshObj.position;
    meshObj.mesh.position.set(x, y, z);
    meshObj.mesh.updateMatrix();
    meshObj.mesh.geometry.applyMatrix4(meshObj.mesh.matrix);

    return meshObj.mesh.geometry;
  });

  const mergedGeometryBuffer = BufferGeometryUtils.mergeGeometries(geometries);
  mergedGeometryBuffer.computeBoundingSphere();
  mergedGeometryBuffer.computeBoundingBox();
  mergedGeometryBuffer.computeVertexNormals();
  mergedGeometry.copy(mergedGeometryBuffer);

  return mergedMesh;
};

export default mergeMeshes;
