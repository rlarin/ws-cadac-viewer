const useCreateSnapshot = scope => {
  scope.renderer.setSize(
    scope.renderer.domElement.width,
    scope.renderer.domElement.height,
    true
  );
  scope.renderer.render(scope.scene, scope.camera);
  return scope.renderer.domElement.toDataURL('image/png');
};

export default useCreateSnapshot;
