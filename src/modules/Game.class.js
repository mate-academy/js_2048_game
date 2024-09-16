'use strict';

// const rows = document.querySelectorAll('tr');

class Game {
  constructor(
    initialState = [
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
    ],
  ) {
    this.board = initialState.map((row) => [...row]);
    this.score = 0;
    this.status = 'idle';
    this.initialState = initialState;
  }

  getState() {
    return this.board;
  }

  getScore() {
    return this.score;
  }

  getStatus() {
    return this.status;
  }

  start() {
    this.status = 'playing';
    this.newCell();
    this.newCell();
  }

  restart() {
    this.status = 'idle';
    this.score = 0;

    this.board = this.initialState.map((row) => [...row]);
  }

  newCell() {
    const emptyCells = [];

    for (let y = 0; y < 4; y++) {
      for (let x = 0; x < 4; x++) {
        if (!this.board[y][x]) {
          emptyCells.push({ y: y, x: x });
        }
      }
    }

    if (emptyCells.length > 0) {
      const val = Math.floor(Math.random() * emptyCells.length);

      this.board[emptyCells[val].y][emptyCells[val].x] =
        Math.random() < 0.9 ? 2 : 4;
    }
  }

  checkGameState() {
    if (this.board.find((row) => row.find((el) => el === 2048))) {
      this.status = 'win';
    } else if (this.checkIfLose()) {
      this.status = 'lose';
    }
  }

  checkIfLose() {
    let lose = true;

    if (this.board.find((row) => row.includes(0))) {
      lose = false;
    }

    for (let y = 0; y < 4; y++) {
      for (let x = 0; x < 4; x++) {
        if (y < 3 && this.board[y][x] === this.board[y + 1][x]) {
          lose = false;
        }

        if (x < 3 && this.board[y][x] === this.board[y][x + 1]) {
          lose = false;
        }
      }
    }

    return lose;
  }

  moveUp() {
    if (this.status !== 'playing') {
      return;
    }

    // Track if the board state has changed
    let hasChanged = false;

    for (let x = 0; x < 4; x++) {
      // Array to track if a cell has already merged in this move
      const merged = [false, false, false, false];

      for (let y = 1; y < 4; y++) {
        // Check if the cell is not empty
        if (this.board[y][x] !== 0) {
          let newY = y;
          // Variable to track the distance the cell will move
          // let moveDistance = 0;

          // Move the cell up as far as possible
          while (newY > 0 && this.board[newY - 1][x] === 0) {
            newY--;
            // moveDistance++; // Increment move distance
          }

          // Check if we can merge the cell with the one above
          if (
            newY > 0 &&
            this.board[newY - 1][x] === this.board[y][x] &&
            !merged[newY - 1]
          ) {
            // Merge the cells by doubling the value
            this.board[newY - 1][x] *= 2;
            this.score += this.board[newY - 1][x]; // Increase the score
            this.board[y][x] = 0; // Clear the original cell
            merged[newY - 1] = true; // Mark this cell as merged
            hasChanged = true;

            // Animate the move with merging (cells move to the same position)
            /* const cellElement = rows[y].cells[x].firstChild;

            if (cellElement) {
              // Add a class for animation
              cellElement.classList.add(`move-up--${moveDistance + 1}`);
            } */
          } else if (newY !== y) {
            // If the cell moved but did not merge
            // Move the cell to its new position
            this.board[newY][x] = this.board[y][x];
            this.board[y][x] = 0; // Clear the original position
            hasChanged = true;

            // Animate the move without merging
            /* const cellElement = rows[y].cells[x].firstChild;

            if (cellElement) {
              cellElement.classList.add(`move-up--${moveDistance}`);
              // Add a class for the move animation
            } */
          }
        }
      }
    }

    if (hasChanged) {
      this.newCell();
      this.checkGameState();
    }

    return hasChanged;
  }

