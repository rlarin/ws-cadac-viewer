import { DoubleSide, Mesh, MeshBasicMaterial, PlaneGeometry } from 'three';

export const useCreateRestrictedPlane = ({
  size,
  color,
  opacity,
  position,
}) => {
  const geometry = new PlaneGeometry(size, size);
  const material = new MeshBasicMaterial({
    color,
    transparent: true,
    opacity,
    side: DoubleSide,
  });
  const plane = new Mesh(geometry, material);
  plane.position.set(position.x, position.y, position.z);
  return plane;
};
