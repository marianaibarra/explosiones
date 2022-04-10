const colors = [
  "70, 36, 76",
  "113, 43, 117",
  "199, 75, 80",
  "212, 155, 84",
  "51, 47, 208",
  "146, 84, 200",
  "225, 95, 237",
  "110, 220, 217",
  "249, 7, 22",
  "255, 84, 3",
  "255, 202, 3",
  "255, 243, 35",
];

export const getDistanceBetweenTwoPoints = (x1, y1, x2, y2) => {
  const xDist = x1 - x2;
  const yDist = y1 - y2;

  return Math.hypot(xDist, yDist);
};

export const moveToPoint = (x1, x2, y1, y2) => {
  const alpha = Math.atan2(y1 - y2, x1 - x2);
  const sinOfAngle = Math.sin(alpha);
  const cosOfAngle = Math.cos(alpha);

  const velocity = {
    dx: cosOfAngle,
    dy: sinOfAngle,
  };

  return velocity;
};

export const randomColor = () => {
  return colors[Math.floor(Math.random() * colors.length)];
};

export const getRandomInt = (min, max) => {
  return Math.floor(Math.random() * (max - min)) + min;
};
