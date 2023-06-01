import { CadacUnits } from '../models/types';

export class Conversion {
  static convertToThreeUnits(
    value: number,
    from: CadacUnits,
    to: CadacUnits
  ): number {
    if (Number.isFinite(value)) {
      switch (from) {
        case CadacUnits.mm:
          switch (to) {
            case CadacUnits.mm:
              return value;
            case CadacUnits.cm:
              return value / 10;
            case CadacUnits.inch:
              return value / 25.4;
            case CadacUnits.m:
              return value / 1000;
            case CadacUnits.km:
              return value / 1000000;
          }
          break;

        case CadacUnits.cm:
          switch (to) {
            case CadacUnits.mm:
              return value * 10;
            case CadacUnits.cm:
              return value;
            case CadacUnits.inch:
              return value / 2.54;
            case CadacUnits.m:
              return value / 100;
            case CadacUnits.km:
              return value / 100000;
          }
          break;

        case CadacUnits.m:
          switch (to) {
            case CadacUnits.mm:
              return value * 1000;
            case CadacUnits.cm:
              return value * 100;
            case CadacUnits.inch:
              return value * 39.37;
            case CadacUnits.m:
              return value;
            case CadacUnits.km:
              return value / 1000;
          }
          break;

        case CadacUnits.inch:
          switch (to) {
            case CadacUnits.mm:
              return value * 25.4;
            case CadacUnits.cm:
              return value * 2.54;
            case CadacUnits.inch:
              return value;
            case CadacUnits.m:
              return value / 39.37;
            case CadacUnits.km:
              return value / 39370.079;
          }
          break;

        case CadacUnits.km:
          switch (to) {
            case CadacUnits.mm:
              return value * 1000000;
            case CadacUnits.cm:
              return value * 100000;
            case CadacUnits.m:
              return value * 1000;
            case CadacUnits.inch:
              return value * 39370.079;
            case CadacUnits.km:
              return value;
          }
          break;

        default:
          return value;
      }
    } else {
      return value;
    }
  }
}
