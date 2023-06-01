import { CadacUnits, DEFAULTS_CADAC } from '../models/types';
import { Conversion } from './conversion';
import { Box3, Scene, Vector3 } from 'three';

export class UnitsHelper {
  static convertCubeUnits(
    width: number,
    height: number,
    depth: number,
    unit: CadacUnits = DEFAULTS_CADAC.UNIT
  ) {
    width = Conversion.convertToThreeUnits(width, unit, DEFAULTS_CADAC.UNIT);
    height = Conversion.convertToThreeUnits(height, unit, DEFAULTS_CADAC.UNIT);
    depth = Conversion.convertToThreeUnits(depth, unit, DEFAULTS_CADAC.UNIT);

    return { width, height, depth };
  }

  static convertSphereUnits(
    radius: number,
    unit: CadacUnits = DEFAULTS_CADAC.UNIT
  ) {
    radius = Conversion.convertToThreeUnits(radius, unit, DEFAULTS_CADAC.UNIT);

    return { radius };
  }

  static convertCameraUnits(
    near: number,
    far: number,
    unit: CadacUnits = DEFAULTS_CADAC.UNIT
  ) {
    near = Conversion.convertToThreeUnits(near, unit, DEFAULTS_CADAC.UNIT);
    far = Conversion.convertToThreeUnits(far, unit, DEFAULTS_CADAC.UNIT);

    return { near, far };
  }

  static convertCameraPosition(
    x: number,
    y: number,
    z: number,
    unit: CadacUnits = DEFAULTS_CADAC.UNIT
  ) {
    x = Conversion.convertToThreeUnits(x, unit, DEFAULTS_CADAC.UNIT);
    y = Conversion.convertToThreeUnits(y, unit, DEFAULTS_CADAC.UNIT);
    z = Conversion.convertToThreeUnits(z, unit, DEFAULTS_CADAC.UNIT);

    return { x, y, z };
  }

  static getConvertedBoundingBox(
    scene: Scene,
    unit: CadacUnits = DEFAULTS_CADAC.UNIT
  ) {
    // const boundingBox = new Box3().setFromObject(scene);

    const maxBbox = new Vector3();
    const minBbox = new Vector3();
    scene.children.forEach(child => {
      if (child['isTransformControls']) {
        return;
      }
      const childBbox = new Box3().setFromObject(child);
      if (Number.isFinite(childBbox.max.x) && childBbox.max.x > maxBbox.x) {
        maxBbox.x = childBbox.max.x;
      }

      if (Number.isFinite(childBbox.min.x) && childBbox.min.x < minBbox.x) {
        minBbox.x = childBbox.min.x;
      }

      if (Number.isFinite(childBbox.max.y) && childBbox.max.y > maxBbox.y) {
        maxBbox.y = childBbox.max.y;
      }

      if (Number.isFinite(childBbox.min.y) && childBbox.min.y < minBbox.y) {
        minBbox.y = childBbox.min.y;
      }

      if (Number.isFinite(childBbox.max.z) && childBbox.max.z > maxBbox.z) {
        maxBbox.z = childBbox.max.z;
      }

      if (Number.isFinite(childBbox.min.z) && childBbox.min.z < minBbox.z) {
        minBbox.z = childBbox.min.z;
      }
    });

    const boundingBox = new Box3(minBbox, maxBbox);

    const { min, max } = boundingBox;
    const { x: minX, y: minY, z: minZ } = min;
    const { x: maxX, y: maxY, z: maxZ } = max;

    return new Box3(
      new Vector3(
        Conversion.convertToThreeUnits(minX, DEFAULTS_CADAC.UNIT, unit),
        Conversion.convertToThreeUnits(minY, DEFAULTS_CADAC.UNIT, unit),
        Conversion.convertToThreeUnits(minZ, DEFAULTS_CADAC.UNIT, unit)
      ),
      new Vector3(
        Conversion.convertToThreeUnits(maxX, DEFAULTS_CADAC.UNIT, unit),
        Conversion.convertToThreeUnits(maxY, DEFAULTS_CADAC.UNIT, unit),
        Conversion.convertToThreeUnits(maxZ, DEFAULTS_CADAC.UNIT, unit)
      )
    );
  }

  static convertConeUnits(
    radius: number,
    height: number,
    unit: CadacUnits = DEFAULTS_CADAC.UNIT
  ) {
    radius = Conversion.convertToThreeUnits(radius, unit, DEFAULTS_CADAC.UNIT);
    height = Conversion.convertToThreeUnits(height, unit, DEFAULTS_CADAC.UNIT);

    return { radius, height };
  }

  static convertCylinderUnits(
    radiusTop: number,
    radiusBottom: number,
    height: number,
    unit: CadacUnits = DEFAULTS_CADAC.UNIT
  ) {
    radiusTop = Conversion.convertToThreeUnits(
      radiusTop,
      unit,
      DEFAULTS_CADAC.UNIT
    );
    radiusBottom = Conversion.convertToThreeUnits(
      radiusBottom,
      unit,
      DEFAULTS_CADAC.UNIT
    );
    height = Conversion.convertToThreeUnits(height, unit, DEFAULTS_CADAC.UNIT);

    return { radiusTop, radiusBottom, height };
  }

  static convertCapsuleUnits(
    radius: number,
    length: number,
    unit: CadacUnits = DEFAULTS_CADAC.UNIT
  ) {
    radius = Conversion.convertToThreeUnits(radius, unit, DEFAULTS_CADAC.UNIT);
    length = Conversion.convertToThreeUnits(length, unit, DEFAULTS_CADAC.UNIT);

    return { radius, length };
  }

  static convertCircleUnits(
    radius: number,
    unit: CadacUnits = DEFAULTS_CADAC.UNIT
  ) {
    radius = Conversion.convertToThreeUnits(radius, unit, DEFAULTS_CADAC.UNIT);

    return { radius };
  }

  static convertPlaneUnits(
    width: number,
    height: number,
    unit: CadacUnits = DEFAULTS_CADAC.UNIT
  ) {
    width = Conversion.convertToThreeUnits(width, unit, DEFAULTS_CADAC.UNIT);
    height = Conversion.convertToThreeUnits(height, unit, DEFAULTS_CADAC.UNIT);

    return { width, height };
  }
}
