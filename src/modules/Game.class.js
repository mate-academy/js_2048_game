'use strict';

class Game {
  /**
* Creates a new game instance.
*
* @param {number[][]} initialState
* The initial state of the board.
* @default
* [[0, 0, 0, 0],
*  [0, 0, 0, 0],
*  [0, 0, 0, 0],
*  [0, 0, 0, 0]]
*
* If passed, the board will be initialized with the provided
* initial state.
*/
  constructor(initialState = [
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0]]) {
    this.field = initialState.map(row => [...row]);
    this.initialState = initialState.map(row => [...row]);
    this.status = 'idle';
    this.score = 0;
  }

  randomCell() {
    let row = 0;
    let col = 0;
    let value = 2;

    for (let i = 0; i < 1; i++) {
      row = Math.floor(Math.random() * 4);
      col = Math.floor(Math.random() * 4);

      const cell = [row, col];

      const subValue = Math.floor(Math.random() * 100);

      if (subValue > 89) {
        value = 4;
      } else {
        value = 2;
      }

      if (this.field[cell[0]][cell[1]] === 0) {
        this.field[cell[0]][cell[1]] = value;
      } else {
        i--;
      }
    }
  };

  moveLeft() {
    const copy = this.field.map(row => row.map(el => el));
    const stat = this.getStatus();

    if (stat === 'playing') {
      for (let x = 0; x <= this.field.length - 1; x++) {
        for (let y = 0; y < this.field.length - 1; y++) {
          for (let xX = 0; xX <= this.field.length - 1; xX++) {
            for (let yY = 0; yY < this.field.length - 1;) {
              const cur = this.field[xX][yY];
              const nextCur = this.field[xX][yY + 1];

              if (cur === 0 && nextCur > 0) {
                this.field[xX][yY] = this.field[xX][yY + 1];
                this.field[xX][yY + 1] = 0;
                yY = 0;
              } else {
                yY++;
              }
            }
          }

          const current = this.field[x][y];
          const next = this.field[x][y + 1];

          if (current === next) {
            this.field[x][y] *= 2;
            this.score += this.field[x][y];
            this.field[x][y + 1] = 0;
          }
        }
      }
    }

    const newState = this.getState();

    if (JSON.stringify(copy) !== JSON.stringify(newState)) {
      this.randomCell();
    }
  }

  moveRight() {
    const copy = this.field.map(row => row.map(el => el));
    const stat = this.getStatus();

    if (stat === 'playing') {
      for (let x = 0; x <= this.field.length - 1; x++) {
        for (let y = this.field.length - 1; y > 0; y--) {
          for (let xX = 0; xX <= this.field.length - 1; xX++) {
            for (let yY = this.field.length - 1; yY > 0;) {
              const cur = this.field[xX][yY];
              const nextCur = this.field[xX][yY - 1];

              if (cur === 0 && nextCur > 0) {
                this.field[xX][yY] = this.field[xX][yY - 1];
                this.field[xX][yY - 1] = 0;
                yY = this.field.length - 1;
              } else {
                yY--;
              }
            }
          }

          const current = this.field[x][y];
          const next = this.field[x][y - 1];

          if (current === next) {
            this.field[x][y] *= 2;
            this.score += this.field[x][y];
            this.field[x][y - 1] = 0;
          }
        }
      }
    }

    const newState = this.getState();

    if (JSON.stringify(copy) !== JSON.stringify(newState)) {
      this.randomCell();
    }
  }

  moveUp() {
    const copy = this.field.map(row => row.map(el => el));
    const stat = this.getStatus();

    if (stat === 'playing') {
      for (let y = 0; y < this.field.length; y++) {
        for (let x = 0; x < this.field.length - 1; x++) {
          for (let yY = 0; yY < this.field.length; yY++) {
            for (let xX = 0; xX < this.field.length - 1;) {
              const cur = this.field[xX][yY];
              const nextCur = this.field[xX + 1][yY];

              if (cur === 0 && nextCur > 0) {
                this.field[xX][yY] = this.field[xX + 1][yY];
                this.field[xX + 1][yY] = 0;
                xX = 0;
              } else {
                xX++;
              }
            }
          }

          const current = this.field[x][y];
          const next = this.field[x + 1][y];

          if (current === next) {
            this.field[x][y] *= 2;
            this.score += this.field[x][y];
            this.field[x + 1][y] = 0;
          }
        }
      }
    }

    const newState = this.getState();

    if (JSON.stringify(copy) !== JSON.stringify(newState)) {
      this.randomCell();
    }
  }

  moveDown() {
    const copy = this.field.map(row => row.map(el => el));
    const stat = this.getStatus();

    if (stat === 'playing') {
      for (let y = this.field.length - 1; y >= 0; y--) {
        for (let x = this.field.length - 1; x > 0; x--) {
          for (let yY = this.field.length - 1; yY >= 0; yY--) {
            for (let xX = this.field.length - 1; xX > 0;) {
              const cur = this.field[xX][yY];
              const nextCur = this.field[xX - 1][yY];

              if (cur === 0 && nextCur > 0) {
                this.field[xX][yY] = this.field[xX - 1][yY];
                this.field[xX - 1][yY] = 0;
                xX = this.field.length - 1;
              } else {
                xX--;
              }
            }
          }

          const current = this.field[x][y];
          const next = this.field[x - 1][y];

          if (current === next) {
            this.field[x][y] *= 2;
            this.score += this.field[x][y];
            this.field[x - 1][y] = 0;
          }
        }
      }
    }

    const newState = this.getState();

    if (JSON.stringify(copy) !== JSON.stringify(newState)) {
      this.randomCell();
    }
  }

  getScore() {
    return this.score;
  }

  getState() {
    return this.field;
  };

  /**
   * Returns the current game status.
   *
   * @returns {string} One of: 'idle', 'playing', 'win', 'lose'
   *
   * `idle` - the game has not started yet (the initial state);
   * `playing` - the game is in progress;
   * `win` - the game is won;
   * `lose` - the game is lost
   */

  canMove() {
    for (let x = 0; x <= 3; x++) {
      for (let y = 0; y < 3; y++) {
        if (this.field[x][y] === this.field[x][y + 1]) {
          return true;
        }
      }
    }

    for (let y = 0; y <= 3; y++) {
      for (let x = 0; x < 3; x++) {
        if (this.field[x][y] === this.field[x + 1][y]) {
          return true;
        }
      }
    }

    for (let y = 0; y <= 3; y++) {
      for (let x = 0; x < 3; x++) {
        if (this.field[x][y] === 0) {
          return true;
        }
      }
    }
  }

  isWin() {
    for (let x = 0; x < this.field.length; x++) {
      for (let y = 0; y < this.field.length; y++) {
        if (this.field[x][y] >= 2048) {
          return true;
        }
      }
    }
  }

  getStatus() {
    if (!this.canMove()) {
      this.status = 'lose';
    }

    if (this.isWin()) {
      this.status = 'win';
    }

    return this.status;
  }

  start() {
    let value = 2;
    let row = 0;
    let col = 0;

    for (let i = 0; i < 2; i++) {
      row = Math.floor(Math.random() * 4);
      col = Math.floor(Math.random() * 4);

      const newCell = [row, col];

      if (this.field[newCell[0]][newCell[1]] === 0) {
        const subValue = Math.floor(Math.random() * 100);

        if (subValue > 89) {
          value = 4;
        } else {
          value = 2;
        }

        this.field[newCell[0]][newCell[1]] = value;
      } else {
        i--;
      }
    }

    this.status = 'playing';
  }

  restart(initialState) {
    this.status = 'idle';
    this.score = 0;
    this.field = this.initialState.map(row => [...row]);
  }
}

module.exports = Game;
