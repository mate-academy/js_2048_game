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
    return this.moveDirection('left');
  }

  moveRight() {
    return this.moveDirection('right');
  }

  moveUp() {
    return this.moveDirection('up');
  }

  moveDown() {
    return this.moveDirection('down');
  }

  moveDirection(direction) {
    let moveSuccess = this.mergeCells(direction);

    moveSuccess = this.moveToSide(direction);

    return moveSuccess;
  }

  mergeCells(direction) {
    let moveSuccess = false;

    for (let row = 0; row < 4; row++) {
      let start = this.startByDirection(direction);

      while (this.loopConditionByDirection(direction, 3, 0)(start)) {
        let first = -1;

        for (
          let i = start;
          this.loopConditionByDirection(direction, 3, 0)(i);
          i = this.operationByDirection(direction)(i)
        ) {
          const [x, y] = this.swapByDirection(direction, row, i);

          if (this.state[x][y] !== 0) {
            first = i;
            break;
          }
        }

        let second = -1;

        for (
          let i = this.operationByDirection(direction)(first);
          this.loopConditionByDirection(direction, 4, -1)(i);
          i = this.operationByDirection(direction)(i)
        ) {
          const [x, y] = this.swapByDirection(direction, row, i);

          if (this.state[x][y] !== 0) {
            second = i;
            break;
          }
        }

        if (first === -1 || second === -1) {
          break;
        }

        const [firstEl, secondEl] = this.swapDimension(
          direction,
          row,
          first,
          second,
        );

        if (firstEl === secondEl) {
          if (['left', 'right'].includes(direction)) {
            this.state[row][first] *= 2;
            this.state[row][second] = 0;
            this.addScore(this.state[row][first]);
          } else {
            this.state[first][row] *= 2;
            this.state[second][row] = 0;
            this.addScore(this.state[first][row]);
          }

          moveSuccess = true;
          start = this.operationByDirection(direction)(second);
          continue;
        } else {
          start = second;
          continue;
        }
      }
    }

    return moveSuccess;
  }

  moveToSide(direction) {
    let moveSuccess = false;

    for (let i = 0; i < 4; i++) {
      for (
        let j = this.startByDirection(direction);
        this.loopConditionByDirection(direction, 4, -1)(j);
        j = this.operationByDirection(direction)(j)
      ) {
        const [x, y] = this.swapByDirection(direction, i, j);

        if (this.state[x][y] !== 0) {
          const temp = this.state[x][y];

          this.state[x][y] = 0;

          let idx = null;

          for (
            let q = this.startByDirection(direction);
            this.loopConditionByDirection(direction, 4, -1)(q);
            q = this.operationByDirection(direction)(q)
          ) {
            const [x2, y2] = this.swapByDirection(direction, i, q);

            if (this.state[x2][y2] === 0) {
              idx = q;
              break;
            }
          }

          const [x3, y3] = this.swapByDirection(direction, i, idx);

          this.state[x3][y3] = temp;

          if (j !== idx) {
            moveSuccess = true;
          }
        }
      }
    }

    return moveSuccess;
  }

  swapByDirection(direction, var1, var2) {
    if (['up', 'down'].includes(direction)) {
      return [var2, var1];
    }

    return [var1, var2];
  }

  startByDirection(direction) {
    if (['left', 'up'].includes(direction)) {
      return 0;
    }

    return 3;
  }

  loopConditionByDirection(direction, max, min) {
    if (['left', 'up'].includes(direction)) {
      return (start) => start < max;
    }

    return (start) => start > min;
  }

  operationByDirection(direction) {
    if (['left', 'up'].includes(direction)) {
      return (i) => i + 1;
    }

    return (i) => i - 1;
  }

  swapDimension(direction, row, first, second) {
    if (['up', 'down'].includes(direction)) {
      return [this.state[first][row], this.state[second][row]];
    }

    return [this.state[row][first], this.state[row][second]];
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

    if (indx.length === 0) {
      return;
    }

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
