const useAnimate = scope => {
  scope.shapesToRotate.forEach(shape => {
    shape.shape.rotation.x += shape.xSpeed;
    shape.shape.rotation.y += shape.ySpeed;
    shape.shape.rotation.z += shape.zSpeed;
  });
  scope.updateLightPosition();
  requestAnimationFrame(scope.animate.bind(scope));
  scope.renderer.render(scope.scene, scope.camera);
};

export default useAnimate;
