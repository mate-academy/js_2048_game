'use strict';

class Game {
  static Status = {
    idle: 'idle',
    playing: 'playing',
    win: 'win',
    lose: 'lose',
  };

  constructor(
    initialState = [
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
    ],
  ) {
    this.state = [...initialState];
    this.status = Game.Status.idle;
    this.score = 0;
    this.initialState = initialState;
  }

  getScore() {
    return this.score;
  }

  getState() {
    return this.state;
  }

  getStatus() {
    this.updateStatus();

    return this.status;
  }

  start() {
    this.status = Game.Status.playing;
    this.state = this.initialState.concat();
    this.createRandomTile();
    this.createRandomTile();
    this.printTiles();
  }

  restart() {
    this.clearTheBoard();
    this.printTiles();
    this.status = Game.Status.idle;
    this.score = 0;
  }

  move(direction) {
    if (this.status !== Game.Status.playing) {
      return false;
    }

    const directionConfig = {
      left: {
        rowStart: 0,
        rowEnd: 4,
        colStart: 1,
        colEnd: 4,
        rowInc: 1,
        colInc: 1,
        rowOp: (r, t) => r,
        colOp: (c, t) => c - t,
      },
      right: {
        rowStart: 0,
        rowEnd: 4,
        colStart: 2,
        colEnd: -1,
        rowInc: 1,
        colInc: -1,
        rowOp: (r, t) => r,
        colOp: (c, t) => c + t,
      },
      up: {
        rowStart: 1,
        rowEnd: 4,
        colStart: 0,
        colEnd: 4,
        rowInc: 1,
        colInc: 1,
        rowOp: (r, t) => r - t,
        colOp: (c, t) => c,
      },
      down: {
        rowStart: 2,
        rowEnd: -1,
        colStart: 0,
        colEnd: 4,
        rowInc: -1,
        colInc: 1,
        rowOp: (r, t) => r + t,
        colOp: (c, t) => c,
      },
    };

    const { rowStart, rowEnd, colStart, colEnd, rowInc, colInc, rowOp, colOp } =
      directionConfig[direction];

    let didTilesMove = false;

    for (let row = rowStart; row !== rowEnd; row += rowInc) {
      let didJustMerged = false;

      for (let tile = colStart; tile !== colEnd; tile += colInc) {
        const currentRow = rowOp(row, 0);
        const currentCol = colOp(tile, 0);

        if (this.state[currentRow][currentCol] > 0) {
          let moveTile = 0;
          let merge = false;

          while (
            this.isValidPosition(
              rowOp(row, moveTile + 1),
              colOp(tile, moveTile + 1),
            ) &&
            this.state[rowOp(row, moveTile + 1)][colOp(tile, moveTile + 1)] ===
              0
          ) {
            moveTile++;
          }

          if (
            !didJustMerged &&
            this.isValidPosition(
              rowOp(row, moveTile + 1),
              colOp(tile, moveTile + 1),
            ) &&
            this.state[rowOp(row, moveTile + 1)][colOp(tile, moveTile + 1)] ===
              this.state[currentRow][currentCol]
          ) {
            moveTile++;
            merge = true;
          }

          if (moveTile > 0) {
            if (!didJustMerged && merge) {
              didJustMerged = true;

              const newNumber =
                this.state[rowOp(row, moveTile)][colOp(tile, moveTile)] * 2;

              this.state[rowOp(row, moveTile)][colOp(tile, moveTile)] =
                newNumber;
              this.score += newNumber;
            } else {
              didJustMerged = false;

              this.state[rowOp(row, moveTile)][colOp(tile, moveTile)] =
                this.state[currentRow][currentCol];
            }
            this.state[currentRow][currentCol] = 0;
            didTilesMove = true;
          }
        }
      }
    }

    if (didTilesMove) {
      this.createRandomTile();
    }

    return didTilesMove;
  }

  moveLeft() {
    return this.move('left');
  }

  moveRight() {
    return this.move('right');
  }

  moveUp() {
    return this.move('up');
  }

  moveDown() {
    return this.move('down');
  }

  isValidPosition(row, col) {
    return row >= 0 && row < 4 && col >= 0 && col < 4;
  }

  saveState() {
    return this.state.map((row) => row.slice());
  }

  createRandomTile() {
    let row = this.randomNumber(3);

    while (!this.state[row].includes(0)) {
      row = this.randomNumber(3);
    }

    let cell = this.randomNumber(3);

    while (this.state[row][cell] !== 0) {
      cell = this.randomNumber(3);
    }

    const newState = this.state.map((currentRow) => currentRow.slice());

    newState[row][cell] = this.generateCellValue();
    this.state = newState;
    this.printTiles();
  }

  randomNumber(max) {
    return Math.round(Math.random() * max);
  }

  generateCellValue() {
    const result = Math.random();

    return result > 0.9 ? 4 : 2;
  }

  updateStatus() {
    if (this.didPlayerWin()) {
      this.status = Game.Status.win;
    } else if (this.didPlayerLose()) {
      this.status = Game.Status.lose;
    }
  }

  didPlayerWin() {
    for (const tile of this.state.flat()) {
      if (tile === 2048) {
        return true;
      }
    }

    return false;
  }

  didPlayerLose() {
    for (const tile of this.state.flat()) {
      if (tile === 0) {
        return false;
      }
    }

    for (let row = 0; row <= 3; row++) {
      for (let tile = 0; tile <= 2; tile++) {
        if (this.state[row][tile] === this.state[row][tile + 1]) {
          return false;
        }
      }
    }

    for (let column = 0; column <= 3; column++) {
      for (let tile = 0; tile <= 2; tile++) {
        if (this.state[tile][column] === this.state[tile + 1][column]) {
          return false;
        }
      }
    }

    return true;
  }

  printTiles() {
    const cells = document.getElementsByClassName('field-cell');
    const flatState = this.state.flat();

    for (let i = 0; i < flatState.length; i++) {
      const currentCell = cells[i];
      const currentState = flatState[i];

      if (currentState > 0) {
        if (currentCell) {
          currentCell.textContent = currentState;
          currentCell.className = `field-cell field-cell--${currentState}`;
        }
      } else {
        if (currentCell) {
          currentCell.textContent = '';
          currentCell.className = 'field-cell';
        }
      }
    }
  }

  clearTheBoard() {
    this.state = this.initialState.concat();
  }
}

module.exports = Game;
