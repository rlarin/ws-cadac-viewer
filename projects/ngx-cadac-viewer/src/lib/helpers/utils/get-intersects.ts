import { Object3D, PerspectiveCamera, Raycaster, Scene, Vector2 } from 'three';

const getIntersects = (
  event: MouseEvent,
  object: Object3D,
  raycaster: Raycaster,
  scene: Scene,
  camera: PerspectiveCamera,
  container: HTMLDivElement,
  callback?: (event: Event, object?: Object3D) => void
) => {
  const objectId = object.uuid;
  const mouse = new Vector2();
  mouse.x =
    ((event.clientX - container.offsetLeft) / container.offsetWidth) * 2 - 1;
  mouse.y =
    -((event.clientY - container.offsetTop) / container.offsetHeight) * 2 + 1;
  raycaster.setFromCamera(mouse, camera);
  const intersects = raycaster.intersectObjects(
    scene.children,
    object['isGroup']
  );

  const intersectedObject =
    intersects.length > 0 && object['isGroup']
      ? { object }
      : intersects.find(
          intersectedEl => intersectedEl.object.uuid === objectId
        );
  if (intersectedObject?.object) {
    if (callback) {
      callback(event, intersectedObject?.object);
    }
  }

  return intersectedObject?.object;
};

export default getIntersects;
