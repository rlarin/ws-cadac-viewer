import { useGetIntersects } from '../shapes-helper';
import { CadacEventDataTypes } from '../../models/types';

const useDocumentMouseClick = (scope, event: MouseEvent) => {
  for (let i = 0; i < scope.sceneShapes.length; i++) {
    const shape = scope.sceneShapes[i];
    scope.toggleTransformControls(shape, false);
    const intersectedObject = useGetIntersects(
      event,
      shape,
      scope.raycaster,
      scope.scene,
      scope.camera,
      scope.elRef.nativeElement
    );

    if (intersectedObject) {
      scope.selectedObject = scope.scene.getObjectById(intersectedObject.id);
      const eventData = {
        payload: {
          object: scope.selectedObject,
        },
        type: CadacEventDataTypes.OBJECT_SELECTED,
      };
      scope.dispatchEvent(eventData);

      scope.toggleTransformControls(scope.selectedObject, true);
      scope.eventSubject$.next(eventData);

      scope.debouncedObjectChangedEmitter();
      break;
    } else {
      scope.toggleTransformControls(scope.selectedObject, false);
      const eventData = {
        payload: {
          object: scope.selectedObject,
        },
        type: CadacEventDataTypes.OBJECT_UNSELECTED,
      };
      scope.eventSubject$.next(eventData);
      scope.dispatchEvent(eventData);
      scope.selectedObject = null;
    }
  }
};

export default useDocumentMouseClick;
