import { Color } from 'three';

export const debounce = (func, delay = 300) => {
  let timerId;

  return function (...args) {
    clearTimeout(timerId);

    timerId = setTimeout(() => {
      func.apply(this, args);
    }, delay);
  };
};

export const calculateContrastColor = (hex, bw = false) => {
  if (hex.indexOf('#') === 0) {
    hex = hex.slice(1);
  }
  // convert 3-digit hex to 6-digits.
  if (hex.length === 3) {
    hex = hex[0] + hex[0] + hex[1] + hex[1] + hex[2] + hex[2];
  }
  if (hex.length !== 6) {
    throw new Error('Invalid HEX color.');
  }
  let r: string | number = parseInt(hex.slice(0, 2), 16),
    g: string | number = parseInt(hex.slice(2, 4), 16),
    b: string | number = parseInt(hex.slice(4, 6), 16);
  if (bw) {
    return r * 0.299 + g * 0.587 + b * 0.114 > 186 ? '#454545' : '#cccccc';
  }
  // invert color components
  r = (255 - r).toString(16);
  g = (255 - g).toString(16);
  b = (255 - b).toString(16);
  // pad each with zeros and return
  return '#' + padZero(r) + padZero(g) + padZero(b);
};

function padZero(str, len = 2) {
  const zeros = new Array(len).join('0');
  return (zeros + str).slice(-len);
}

export const addColors = (color1, color2) => {
  // Convert hex colors to RGB components
  const r1 = parseInt(color1.slice(1, 3), 16);
  const g1 = parseInt(color1.slice(3, 5), 16);
  const b1 = parseInt(color1.slice(5, 7), 16);

  const r2 = parseInt(color2.slice(1, 3), 16);
  const g2 = parseInt(color2.slice(3, 5), 16);
  const b2 = parseInt(color2.slice(5, 7), 16);

  // Add the RGB components
  const sumR = r1 + r2 > 255 ? 255 : r1 + r2;
  const sumG = g1 + g2 > 255 ? 255 : g1 + g2;
  const sumB = b1 + b2 > 255 ? 255 : b1 + b2;

  // Convert RGB components back to hex color
  return `#${sumR.toString(16).padStart(2, '0')}${sumG
    .toString(16)
    .padStart(2, '0')}${sumB.toString(16).padStart(2, '0')}`;
};

export const subtractColors = (color1, color2) => {
  const c1 = new Color(color1);
  const c2 = new Color(color2);
  return c1.sub(c2);
};
