const updatePrimPosition = scope => {
  if (scope.selectedObject) {
    if (scope.selectedObject.isGroup) {
      scope.selectedObject.children.forEach(object =>
        scope.updateObjectPositionProcessor(object)
      );
    } else {
      scope.updateObjectPositionProcessor(scope.selectedObject);
    }
  }
};

export default updatePrimPosition;
