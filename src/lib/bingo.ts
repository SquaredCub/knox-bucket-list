/** Index of the free center square on a 5x5 card. */
export const FREE = 12;

/** Every row, column and diagonal as lists of square indexes. */
export const LINES: number[][] = (() => {
  const lines: number[][] = [];
  for (let i = 0; i < 5; i++) {
    lines.push([0, 1, 2, 3, 4].map((c) => i * 5 + c));
    lines.push([0, 1, 2, 3, 4].map((r) => r * 5 + i));
  }
  lines.push([0, 6, 12, 18, 24], [4, 8, 12, 16, 20]);
  return lines;
})();

/** Turns the 24 squares stored in bingo.json into a 25-square board. */
export function toBoard(squares: string[]): (string | null)[] {
  const board: (string | null)[] = [...squares];
  board.splice(FREE, 0, null);
  return board;
}

export function completedLines(marked: Set<number>): number[][] {
  return LINES.filter((line) => line.every((i) => i === FREE || marked.has(i)));
}
