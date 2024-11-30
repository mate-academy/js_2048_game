'use strict';

/**
 * This class represents the game.
 * Now it has a basic structure, that is needed for testing.
 * Feel free to add more props and methods if needed.
 */
const startMessage = document.querySelector('.message-start');
const loseMessage = document.querySelector('.message-lose');
const winMessage = document.querySelector('.message-win');

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

    this.status = 'idle';

    this.score = 0;
  }

  moveLeft() {
    if (this.getStatus() !== 'playing') {
      return;
    }

    let isChange = false;

    this.matrix = this.matrix.map((group) => {
      for (let i = 1; i < 4; i++) {
        while (group[i - 1] === 0 && group[i] !== 0) {
          group[i - 1] = group[i];
          group[i] = 0;
          isChange = true;
          i--;
        }
      }

      for (let i = 1; i < group.length; i++) {
        if (group[i] === group[i - 1] && group[i] !== 0) {
          group[i - 1] = group[i] + group[i - 1];
          this.score += group[i - 1];
          group[i] = 0;
          isChange = true;
          i--;
        }
      }

      for (let i = 1; i < 4; i++) {
        while (group[i - 1] === 0 && group[i] !== 0) {
          group[i - 1] = group[i];
          group[i] = 0;
          isChange = true;
          i--;
        }
      }

      return group;
    });

    if (isChange) {
      this.createRandomTile();
    }

    this.drawTiles();

    this.getStatus();

    this.winOrLose();
  }
  moveRight() {
    if (this.getStatus() !== 'playing') {
      return;
    }

    let isChange = false;

    this.matrix = this.matrix.map((group) => {
      for (let i = 2; i >= 0; i--) {
        while (group[i + 1] === 0 && group[i] !== 0) {
          group[i + 1] = group[i];
          group[i] = 0;
          isChange = true;
          i++;
        }
      }

      for (let i = group.length - 2; i >= 0; i--) {
        if (group[i] === group[i + 1] && group[i] !== 0) {
          group[i + 1] = group[i] + group[i + 1];
          this.score += group[i + 1];
          group[i] = 0;
          isChange = true;
          i++;
        }
      }

      for (let i = 2; i >= 0; i--) {
        while (group[i + 1] === 0 && group[i] !== 0) {
          group[i + 1] = group[i];
          group[i] = 0;
          isChange = true;
          i++;
        }
      }

      return group;
    });

    if (isChange) {
      this.createRandomTile();
    }

    this.drawTiles();

    this.getStatus();

    this.winOrLose();
  }
  moveUp() {
    if (this.getStatus() !== 'playing') {
      return;
    }

    let isChange = false;

    const slidedMatrix = this.getMatrixGroupedByCols().map((group) => {
      for (let i = 1; i < 4; i++) {
        while (group[i - 1] === 0 && group[i] !== 0) {
          group[i - 1] = group[i];
          group[i] = 0;
          isChange = true;
          i--;
        }
      }

      for (let i = 1; i < group.length; i++) {
        if (group[i] === group[i - 1] && group[i] !== 0) {
          group[i - 1] = group[i] + group[i - 1];
          this.score += group[i - 1];
          group[i] = 0;
          isChange = true;
          i--;
        }
      }

      for (let i = 1; i < 4; i++) {
        while (group[i - 1] === 0 && group[i] !== 0) {
          group[i - 1] = group[i];
          group[i] = 0;
          isChange = true;
          i--;
        }
      }

      return group;
    });

    for (let i = 0; i < 4; i++) {
      for (let j = 0; j < 4; j++) {
        this.matrix[i][j] = slidedMatrix[j][i];
      }
    }

    if (isChange) {
      this.createRandomTile();
    }

    this.drawTiles();

    this.getStatus();

    this.winOrLose();
  }
  moveDown() {
    if (this.getStatus() !== 'playing') {
      return;
    }

    let isChange = false;

    const slidedMatrix = this.getMatrixGroupedByCols().map((group) => {
      for (let i = 2; i >= 0; i--) {
        while (group[i + 1] === 0 && group[i] !== 0) {
          isChange = true;
          group[i + 1] = group[i];
          group[i] = 0;
          i++;
        }
      }

      for (let i = group.length - 2; i >= 0; i--) {
        if (group[i] === group[i + 1] && group[i] !== 0) {
          isChange = true;
          group[i + 1] = group[i] + group[i + 1];
          this.score += group[i + 1];
          group[i] = 0;
          i++;
        }
      }

      for (let i = 2; i >= 0; i--) {
        while (group[i + 1] === 0 && group[i] !== 0) {
          isChange = true;
          group[i + 1] = group[i];
          group[i] = 0;
          i++;
        }
      }

      return group;
    });

    for (let i = 0; i < 4; i++) {
      for (let j = 0; j < 4; j++) {
        this.matrix[i][j] = slidedMatrix[j][i];
      }
    }

    if (isChange) {
      this.createRandomTile();
    }

    this.drawTiles();

    this.getStatus();

    this.winOrLose();
  }

  getScore() {
    return this.score;
  }

  getState() {
    return this.matrix;
  }

  getStatus() {
    switch (this.status) {
      case 'idle':
        startMessage.classList.remove('hidden');
        loseMessage.classList.add('hidden');
        winMessage.classList.add('hidden');
        break;
      case 'playing':
        startMessage.classList.add('hidden');
        loseMessage.classList.add('hidden');
        winMessage.classList.add('hidden');
        break;
      case 'win':
        winMessage.classList.remove('hidden');
        // document.removeEventListener('keydown', arrowsToggle);
        break;
      case 'lose':
        loseMessage.classList.remove('hidden');
        // document.removeEventListener('keydown', arrowsToggle);
        break;
      default:
        break;
    }

    return this.status;
  }

  start() {
    this.createRandomTile();
    this.createRandomTile();

    this.status = 'playing';

    this.getStatus();
  }

  restart() {
    this.matrix = this.#copyState(this.#DEFAULT_STATE);
    this.status = 'idle';

    this.getStatus();

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

  movesAvailable(grid) {
    const size = grid.length;

    // Check for empty cells
    for (let row = 0; row < size; row++) {
      for (let col = 0; col < size; col++) {
        if (grid[row][col] === 0) {
          return true;
        }
      }
    }

    // Check for possible merges
    for (let row = 0; row < size; row++) {
      for (let col = 0; col < size; col++) {
        if (col < size - 1 && grid[row][col] === grid[row][col + 1]) {
          return true; // horizontally
        }

        if (row < size - 1 && grid[row][col] === grid[row + 1][col]) {
          return true; // vertically
        }
      }
    }

    return false;
  }

  winOrLose() {
    if (!this.movesAvailable(this.matrix)) {
      this.status = 'lose';
    }

    for (let i = 0; i < 4; i++) {
      for (let j = 0; j < 4; j++) {
        if (this.matrix[i][j] === 2048) {
          this.status = 'win';
        }
      }
    }
  }
}
module.exports = Game;
