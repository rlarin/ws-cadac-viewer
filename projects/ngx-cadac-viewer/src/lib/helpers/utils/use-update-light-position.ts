const useUpdateLightPosition = scope => {
  if (scope.mainLight) {
    scope.mainLight.position.set(
      scope.camera.position.x,
      scope.camera.position.y,
      scope.camera.position.z
    );
  }
};

export default useUpdateLightPosition;
