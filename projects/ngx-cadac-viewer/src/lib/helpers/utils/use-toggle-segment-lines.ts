import { LineSegments } from 'three';

const useToggleSegmentLines = (scope, value: boolean) => {
  scope.selectedObject &&
    scope.selectedObject?.traverse(child => {
      if (child instanceof LineSegments) {
        child.visible = value;
      }
    });
};

export default useToggleSegmentLines;
