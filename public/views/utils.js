export const getDistanceBetweenTwoPoints = (x1, y1, x2, y2) => {
  const xDist = x1 - x2;
  const yDist = y1 - y2;

  console.log(xDist, yDist);

  return Math.hypot(xDist, yDist);
};
