'use strict';

/**
 * This class represents the game.
 * Now it has a basic structure, that is needed for testing.
 * Feel free to add more props and methods if needed.
 */
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
  static MATRIX_SIZE = 4;
  static TILE_CLASS = 'tile';

  constructor(initialState) {
    // eslint-disable-next-line no-console
    if (initialState) {
      if (
        initialState.length === 4 &&
        initialState.every((row) => Array.isArray(row) && row.length === 4)
      ) {
        this.#initialState = initialState;

        this.#state = initialState.map((m, i) => {
          m.forEach((f, j) => {
            if (f !== 0) {
              this.addTile(i, j, f);
            }
          });

          return [...m];
        });
      }
    } else {
      this.#initialState = [
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
      ];

      this.#state = [
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
      ];
    }

    this.tileContainer.style.position = 'relative';
  }

  #status = 'idle';
  #score = 0;
  #initialState;
  #state;
  #lastPosition = {};
  #maxNumber = 2;
  step = 85;
  speed = 0.1;
  numberClass = 'field-cell';
  tileContainer = document.querySelector('.game-field tbody');
  #tiles = [
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
  ];

  addTile(i, j, number) {
    const div = document.createElement('div');

    this.#tiles[i][j] = div;
    div.innerText = number;

    div.classList.add(
      this.numberClass,
      this.numberClass + '--' + number,
      Game.TILE_CLASS,
    );

    div.style.cssText = `
      position: absolute;
      top: ${i * this.step}px;
      left: ${j * this.step}px;
      display: flex;
      align-items: center;
      justify-content: center;`;

    this.tileContainer.appendChild(div);
  }

  async moveLeft() {
    let isMove = false;
    const promises = [];

    for (let n = 0; n < Game.MATRIX_SIZE; n++) {
      let lastNumberIndex = 0;

      for (let i = 1; i < Game.MATRIX_SIZE; i++) {
        if (this.#state[n][i] === 0) {
          continue;
        }

        if (this.#state[n][lastNumberIndex] === 0) {
          this.#state[n][lastNumberIndex] = this.#state[n][i];
          this.#state[n][i] = 0;
          isMove = true;

          promises.push(
            this.moveTile(
              n,
              i,
              lastNumberIndex - i,
              'X',
              this.#state[n][lastNumberIndex],
            ),
          );
          continue;
        }

        if (this.#state[n][i] === this.#state[n][lastNumberIndex]) {
          this.#state[n][lastNumberIndex] *= 2;
          this.#state[n][i] = 0;

          promises.push(
            this.moveTile(
              n,
              i,
              lastNumberIndex - i,
              'X',
              this.#state[n][lastNumberIndex],
            ),
          );
          isMove = true;
          lastNumberIndex++;

          if (this.#state[n][lastNumberIndex] > this.#maxNumber) {
            this.#maxNumber = this.#state[n][lastNumberIndex];
          }
          continue;
        }

        if (this.#state[n][i] !== this.#state[n][lastNumberIndex]) {
          lastNumberIndex++;

          if (lastNumberIndex < i) {
            this.#state[n][lastNumberIndex] = this.#state[n][i];
            this.#state[n][i] = 0;

            promises.push(
              this.moveTile(
                n,
                i,
                lastNumberIndex - i,
                'X',
                this.#state[n][lastNumberIndex],
              ),
            );
            isMove = true;
          }
          continue;
        }
      }
    }

    if (isMove) {
      this.#score++;
      await Promise.all(promises);

      if (this.#maxNumber < 2048) {
        this.setNewNumber();
      } else {
        this.#status = 'win';
      }
    }
  }

  async moveRight() {
    let isMove = false;
    const promises = [];

    this.#state.forEach((row, n) => {
      let lastNumberIndex = row.length - 1;

      for (let i = row.length - 2; i >= 0; i--) {
        if (row[i] === 0) {
          continue;
        }

        if (row[lastNumberIndex] === 0) {
          row[lastNumberIndex] = row[i];
          row[i] = 0;

          promises.push(
            this.moveTile(
              n,
              i,
              lastNumberIndex - i,
              'X',
              this.#state[n][lastNumberIndex],
            ),
          );
          isMove = true;
          continue;
        }

        if (row[i] === row[lastNumberIndex]) {
          row[lastNumberIndex] *= 2;
          row[i] = 0;

          promises.push(
            this.moveTile(
              n,
              i,
              lastNumberIndex - i,
              'X',
              this.#state[n][lastNumberIndex],
            ),
          );
          isMove = true;
          lastNumberIndex--;

          if (row[lastNumberIndex] > this.#maxNumber) {
            this.#maxNumber = row[lastNumberIndex];
          }
          continue;
        }

        if (row[i] !== row[lastNumberIndex]) {
          lastNumberIndex--;

          if (lastNumberIndex !== i) {
            row[lastNumberIndex] = row[i];
            row[i] = 0;

            promises.push(
              this.moveTile(
                n,
                i,
                lastNumberIndex - i,
                'X',
                this.#state[n][lastNumberIndex]
              ),
            );
            isMove = true;
          }
          continue;
        }
      }
    });

    if (isMove) {
      this.#score++;
      await Promise.all(promises);

      if (this.#maxNumber < 2048) {
        this.setNewNumber();
      } else {
        this.#status = 'win';
      }
    }
  }
  async moveUp() {
    let isMove = false;
    const lenY = this.#state.length;
    const lenX = this.#state[0].length;
    const promises = [];

    for (let j = 0; j < lenX; j++) {
      let targetPosRow = 0;

      for (let i = 1; i < lenY; i++) {
        if (this.#state[i][j] === 0) {
          continue;
        }

        if (this.#state[targetPosRow][j] === 0) {
          this.#state[targetPosRow][j] = this.#state[i][j];
          this.#state[i][j] = 0;

          promises.push(
            this.moveTile(
              i,
              j,
              targetPosRow - i,
              'Y',
              this.#state[targetPosRow][j],
            ),
          );
          isMove = true;
          continue;
        }

        if (this.#state[i][j] === this.#state[targetPosRow][j]) {
          this.#state[targetPosRow][j] *= 2;
          this.#state[i][j] = 0;

          promises.push(
            this.moveTile(
              i,
              j,
              targetPosRow - i,
              'Y',
              this.#state[targetPosRow][j],
            ),
          );
          isMove = true;
          targetPosRow++;

          if (this.#state[targetPosRow][j] > this.#maxNumber) {
            this.#maxNumber = this.#state[targetPosRow][j];
          }
          continue;
        }

        if (this.#state[i][j] !== this.#state[targetPosRow][j]) {
          targetPosRow++;

          if (targetPosRow !== i) {
            this.#state[targetPosRow][j] = this.#state[i][j];
            this.#state[i][j] = 0;

            promises.push(
              this.moveTile(
                i,
                j,
                targetPosRow - i,
                'Y',
                this.#state[targetPosRow][j],
              ),
            );
            isMove = true;
          }

          continue;
        }
      }
    }

    if (isMove) {
      this.#score++;
      await Promise.all(promises);

      if (this.#maxNumber < 2048) {
        this.setNewNumber();
      } else {
        this.#status = 'win';
      }
    }
  }
  async moveDown() {
    let isMove = false;
    const lenY = this.#state.length;
    const lenX = this.#state[0].length;
    const promises = [];

    for (let j = 0; j < lenX; j++) {
      let targetPosRow = lenY - 1;

      for (let i = lenY - 2; i >= 0; i--) {
        if (this.#state[i][j] === 0) {
          continue;
        }

        if (this.#state[targetPosRow][j] === 0) {
          this.#state[targetPosRow][j] = this.#state[i][j];
          this.#state[i][j] = 0;

          promises.push(
            this.moveTile(
              i,
              j,
              targetPosRow - i,
              'Y',
              this.#state[targetPosRow][j],
            ),
          );
          isMove = true;
          continue;
        }

        if (this.#state[i][j] === this.#state[targetPosRow][j]) {
          this.#state[targetPosRow][j] *= 2;
          this.#state[i][j] = 0;

          promises.push(
            this.moveTile(
              i,
              j,
              targetPosRow - i,
              'Y',
              this.#state[targetPosRow][j],
            ),
          );
          isMove = true;
          targetPosRow--;

          if (this.#state[targetPosRow][j] > this.#maxNumber) {
            this.#maxNumber = this.#state[targetPosRow][j];
          }
          continue;
        }

        if (this.#state[i][j] !== this.#state[targetPosRow][j]) {
          targetPosRow--;

          if (targetPosRow !== i) {
            this.#state[targetPosRow][j] = this.#state[i][j];
            this.#state[i][j] = 0;

            promises.push(
              this.moveTile(
                i,
                j,
                targetPosRow - i,
                'Y',
                this.#state[targetPosRow][j],
              ),
            );
            isMove = true;
          }

          continue;
        }
      }
    }

    if (isMove) {
      this.#score++;
      await Promise.all(promises);

      if (this.#maxNumber < 2048) {
        this.setNewNumber();
      } else {
        this.#status = 'win';
      }
    }
  }

  getTiles() {
    return this.#tiles;
  }

  getScore() {
    return this.#score;
  }

  /**
   * @returns {number[][]}
   */
  getState() {
    return this.#state;
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
    return this.#status;
  }

  /**
   * Starts the game.
   */
  start() {
    this.#status = 'playing';
  }

  /**
   * Resets the game.
   */
  restart() {
    this.#state = this.#initialState.map((r) => [...r]);

    this.#tiles.forEach((tileRow, i) => {
      tileRow.forEach((tile, j) => {
        if (tile !== 0) {

          this.#tiles[i][j].remove();
          this.#tiles[i][j] = 0;
        }

        if (this.#state[i][j] !== 0) {
          this.addTile(i, j, this.#state[i][j]);
        }
      });
    });

    this.#status = 'playing';
    this.#score = 0;
  }

  getLastPosition() {
    return this.#lastPosition;
  }

  setNewNumber() {
    const freeCells = [];

    this.#state.forEach((row, i) => {
      row.forEach((value, j) => {
        if (value === 0) {
          freeCells.push({ i, j });
        }
      });
    });

    const placeRandom = Math.floor(Math.random() * freeCells.length);
    const coords = freeCells[placeRandom];
    const number = Math.random() < 0.9 ? 2 : 4;

    if (freeCells.length === 0) {
      if (!this.moveApportunity()) {
        this.#status = 'lose';
      }

      return;
    }

    this.#state[coords.i][coords.j] = number;
    this.addTile(coords.i, coords.j, number);

    this.#lastPosition = {
      x: coords.i,
      y: coords.j,
    };

    if (freeCells.length === 1) {
      if (!this.moveApportunity()) {
        this.#status = 'lose';
      }
    }
  }

  moveApportunity() {
    const len = this.#state.length;

    for (let i = 0; i < len; i++) {
      for (let j = 0; j < len; j++) {
        const num = this.#state[i][j];

        if (
          (j > 0 && this.#state[i][j - 1] === num) ||
          (j < len - 1 && this.#state[i][j + 1] === num) ||
          (i > 0 && this.#state[i - 1][j] === num) ||
          (i < len - 1 && this.#state[i + 1][j] === num)
        ) {
          return true;
        }
      }
    }

    return false;
  }

  moveTile(i, j, distance, direction, number) {
    const time = Math.abs(distance) * this.speed;
    let newX;
    let newY;
    let previusTile;

    if (direction === 'X') {
      this.#tiles[i][j].style.transition = `left ${time}s linear`;
      newX = i;
      newY = j + distance;
    } else {
      this.#tiles[i][j].style.transition = `top ${time}s linear`;
      newX = i + distance;
      newY = j;
    }

    if (this.#tiles[newX][newY] !== 0) {
      previusTile = this.#tiles[newX][newY];
    }
    this.#tiles[newX][newY] = this.#tiles[i][j];
    this.#tiles[i][j] = 0;

    const tile = this.#tiles[newX][newY];

    setTimeout(() => {
      if (direction === 'X') {
        tile.style.left = `${+tile.style.left.slice(0, -2) + this.step * distance}px`;
      } else {
        tile.style.top = `${+tile.style.top.slice(0, -2) + this.step * distance}px`;
      }
    }, 0);

    return new Promise((resolve) => {
      setTimeout(() => {
        tile.style.transition = '';

        tile.classList.remove(`${this.numberClass}--${tile.innerText}`);
        tile.innerText = number;

        tile.classList.add(`${this.numberClass}--${tile.innerText}`);

        if (previusTile) {
          previusTile.remove();
        }
        resolve();
      }, time * 1000);
    });
  }
}

module.exports = Game;
