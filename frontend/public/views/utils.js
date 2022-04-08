const colors = [
  "#46244C",
  "#712B75",
  "#C74B50",
  "#D49B54",
  "#332FD0",
  "#9254C8",
  "#E15FED",
  "#6EDCD9",
  "#F90716",
  "#FF5403",
  "#FFCA03",
  "#FFF323",
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
