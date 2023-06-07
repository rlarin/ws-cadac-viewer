const useRemoveElFromSceneByProp = (scope, prop: string, value) => {
  const el = scope.scene.children.find(child => child[prop] === value);
  if (el) {
    scope.scene.remove(el);
    scope.transformControls.detach();
    scope.scene.remove(scope.transformControls);
  }
};

export default useRemoveElFromSceneByProp;
