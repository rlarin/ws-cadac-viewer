import { Vector3 } from 'three';
import { DEFAULTS_CADAC } from '../../models/types';
import { Text } from 'troika-three-text';

const createText = (
  text = DEFAULTS_CADAC.DEFAULT_TEXT,
  fontSize = DEFAULTS_CADAC.DEFAULT_FONT_SIZE,
  position: Vector3 = new Vector3(0, 0, 0),
  color: string = DEFAULTS_CADAC.COLOR
) => {
  const textObject = new Text();
  textObject.text = text;
  textObject.fontSize = fontSize;
  textObject.position.set(position.x, position.y, position.z);
  textObject.color = color;

  return textObject;
};

export default createText;
