class Game {
  board: number[][]; // 4x4 grid
  score: number;
  status: 'playing' | 'won' | 'lost';
  initialState: number[][];

  constructor(initialState = null) { ... }
}

function getRandomTileValue() {
  return Math.random() < 0.9 ? 2 : 4;
}

function placeRandomTile() {
  const emptyCells = [];
  for (let y = 0; y < 4; y++) {
    for (let x = 0; x < 4; x++) {
      if (board[y][x] === 0) emptyCells.push([y, x]);
    }
  }

  if (emptyCells.length > 0) {
    const [y, x] = emptyCells[Math.floor(Math.random() * emptyCells.length)];
    board[y][x] = getRandomTileValue();
  }
}

function move(direction) {
  // Save state before move
  // Slide + merge
  // Compare new state with old to detect valid move
  // If valid → add random tile
  // Check for win/loss
}

function compressAndMerge(row: number[]): [number[], number] {
  let newRow = row.filter(v => v !== 0);
  let scoreGained = 0;

  for (let i = 0; i < newRow.length - 1; i++) {
    if (newRow[i] === newRow[i + 1]) {
      newRow[i] *= 2;
      scoreGained += newRow[i];
      newRow[i + 1] = 0;
    }
  }

  newRow = newRow.filter(v => v !== 0);
  while (newRow.length < 4) newRow.push(0);

  return [newRow, scoreGained];
}

function checkGameOver(board) {
  const directions = [moveLeft, moveRight, moveUp, moveDown];
  return directions.every(dir => !dirWouldChangeBoard(board));
}
