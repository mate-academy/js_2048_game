// src/modules/Game.class.js

class Game {
  constructor(initialState = null) {
    this.board = initialState || [
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
    ];
    this.score = 0;
    this.status = 'idle'; // 'playing', 'won', 'lose'
    this.addNewTile(); // Start with two random tiles
  }

  // Helper function to get the current board state
  getState() {
    return this.board;
  }

  // Get the current score
  getScore() {
    return this.score;
  }

  // Get the current status of the game ('idle', 'playing', 'won', 'lose')
  getStatus() {
    return this.status;
  }

  // Start the game (reset game state)
  start() {
    this.status = 'playing';
    this.score = 0;

    this.board = [
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
    ];
    this.addNewTile(); // Start with two random tiles
    this.addNewTile();
  }

  // Restart the game to the initial state
  restart() {
    this.start();
  }

  // Add a new tile (2 or 4) to a random empty space
  addNewTile() {
    const emptyCells = [];

    // eslint-disable-next-line no-shadow
    for (let row = 0; row < 4; row++) {
      // eslint-disable-next-line no-shadow
      for (let col = 0; col < 4; col++) {
        if (this.board[row][col] === 0) {
          emptyCells.push([row, col]);
        }
      }
    }

    if (emptyCells.length === 0) {
      return;
    } // No empty space left

    const [row, col] =
      emptyCells[Math.floor(Math.random() * emptyCells.length)];
    const value = Math.random() < 0.1 ? 4 : 2; // 10% chance for 4, else 2

    this.board[row][col] = value;
  }

  // Move the board to the left
  moveLeft() {
    let moved = false;

    for (let row = 0; row < 4; row++) {
      const newRow = this.board[row].filter((val) => val !== 0);
      const mergedRow = [];
      let scoreAdded = 0;

      for (let i = 0; i < newRow.length; i++) {
        if (newRow[i] === newRow[i + 1]) {
          mergedRow.push(newRow[i] * 2);
          scoreAdded += newRow[i] * 2;
          i++;
        } else {
          mergedRow.push(newRow[i]);
        }
      }

      while (mergedRow.length < 4) {
        mergedRow.push(0);
      }

      if (!this.arraysEqual(this.board[row], mergedRow)) {
        moved = true;
      }

      this.board[row] = mergedRow;
      this.score += scoreAdded;
    }

    if (moved) {
      this.addNewTile();
    }

    this.checkGameOver();
    this.checkWin();
  }

  // Check if two arrays are equal
  arraysEqual(a, b) {
    return a.every((val, index) => val === b[index]);
  }

  // Check if the game is won (2048 achieved)
  checkWin() {
    for (let row = 0; row < 4; row++) {
      for (let col = 0; col < 4; col++) {
        if (this.board[row][col] === 2048) {
          this.status = 'won';

          return;
        }
      }
    }
  }

  // Check if the game is over (no valid moves)
  checkGameOver() {
    // Check if there are any empty cells
    let emptyFound = false;

    for (let row = 0; row < 4; row++) {
      for (let col = 0; col < 4; col++) {
        if (this.board[row][col] === 0) {
          emptyFound = true;
          break;
        }
      }

      if (emptyFound) {
        break;
      }
    }

    if (!emptyFound) {
      // Check if there are any valid moves (adjacent tiles with the same value)
      for (let row = 0; row < 4; row++) {
        for (let col = 0; col < 4; col++) {
          if (
            (row < 3 && this.board[row][col] === this.board[row + 1][col]) ||
            (col < 3 && this.board[row][col] === this.board[row][col + 1])
          ) {
            return;
          }
        }
      }
      this.status = 'lose';
    }
  }

  // Move the board to the right
  moveRight() {
    this.board.forEach((row) => row.reverse());
    this.moveLeft();
    this.board.forEach((row) => row.reverse());
  }

  // Move the board up
  moveUp() {
    this.board = this.transposeBoard();
    this.moveLeft();
    this.board = this.transposeBoard(true);
  }

  // Move the board down
  moveDown() {
    this.board = this.transposeBoard();
    this.moveRight();
    this.board = this.transposeBoard(true);
  }

  // Transpose the board (switch rows and columns)
  transposeBoard(reverse = false) {
    return this.board[0].map((_, colIndex) =>
      // eslint-disable-next-line comma-dangle, prettier/prettier
      this.board.map((row) => (reverse ? row[3 - colIndex] : row[colIndex])),);
  }
}

export default Game;