  moveDown() {
    if (this.status !== 'playing') {
      return;
    }

    let hasChanged = false;

    for (let x = 0; x < 4; x++) {
      const merged = [false, false, false, false];

      for (let y = 2; y >= 0; y--) {
        if (this.board[y][x] !== 0) {
          let newY = y;
          // let moveDistance = 0;

          while (newY < 3 && this.board[newY + 1][x] === 0) {
            newY++;
            // moveDistance++;
          }

          if (
            newY < 3 &&
            this.board[newY + 1][x] === this.board[y][x] &&
            !merged[newY + 1]
          ) {
            this.board[newY + 1][x] *= 2;
            this.score += this.board[newY + 1][x];
            this.board[y][x] = 0;
            merged[newY + 1] = true;
            hasChanged = true;

            /* const cellElement = rows[y].cells[x].firstChild;

            if (cellElement) {
              cellElement.classList.add(`move-down--${moveDistance + 1}`);
            } */
          } else if (newY !== y) {
            this.board[newY][x] = this.board[y][x];
            this.board[y][x] = 0;
            hasChanged = true;

            /* const cellElement = rows[y].cells[x].firstChild;

            if (cellElement) {
              cellElement.classList.add(`move-down--${moveDistance}`);
            }  */
          }
        }
      }
    }

    if (hasChanged) {
      this.newCell();
      this.checkGameState();
    }

    return hasChanged;
  }

  moveLeft() {
    if (this.status !== 'playing') {
      return;
    }

    let hasChanged = false;

    for (let y = 0; y < 4; y++) {
      const merged = [false, false, false, false];

      for (let x = 1; x < 4; x++) {
        if (this.board[y][x] !== 0) {
          let newX = x;
          // let moveDistance = 0;

          while (newX > 0 && this.board[y][newX - 1] === 0) {
            newX--;
            // moveDistance++;
          }

          if (
            newX > 0 &&
            this.board[y][newX - 1] === this.board[y][x] &&
            !merged[newX - 1]
          ) {
            this.board[y][newX - 1] *= 2;
            this.score += this.board[y][newX - 1];
            this.board[y][x] = 0;
            merged[newX - 1] = true;
            hasChanged = true;

            /* const cellElement = rows[y].cells[x].firstChild;

            if (cellElement) {
              cellElement.classList.add(`move-left--${moveDistance + 1}`);
            } */
          } else if (newX !== x) {
            this.board[y][newX] = this.board[y][x];
            this.board[y][x] = 0;
            hasChanged = true;

            /* const cellElement = rows[y].cells[x].firstChild;

            if (cellElement) {
              cellElement.classList.add(`move-left--${moveDistance}`);
            } */
          }
        }
      }
    }

    if (hasChanged) {
      this.newCell();
      this.checkGameState();
    }

    return hasChanged;
  }

  moveRight() {
    if (this.status !== 'playing') {
      return;
    }

    let hasChanged = false;

    for (let y = 0; y < 4; y++) {
      const merged = [false, false, false, false];

      for (let x = 2; x >= 0; x--) {
        if (this.board[y][x] !== 0) {
          let newX = x;
          // let moveDistance = 0;

          while (newX < 3 && this.board[y][newX + 1] === 0) {
            newX++;
            // moveDistance++;
          }

          if (
            newX < 3 &&
            this.board[y][newX + 1] === this.board[y][x] &&
            !merged[newX + 1]
          ) {
            this.board[y][newX + 1] *= 2;
            this.score += this.board[y][newX + 1];
            this.board[y][x] = 0;
            merged[newX + 1] = true;
            hasChanged = true;

            /* const cellElement = rows[y].cells[x].firstChild;

              if (cellElement) {
              cellElement.classList.add(`move-right--${moveDistance + 1}`);
            }  */
          } else if (newX !== x) {
            this.board[y][newX] = this.board[y][x];
            this.board[y][x] = 0;
            hasChanged = true;

            /* const cellElement = rows[y].cells[x].firstChild;

            if (cellElement) {
              cellElement.classList.add(`move-right--${moveDistance}`);
            } */
          }
        }
      }
    }

    if (hasChanged) {
      this.newCell();
      this.checkGameState();
    }

    return hasChanged;
  }
}

module.exports = Game;
