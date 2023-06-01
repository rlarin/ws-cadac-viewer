import { CadacTransformControlsModes } from '../../models/types';

const useDocumentKeydown = (scope, event: KeyboardEvent) => {
  if (document.activeElement?.tagName === 'body') {
    event.preventDefault();
    event.stopPropagation();
  }

  const axesHelper = scope.scene.children.find(
    child => child.type === 'AxesHelper'
  );
  switch (event.key) {
    case 'a':
      axesHelper.visible = !axesHelper.visible;
      break;
    case 'g':
      scope.gridHelper.visible = !scope.gridHelper.visible;
      break;
    case 'x':
      scope.transformControls.showX = !scope.transformControls.showX;
      break;
    case 'y':
      scope.transformControls.showY = !scope.transformControls.showY;
      break;
    case 'z':
      scope.transformControls.showZ = !scope.transformControls.showZ;
      break;
    case 'r':
      scope.transformControlsCurrentMode = CadacTransformControlsModes.ROTATE;
      scope.transformControls.setMode(scope.transformControlsCurrentMode);
      break;
    case 's':
      scope.transformControlsCurrentMode = CadacTransformControlsModes.SCALE;
      scope.transformControls.setMode(scope.transformControlsCurrentMode);
      break;
    case 't':
      scope.transformControlsCurrentMode =
        CadacTransformControlsModes.TRANSLATE;
      scope.transformControls.setMode(scope.transformControlsCurrentMode);
      break;
  }
};

export default useDocumentKeydown;
