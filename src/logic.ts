export type Board = number[][];

export interface GameState {
  board: Board;
  fixed: boolean[][];
}

//solvable boards (4x4)
const easyBoards4x4: Board[] = [
  [
  [0, 2, 0, 4],
  [3, 0, 0, 0],
  [0, 0, 0, 2],
  [2, 0, 4, 0]
  ],
  [
  [0, 0, 1, 0],
  [0, 3, 0, 4],
  [4, 0, 0, 0],
  [0, 1, 0, 0]
  ],
  [
  [1, 0, 0, 0],
  [0, 0, 2, 0],
  [0, 3, 0, 0],
  [0, 0, 0, 4]
  ]
];

// Placeholder 9x9 (you can update or generate more later)
const easyBoards9x9: Board[] = [
  [
    [5, 3, 0, 0, 7, 0, 0, 0, 0],
    [6, 0, 0, 1, 9, 5, 0, 0, 0],
    [0, 9, 8, 0, 0, 0, 0, 6, 0],
    [8, 0, 0, 0, 6, 0, 0, 0, 3],
    [4, 0, 0, 8, 0, 3, 0, 0, 1],
    [7, 0, 0, 0, 2, 0, 0, 0, 6],
    [0, 6, 0, 0, 0, 0, 2, 8, 0],
    [0, 0, 0, 4, 1, 9, 0, 0, 5],
    [0, 0, 0, 0, 8, 0, 0, 7, 9]
  ]
];

export function createGame(size: 4 | 9): GameState {
  const boards = size === 4 ? easyBoards4x4 : easyBoards9x9;
  const board = deepCopy(boards[Math.floor(Math.random() * boards.length)]);
  const fixed = board.map(row => row.map(cell => cell !== 0));
  return { board, fixed };
}

function deepCopy(board: Board): Board {
  return board.map(row => [...row]);
}

export function isValidMove(board: Board, row: number, col: number, num: number): boolean {
  const size = board.length;
  const boxSize = size === 4 ? 2 : 3;

  if (board[row].includes(num)) return false;

  for (let r = 0; r < size; r++) {
    if (board[r][col] === num) return false;
  }

  const startRow = Math.floor(row / boxSize) * boxSize;
  const startCol = Math.floor(col / boxSize) * boxSize;
  for (let r = 0; r < boxSize; r++) {
    for (let c = 0; c < boxSize; c++) {
      if (board[startRow + r][startCol + c] === num) return false;
    }
  }

  return true;
}
