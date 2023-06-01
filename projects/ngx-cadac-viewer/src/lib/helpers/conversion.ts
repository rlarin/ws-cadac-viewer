import { CadacUnits } from '../models/types';

export class Conversion {
  static convertToThreeUnits(
    value: number,
    from: CadacUnits,
    to: CadacUnits
  ): number {
    if (Number.isFinite(value)) {
      switch (from) {
        case CadacUnits.MM:
          switch (to) {
            case CadacUnits.MM:
              return value;
            case CadacUnits.CM:
              return value / 10;
            case CadacUnits.IN:
              return value / 25.4;
            case CadacUnits.M:
              return value / 1000;
            case CadacUnits.KM:
              return value / 1000000;
          }
          break;

        case CadacUnits.CM:
          switch (to) {
            case CadacUnits.MM:
              return value * 10;
            case CadacUnits.CM:
              return value;
            case CadacUnits.IN:
              return value / 2.54;
            case CadacUnits.M:
              return value / 100;
            case CadacUnits.KM:
              return value / 100000;
          }
          break;

        case CadacUnits.M:
          switch (to) {
            case CadacUnits.MM:
              return value * 1000;
            case CadacUnits.CM:
              return value * 100;
            case CadacUnits.IN:
              return value * 39.37;
            case CadacUnits.M:
              return value;
            case CadacUnits.KM:
              return value / 1000;
          }
          break;

        case CadacUnits.IN:
          switch (to) {
            case CadacUnits.MM:
              return value * 25.4;
            case CadacUnits.CM:
              return value * 2.54;
            case CadacUnits.IN:
              return value;
            case CadacUnits.M:
              return value / 39.37;
            case CadacUnits.KM:
              return value / 39370.079;
          }
          break;

        case CadacUnits.KM:
          switch (to) {
            case CadacUnits.MM:
              return value * 1000000;
            case CadacUnits.CM:
              return value * 100000;
            case CadacUnits.M:
              return value * 1000;
            case CadacUnits.IN:
              return value * 39370.079;
            case CadacUnits.KM:
              return value;
          }
          break;

        default:
          return value;
      }
    }
    return value;
  }
}
