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
