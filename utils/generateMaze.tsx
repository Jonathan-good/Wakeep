// utils/generateMaze.ts
export const generateMaze = (rows: number, cols: number): number[][] => {
  const height = rows;
  const width = cols;
  const maze = Array.from({ length: height }, () => Array(width).fill(1));

  const inBounds = (x: number, y: number) => x > 0 && x < width - 1 && y > 0 && y < height - 1;

  const carve = (x: number, y: number) => {
    maze[x][y] = 0;

    const directions = [
      [0, -2], [2, 0], [0, 2], [-2, 0],
    ].sort(() => Math.random() - 0.5); // shuffle directions

    for (const [dx, dy] of directions) {
      const nx = x + dx, ny = y + dy;
      if (inBounds(nx, ny) && maze[nx][ny] === 1) {
        maze[x + dx / 2][y + dy / 2] = 0; // carve path between
        carve(nx, ny);
      }
    }
  };

  carve(1, 1); // Start at (1, 1)

  maze[1][1] = 0; // Start
  maze[height - 2][width - 2] = 2; // Goal

  return maze;
};