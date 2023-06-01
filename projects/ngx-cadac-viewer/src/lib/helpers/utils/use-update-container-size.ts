const useUpdateContainerSize = scope => {
  scope.renderer.setSize(
    scope.elRef.nativeElement?.offsetWidth,
    scope.elRef.nativeElement?.offsetHeight,
    true
  );
  scope.camera.aspect =
    scope.elRef.nativeElement?.offsetWidth /
    scope.elRef.nativeElement?.offsetHeight;
  scope.camera.updateProjectionMatrix();
};

export default useUpdateContainerSize;
