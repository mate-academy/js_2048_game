'use strict';

class Game {
  static defaultInitialState = [
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
  ];

  static GameStatus = {
    idle: 'idle',
    playing: 'playing',
    win: 'win',
    lose: 'lose',
  };

  constructor(initialState = Game.defaultInitialState) {
    this.board = initialState.map((row) => [...row]);
    this.score = 0;
    this.status = Game.GameStatus.idle;
    this.initialState = initialState.map((row) => [...row]);
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
    this.status = Game.GameStatus.playing;
    this.newCell();
    this.newCell();
  }

  restart() {
    this.status = Game.GameStatus.idle;
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
      this.status = Game.GameStatus.win;
    } else if (this.checkIfLose()) {
      this.status = Game.GameStatus.lose;
    }
  }

  checkIfLose() {
    if (this.board.find((row) => row.includes(0))) {
      return false;
    }

    for (let y = 0; y < 4; y++) {
      for (let x = 0; x < 4; x++) {
        if (y < 3 && this.board[y][x] === this.board[y + 1][x]) {
          return false;
        }

        if (x < 3 && this.board[y][x] === this.board[y][x + 1]) {
          return false;
        }
      }
    }

    return true;
  }

  move(direction) {
    if (this.status !== 'playing') {
      return false;
    }

    let hasChanged = false;
    const merged = Array.from({ length: 4 }, () => [
      false,
      false,
      false,
      false,
    ]);

    // Helper function to traverse the board based on direction
    const traverse = (callback, reverse = false) => {
      for (let i = 0; i < 4; i++) {
        for (let j = 0; j < 4; j++) {
          const y = reverse ? 3 - i : i;
          const x = reverse ? 3 - j : j;

          callback(y, x);
        }
      }
    };

    const moveCell = (startY, startX, nextY, nextX) => {
      if (this.board[startY][startX] !== 0) {
        let newY = startY;
        let newX = startX;

        // Move the cell as far as possible in the current direction
        while (
          newY + nextY >= 0 &&
          newY + nextY < 4 &&
          newX + nextX >= 0 &&
          newX + nextX < 4 &&
          this.board[newY + nextY][newX + nextX] === 0
        ) {
          newY += nextY;
          newX += nextX;
        }

        // Merge if possible
        if (
          newY + nextY >= 0 &&
          newY + nextY < 4 &&
          newX + nextX >= 0 &&
          newX + nextX < 4 &&
          this.board[newY + nextY][newX + nextX] ===
            this.board[startY][startX] &&
          !merged[newY + nextY][newX + nextX]
        ) {
          this.board[newY + nextY][newX + nextX] *= 2;
          this.score += this.board[newY + nextY][newX + nextX];
          this.board[startY][startX] = 0;
          merged[newY + nextY][newX + nextX] = true;
          hasChanged = true;
        } else if (newY !== startY || newX !== startX) {
          this.board[newY][newX] = this.board[startY][startX];
          this.board[startY][startX] = 0;
          hasChanged = true;
        }
      }
    };

    if (direction === 'up') {
      traverse((y, x) => moveCell(y, x, -1, 0));
    } else if (direction === 'down') {
      traverse((y, x) => moveCell(3 - y, x, 1, 0));
    } else if (direction === 'left') {
      traverse((y, x) => moveCell(y, x, 0, -1));
    } else if (direction === 'right') {
      traverse((y, x) => moveCell(y, 3 - x, 0, 1));
    }

    if (hasChanged) {
      this.newCell();
      this.checkGameState();
    }

    return hasChanged;
  }

  moveUp() {
    return this.move('up');
  }

  moveDown() {
    return this.move('down');
  }

  moveLeft() {
    return this.move('left');
  }

  moveRight() {
    return this.move('right');
  }
}

module.exports = Game;
