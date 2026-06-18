'use strict';

function copyGrid(grid) {
  return grid.map((row) => [...row]);
}

class Game {
  // constants

  static #spawnValues = [2, 4]; // only 2 values are supported
  static #winValue = 2048;

  // private values

  #status = 'idle';
  #initialState;

  // DOM elements

  #buttonEl = document.querySelector('.button');
  #messageStartEl = document.querySelector('.message-start');
  #fieldEl = document.querySelector('.game-field tbody');
  #scoreEl = document.querySelector('.game-score');

  // private methods

  #handleMove = (e) => {
    switch (e.key) {
      case 'ArrowLeft':
        if (this.moveLeft()) {
          this.spawnNewTile();
        }
        break;
      case 'ArrowRight':
        if (this.moveRight()) {
          this.spawnNewTile();
        }
        break;
      case 'ArrowUp':
        if (this.moveUp()) {
          this.spawnNewTile();
        }
        break;
      case 'ArrowDown':
        if (this.moveDown()) {
          this.spawnNewTile();
        }
        break;
    }
    this.updateGrid();
  };

  #handleButtonClick = () => {
    if (this.status === 'idle') {
      this.start();
    } else {
      this.restart();
    }
  };

  // moves every cell to the left if it is possible
  #slideRow(row) {
    let mutatedRow = row.filter((num) => num !== 0);

    for (let i = 1; i < mutatedRow.length; i++) {
      if (mutatedRow[i] === mutatedRow[i - 1]) {
        this.score += mutatedRow[i - 1] * 2;

        mutatedRow[i - 1] *= 2;
        mutatedRow[i] = 0;
      }
    }

    mutatedRow = mutatedRow.filter((n) => n !== 0);

    while (mutatedRow.length < 4) {
      mutatedRow.push(0);
    }

    const wasMoved = mutatedRow.some((num, index) => num !== row[index]);

    return { mutatedRow, wasMoved };
  }

  #transpose(grid) {
    const transposedGrid = [
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
    ];

    for (let i = 0; i < 4; i++) {
      for (let j = 0; j < 4; j++) {
        transposedGrid[i][j] = grid[j][i];
      }
    }

    return transposedGrid;
  }

  /**
   * @param {number[][]} initialState
   * The initial state of the board.
   * @default
   * [[0, 0, 0, 0],
   *  [0, 0, 0, 0],
   *  [0, 0, 0, 0],
   *  [0, 0, 0, 0]]
   */
  constructor(initialState) {
    this.#initialState = copyGrid(initialState);
    this.state = copyGrid(initialState);
    this.score = 0;

    this.#buttonEl.addEventListener('click', this.#handleButtonClick);
  }

  /**
   * @returns {boolean}
   * */
  moveLeft() {
    let wasAnyMoved = false;

    this.state.forEach((row, i) => {
      const slided = this.#slideRow(row);

      wasAnyMoved = wasAnyMoved || slided.wasMoved;
      slided.mutatedRow.forEach((val, j) => (this.state[i][j] = val));
    });

    return wasAnyMoved;
  }

  moveRight() {
    let wasAnyMoved = false;

    this.state.forEach((row, i) => {
      const reversedSlided = this.#slideRow(row.toReversed());

      wasAnyMoved = wasAnyMoved || reversedSlided.wasMoved;

      reversedSlided.mutatedRow
        .toReversed()
        .forEach((val, j) => (this.state[i][j] = val));
    });

    return wasAnyMoved;
  }

  moveUp() {
    let wasAnyMoved = false;

    this.#transpose(this.state).forEach((row, i) => {
      const slided = this.#slideRow(row);

      wasAnyMoved = wasAnyMoved || slided.wasMoved;
      slided.mutatedRow.forEach((val, j) => (this.state[j][i] = val));
    });

    return wasAnyMoved;
  }

  moveDown() {
    let wasAnyMoved = false;

    this.#transpose(this.state).forEach((row, i) => {
      const reversedSlided = this.#slideRow(row.toReversed());

      wasAnyMoved = wasAnyMoved || reversedSlided.wasMoved;

      reversedSlided.mutatedRow
        .toReversed()
        .forEach((val, j) => (this.state[j][i] = val));
    });

    return wasAnyMoved;
  }

  /**
   * @returns {string} One of: 'idle', 'playing', 'win', 'lose'
   *
   * `idle` - the game has not started yet (the initial state);
   * `playing` - the game is in progress;
   * `win` - the game is won;
   * `lose` - the game is lost
   */
  get status() {
    return this.#status;
  }

  set status(value) {
    this.#status = value;

    if (value === 'idle') {
      document.removeEventListener('keydown', this.#handleMove);
      this.#buttonEl.className = 'button start';
      this.#buttonEl.textContent = 'Start';
    } else if (value === 'playing') {
      document.addEventListener('keydown', this.#handleMove);
      this.#buttonEl.className = 'button restart';
      this.#buttonEl.textContent = 'Restart';
    } else if (value === 'win') {
    } else if (value === 'lose') {
    }
  }

  start() {
    this.status = 'playing';
    this.#messageStartEl.classList.add('hidden');
    this.spawnNewTile();
  }

  restart() {
    this.status = 'idle';
    this.state = copyGrid(this.#initialState);
    this.#messageStartEl.classList.remove('hidden');
    this.score = 0;
    this.updateGrid();
  }

  spawnNewTile() {
    const emptyTileIndexes = this.state
      .flat()
      .map((tile, index) => (tile ? -1 : index))
      .filter((el) => el !== -1);

    if (!emptyTileIndexes.length) {
      throw new Error(`No free tile index found`);
    }

    const spawnValue =
      Math.random() < 0.9 ? Game.#spawnValues[0] : Game.#spawnValues[1];
    const spawnIndex =
      emptyTileIndexes[Math.floor(Math.random() * emptyTileIndexes.length)];

    this.state[Math.floor(spawnIndex / 4)][spawnIndex % 4] = spawnValue;
    this.updateGrid();
  }

  updateGrid() {
    [...this.#fieldEl.children].forEach((row, rowIndex) => {
      [...row.children].forEach((el, elIndex) => {
        const tileValue = this.state[rowIndex][elIndex];

        if (tileValue) {
          el.textContent = tileValue;
          el.className = `field-cell field-cell--${tileValue}`;
        } else {
          el.textContent = '';
          el.className = 'field-cell';
        }
      });
    });

    this.#scoreEl.textContent = this.score;
  }
}

module.exports = Game;
