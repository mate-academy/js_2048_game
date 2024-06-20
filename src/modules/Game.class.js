'use strict';

/**
 * This class represents the game.
 * Now it has a basic structure, that is needed for testing.
 * Feel free to add more props and methods if needed.
 */
class Game {
  #DEFAULT_STATE = [
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
  ];

  // #DEFAULT_STATE = [
  //   [1, 1, 1, 1],
  //   [2, 2, 2, 2],
  //   [3, 3, 3, 3],
  //   [0, 0, 0, 0],
  // ];

  // #DEFAULT_STATE = [
  //   [1, 1, 1, 1],
  //   [2, 2, 2, 2],
  //   [0, 0, 0, 0],
  //   [0, 0, 0, 0],
  // ];

  #copyState(state) {
    return state.map((arr) => [...arr]);
  }

  constructor(initialState = this.#copyState(this.#DEFAULT_STATE)) {
    this.matrix = initialState;
    this.statusIdle = 'idle';
    this.statusPlaying = 'playing';
    this.statusWin = 'win';
    this.statusLose = 'lose';
  }

  moveLeft() {
    this.slideTilesLeft(this.matrix);

    this.createRandomTile();

    this.drawTiles();
  }
  moveRight() {
    this.slideTilesRight(this.matrix);

    this.createRandomTile();

    this.drawTiles();
  }
  moveUp() {
    this.slideTilesUp(this.getMatrixGroupedByCols());

    this.createRandomTile();

    this.drawTiles();
  }
  moveDown() {
    this.slideTilesDown(this.getMatrixGroupedByCols());

    this.createRandomTile();

    this.drawTiles();
  }

  /**
   * @returns {number}
   */
  getScore() {}

  /**
   * @returns {number[][]}
   */
  getState() {}

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
    // if ()

    return this.statusIdle;
  }

  start() {
    this.createRandomTile();
    this.createRandomTile();
  }

  restart() {
    this.matrix = this.#copyState(this.#DEFAULT_STATE);

    this.clearMatrix();
  }

  // Add your own methods here

  createRandomTile() {
    const randomDigit = Math.random() < 0.9 ? 2 : 4;
    const getEmptyTiles = [];

    for (let i = 0; i < 4; i++) {
      for (let j = 0; j < 4; j++) {
        if (this.matrix[i][j] === 0) {
          getEmptyTiles.push([i, j]);
        }
      }
    }

    const randomEmptyTile = Math.floor(Math.random() * getEmptyTiles.length);
    const coordinateEmptyTile = getEmptyTiles[randomEmptyTile];

    this.matrix[coordinateEmptyTile[0]][coordinateEmptyTile[1]] = randomDigit;

    // edit HTML element
    const getRowWithEmptyTile = document.querySelector(
      `.field-row:nth-child(${coordinateEmptyTile[0] + 1})`,
    );
    const emptyTile = getRowWithEmptyTile.querySelector(
      `.field-cell:nth-child(${coordinateEmptyTile[1] + 1})`,
    );

    emptyTile.textContent = randomDigit;
    emptyTile.classList.add(`field-cell--${randomDigit}`);
    emptyTile.style.transition = '.5s';
  }

  getMatrixGroupedByCols() {
    const groupedMatrix = this.#copyState(this.#DEFAULT_STATE);

    for (let i = 0; i < 4; i++) {
      for (let j = 0; j < 4; j++) {
        groupedMatrix[j][i] = this.matrix[i][j];
      }
    }

    return groupedMatrix;
  }

  clearMatrix() {
    for (let i = 0; i < 4; i++) {
      for (let j = 0; j < 4; j++) {
        const getRow = document.querySelector(`.field-row:nth-child(${i + 1})`);
        const tile = getRow.querySelector(`.field-cell:nth-child(${j + 1})`);

        tile.textContent = '';
        tile.className = 'field-cell';
      }
    }
  }

  slideTilesUp(groupedMatrix) {
    groupedMatrix.map((group) => {
      for (let i = 1; i < 4; i++) {
        while (group[i - 1] === 0 && group[i] !== 0) {
          group[i - 1] = group[i];
          group[i] = 0;
          i--;
        }

        // merge tiles
        if (group[i] === group[i - 1] && group[i] !== 0) {
          group[i - 1] = group[i] + group[i - 1];
          group[i] = 0;
          i++;
        }

        // while (group[i - 1] === 0 && group[i] !== 0) {
        //   group[i - 1] = group[i];
        //   group[i] = 0;
        //   i--;
        // }
      }

      return group;
    });

    for (let i = 0; i < 4; i++) {
      for (let j = 0; j < 4; j++) {
        this.matrix[i][j] = groupedMatrix[j][i];
      }
    }
  }

  slideTilesLeft(groupedMatrix) {
    groupedMatrix.map((group) => {
      for (let i = 1; i < 4; i++) {
        while (group[i - 1] === 0 && group[i] !== 0) {
          group[i - 1] = group[i];
          group[i] = 0;
          i--;
        }

        if (group[i] === group[i - 1] && group[i] !== 0) {
          group[i - 1] = group[i] + group[i - 1];
          group[i] = 0;
          i++;
        }
      }

      return group;
    });
  }

  slideTilesDown(groupedMatrix) {
    groupedMatrix.map((group) => {
      for (let i = 2; i >= 0; i--) {
        while (group[i + 1] === 0 && group[i] !== 0) {
          group[i + 1] = group[i];
          group[i] = 0;
          i++;
        }

        if (group[i] === group[i + 1] && group[i] !== 0) {
          group[i + 1] = group[i] + group[i + 1];
          group[i] = 0;
          i--;
        }
      }

      return group;
    });

    for (let i = 0; i < 4; i++) {
      for (let j = 0; j < 4; j++) {
        this.matrix[i][j] = groupedMatrix[j][i];
      }
    }
  }

  slideTilesRight(groupedMatrix) {
    groupedMatrix.map((group) => {
      for (let i = 2; i >= 0; i--) {
        while (group[i + 1] === 0 && group[i] !== 0) {
          group[i + 1] = group[i];
          group[i] = 0;
          i++;
        }

        if (group[i] === group[i + 1] && group[i] !== 0) {
          group[i + 1] = group[i] + group[i + 1];
          group[i] = 0;
          i--;
        }
      }

      return group;
    });
  }

  drawTiles() {
    for (let i = 0; i < 4; i++) {
      for (let j = 0; j < 4; j++) {
        const getRow = document.querySelector(`.field-row:nth-child(${i + 1})`);
        const tile = getRow.querySelector(`.field-cell:nth-child(${j + 1})`);

        tile.textContent = '';
        tile.className = 'field-cell';

        if (this.matrix[i][j] !== 0) {
          tile.textContent = `${this.matrix[i][j]}`;
          tile.classList.add(`field-cell--${this.matrix[i][j]}`);
        }
      }
    }
  }
}

module.exports = Game;
