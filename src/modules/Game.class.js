'use strict';

/**
 * This class represents the game.
 * Now it has a basic structure, that is needed for testing.
 * Feel free to add more props and methods if needed.
 */
class Game {
  static defaultInitial = [
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
  ];
  static defaultStatus = 'idle';
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
  constructor(initialState = Game.defaultInitial) {
    this.state = JSON.parse(JSON.stringify(initialState));
    this.score = 0;
    this.status = Game.defaultStatus;
  }

  moveLeft() {
    let moveSuccess = false;

    for (let row = 0; row < 4; row++) {
      let start = 0;

      while (start < 3) {
        let first = -1;

        for (let i = start; i < 3; i++) {
          if (this.state[row][i] !== 0) {
            first = i;
            break;
          }
        }

        let second = -1;

        for (let i = first + 1; i < 4; i++) {
          if (this.state[row][i] !== 0) {
            second = i;
            break;
          }
        }

        if (first === -1 || second === -1) {
          break;
        }

        if (this.state[row][first] === this.state[row][second]) {
          this.state[row][first] *= 2;
          this.state[row][second] = 0;
          this.addScore(this.state[row][first]);
          moveSuccess = true;
          start = second + 1;
          continue;
        } else {
          start = second;
          continue;
        }
      }
    }

    for (let i = 0; i < 4; i++) {
      for (let j = 0; j < 4; j++) {
        if (this.state[i][j] !== 0) {
          const temp = this.state[i][j];

          this.state[i][j] = 0;

          const idx = this.state[i].findIndex((el) => el === 0);

          this.state[i][idx] = temp;

          if (j !== idx) {
            moveSuccess = true;
          }
        }
      }
    }

    return moveSuccess;
  }

  moveRight() {
    let moveSuccess = false;

    for (let row = 0; row < 4; row++) {
      let start = 3;

      while (start > 0) {
        let first = -1;

        for (let i = start; i > 0; i--) {
          if (this.state[row][i] !== 0) {
            first = i;
            break;
          }
        }

        let second = -1;

        for (let i = first - 1; i >= 0; i--) {
          if (this.state[row][i] !== 0) {
            second = i;
            break;
          }
        }

        if (first === -1 || second === -1) {
          break;
        }

        if (this.state[row][first] === this.state[row][second]) {
          this.state[row][first] *= 2;
          this.state[row][second] = 0;
          moveSuccess = true;
          this.addScore(this.state[row][first]);
          start = second - 1;
          continue;
        } else {
          start = second;
          continue;
        }
      }
    }

    for (let i = 0; i < 4; i++) {
      for (let j = 3; j >= 0; j--) {
        if (this.state[i][j] !== 0) {
          const temp = this.state[i][j];

          this.state[i][j] = 0;

          let idx = null;

          for (let q = 3; q >= 0; q--) {
            if (this.state[i][q] === 0) {
              idx = q;
              break;
            }
          }

          this.state[i][idx] = temp;

          if (j !== idx) {
            moveSuccess = true;
          }
        }
      }
    }

    return moveSuccess;
  }

  moveUp() {
    let moveSuccess = false;

    for (let col = 0; col < 4; col++) {
      let start = 0;

      while (start < 4) {
        let first = -1;

        for (let i = start; i < 3; i++) {
          if (this.state[i][col] !== 0) {
            first = i;
            break;
          }
        }

        let second = -1;

        for (let i = first + 1; i < 4; i++) {
          if (this.state[i][col] !== 0) {
            second = i;
            break;
          }
        }

        if (first === -1 || second === -1) {
          break;
        }

        if (this.state[first][col] === this.state[second][col]) {
          this.state[first][col] *= 2;
          this.state[second][col] = 0;
          moveSuccess = true;
          this.addScore(this.state[first][col]);
          start = second + 1;
          continue;
        } else {
          start = second;
          continue;
        }
      }
    }

    for (let i = 0; i < 4; i++) {
      for (let j = 0; j < 4; j++) {
        if (this.state[j][i] !== 0) {
          const temp = this.state[j][i];

          this.state[j][i] = 0;

          let idx = null;

          for (let q = 0; q < 4; q++) {
            if (this.state[q][i] === 0) {
              idx = q;
              break;
            }
          }

          this.state[idx][i] = temp;

          if (j !== idx) {
            moveSuccess = true;
          }
        }
      }
    }

    return moveSuccess;
  }

  moveDown() {
    let moveSuccess = false;

    for (let col = 0; col < 4; col++) {
      let start = 3;

      while (start > 0) {
        let first = -1;

        for (let i = start; i > 0; i--) {
          if (this.state[i][col] !== 0) {
            first = i;
            break;
          }
        }

        let second = -1;

        for (let i = first - 1; i >= 0; i--) {
          if (this.state[i][col] !== 0) {
            second = i;
            break;
          }
        }

        if (first === -1 || second === -1) {
          break;
        }

        if (this.state[first][col] === this.state[second][col]) {
          this.state[first][col] *= 2;
          this.state[second][col] = 0;
          moveSuccess = true;
          this.addScore(this.state[first][col]);
          start = second - 1;
          continue;
        } else {
          start = second;
          continue;
        }
      }
    }

    for (let i = 0; i < 4; i++) {
      for (let j = 3; j >= 0; j--) {
        if (this.state[j][i] !== 0) {
          const temp = this.state[j][i];

          this.state[j][i] = 0;

          let idx = null;

          for (let q = 3; q >= 0; q--) {
            if (this.state[q][i] === 0) {
              idx = q;
              break;
            }
          }

          this.state[idx][i] = temp;

          if (j !== idx) {
            moveSuccess = true;
          }
        }
      }
    }

    return moveSuccess;
  }

  /**
   * @returns {number}
   */
  getScore() {
    return this.score;
  }

  /**
   * @returns {number[][]}
   */
  getState() {
    return this.state;
  }

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
  getStatus() {
    return this.status;
  }

  /**
   * Starts the game.
   */
  start() {
    this.status = 'playing';
    this.fillRandomCell();
    this.fillRandomCell();
  }

  /**
   * Resets the game.
   */
  restart() {
    this.state = JSON.parse(JSON.stringify(Game.defaultInitial));
    this.score = 0;
    this.status = Game.defaultStatus;
  }

  // Add your own methods here
  fillRandomCell() {
    // get indexes of empty cells
    const indx = [];

    this.state.forEach((arr, ind1) => {
      arr.forEach((el, ind2) => {
        if (el === 0) {
          indx.push([ind1, ind2]);
        }
      });
    });

    // choose random element
    const randomInd = indx[Math.floor(Math.random() * indx.length)];
    const x = randomInd[0];
    const y = randomInd[1];

    // fill the cell
    if (Math.random <= 0.1) {
      this.state[x][y] = 4;
    } else {
      this.state[x][y] = 2;
    }
  }

  addScore(num) {
    this.score += num;
  }

  checkLose() {
    const tempLeft = new Game(this.state);
    const leftSuccess = tempLeft.moveLeft();

    const tempRight = new Game(this.state);
    const rightSuccess = tempRight.moveRight();

    const tempUp = new Game(this.state);
    const upSuccess = tempUp.moveUp();

    const tempDown = new Game(this.state);
    const downSuccess = tempDown.moveDown();

    if (!(leftSuccess || rightSuccess || upSuccess || downSuccess)) {
      return true;
    }

    return false;
  }
}

module.exports = Game;
