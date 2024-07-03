'use strict';

class Game {
  constructor(initialState = { size: 4 }) {
    this.status = 'idle';
    this.size = initialState.size;
    this.boardState = this.initializeBoard();
    this.score = 0;

    this.changeByMove = {
      direction: undefined,
      side: '',
      moves: [],
    };
  }

  moveLeft() {
    for (let row = 0; row < this.size; row++) {
      for (let col = 0; col < this.size; col++) {
        for (let nextCol = col + 1; nextCol < this.size; nextCol++) {
          this.changeByMove.direction = 'X';
          this.changeByMove.side = '-';

          if (!this.#checkRatioValues(row, col, row, nextCol)) {
            break;
          }
        }
      }
    }

    this.#afterEffects();

    return this.boardState;
  }
  moveRight() {
    for (let row = 0; row < this.size; row++) {
      for (let col = this.size - 1; col >= 0; col--) {
        for (let nextCol = col - 1; nextCol >= 0; nextCol--) {
          this.changeByMove.direction = 'X';
          this.changeByMove.side = '+';

          if (!this.#checkRatioValues(row, col, row, nextCol)) {
            break;
          }
        }
      }
    }

    this.#afterEffects();

    return this.boardState;
  }
  moveUp() {
    for (let col = 0; col < this.size; col++) {
      for (let row = 0; row < this.size; row++) {
        for (let nextRow = row + 1; nextRow < this.size; nextRow++) {
          this.changeByMove.direction = 'Y';
          this.changeByMove.side = '-';

          if (!this.#checkRatioValues(row, col, nextRow, col)) {
            break;
          }
        }
      }
    }

    this.#afterEffects();

    return this.boardState;
  }
  moveDown() {
    for (let col = 0; col < this.size; col++) {
      for (let row = this.size - 1; row >= 0; row--) {
        for (let nextRow = row - 1; nextRow >= 0; nextRow--) {
          this.changeByMove.direction = 'Y';
          this.changeByMove.side = '+';

          if (!this.#checkRatioValues(row, col, nextRow, col)) {
            break;
          }
        }
      }
    }

    this.#afterEffects();

    return this.boardState;
  }

  getScore() {
    return this.score;
  }

  getState() {
    return this.boardState;
  }

  getStatus() {
    return this.status;
  }

  start() {
    this.boardState = this.initializeBoard();

    const [emptyCells] = this.#checkValues();

    this.#pushNewBoardValue(2, emptyCells);
    this.status = 'playing';

    return this.boardState;
  }

  restart() {
    this.start();
    this.score = 0;

    return this.boardState;
  }

  clearChangesList() {
    this.changeByMove.moves = [];
    this.changeByMove.direction = [];
    this.changeByMove.side = '-';
  }

  getChanges() {
    return this.changeByMove;
  }

  initializeBoard() {
    return Array.from({ length: this.size }, () => Array(this.size).fill(0));
  }

  #afterEffects() {
    const [emptyCells, maxValue] = this.#checkValues();

    this.#pushNewBoardValue(1, emptyCells);
    this.#checkForLose(emptyCells);
    this.#checkForWin(maxValue);
  }

  #setScore(value) {
    this.score += value;
  }

  #pushNewBoardValue(num = 1, arr) {
    const emptyCells = arr;

    for (let c = 0; c < num; c++) {
      const newValue = Math.random() * 100 > 10 ? 2 : 4;

      const randomCellIndex = Math.floor(
        Math.random() * (emptyCells.length - 1),
      );

      if (emptyCells.length === 0) {
        return false;
      }

      const randomCell = emptyCells[randomCellIndex];

      emptyCells.splice(randomCellIndex, 1);
      this.boardState[randomCell[0]][randomCell[1]] = newValue;
    }
  }

  #checkValues() {
    const emptyCells = [];
    let maxValue = 0;

    for (let i = 0; i < this.size; i++) {
      for (let y = 0; y < this.size; y++) {
        if (this.boardState[i][y] === 0) {
          emptyCells.push([i, y]);
        }

        if (this.boardState[i][y] > maxValue) {
          maxValue = this.boardState[i][y];
        }
      }
    }

    return [emptyCells, maxValue];
  }

  #checkRatioValues(a, b, c, d) {
    if (this.boardState[a][b] === 0 && this.boardState[c][d] !== 0) {
      this.boardState[a][b] = this.boardState[c][d];
      this.boardState[c][d] = 0;
      this.changeByMove.moves.push({ from: [c, d], to: [a, b] });
    } else if (
      this.boardState[a][b] !== 0 &&
      this.boardState[a][b] === this.boardState[c][d]
    ) {
      this.boardState[a][b] += this.boardState[c][d];
      this.boardState[c][d] = 0;
      this.changeByMove.moves.push({ from: [c, d], to: [a, b] });
      this.#setScore(this.boardState[a][b]);

      return false;
    } else if (this.boardState[a][b] !== 0 && this.boardState[c][d] !== 0) {
      return false;
    }

    return true;
  }

  #checkForMoveOptions() {
    for (let i = 0; i < this.size; i++) {
      for (let y = 0; y < this.size - 1; y++) {
        if (
          this.boardState[i][y] === this.boardState[i][y + 1] ||
          this.boardState[y][i] === this.boardState[y + 1][i]
        ) {
          return true;
        }
      }
    }

    return false;
  }

  #checkForLose(arr) {
    if (arr.length === 0 && !this.#checkForMoveOptions()) {
      this.status = 'lose';

      return true;
    }

    return false;
  }

  #checkForWin(val) {
    if (val >= 2048) {
      this.status = 'win';

      return true;
    }

    return false;
  }
}

module.exports = Game;
