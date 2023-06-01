const useToggleGridHelper = (scope, visible?) => {
  if (scope.gridHelper) {
    scope.gridHelper.visible = visible || !scope.gridHelper.visible;
  } else {
    scope.setGridHelper();
  }
};

export default useToggleGridHelper;
