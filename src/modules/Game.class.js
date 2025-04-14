'use strict';

/**
 * This class represents the game.
 * Now it has a basic structure, that is needed for testing.
 * Feel free to add more props and methods if needed.
 */
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
    this.state = initialState.map((row) => row.slice());
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

  moveLeft() {
    if (this.status !== Game.Status.playing) {
      return;
    }

    let didTilesMove = false;

    for (let row = 0; row < 4; row++) {
      let didJustMerged = false;

      for (let cell = 1; cell < 4; cell++) {
        if (this.state[row][cell] > 0) {
          let moveTile = 0;

          let merge = false;

          while (this.state[row][cell - moveTile - 1] === 0) {
            moveTile++;
          }

          if (
            !didJustMerged &&
            this.state[row][cell - moveTile - 1] === this.state[row][cell]
          ) {
            moveTile++;
            merge = true;
          }

          if (moveTile > 0) {
            if (!didJustMerged && merge) {
              didJustMerged = true;

              const newNumber = this.state[row][cell - moveTile] * 2;

              this.state[row][cell - moveTile] = newNumber;

              this.score += newNumber;
            } else {
              didJustMerged = false;

              this.state[row][cell - moveTile] = this.state[row][cell];
            }

            this.state[row][cell] = 0;

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

  moveRight() {
    if (this.status !== Game.Status.playing) {
      return;
    }

    let didTilesMove = false;

    for (let row = 0; row < 4; row++) {
      let didJustMerged = false;

      for (let cell = 2; cell >= 0; cell--) {
        if (this.state[row][cell] > 0) {
          let moveTile = 0;
          let merge = false;

          while (this.state[row][cell + moveTile + 1] === 0) {
            moveTile++;
          }

          if (
            !didJustMerged &&
            this.state[row][cell + moveTile + 1] === this.state[row][cell]
          ) {
            moveTile++;
            merge = true;
          }

          if (moveTile > 0) {
            if (!didJustMerged && merge) {
              didJustMerged = true;

              const newNumber = this.state[row][cell + moveTile] * 2;

              this.state[row][cell + moveTile] = newNumber;

              this.score += newNumber;
            } else {
              didJustMerged = false;

              this.state[row][cell + moveTile] = this.state[row][cell];
            }

            this.state[row][cell] = 0;
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

  moveUp() {
    if (this.status !== Game.Status.playing) {
      return;
    }

    let didTilesMove = false;

    for (let column = 0; column < 4; column++) {
      let didJustMerged = false;

      for (let cell = 1; cell < 4; cell++) {
        if (this.state[cell][column] > 0) {
          let moveTile = 0;
          let merge = false;

          while (
            cell - moveTile - 1 >= 0 &&
            this.state[cell - moveTile - 1][column] === 0
          ) {
            moveTile++;
          }

          if (
            !didJustMerged &&
            cell - moveTile - 1 >= 0 &&
            this.state[cell - moveTile - 1][column] === this.state[cell][column]
          ) {
            moveTile++;
            merge = true;
          }

          if (moveTile > 0) {
            if (!didJustMerged && merge) {
              didJustMerged = true;

              const newNumber = this.state[cell - moveTile][column] * 2;

              this.state[cell - moveTile][column] = newNumber;

              this.score += newNumber;
            } else {
              didJustMerged = false;

              this.state[cell - moveTile][column] = this.state[cell][column];
            }

            this.state[cell][column] = 0;

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

  moveDown() {
    if (this.status !== Game.Status.playing) {
      return;
    }

    let didTilesMove = false;

    for (let column = 0; column < 4; column++) {
      let didJustMerged = false;

      for (let tile = 2; tile >= 0; tile--) {
        if (this.state[tile][column] > 0) {
          let moveTile = 0;
          let merge = false;

          while (
            tile + moveTile + 1 < this.state.length &&
            this.state[tile + moveTile + 1][column] === 0
          ) {
            moveTile++;
          }

          if (
            !didJustMerged &&
            tile + moveTile + 1 < this.state.length &&
            this.state[tile + moveTile + 1][column] === this.state[tile][column]
          ) {
            moveTile++;
            merge = true;
          }

          if (moveTile > 0) {
            if (!didJustMerged && merge) {
              didJustMerged = true;

              const newNumber = this.state[tile + moveTile][column] * 2;

              this.state[tile + moveTile][column] = newNumber;

              this.score += newNumber;
            } else {
              didJustMerged = false;

              this.state[tile + moveTile][column] = this.state[tile][column];
            }

            this.state[tile][column] = 0;

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
        if (currentCell !== undefined) {
          currentCell.textContent = currentState;
          currentCell.className = `field-cell field-cell--${currentState}`;
        }
      } else {
        if (currentCell !== undefined) {
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
